/* Zell-Labor – App: Store, Router, Übungs-Engine, Fortschritt */
(function () {
  "use strict";
  const D = window.DATA, GR = window.Graphics;

  /* ================= Hilfsfunktionen ================= */
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  const sample = (a, n) => shuffle(a).slice(0, n);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function todayStr(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  const reducedMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onActivate(el, fn) {
    el.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target === el) { e.preventDefault(); fn(e); } });
  }

  const ITEMS = {};
  D.fragen.forEach((f) => { ITEMS[f.id] = f; });
  D.uebungen.forEach((u) => { ITEMS[u.id] = u; });
  const THEMA = {}; const THEMA_NR = {};
  D.themen.forEach((t) => { THEMA[t.id] = t; THEMA_NR[t.nr] = t; });
  const graded = (u) => u.typ !== "EXPLORER";
  const themeItems = (nr) => D.fragen.filter((f) => f.thema === nr).concat(D.uebungen.filter((u) => u.thema === nr && graded(u)));

  const TYPNAME = {
    MC: "Multiple Choice", "MC+": "Mehrfachauswahl", RF: "Richtig oder falsch", ZU: "Zuordnen", SORT: "Einordnen",
    RH: "Reihenfolge", BESCHR: "Beschriften", ZEIG: "Zeig mir", LUECKE: "Lückentext", ZAHL: "Rechnen",
    ZELLE: "Welche Zelle bin ich?", FREI: "Klassenarbeitsaufgabe", CHECK: "Lebendig-Check", TABELLE: "Tabelle",
    EXPLORER: "Entdecken", ZAHLGEN: "Rechentrainer"
  };
  function itemTitle(it) {
    const t = it.frage || it.aussage || it.aufgabe || it.titel || (it.text ? it.text.replace(/\{([^}]+)\}/g, "___") : it.id);
    return t.length > 110 ? t.slice(0, 107) + "…" : t;
  }
  function partName(info, k) {
    if (info === "mikroskop") return D.MIKROSKOP[k].name;
    return D.ORGANELLEN[k].name;
  }

  /* ================= Store (einzige Stelle mit Speicherzugriff) ================= */
  const Store = (function () {
    const KEY = "bio.v1";
    let mem = null, ok = true;
    function defaults() { return { v: 1, items: {}, xp: 0, serie: { n: 0, tag: null }, fehler: {}, arbeiten: 0, theme: "auto" }; }
    function normalize(d) {
      const x = defaults();
      if (d && typeof d === "object") {
        if (d.items && typeof d.items === "object") x.items = d.items;
        if (typeof d.xp === "number") x.xp = d.xp;
        if (d.serie && typeof d.serie === "object") x.serie = { n: +d.serie.n || 0, tag: d.serie.tag || null };
        if (d.fehler && typeof d.fehler === "object") x.fehler = d.fehler;
        if (typeof d.arbeiten === "number") x.arbeiten = d.arbeiten;
        if (["auto", "light", "dark"].indexOf(d.theme) >= 0) x.theme = d.theme;
      }
      return x;
    }
    function load() {
      try { const raw = window.localStorage.getItem(KEY); mem = raw ? normalize(JSON.parse(raw)) : defaults(); ok = true; }
      catch (e) { ok = false; mem = mem || defaults(); }
      warn(); return mem;
    }
    function save(state) {
      mem = state;
      try { window.localStorage.setItem(KEY, JSON.stringify(state)); ok = true; } catch (e) { ok = false; }
      warn(); return ok;
    }
    function warn() { const w = document.getElementById("storewarn"); if (w) w.hidden = ok; }
    function exportJson() { return JSON.stringify({ app: "zell-labor", version: 1, exportiert: new Date().toISOString(), daten: mem }, null, 2); }
    function importJson(json) {
      const o = JSON.parse(json);
      const d = o && o.daten ? o.daten : o;
      if (!d || typeof d !== "object" || typeof d.items !== "object") throw new Error("Das ist keine gültige Fortschritts-Datei.");
      save(normalize(d)); return mem;
    }
    function reset() { save(defaults()); }
    return { load: load, save: save, export: exportJson, import: importJson, reset: reset, get state() { return mem; }, get ok() { return ok; } };
  })();
  window.Store = Store;

  /* ================= Fortschritt ================= */
  function streakNow() {
    const s = Store.state, t = todayStr(), y = todayStr(new Date(Date.now() - 864e5));
    return s.serie.tag === t || s.serie.tag === y ? s.serie.n : 0;
  }
  function bumpStreak(s) {
    const t = todayStr(); if (s.serie.tag === t) return;
    const y = todayStr(new Date(Date.now() - 864e5));
    s.serie.n = s.serie.tag === y ? s.serie.n + 1 : 1; s.serie.tag = t;
  }
  function record(id, correct, xp) {
    const s = Store.state;
    const it = s.items[id] || { r: 0, f: 0, last: null, serie: 0 };
    if (correct) { it.r++; it.serie++; } else { it.f++; it.serie = 0; }
    it.last = !!correct; s.items[id] = it;
    if (!correct) s.fehler[id] = 0;
    else if (Object.prototype.hasOwnProperty.call(s.fehler, id)) { s.fehler[id]++; if (s.fehler[id] >= 2) delete s.fehler[id]; }
    if (correct && xp) s.xp += xp;
    bumpStreak(s);
    Store.save(s); updateHeader();
  }
  function mastery(nr) {
    const list = themeItems(nr), s = Store.state;
    const done = list.filter((i) => s.items[i.id] && s.items[i.id].last === true).length;
    return Math.round((done / list.length) * 100);
  }
  const fehlerIds = () => Object.keys(Store.state.fehler).filter((id) => ITEMS[id]);
  function updateHeader() {
    const x = $("#xp"), st = $("#streak");
    if (x) x.textContent = "⭐ " + Store.state.xp + " XP";
    if (st) st.textContent = "🔥 " + streakNow() + (streakNow() === 1 ? " Tag" : " Tage");
  }
  function applyTheme() {
    const t = Store.state.theme;
    if (t === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t);
  }

  /* ================= Interaktive SVG ================= */
  function makeInteractive(holder, name, onPick, labelFor) {
    const svg = $("svg", holder); svg.classList.add("interactive");
    const seen = {}; let n = 0;
    $$("[data-part]", svg).forEach((el) => {
      const id = el.getAttribute("data-part");
      el.addEventListener("click", (e) => { e.stopPropagation(); onPick(id); });
      if (!seen[id]) {
        seen[id] = true; n++;
        el.setAttribute("tabindex", "0"); el.setAttribute("role", "button");
        el.setAttribute("aria-label", labelFor ? labelFor(id, n) : id);
        el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(id); } });
      }
    });
    svg.removeAttribute("aria-hidden");
  }
  function ring(holder, name, partId, cls) {
    const svg = $("svg", holder); const g = GR.G[name]();
    if (!g.parts || !g.parts[partId]) return;
    const a = g.parts[partId].anker;
    const NS = svg.namespaceURI;
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", a[0]); c.setAttribute("cy", a[1]); c.setAttribute("r", 22); c.setAttribute("class", "g-hl " + (cls || ""));
    svg.appendChild(c);
    if (cls) {
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", a[0] + 20); t.setAttribute("y", a[1] - 18); t.setAttribute("class", "g-hl-t " + cls);
      t.textContent = cls === "ok" ? "✓" : "✗"; svg.appendChild(t);
    }
  }
  const clearRings = (holder) => $$(".g-hl, .g-hl-t", holder).forEach((e) => e.remove());

  /* ================= Zuordnungs-Brett (Tippen–Tippen) ================= */
  function makeBoard(root, opt) {
    opt = opt || {};
    const place = {}; let sel = null; let locked = false;
    $$("[data-chip]", root).forEach((c) => { place[c.dataset.chip] = "pool"; });
    const slotEl = (id) => $('[data-slot="' + id + '"]', root);
    const chipEl = (id) => $('[data-chip="' + id + '"]', root);
    const cont = (id) => { const s = slotEl(id); return $(".sb", s) || s; };
    const cap = (id) => { const s = slotEl(id); return s && s.dataset.cap ? +s.dataset.cap : 1; };
    function refresh() {
      $$("[data-slot]", root).forEach((s) => { const ph = $(".ph", s); if (ph) ph.hidden = !!$("[data-chip]", s); });
      if (opt.onChange) opt.onChange(place);
    }
    function clearSel() {
      $$('[data-chip][aria-pressed="true"]', root).forEach((c) => c.setAttribute("aria-pressed", "false"));
      $$("[data-slot].sel", root).forEach((s) => s.classList.remove("sel"));
      sel = null; if (opt.onSel) opt.onSel(null);
    }
    function moveRaw(c, s) { place[c] = s; cont(s).appendChild(chipEl(c)); }
    function move(c, s) {
      if (s !== "pool" && cap(s) === 1) {
        const occ = Object.keys(place).find((k) => place[k] === s && k !== c);
        if (occ) moveRaw(occ, place[c]);
      }
      moveRaw(c, s); refresh();
    }
    function tapChip(c) {
      if (sel && sel.t === "chip" && sel.id === c) { clearSel(); return; }
      if (sel && sel.t === "slot") { const s = sel.id; clearSel(); move(c, s); return; }
      if (sel && sel.t === "chip" && place[c] !== "pool") { const target = place[c], m = sel.id; clearSel(); move(m, target); return; }
      clearSel(); sel = { t: "chip", id: c }; chipEl(c).setAttribute("aria-pressed", "true");
    }
    function tapSlot(s) {
      if (sel && sel.t === "chip") { const c = sel.id; clearSel(); move(c, s); return; }
      if (s === "pool" || (sel && sel.t === "slot" && sel.id === s)) { clearSel(); return; }
      clearSel(); sel = { t: "slot", id: s }; slotEl(s).classList.add("sel"); if (opt.onSel) opt.onSel(s);
    }
    root.addEventListener("click", (e) => {
      if (locked) return;
      const chip = e.target.closest("[data-chip]");
      if (chip && root.contains(chip)) { tapChip(chip.dataset.chip); return; }
      const proxy = e.target.closest("[data-slot-proxy]");
      if (proxy) { tapSlot(proxy.getAttribute("data-slot-proxy")); return; }
      const slot = e.target.closest("[data-slot]");
      if (slot && root.contains(slot)) tapSlot(slot.dataset.slot);
    });
    root.addEventListener("keydown", (e) => {
      if (locked || (e.key !== "Enter" && e.key !== " ")) return;
      const t = e.target;
      if (t.matches && (t.matches("[data-slot]") || t.matches("[data-slot-proxy]"))) { e.preventDefault(); tapSlot(t.dataset.slot || t.getAttribute("data-slot-proxy")); }
    });
    refresh();
    return {
      place: place,
      lock() { locked = true; clearSel(); $$("[data-chip]", root).forEach((c) => { c.setAttribute("aria-disabled", "true"); }); $$("[data-slot]", root).forEach((s) => s.removeAttribute("tabindex")); },
      chipEl: chipEl, slotEl: slotEl
    };
  }

  /* ================= Übungstypen =================
     Jede Komponente: (item, root, ctx) → { evaluate(): {score,max}, reveal(), loesung?(), extra?() }
     ctx.mode: "practice" (Sofort-Feedback, eigener Prüfen-Button) | "exam" (Feedback erst am Ende) */
  const C = {};
  const checkBtn = (ctx, label) => ctx.mode === "practice" ? '<div class="nextrow"><button type="button" class="btn" data-check>' + (label || "Prüfen") + "</button></div>" : "";
  function wireCheck(root, ctx) { const b = $("[data-check]", root); if (b) b.addEventListener("click", () => { b.remove(); ctx.done(); }); }

  C.MC = function (q, root, ctx) {
    const opts = shuffle([q.richtig].concat(q.falsch));
    root.innerHTML = '<p class="qtext">' + esc(q.frage) + '</p><div class="opts" role="group" aria-label="Antworten">' +
      opts.map((o, i) => '<button type="button" class="opt" aria-pressed="false" data-i="' + i + '">' + esc(o) + '<span class="mark" aria-hidden="true"></span></button>').join("") + "</div>";
    let chosen = null, locked = false;
    $$(".opt", root).forEach((b) => b.addEventListener("click", () => {
      if (locked) return; chosen = +b.dataset.i;
      $$(".opt", root).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      if (ctx.mode === "practice") { locked = true; ctx.done(); }
    }));
    return {
      evaluate: () => ({ score: chosen !== null && opts[chosen] === q.richtig ? 1 : 0, max: 1 }),
      reveal() { locked = true; $$(".opt", root).forEach((b) => { const i = +b.dataset.i; if (opts[i] === q.richtig) b.classList.add("ok"); else if (i === chosen) b.classList.add("bad"); b.disabled = true; }); },
      loesung: () => q.richtig
    };
  };

  C.RF = function (q, root, ctx) {
    root.innerHTML = '<p class="qtext">„' + esc(q.aussage) + '“</p><div class="rf" role="group" aria-label="Richtig oder falsch"><button type="button" class="opt" data-v="1" aria-pressed="false">Richtig<span class="mark" aria-hidden="true"></span></button><button type="button" class="opt" data-v="0" aria-pressed="false">Falsch<span class="mark" aria-hidden="true"></span></button></div>';
    let chosen = null, locked = false;
    $$(".opt", root).forEach((b) => b.addEventListener("click", () => {
      if (locked) return; chosen = b.dataset.v === "1";
      $$(".opt", root).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      if (ctx.mode === "practice") { locked = true; ctx.done(); }
    }));
    return {
      evaluate: () => ({ score: chosen === q.loesung ? 1 : 0, max: 1 }),
      reveal() { locked = true; $$(".opt", root).forEach((b) => { const v = b.dataset.v === "1"; if (v === q.loesung) b.classList.add("ok"); else if (v === chosen) b.classList.add("bad"); b.disabled = true; }); },
      loesung: () => "Die Aussage ist " + (q.loesung ? "richtig." : "falsch.") + (q.korrektur ? " Richtig heißt es: „" + q.korrektur + "“" : "")
    };
  };

  C["MC+"] = function (q, root, ctx) {
    const opts = shuffle(q.richtig.concat(q.falsch));
    root.innerHTML = '<p class="qtext">' + esc(q.frage) + '</p><div class="opts" role="group" aria-label="Antworten">' +
      opts.map((o, i) => '<button type="button" class="opt" aria-pressed="false" data-i="' + i + '"><span aria-hidden="true">☐</span> ' + esc(o) + '<span class="mark" aria-hidden="true"></span></button>').join("") + "</div>" + checkBtn(ctx);
    let locked = false;
    $$(".opt", root).forEach((b) => b.addEventListener("click", () => {
      if (locked) return; const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on ? "true" : "false"); b.firstChild.textContent = on ? "☑" : "☐";
    }));
    wireCheck(root, ctx);
    const chosen = () => $$(".opt", root).filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => opts[+b.dataset.i]);
    return {
      evaluate() { const c = chosen(); const exact = c.length === q.richtig.length && c.every((x) => q.richtig.indexOf(x) >= 0); return { score: exact ? 1 : 0, max: 1 }; },
      reveal() {
        locked = true; const c = chosen();
        $$(".opt", root).forEach((b) => {
          const o = opts[+b.dataset.i], r = q.richtig.indexOf(o) >= 0, ch = c.indexOf(o) >= 0;
          if (r) { b.classList.add("ok"); if (!ch) b.insertAdjacentHTML("beforeend", ' <em class="muted">(fehlte)</em>'); } else if (ch) b.classList.add("bad");
          b.disabled = true;
        });
      },
      loesung: () => q.richtig.join(", ")
    };
  };

  C.LUECKE = function (q, root, ctx) {
    const sol = []; const words = shuffle(q.woerter);
    const html = esc(q.text).replace(/\{([^}]+)\}/g, (m, w) => {
      const i = sol.length; sol.push(w);
      return '<label class="sr-only" for="lu' + i + '">Lücke ' + (i + 1) + '</label><select id="lu' + i + '" data-i="' + i + '"><option value="">– wählen –</option>' + words.map((x) => "<option>" + esc(x) + "</option>").join("") + "</select>";
    });
    root.innerHTML = '<p class="hint">Wähle für jede Lücke das passende Wort.</p><p class="lu">' + html + "</p>" + checkBtn(ctx);
    // eindeutige IDs je Instanz
    const uid = Math.random().toString(36).slice(2, 7);
    $$("select", root).forEach((s) => { const l = root.querySelector('label[for="' + s.id + '"]'); s.id = s.id + uid; if (l) l.htmlFor = s.id; });
    wireCheck(root, ctx);
    return {
      evaluate() { const sc = $$("select", root).filter((s) => s.value === sol[+s.dataset.i]).length; return { score: sc, max: sol.length }; },
      reveal() { $$("select", root).forEach((s) => { const ok = s.value === sol[+s.dataset.i]; s.classList.add(ok ? "ok" : "bad"); s.disabled = true; if (!ok) s.insertAdjacentHTML("afterend", '<span class="sol">✓ ' + esc(sol[+s.dataset.i]) + "</span>"); else s.insertAdjacentHTML("afterend", '<span class="sol" aria-hidden="true">✓</span>'); }); },
      loesung: () => sol.join(", ")
    };
  };

  C.ZAHL = function (q, root, ctx) {
    const id = "z" + Math.random().toString(36).slice(2, 7);
    root.innerHTML = '<p class="qtext">' + esc(q.frage) + '</p><div class="zahl"><label for="' + id + '" class="sr-only">Deine Antwort</label><input id="' + id + '" type="text" inputmode="decimal" autocomplete="off" placeholder="Zahl"> <span>' + esc(q.einheit || "") + "</span></div>" + checkBtn(ctx);
    const inp = $("input", root);
    wireCheck(root, ctx);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { const b = $("[data-check]", root); if (b) b.click(); } });
    const val = () => parseFloat(inp.value.replace(",", ".").replace(/[^0-9.\-]/g, ""));
    return {
      evaluate: () => ({ score: val() === q.loesung ? 1 : 0, max: 1 }),
      reveal() { inp.classList.add(val() === q.loesung ? "ok" : "bad"); inp.disabled = true; },
      loesung: () => String(q.loesung)
    };
  };

  C.FREI = function (q, root, ctx) {
    const id = "f" + Math.random().toString(36).slice(2, 7);
    root.innerHTML = '<p class="qtext">' + esc(q.aufgabe) + '</p><label for="' + id + '" class="hint">Schreib deine Antwort auf (wird nicht gespeichert):</label><textarea id="' + id + '"></textarea>' +
      '<div class="muster" hidden></div>' + (ctx.mode === "practice" ? '<div class="nextrow"><button type="button" class="btn sec" data-show>Musterlösung zeigen</button></div>' : "");
    const m = $(".muster", root);
    let shown = false;
    function show() {
      if (shown) return; shown = true; m.hidden = false;
      m.innerHTML = "<h3>Musterlösung – hake ab, was du genannt hast:</h3>" + (q.muster ? '<p class="muted">Beispiele: ' + esc(q.muster) + "</p>" : "") +
        '<ul class="checklist">' + q.punkte.map((p, i) => '<li><label><input type="checkbox" data-i="' + i + '"> <span>' + esc(p) + " <em class=\"muted\">(Hab ich genannt)</em></span></label></li>").join("") + "</ul>" +
        (ctx.mode === "practice" ? '<div class="nextrow"><button type="button" class="btn" data-fin>Fertig bewertet</button></div>' : "");
      const fin = $("[data-fin]", m); if (fin) fin.addEventListener("click", () => { fin.remove(); ctx.done(); });
    }
    const sb = $("[data-show]", root); if (sb) sb.addEventListener("click", () => { sb.parentNode.remove(); show(); });
    return {
      prepare: show,
      evaluate() { show(); return { score: $$("input[type=checkbox]", root).filter((c) => c.checked).length, max: q.punkte.length }; },
      reveal() { show(); $$("input[type=checkbox]", root).forEach((c) => { c.disabled = true; }); $("textarea", root).readOnly = true; }
    };
  };

  C.ZU = function (u, root, ctx) {
    const paare = u.anzahl ? sample(u.paare, u.anzahl) : u.paare.slice();
    const order = shuffle(paare.map((p, i) => i));
    root.innerHTML = '<p class="hint">' + esc(u.anleitung || "Ordne zu.") + " Tippe erst eine Karte an, dann das passende Feld.</p>" +
      '<div class="chips" data-slot="pool" data-cap="99" role="group" aria-label="Antwortkarten">' + order.map((i) => '<button type="button" class="chip" data-chip="c' + i + '" aria-pressed="false">' + esc(paare[i].rechts) + "</button>").join("") + "</div>" +
      '<div class="pairs">' + paare.map((p, i) => '<div class="pair"><div class="lbl">' + (p.bild ? GR.svg(p.bild) : "") + "<span>" + esc(p.links) + '</span></div><div class="slot" data-slot="s' + i + '" role="button" tabindex="0" aria-label="Feld für ' + esc(p.links) + '"><span class="ph">hier zuordnen</span><span class="sb"></span></div></div>').join("") + "</div>" + checkBtn(ctx);
    $$(".slot", root).forEach((s) => { const sb = $(".sb", s); sb.style.display = "contents"; });
    const board = makeBoard(root);
    wireCheck(root, ctx);
    return {
      evaluate() { const sc = paare.filter((p, i) => board.place["c" + i] === "s" + i).length; return { score: sc, max: paare.length }; },
      reveal() {
        board.lock();
        paare.forEach((p, i) => {
          const s = board.slotEl("s" + i), ok = board.place["c" + i] === "s" + i;
          s.classList.add(ok ? "ok" : "bad");
          const c = $("[data-chip]", s); if (c) c.classList.add(ok ? "ok" : "bad");
          if (!ok) s.insertAdjacentHTML("beforeend", '<div class="sol">✓ Richtig: ' + esc(p.rechts) + "</div>");
        });
      }
    };
  };

  C.SORT = function (u, root, ctx) {
    let spalten = u.spalten;
    if (ctx.opts && ctx.opts.ohneLeere) spalten = spalten.filter((s) => u.karten.some((k) => k.spalte === s.id));
    const karten = u.karten;
    const order = shuffle(karten.map((k, i) => i));
    root.innerHTML = '<p class="hint">' + esc(u.anleitung || "Sortiere.") + " Tippe erst eine Karte an, dann die passende Spalte.</p>" +
      '<div class="chips" data-slot="pool" data-cap="99" role="group" aria-label="Karten">' + order.map((i) => '<button type="button" class="chip" data-chip="k' + i + '" aria-pressed="false">' + esc(karten[i].text) + "</button>").join("") + "</div>" +
      '<div class="cols">' + spalten.map((s) => '<div class="col" data-slot="' + s.id + '" data-cap="99" role="button" tabindex="0" aria-label="Spalte ' + esc(s.titel) + '"><h4>' + esc(s.titel) + '</h4><span class="ph muted">hierher tippen</span><div class="sb" style="display:contents"></div></div>').join("") + "</div>" + checkBtn(ctx);
    const board = makeBoard(root);
    wireCheck(root, ctx);
    return {
      evaluate() { const sc = karten.filter((k, i) => board.place["k" + i] === k.spalte).length; return { score: sc, max: karten.length }; },
      reveal() {
        board.lock();
        karten.forEach((k, i) => {
          const c = board.chipEl("k" + i), ok = board.place["k" + i] === k.spalte;
          c.classList.add(ok ? "ok" : "bad");
          if (!ok) { const sp = u.spalten.find((s) => s.id === k.spalte); c.insertAdjacentHTML("beforeend", '<span class="sol" style="display:block">→ gehört zu: ' + esc(sp.titel) + "</span>"); }
        });
      },
      extra: () => (u.leerHinweis && spalten.length === u.spalten.length ? u.leerHinweis : "")
    };
  };

  C.RH = function (u, root, ctx) {
    const n = u.karten.length;
    let order = shuffle(u.karten.map((k, i) => i));
    let guard = 0; while (order.every((v, i) => v === i) && guard++ < 10) order = shuffle(order);
    let sel = null, locked = false;
    root.innerHTML = '<p class="hint">' + esc(u.anleitung || "Bringe in die richtige Reihenfolge.") + " Verschiebe mit ▲/▼ oder tippe zwei Karten nacheinander an, um sie zu tauschen.</p><ol class=\"order\"></ol>" + checkBtn(ctx);
    const ol = $("ol", root);
    function draw(focusIdx, dir) {
      ol.innerHTML = order.map((k, pos) => '<li data-pos="' + pos + '"' + (sel === pos ? ' class="sel"' : "") + '><span class="pos">' + (pos + 1) + '.</span><button type="button" class="txt" aria-pressed="' + (sel === pos) + '">' + (u.bilder ? GR.svg(u.bilder[k]) : "") + "<span>" + esc(u.karten[k]) + '</span></button><span class="mv"><button type="button" data-up aria-label="Nach oben: ' + esc(u.karten[k]) + '"' + (pos === 0 ? " disabled" : "") + '>▲</button><button type="button" data-down aria-label="Nach unten: ' + esc(u.karten[k]) + '"' + (pos === n - 1 ? " disabled" : "") + ">▼</button></span></li>").join("");
      if (focusIdx !== undefined) { const li = ol.children[focusIdx]; const b = li && $(dir ? (dir < 0 ? "[data-up]" : "[data-down]") : ".txt", li); if (b && !b.disabled) b.focus(); else if (li) $(".txt", li).focus(); }
    }
    ol.addEventListener("click", (e) => {
      if (locked) return;
      const li = e.target.closest("li"); if (!li) return; const pos = +li.dataset.pos;
      if (e.target.closest("[data-up]") && pos > 0) { [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]]; sel = null; draw(pos - 1, -1); return; }
      if (e.target.closest("[data-down]") && pos < n - 1) { [order[pos + 1], order[pos]] = [order[pos], order[pos + 1]]; sel = null; draw(pos + 1, 1); return; }
      if (e.target.closest(".txt")) {
        if (sel === null) { sel = pos; draw(pos); }
        else if (sel === pos) { sel = null; draw(pos); }
        else { [order[sel], order[pos]] = [order[pos], order[sel]]; sel = null; draw(pos); }
      }
    });
    draw();
    wireCheck(root, ctx);
    return {
      evaluate: () => ({ score: order.filter((k, i) => k === i).length, max: n }),
      reveal() {
        locked = true;
        $$("li", ol).forEach((li, pos) => {
          const ok = order[pos] === pos; li.classList.add(ok ? "ok" : "bad");
          $$("button", li).forEach((b) => { b.disabled = true; });
          li.insertAdjacentHTML("beforeend", '<span class="fach">' + (ok ? "✓" : "✗") + (u.fachbegriffe ? " " + esc(u.fachbegriffe[order[pos]]) : "") + "</span>");
        });
      },
      loesung: () => u.karten.map((k, i) => (i + 1) + ". " + k + (u.fachbegriffe ? " (" + u.fachbegriffe[i] + ")" : "")).join(" → ")
    };
  };

  C.BESCHR = function (u, root, ctx) {
    const r = GR.svg(u.grafik, { mode: "numbers", only: u.teile, withOrder: true, title: "Grafik mit nummerierten Markierungen" });
    const order = r.order;
    const terms = shuffle(u.teile);
    root.innerHTML = '<p class="hint">Tippe einen Begriff an und dann die passende Nummer (in der Liste oder in der Grafik).</p>' +
      '<div class="gwrap">' + r.html + "</div>" +
      '<div class="chips" data-slot="pool" data-cap="99" role="group" aria-label="Begriffe">' + terms.map((k) => '<button type="button" class="chip" data-chip="' + k + '" aria-pressed="false">' + esc(partName(u.info, k)) + "</button>").join("") + "</div>" +
      '<div class="beschr-slots">' + order.map((k, i) => '<div class="bs"><span class="nr" aria-hidden="true">' + (i + 1) + '</span><div class="slot" data-slot="' + k + '" role="button" tabindex="0" aria-label="Markierung ' + (i + 1) + '"><span class="ph">frei</span><span class="sb" style="display:contents"></span></div></div>').join("") + "</div>" + checkBtn(ctx);
    $$(".marker", root).forEach((m) => { m.setAttribute("data-slot-proxy", m.getAttribute("data-marker")); m.style.cursor = "pointer"; });
    const board = makeBoard(root, { onSel: (s) => { $$(".marker", root).forEach((m) => m.classList.toggle("sel", m.getAttribute("data-marker") === s)); } });
    wireCheck(root, ctx);
    return {
      evaluate() { const sc = u.teile.filter((k) => board.place[k] === k).length; return { score: sc, max: u.teile.length }; },
      reveal() {
        board.lock();
        order.forEach((k) => {
          const s = board.slotEl(k), ok = board.place[k] === k;
          s.classList.add(ok ? "ok" : "bad"); const c = $("[data-chip]", s); if (c) c.classList.add(ok ? "ok" : "bad");
          const mk = $('.marker[data-marker="' + k + '"]', root); if (mk) mk.classList.add(ok ? "ok" : "bad");
          if (!ok) s.insertAdjacentHTML("beforeend", '<div class="sol">✓ ' + esc(partName(u.info, k)) + "</div>");
        });
      }
    };
  };

  C.TABELLE = function (u, root, ctx) {
    const st = u.zeilen.map(() => ({ tier: null, pflanze: null }));
    const sym = (v) => (v === null ? "?" : v ? "✓" : "✗");
    const lbl = (v) => (v === null ? "leer" : v ? "kommt vor" : "kommt nicht vor");
    root.innerHTML = '<p class="hint">' + esc(u.anleitung) + '</p><div class="tblwrap"><table class="tbl ttab"><thead><tr><th>Bestandteil</th><th>Tierzelle</th><th>Pflanzenzelle</th></tr></thead><tbody>' +
      u.zeilen.map((z, i) => "<tr><td>" + esc(z.name) + "</td>" + ["tier", "pflanze"].map((c) => '<td><button type="button" class="tog" data-r="' + i + '" data-c="' + c + '" aria-label="' + esc(z.name) + ", " + (c === "tier" ? "Tierzelle" : "Pflanzenzelle") + ': leer">?</button></td>').join("") + "</tr>").join("") +
      "</tbody></table></div>" + checkBtn(ctx);
    let locked = false;
    $$(".tog", root).forEach((b) => b.addEventListener("click", () => {
      if (locked) return; const s = st[+b.dataset.r]; const c = b.dataset.c;
      s[c] = s[c] === true ? false : true; b.textContent = sym(s[c]);
      b.setAttribute("aria-label", u.zeilen[+b.dataset.r].name + ", " + (c === "tier" ? "Tierzelle" : "Pflanzenzelle") + ": " + lbl(s[c]));
    }));
    wireCheck(root, ctx);
    return {
      evaluate() { let sc = 0; u.zeilen.forEach((z, i) => { if (st[i].tier === z.tier) sc++; if (st[i].pflanze === z.pflanze) sc++; }); return { score: sc, max: u.zeilen.length * 2 }; },
      reveal() {
        locked = true;
        $$(".tog", root).forEach((b) => { const z = u.zeilen[+b.dataset.r], c = b.dataset.c, ok = st[+b.dataset.r][c] === z[c]; b.classList.add(ok ? "ok" : "bad"); b.disabled = true; if (!ok) b.textContent = sym(st[+b.dataset.r][c]) + "→" + sym(z[c]); });
      }
    };
  };

  C.ZELLE = function (u, root, ctx) {
    const einzel = ctx.opts && ctx.opts.einzel;
    const list = einzel ? [pick(u.zellen)] : shuffle(u.zellen);
    let idx = 0, score = 0;
    const B = u.begruendungen;
    const keys = Object.keys(B);
    function evalCell(cell, scope) {
      const art = $("[data-art][aria-pressed=true]", scope);
      const artOk = !!art && art.dataset.art === cell.loesung;
      const ch = $$("input[data-b]", scope).filter((c) => c.checked).map((c) => c.dataset.b);
      const begrOk = ch.some((b) => cell.richtig.indexOf(b) >= 0) && ch.every((b) => cell.richtig.indexOf(b) >= 0);
      return { artOk: artOk, begrOk: begrOk, ch: ch };
    }
    function feedbackFor(cell, ev) {
      const ok = ev.artOk && ev.begrOk;
      return '<div class="feedback ' + (ok ? "ok" : "bad") + '"><div class="fh">' + (ok ? "✓ Richtig!" : "✗ Fast! Schau noch mal:") + "</div>" +
        "<p>Das ist eine <b>" + esc(cell.name) + "</b> → <b>" + (cell.loesung === "tier" ? "Tierzelle" : "Pflanzenzelle") + "</b>. " + esc(cell.hinweis) + "</p>" +
        "<p>Zellart: " + (ev.artOk ? "✓ richtig" : "✗ falsch") + " · Begründung: " + (ev.begrOk ? "✓ passt" : "✗ passt noch nicht") + "</p>" +
        "<p>Passende Begründungen: " + cell.richtig.map((b) => "„" + esc(B[b]) + "“").join(", ") + ". Ein Zellkern sagt nichts über die Zellart – beide haben einen.</p></div>";
    }
    function markCell(cell, scope) {
      $$("[data-art]", scope).forEach((b) => { b.disabled = true; if (b.dataset.art === cell.loesung) b.classList.add("ok"); else if (b.getAttribute("aria-pressed") === "true") b.classList.add("bad"); });
      $$("input[data-b]", scope).forEach((c) => { c.disabled = true; const r = cell.richtig.indexOf(c.dataset.b) >= 0; c.parentNode.style.outline = r ? "2px solid var(--ok)" : (c.checked ? "2px solid var(--bad)" : ""); c.parentNode.insertAdjacentHTML("beforeend", r ? ' <b style="color:var(--ok)">✓</b>' : (c.checked ? ' <b style="color:var(--bad)">✗</b>' : "")); });
    }
    function draw() {
      const cell = list[idx];
      root.innerHTML = (einzel ? "" : '<p class="progress">Zelle ' + (idx + 1) + " von " + list.length + "</p>") +
        '<div class="zelle-grid"><div class="cellpic">' + GR.svg(cell.grafik, { title: "Zellzeichnung" }) + "</div><div>" +
        '<p class="qtext">Welche Zelle bin ich?</p><div class="rf" role="group" aria-label="Zellart"><button type="button" class="opt" data-art="tier" aria-pressed="false">Tierzelle<span class="mark" aria-hidden="true"></span></button><button type="button" class="opt" data-art="pflanze" aria-pressed="false">Pflanzenzelle<span class="mark" aria-hidden="true"></span></button></div>' +
        '<p class="hint" style="margin-top:10px">Begründung – kreuze passende Aussagen an:</p><ul class="checklist">' + keys.map((k) => '<li><label><input type="checkbox" data-b="' + k + '"> <span>(' + k + ") " + esc(B[k]) + "</span></label></li>").join("") + "</ul>" +
        (ctx.mode === "practice" ? '<div class="nextrow"><button type="button" class="btn" data-zcheck>Prüfen</button></div>' : "") + '<div class="zfb" role="status" aria-live="polite"></div></div></div>';
      $$("[data-art]", root).forEach((b) => b.addEventListener("click", () => { if (b.disabled) return; $$("[data-art]", root).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false")); }));
      const zc = $("[data-zcheck]", root);
      if (zc) zc.addEventListener("click", () => {
        const ev = evalCell(cell, root);
        score += (ev.artOk ? 1 : 0) + (ev.begrOk ? 1 : 0);
        markCell(cell, root);
        zc.parentNode.innerHTML = idx < list.length - 1 ? '<button type="button" class="btn" data-znext>Nächste Zelle</button>' : "";
        $(".zfb", root).innerHTML = feedbackFor(cell, ev);
        const nx = $("[data-znext]", root);
        if (nx) { nx.addEventListener("click", () => { idx++; draw(); $(".qtext", root).scrollIntoView({ block: "nearest" }); }); nx.focus(); }
        else ctx.done();
      });
    }
    draw();
    return {
      evaluate() {
        if (einzel) { const ev = evalCell(list[0], root); return { score: (ev.artOk ? 1 : 0) + (ev.begrOk ? 1 : 0), max: 2 }; }
        return { score: score, max: list.length * 2 };
      },
      reveal() { if (einzel) { const ev = evalCell(list[0], root); markCell(list[0], root); $(".zfb", root).innerHTML = feedbackFor(list[0], ev); } }
    };
  };

  C.CHECK = function (u, root, ctx) {
    const list = shuffle(u.objekte); let idx = 0, score = 0;
    const KZ = [["w", "Wachstum"], ["s", "Stoffwechsel"], ["f", "Fortpflanzung und Entwicklung"], ["b", "Bewegung"], ["r", "Reizbarkeit"]];
    const GRAF = { hund: "oHund", sonnenblume: "oSonnenblume", regenwurm: "oRegenwurm", venusfliegenfalle: "oVenus", muschel: "oMuschel", roboter: "oRoboter", kerze: "oKerze", eiszapfen: "oEis", auto: "oAuto" };
    function draw() {
      const o = list[idx];
      root.innerHTML = '<p class="progress">Objekt ' + (idx + 1) + " von " + list.length + '</p><div class="center"><div class="objpic">' + GR.svg(GRAF[o.id], { title: o.name }) + '</div><p class="qtext">' + esc(o.name) + ": Ist das ein Lebewesen?</p></div>" +
        '<div class="rf" role="group" aria-label="Lebewesen?"><button type="button" class="opt" data-v="1" aria-pressed="false">Ja<span class="mark" aria-hidden="true"></span></button><button type="button" class="opt" data-v="0" aria-pressed="false">Nein<span class="mark" aria-hidden="true"></span></button></div><div class="cfb" role="status" aria-live="polite"></div>';
      $$("[data-v]", root).forEach((b) => b.addEventListener("click", () => {
        if (b.disabled) return;
        const v = b.dataset.v === "1", ok = v === o.lebewesen; if (ok) score++;
        $$("[data-v]", root).forEach((x) => { x.disabled = true; const xv = x.dataset.v === "1"; if (xv === o.lebewesen) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); });
        const row = (k) => { const val = o.k[k[0]], note = o.notiz && o.notiz[k[0]]; const s = val === 1 ? '<span class="y">✓</span>' : val === 2 ? '<span class="s">~ nur scheinbar</span>' : '<span class="n">✗</span>'; return "<tr><td>" + k[1] + "</td><td>" + s + (note ? ' <span class="muted">(' + esc(note) + ")</span>" : "") + "</td></tr>"; };
        $(".cfb", root).innerHTML = '<div class="feedback ' + (ok ? "ok" : "bad") + '"><div class="fh">' + (ok ? "✓ Richtig!" : "✗ Fast! Schau noch mal:") + "</div><p>" + esc(o.begruendung) + '</p><table class="ktab">' + KZ.map(row).join("") + "</table>" +
          (idx < list.length - 1 ? '<button type="button" class="btn" data-cnext>Nächstes Objekt</button>' : "") + "</div>";
        const nx = $("[data-cnext]", root);
        if (nx) { nx.addEventListener("click", () => { idx++; draw(); }); nx.focus(); } else ctx.done();
      }));
    }
    draw();
    return { evaluate: () => ({ score: score, max: list.length }), reveal() {} };
  };

  C.ZEIG = function (u, root, ctx) {
    const rounds = [];
    const multi = u.grafiken.length > 1;
    for (let i = 0; i < u.runden; i++) rounds.push({ grafik: u.grafiken[i % u.grafiken.length] });
    const bag = {};
    rounds.forEach((r) => { if (!bag[r.grafik] || !bag[r.grafik].length) bag[r.grafik] = shuffle(u.teile); r.target = bag[r.grafik].pop(); });
    let idx = 0, score = 0;
    const gname = { pflanzenzelle: "in der Pflanzenzelle", tierzelle: "in der Tierzelle", mikroskop: "am Mikroskop" };
    function draw() {
      const r = rounds[idx]; const present = GR.dataPartsIn(r.grafik).indexOf(r.target) >= 0;
      root.innerHTML = '<p class="progress">Runde ' + (idx + 1) + " von " + rounds.length + '</p><p class="zeig-q">Zeig mir: <b>' + esc(partName(u.info, r.target)) + "</b> " + (gname[r.grafik] || "") + '</p><div class="gwrap">' + GR.svg(r.grafik) + "</div>" +
        (multi ? '<div class="nextrow"><button type="button" class="btn ghost" data-nicht>Gibt es hier nicht</button></div>' : "") + '<div class="zfb" role="status" aria-live="polite"></div>';
      const holder = $(".gwrap", root); let done = false;
      function answer(p) {
        if (done) return; done = true;
        const ok = present ? p === r.target : p === null; if (ok) score++;
        if (present) ring(holder, r.grafik, r.target, "ok");
        if (!ok && p) ring(holder, r.grafik, p, "bad");
        const nm = partName(u.info, r.target);
        const msg = ok ? (present ? "Richtig! Das ist " + artikel(u.info, r.target) + " " + nm + "." : "Richtig! " + nm + " gibt es in der Tierzelle nicht.")
          : (present ? (p ? "Das war " + artikel(u.info, p) + " " + partName(u.info, p) + ". " : "") + nm + " ist grün markiert." : nm + " gibt es in der Tierzelle nicht – nur in der Pflanzenzelle.");
        $(".zfb", root).innerHTML = '<div class="feedback ' + (ok ? "ok" : "bad") + '"><div class="fh">' + (ok ? "✓ " : "✗ Fast! ") + esc(msg) + "</div>" + (idx < rounds.length - 1 ? '<button type="button" class="btn" data-znext style="margin-top:8px">Weiter</button>' : "") + "</div>";
        const nb = $("[data-nicht]", root); if (nb) nb.disabled = true;
        const nx = $("[data-znext]", root);
        if (nx) { nx.addEventListener("click", () => { idx++; draw(); }); nx.focus(); } else ctx.done();
      }
      makeInteractive(holder, r.grafik, answer, (id, n) => "Struktur " + n);
      const nb = $("[data-nicht]", root); if (nb) nb.addEventListener("click", () => answer(null));
    }
    draw();
    return { evaluate: () => ({ score: score, max: rounds.length }), reveal() {} };
  };
  function artikel(info, k) {
    if (info === "mikroskop") return ({ okular: "das", tubus: "der", objektivrevolver: "der", objektiv: "das", objekttisch: "der", kondensorblende: "die", beleuchtung: "die", beleuchtungsregler: "der", grobtrieb: "der", feintrieb: "der", stativ: "das" })[k];
    return ({ zellmembran: "die", zellplasma: "das", zellkern: "der", mitochondrium: "das", er: "das", ribosomen: "die", zellwand: "die", tuepfel: "der", vakuole: "die", chloroplast: "der" })[k];
  }

  C.ZAHLGEN = function (u, root, ctx) {
    const tasks = [];
    for (let i = 0; i < u.runden; i++) {
      const ok = pick(u.okulare), ob = pick(u.objektive), g = ok * ob, r = Math.random();
      if (r < 0.6) tasks.push({ q: "Okular " + ok + "-fach, Objektiv " + ob + "-fach. Wie groß ist die Gesamtvergrößerung?", a: g, weg: ok + " × " + ob + " = " + g });
      else if (r < 0.8) tasks.push({ q: "Okular " + ok + "-fach. Die Gesamtvergrößerung soll " + g + "-fach sein. Welche Vergrößerung hat das Objektiv?", a: ob, weg: g + " : " + ok + " = " + ob });
      else tasks.push({ q: "Objektiv " + ob + "-fach. Die Gesamtvergrößerung soll " + g + "-fach sein. Welche Vergrößerung hat das Okular?", a: ok, weg: g + " : " + ob + " = " + ok });
    }
    let idx = 0, score = 0;
    function draw() {
      const t = tasks[idx], id = "zg" + idx;
      root.innerHTML = '<p class="progress">Aufgabe ' + (idx + 1) + " von " + tasks.length + '</p><p class="qtext">' + esc(t.q) + '</p><div class="zahl"><label class="sr-only" for="' + id + '">Antwort</label><input id="' + id + '" type="text" inputmode="numeric" autocomplete="off" placeholder="Zahl"> <span>-fach</span> <button type="button" class="btn" data-zc>Prüfen</button></div><div class="zfb" role="status" aria-live="polite"></div>';
      const inp = $("input", root), b = $("[data-zc]", root);
      inp.focus({ preventScroll: true });
      const go = () => {
        if (b.disabled) return; b.disabled = true; inp.disabled = true;
        const v = parseFloat(inp.value.replace(",", ".")), ok = v === t.a; if (ok) score++;
        inp.classList.add(ok ? "ok" : "bad");
        $(".zfb", root).innerHTML = '<div class="feedback ' + (ok ? "ok" : "bad") + '"><div class="fh">' + (ok ? "✓ Richtig!" : "✗ Fast! Richtig ist " + t.a + "-fach.") + "</div><p>Rechenweg: " + esc(t.weg) + ". Gesamtvergrößerung = Okular × Objektiv.</p>" + (idx < tasks.length - 1 ? '<button type="button" class="btn" data-zn>Weiter</button>' : "") + "</div>";
        const nx = $("[data-zn]", root); if (nx) { nx.addEventListener("click", () => { idx++; draw(); }); nx.focus(); } else ctx.done();
      };
      b.addEventListener("click", go);
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
    }
    draw();
    return { evaluate: () => ({ score: score, max: tasks.length }), reveal() {} };
  };

  C.EXPLORER = function (u, root) {
    if (u.info === "algen") { algenExplorer(root); return { evaluate: () => ({ score: 0, max: 0 }), reveal() {} }; }
    zellExplorer(root, u.grafiken, u.info, u.hinweis);
    return { evaluate: () => ({ score: 0, max: 0 }), reveal() {} };
  };

  /* ================= Explorer ================= */
  function infoHtml(info, k) {
    if (info === "mikroskop") { const m = D.MIKROSKOP[k]; return "<h3>" + esc(m.name) + "</h3><p>" + esc(m.aufgabe) + "</p>"; }
    const o = D.ORGANELLEN[k];
    return "<h3>" + esc(o.plural || o.name) + "</h3><p>" + esc(o.aufgabe) + '</p><p class="meta"><b>Wo?</b> ' + esc(o.wo) + " · <b>Im Schul-Lichtmikroskop sichtbar?</b> " + esc(o.sichtbar) + '</p><span class="merkhilfe">' + (o.fach ? "Fachbezeichnung: " : "Merkhilfe: ") + esc(o.merkhilfe) + "</span>";
  }
  function zellExplorer(root, grafiken, info, hinweis) {
    let cur = grafiken[0];
    root.innerHTML = (grafiken.length > 1 ? '<div class="switch" role="group" aria-label="Zellart wählen"><button type="button" data-g="pflanzenzelle" aria-pressed="true">Pflanzenzelle</button><button type="button" class="tier" data-g="tierzelle" aria-pressed="false">Tierzelle</button></div>' : "") +
      '<p class="hint">Tippe auf einen Bestandteil, um mehr zu erfahren.</p><div class="gwrap"></div><div class="card info" role="status" aria-live="polite"><p class="muted">Noch nichts ausgewählt.</p></div>' + (hinweis ? '<p class="hint">' + esc(hinweis) + "</p>" : "");
    function draw() {
      const h = $(".gwrap", root); h.innerHTML = GR.svg(cur, { title: cur === "mikroskop" ? "Lichtmikroskop" : cur === "tierzelle" ? "Tierzelle" : "Pflanzenzelle" });
      makeInteractive(h, cur, (p) => { clearRings(h); ring(h, cur, p, ""); $(".info", root).innerHTML = infoHtml(info, p); }, (id) => partName(info, id));
    }
    $$("[data-g]", root).forEach((b) => b.addEventListener("click", () => { cur = b.dataset.g; $$("[data-g]", root).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false")); $(".info", root).innerHTML = '<p class="muted">Noch nichts ausgewählt.</p>'; draw(); }));
    draw();
  }
  function algenExplorer(root) {
    root.innerHTML = '<p class="hint">Tippe auf eine Alge, um ihre Merkmale zu sehen.</p><div class="algen">' +
      D.ALGEN.map((a, i) => (i ? '<div class="arrow" aria-hidden="true">→</div>' : "") + '<button type="button" data-a="' + i + '" aria-pressed="false">' + GR.svg(a.grafik) + "<b>" + esc(a.stufe) + '</b><span class="muted">' + esc(a.name) + "</span></button>").join("") +
      '</div><div class="card info" role="status" aria-live="polite" style="margin-top:12px"><p class="muted">Noch nichts ausgewählt.</p></div>';
    $$("[data-a]", root).forEach((b) => b.addEventListener("click", () => {
      const a = D.ALGEN[+b.dataset.a];
      $$("[data-a]", root).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      $(".info", root).innerHTML = "<h3>" + esc(a.name) + " – " + esc(a.stufe) + "</h3><ul>" + a.merkmale.map((m) => "<li>" + esc(m) + "</li>").join("") + "</ul>";
    }));
  }
  function kennzeichenExplorer(root) {
    root.innerHTML = '<p class="hint">Tippe auf ein Kennzeichen.</p><div class="gwrap small"></div><div class="card info" role="status" aria-live="polite"><p class="muted">W–S–F–B–R: „Wilde Schweine fressen bunte Rüben.“</p></div>';
    const h = $(".gwrap", root); h.innerHTML = GR.svg("kennzeichenRad", { title: "Die fünf Kennzeichen" });
    makeInteractive(h, "kennzeichenRad", (p) => { const k = D.KENNZEICHEN[p]; $(".info", root).innerHTML = "<h3>" + k.buchstabe + " – " + esc(k.name) + "</h3><p>" + k.text + "</p>"; }, (id) => D.KENNZEICHEN[id].name);
  }
  function leiterExplorer(root) {
    root.innerHTML = '<p class="hint">Organisationsstufen am Beispiel Herz – tippe eine Stufe an.</p><div class="stairs">' +
      D.STUFEN.map((s, i) => '<button type="button" data-s="' + i + '" aria-pressed="false">' + GR.svg(s.grafik) + "<b>" + (i + 1) + ". " + esc(s.name) + "</b></button>").join("") +
      '</div><div class="card info" role="status" aria-live="polite" style="margin-top:12px"><p class="muted">Zelle → Gewebe → Organ → Organsystem → Organismus</p></div>';
    $$("[data-s]", root).forEach((b) => b.addEventListener("click", () => {
      const s = D.STUFEN[+b.dataset.s];
      $$("[data-s]", root).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      $(".info", root).innerHTML = "<h3>" + esc(s.name) + "</h3><p>" + esc(s.text) + "</p><p><b>Beispiel:</b> " + esc(s.bsp) + "</p>";
    }));
  }
  function vergleichExplorer(root) {
    root.innerHTML = '<p class="hint">Tippe auf Bestandteile in beiden Zellen.</p><div class="twocol"><div><h3>Pflanzenzelle</h3><div class="gwrap" data-h="pflanzenzelle"></div></div><div><h3>Tierzelle</h3><div class="gwrap" data-h="tierzelle"></div></div></div><div class="card info" role="status" aria-live="polite"><p class="muted">Noch nichts ausgewählt.</p></div>' + vergleichTabelle();
    $$("[data-h]", root).forEach((h) => {
      const n = h.dataset.h; h.innerHTML = GR.svg(n, { title: n === "tierzelle" ? "Tierzelle" : "Pflanzenzelle" });
      makeInteractive(h, n, (p) => { $$("[data-h]", root).forEach(clearRings); ring(h, n, p, ""); $(".info", root).innerHTML = infoHtml("organellen", p); }, (id) => partName("organellen", id));
    });
  }
  function vergleichTabelle() {
    const rows = [["Zellmembran", 1, 1], ["Zellplasma", 1, 1], ["Zellkern", 1, 1], ["Mitochondrien", 1, 1], ["ER mit Ribosomen", 1, 1], ["Zellwand mit Tüpfeln", 0, 1], ["große Vakuole", 0, 1], ["Chloroplasten", 0, "✓ (in grünen Teilen)"]];
    const s = (v) => (v === 1 ? "✓" : v === 0 ? "✗" : v);
    return '<div class="tblwrap"><table class="tbl"><thead><tr><th>Bestandteil</th><th>Tierzelle</th><th>Pflanzenzelle</th></tr></thead><tbody>' + rows.map((r) => "<tr><td>" + r[0] + "</td><td>" + s(r[1]) + "</td><td>" + s(r[2]) + "</td></tr>").join("") + "</tbody></table></div>";
  }

  /* ================= Üben-Wrapper ================= */
  const EXACT = ["MC", "MC+", "RF", "ZAHL", "LUECKE"];
  function isCorrect(item, res) {
    if (!res.max) return false;
    if (EXACT.indexOf(item.typ) >= 0) return res.score === res.max;
    if (item.typ === "FREI") return res.score / res.max >= 0.75;
    return res.score / res.max >= 0.8;
  }
  function feedbackHtml(item, res, ok, api) {
    let h = "";
    const multi = EXACT.indexOf(item.typ) < 0;
    if (item.typ === "FREI") {
      h += '<div class="fh">' + (ok ? "✓ Stark! " : "✗ Fast! ") + "Du hast " + res.score + " von " + res.max + " Punkten genannt.</div>" + (ok ? "" : "<p>Lies dir die Musterlösung noch einmal in Ruhe durch und versuch es später wieder.</p>");
      return h;
    }
    if (ok) h += '<div class="fh">✓ ' + (multi && res.score < res.max ? "Gut gemacht! " + res.score + " von " + res.max + " richtig." : multi ? "Super – alles richtig!" : "Richtig!") + "</div>";
    else {
      h += '<div class="fh">✗ Fast! Schau noch mal:</div>';
      if (multi) h += "<p>Du hast " + res.score + " von " + res.max + " richtig. Die richtigen Lösungen sind markiert (✓).</p>";
      if (api.loesung) h += "<p><b>Richtig ist:</b> " + esc(api.loesung()) + "</p>";
    }
    if (ok && item.typ === "RF" && item.korrektur) h += "<p><b>Richtig heißt es:</b> „" + esc(item.korrektur) + "“</p>";
    if (ok && item.typ === "RH" && api.loesung && res.score < res.max) h += "<p><b>Reihenfolge:</b> " + esc(api.loesung()) + "</p>";
    const ex = api.extra && api.extra(); if (ex) h += "<p><b>Hinweis:</b> " + esc(ex) + "</p>";
    if (item.erklaerung) h += "<p>💡 " + esc(item.erklaerung) + "</p>";
    return h;
  }
  function runItem(item, host, o) {
    o = o || {};
    host.innerHTML = '<div class="ex-body"></div><div class="feedback" role="status" aria-live="polite"></div><div class="nextrow ex-next"></div>';
    const body = $(".ex-body", host), fb = $(".feedback", host);
    let api;
    const ctx = {
      mode: "practice", opts: o.opts || {},
      done() {
        const res = api.evaluate(); const ok = isCorrect(item, res);
        api.reveal();
        fb.className = "feedback " + (ok ? "ok" : "bad"); fb.innerHTML = feedbackHtml(item, res, ok, api);
        record(item.id, ok, o.fehlerModus ? 5 : 10);
        if (o.onFinish) o.onFinish(ok, res, $(".ex-next", host));
        fb.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
      }
    };
    api = C[item.typ](item, body, ctx);
    return api;
  }

  /* ================= Runden (Quiz, Training, Fehlerkiste) ================= */
  function session(host, items, o) {
    o = o || {};
    let i = 0, right = 0; const xp0 = Store.state.xp;
    function show() {
      if (i >= items.length) return end();
      const it = items[i]; const t = THEMA_NR[it.thema];
      host.innerHTML = '<p class="progress">Frage ' + (i + 1) + " von " + items.length + ' · <span aria-hidden="true">✓</span> ' + right + ' richtig</p><div class="pbar" aria-hidden="true"><i style="width:' + Math.round((i / items.length) * 100) + '%"></i></div>' +
        '<div class="card" style="--tc:' + t.farbe + '"><div class="ex-head"><span class="ex-meta">' + esc(TYPNAME[it.typ]) + (it.stufe ? " · Stufe " + it.stufe : "") + (o.showThema ? " · " + esc(t.kurz) : "") + '</span></div><div class="ex"></div></div>';
      runItem(it, $(".ex", host), {
        fehlerModus: o.fehlerModus,
        onFinish(ok, res, next) {
          if (ok) right++;
          next.innerHTML = '<button type="button" class="btn">' + (i < items.length - 1 ? "Weiter" : "Auswertung") + "</button>";
          const b = $("button", next); b.addEventListener("click", () => { i++; show(); window.scrollTo(0, 0); }); b.focus({ preventScroll: true });
        }
      });
    }
    function end() {
      const xp = Store.state.xp - xp0;
      host.innerHTML = '<div class="card center"><h2>Runde geschafft! 🎉</h2><p class="bigpct">' + right + " / " + items.length + "</p><p>" + (right === items.length ? "Alles richtig – stark!" : right >= items.length / 2 ? "Gut gemacht! Falsche Antworten liegen jetzt in der Fehlerkiste." : "Dranbleiben lohnt sich! Die Fehlerkiste hilft dir beim Wiederholen.") + "</p><p>+" + xp + ' XP</p><div class="row" style="justify-content:center"><button type="button" class="btn" data-again>Noch eine Runde</button><a class="btn sec" href="' + (o.backHref || "#/") + '">' + esc(o.backLabel || "Zur Startseite") + "</a></div></div>";
      $("[data-again]", host).addEventListener("click", () => { if (o.again) o.again(); });
      confetti();
    }
    show();
  }
  function quizItems(nr) {
    const pool = D.fragen.filter((f) => f.thema === nr);
    return sample(pool, 10).sort((a, b) => a.stufe - b.stufe);
  }

  /* ================= Konfetti ================= */
  function confetti() {
    if (reducedMotion()) return;
    const c = document.createElement("div"); c.className = "confetti"; c.setAttribute("aria-hidden", "true");
    const cols = ["#2E7D4F", "#D2643F", "#2563EB", "#F5C518", "#7C3AED"];
    for (let i = 0; i < 40; i++) { const p = document.createElement("i"); p.style.left = Math.random() * 100 + "%"; p.style.background = cols[i % cols.length]; p.style.animationDelay = Math.random() * 0.6 + "s"; p.style.transform = "rotate(" + Math.random() * 180 + "deg)"; c.appendChild(p); }
    document.body.appendChild(c); setTimeout(() => c.remove(), 3200);
  }

  /* ================= Seiten ================= */
  const main = () => $("#main");
  function setPage(title, html) {
    document.title = title + " · Zell-Labor";
    main().innerHTML = html;
    const h = $("h1", main()); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }

  function pageHome() {
    const f = fehlerIds().length;
    setPage("Start", '<div class="hello"><h1>Hallo, Zellforscher!</h1></div><p class="muted prose">Wähle ein Thema. In jedem Thema kannst du lernen, üben und ein Quiz machen.</p>' +
      '<div class="tiles">' + D.themen.map((t) => {
        const m = mastery(t.nr);
        return '<a class="tile" href="#/thema/' + t.id + '" style="--tc:' + t.farbe + '"><div class="th">' + GR.icon(t.id) + '<div><span class="tn">Thema ' + t.nr + "</span><b>" + esc(t.titel) + '</b></div></div><div class="bar" role="progressbar" aria-label="Gemeistert" aria-valuenow="' + m + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + m + '%"></i></div><div class="pct"><span>' + m + " % gemeistert</span>" + (m >= 80 ? '<span class="badge">🏅 Abzeichen</span>' : "") + "</div></a>";
      }).join("") + "</div>" +
      '<div class="actions"><a class="btn big" href="#/arbeit">📝 Probe-Klassenarbeit</a><a class="btn big sec" href="#/fehler">🧰 Fehlerkiste (' + f + ')</a><a class="btn big sec" href="#/training">🔀 Gemischtes Training (10 Fragen)</a><a class="btn big sec" href="#/spick">📄 Spickzettel</a></div>');
  }

  function pageThema(id, tab, sub) {
    const t = THEMA[id]; if (!t) return pageHome();
    tab = tab || "lernen";
    const m = mastery(t.nr);
    const tabs = [["lernen", "Lernen"], ["ueben", "Üben"], ["quiz", "Quiz"]];
    let html = '<a class="back" href="#/">← Startseite</a><div class="thead" style="--tc:' + t.farbe + '">' + GR.icon(t.id) + '<div><span class="muted">Thema ' + t.nr + " · " + m + " % gemeistert" + (m >= 80 ? " · 🏅" : "") + "</span><h1>" + esc(t.titel) + "</h1></div></div>" +
      '<nav class="tabs" aria-label="Bereiche">' + tabs.map((x) => '<a href="#/thema/' + id + "/" + x[0] + '"' + (tab === x[0] ? ' aria-current="page"' : "") + ">" + x[1] + "</a>").join("") + '</nav><div id="tabbody" style="--tc:' + t.farbe + '"></div>';
    setPage(t.kurz, html);
    const body = $("#tabbody");
    if (tab === "lernen") {
      body.innerHTML = '<div class="merk">' + t.merk.map((k) => '<div class="card"><h3>' + esc(k.titel) + "</h3><div>" + k.html + "</div></div>").join("") + '</div><h2 style="margin-top:20px">Entdecken</h2><div class="card" id="lg"></div>';
      const lg = $("#lg");
      ({ kennzeichenRad: kennzeichenExplorer, leiterMensch: leiterExplorer, vergleich: vergleichExplorer,
         zellExplorer: (r) => zellExplorer(r, ["pflanzenzelle", "tierzelle"], "organellen", "Diese Bestandteile fehlen der Tierzelle: Zellwand, Tüpfel, Vakuole, Chloroplasten."),
         algen: algenExplorer, mikroskop: (r) => zellExplorer(r, ["mikroskop"], "mikroskop") })[t.lernGrafik](lg);
    } else if (tab === "ueben") {
      const list = D.uebungen.filter((u) => u.thema === t.nr);
      if (sub && ITEMS[sub]) {
        const u = ITEMS[sub];
        body.innerHTML = '<a class="back" href="#/thema/' + id + '/ueben">← Alle Übungen</a><div class="card"><div class="ex-head"><h2>' + esc(u.titel) + '</h2>' + (TYPNAME[u.typ] !== u.titel ? '<span class="ex-meta">' + esc(TYPNAME[u.typ]) + '</span>' : "") + '</div><div id="ex"></div></div>';
        if (u.typ === "EXPLORER") C.EXPLORER(u, $("#ex"));
        else runItem(u, $("#ex"), {
          onFinish(ok, res, next) {
            next.innerHTML = '<button type="button" class="btn" data-re>Nochmal</button><a class="btn sec" href="#/thema/' + id + '/ueben">Zur Übersicht</a>';
            $("[data-re]", next).addEventListener("click", () => pageThema(id, "ueben", sub));
            if (ok) confetti();
          }
        });
      } else {
        const s = Store.state;
        body.innerHTML = '<div class="ulist">' + list.map((u) => { const st = s.items[u.id]; return '<a class="card" href="#/thema/' + id + "/ueben/" + u.id + '"><span class="typ">' + esc(TYPNAME[u.typ]) + "</span><h3>" + esc(u.titel) + "</h3>" + (st && st.last ? '<span class="done">✓ geschafft</span>' : st ? '<span class="muted">nochmal versuchen</span>' : "") + "</a>"; }).join("") + "</div>";
      }
    } else {
      const run = () => session(body, quizItems(t.nr), { backHref: "#/thema/" + id, backLabel: "Zum Thema", again: run });
      run();
    }
  }

  function pageFehler(sub) {
    const ids = fehlerIds();
    if (sub === "ueben" && ids.length) {
      setPage("Fehlerkiste üben", '<a class="back" href="#/fehler">← Fehlerkiste</a><h1>Fehlerkiste üben</h1><div id="sess"></div>');
      const run = () => { const now = fehlerIds(); if (!now.length) { pageFehler(); return; } session($("#sess"), sample(now, 10).map((x) => ITEMS[x]), { fehlerModus: true, showThema: true, backHref: "#/fehler", backLabel: "Zur Fehlerkiste", again: run }); };
      run(); return;
    }
    setPage("Fehlerkiste", '<a class="back" href="#/">← Startseite</a><h1>Fehlerkiste</h1>' +
      (ids.length ? '<p class="prose">Hier liegen ' + ids.length + " Aufgaben, die noch nicht geklappt haben. Eine Aufgabe verlässt die Kiste, wenn du sie <b>zweimal hintereinander</b> richtig löst.</p>" +
        '<p><a class="btn" href="#/fehler/ueben">Fehlerkiste üben (bis zu 10)</a></p><div class="card"><ul class="flist">' + ids.map((id) => { const it = ITEMS[id]; return "<li><b>" + esc(THEMA_NR[it.thema].kurz) + ":</b> " + esc(itemTitle(it)) + ' <span class="muted">(' + esc(TYPNAME[it.typ]) + (Store.state.fehler[id] ? ", 1× richtig" : "") + ")</span></li>"; }).join("") + "</ul></div>"
        : '<div class="card"><p>Deine Fehlerkiste ist leer. 🎉 Super!</p><p class="muted">Wenn du eine Aufgabe falsch beantwortest, landet sie hier, damit du sie wiederholen kannst.</p><a class="btn" href="#/training">Gemischtes Training</a></div>'));
  }

  function pageTraining() {
    setPage("Gemischtes Training", '<a class="back" href="#/">← Startseite</a><h1>Gemischtes Training</h1><div id="sess"></div>');
    const run = () => session($("#sess"), sample(D.fragen, 10).sort((a, b) => a.stufe - b.stufe), { showThema: true, again: run });
    run();
  }

  /* ---------- Probe-Klassenarbeit ---------- */
  let exam = null;
  function examMax(it, opts) {
    switch (it.typ) {
      case "MC": case "RF": case "ZAHL": case "MC+": return 1;
      case "ZU": return it.anzahl || it.paare.length;
      case "SORT": return it.karten.length;
      case "BESCHR": return it.teile.length;
      case "RH": return it.karten.length;
      case "ZELLE": return 2;
      case "FREI": return it.punkte.length;
      case "LUECKE": return (it.text.match(/\{/g) || []).length;
      default: return 1;
    }
  }
  function buildExam() {
    const parts = D.ARBEIT.map((p) => {
      const tasks = [];
      p.teile.forEach((tl) => {
        if (tl.aus) tasks.push({ item: ITEMS[pick(tl.aus)], opts: tl.opts || {} });
        else sample(D.fragen.filter((f) => f.thema === tl.pool.thema && tl.pool.typen.indexOf(f.typ) >= 0), tl.anzahl).forEach((it) => tasks.push({ item: it, opts: {} }));
      });
      tasks.forEach((t) => { t.max = examMax(t.item, t.opts); });
      return { thema: p.thema, titel: p.titel, tasks: tasks };
    });
    return { parts: parts, left: 45 * 60, paused: false, hidden: false, phase: "run", timer: null, node: null };
  }
  function pageArbeit() {
    if (exam && exam.node) {
      setPage("Probe-Klassenarbeit", ""); main().appendChild(exam.node);
      const h = $("h1", main()); if (h) h.focus({ preventScroll: true }); return;
    }
    const tmp = buildExam(); const total = tmp.parts.reduce((s, p) => s + p.tasks.reduce((a, t) => a + t.max, 0), 0);
    setPage("Probe-Klassenarbeit", '<a class="back" href="#/">← Startseite</a><div class="exam-cover"><div class="paper"><p class="muted">Biologie · Klasse 7</p><h1>Probe-Klassenarbeit: Die Zelle</h1><p>Name: ____________________ &nbsp; Datum: ____________</p>' +
      '<ul style="text-align:left"><li>6 Teile – einer pro Thema</li><li>Zeit: 45 Minuten (du kannst den Timer pausieren oder ausblenden)</li><li>Etwa ' + total + " Punkte</li><li>Rückmeldung bekommst du erst am Ende – wie bei einer echten Arbeit.</li><li>Freie Aufgaben bewertest du am Ende selbst mit der Musterlösung.</li></ul>" +
      '<button type="button" class="btn big" id="start">Arbeit beginnen</button></div></div>');
    $("#start").addEventListener("click", () => { exam = tmp; startExam(); });
  }
  function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
  function startExam() {
    const node = document.createElement("div");
    exam.node = node;
    let n = 0;
    node.innerHTML = '<h1>Probe-Klassenarbeit: Die Zelle</h1><div class="timer noprint" id="timer"><span aria-hidden="true">⏱</span><span class="time" aria-live="off">45:00</span><button type="button" class="btn sec" data-pause>Pause</button><button type="button" class="btn ghost" data-hide>Timer ausblenden</button><span class="tmsg muted"></span></div><div id="examres"></div>' +
      exam.parts.map((p, pi) => {
        const t = THEMA_NR[p.thema];
        return '<section style="--tc:' + t.farbe + '"><h2 class="part-h">' + GR.icon(t.id) + "Teil " + (pi + 1) + ": " + esc(p.titel) + "</h2>" + p.tasks.map((tk, ti) => { n++; tk.nr = n; return '<div class="card task" id="task' + n + '"><div class="task-h"><span>Aufgabe ' + n + " · " + esc(TYPNAME[tk.item.typ]) + '</span><span class="pts">' + tk.max + (tk.max === 1 ? " Punkt" : " Punkte") + '</span></div><div class="tbody"></div><div class="tres"></div></div>'; }).join("") + "</section>";
      }).join("") + '<div class="nextrow" id="examactions"><button type="button" class="btn big" id="abgabe">Arbeit abgeben</button></div>';
    setPage("Probe-Klassenarbeit", ""); main().appendChild(node);
    exam.parts.forEach((p) => p.tasks.forEach((tk) => { tk.api = C[tk.item.typ](tk.item, $("#task" + tk.nr + " .tbody", node), { mode: "exam", opts: tk.opts, done() {} }); }));
    const tEl = $("#timer .time", node);
    exam.timer = setInterval(() => {
      if (exam.paused || exam.phase !== "run") return;
      if (exam.left > 0) exam.left--;
      tEl.textContent = exam.hidden ? "••:••" : fmt(exam.left);
      if (exam.left === 0) $(".tmsg", node).textContent = "Die Zeit ist um. Mach in Ruhe fertig und gib dann ab.";
    }, 1000);
    $("[data-pause]", node).addEventListener("click", (e) => { exam.paused = !exam.paused; e.target.textContent = exam.paused ? "Weiter" : "Pause"; $(".tmsg", node).textContent = exam.paused ? "Pausiert" : ""; });
    $("[data-hide]", node).addEventListener("click", (e) => { exam.hidden = !exam.hidden; e.target.textContent = exam.hidden ? "Timer zeigen" : "Timer ausblenden"; tEl.textContent = exam.hidden ? "••:••" : fmt(exam.left); });
    $("#abgabe", node).addEventListener("click", () => {
      if (!window.confirm("Möchtest du die Arbeit jetzt abgeben?")) return;
      exam.phase = "self";
      const frei = [];
      exam.parts.forEach((p) => p.tasks.forEach((tk) => { if (tk.item.typ === "FREI") { tk.api.prepare(); frei.push(tk); } }));
      const act = $("#examactions", node);
      if (frei.length) {
        act.innerHTML = '<div class="card" style="width:100%"><p><b>Fast fertig!</b> Bewerte jetzt deine freien Antworten selbst: Hake in Aufgabe ' + frei.map((f) => f.nr).join(" und ") + ' ab, was du genannt hast.</p><button type="button" class="btn big" id="ergebnis">Ergebnis anzeigen</button></div>';
        $("#ergebnis", node).addEventListener("click", finishExam);
        $("#task" + frei[0].nr, node).scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
      } else finishExam();
    });
  }
  function finishExam() {
    const node = exam.node; exam.phase = "done"; clearInterval(exam.timer);
    let got = 0, max = 0; const rows = []; const weak = {};
    exam.parts.forEach((p) => {
      let pg = 0, pm = 0;
      p.tasks.forEach((tk) => {
        const res = tk.api.evaluate(); tk.api.reveal();
        const ok = isCorrect(tk.item, res);
        pg += res.score; pm += tk.max;
        record(tk.item.id, ok, 0);
        if (!ok) weak[p.thema] = true;
        const extra = tk.item.erklaerung ? "<p>💡 " + esc(tk.item.erklaerung) + "</p>" : "";
        const sol = tk.api.loesung && !ok ? "<p><b>Richtig ist:</b> " + esc(tk.api.loesung()) + "</p>" : "";
        $("#task" + tk.nr + " .tres", node).innerHTML = '<div class="feedback ' + (ok ? "ok" : "bad") + '"><div class="fh">' + (ok ? "✓ " : "✗ ") + res.score + " von " + tk.max + " Punkten</div>" + sol + extra + "</div>";
      });
      got += pg; max += pm; rows.push([p, pg, pm]);
    });
    const s = Store.state; s.xp += 50; s.arbeiten = (s.arbeiten || 0) + 1; Store.save(s); updateHeader();
    const pct = Math.round((got / max) * 100);
    const weakList = Object.keys(weak).map((nr) => THEMA_NR[nr]);
    $("#examres", node).innerHTML = '<div class="card"><h2>Dein Ergebnis</h2><p class="bigpct">' + pct + ' %</p><p>' + got + " von " + max + " Punkten · +50 XP</p>" +
      '<table class="tbl result-table"><thead><tr><th>Teil</th><th>Punkte</th></tr></thead><tbody>' + rows.map((r, i) => "<tr><td>" + (i + 1) + ". " + esc(r[0].titel) + "</td><td>" + r[1] + " / " + r[2] + "</td></tr>").join("") + "</tbody></table>" +
      (weakList.length ? '<h3 style="margin-top:14px">Das solltest du noch üben</h3><ul>' + weakList.map((t) => '<li><a href="#/thema/' + t.id + '">' + esc(t.titel) + "</a></li>").join("") + "</ul><p class=\"muted\">Falsch gelöste Aufgaben liegen jetzt in der Fehlerkiste.</p>" : "<p>Alles richtig – großartig! 🎉</p>") +
      '<div class="row"><button type="button" class="btn" id="neu">Neue Probe-Klassenarbeit</button><a class="btn sec" href="#/">Zur Startseite</a></div></div>';
    $("#examactions", node).innerHTML = "";
    $("#timer", node).hidden = true;
    $("#neu", node).addEventListener("click", () => { exam = null; pageArbeit(); });
    $("#examres", node).scrollIntoView({ block: "start" });
    confetti();
  }

  /* ---------- Spickzettel ---------- */
  function pageSpick() {
    const orgRows = D.PFLANZEN_TEILE.map((k) => { const o = D.ORGANELLEN[k]; return "<tr><td><b>" + esc(o.plural || o.name) + "</b></td><td>" + esc(o.aufgabe) + "</td><td>" + esc(o.wo) + "</td></tr>"; }).join("");
    const labP = {}; D.PFLANZEN_TEILE.forEach((k) => { labP[k] = D.ORGANELLEN[k].name; });
    const labM = {}; D.MIKROSKOP_TEILE.forEach((k) => { labM[k] = D.MIKROSKOP[k].name; });
    setPage("Spickzettel", '<div class="spick"><div class="row noprint" style="justify-content:space-between"><a class="back" href="#/">← Startseite</a><button type="button" class="btn" id="print">🖨 Drucken</button></div>' +
      "<h1>Spickzettel: Die Zelle (Bio Klasse 7)</h1>" +
      '<div class="sgrid"><div class="card"><h2>1 Kennzeichen des Lebendigen</h2><p><b>W</b>achstum · <b>S</b>toffwechsel · <b>F</b>ortpflanzung und Entwicklung · <b>B</b>ewegung · <b>R</b>eizbarkeit<br><i>„Wilde Schweine fressen bunte Rüben.“</i><br>Nur wenn <b>alle fünf</b> zutreffen → Lebewesen. Roboter: bewegt sich, reagiert über Sensoren, aber kein Wachstum, kein Stoffwechsel, keine Fortpflanzung → kein Lebewesen.</p></div>' +
      '<div class="card"><h2>2 Organisationsstufen</h2><p><b>Zelle</b> → <b>Gewebe</b> → <b>Organ</b> → <b>Organsystem</b> → <b>Organismus</b><br>Herzmuskelzelle → Herzmuskelgewebe → Herz → Herz-Kreislauf-System → Mensch.<br>Pflanzenorgane: Wurzel, Sprossachse, Blatt. 1 mm = 1000 µm. Bau passt zur Funktion; ca. 200 Zelltypen beim Menschen.</p></div></div>' +
      '<div class="sgrid"><div class="card"><h2>3 Tierzelle und Pflanzenzelle</h2>' + vergleichTabelle() + '<p style="margin-top:4px">Zellart bestimmen: Zellwand <b>oder</b> Chloroplasten <b>oder</b> große Vakuole → Pflanzenzelle. Der Zellkern sagt nichts – beide haben einen. Nicht jede Pflanzenzelle ist grün (Zwiebelhaut, Wurzel, Blütenblatt).</p></div>' +
      '<div class="card"><h2>5 Vom Einzeller zum Vielzeller</h2><p><b>Chlamydomonas</b> (Einzeller): 2 Geißeln, Augenfleck, becherförmiger Chloroplast, Längsteilung.<br><b>Gonium</b> (Kolonie): 16 gleiche Zellen in Gallerte.<br><b>Volvox</b> (Vielzeller): Hohlkugel, Plasmabrücken, Arbeitsteilung, Tochterkugeln; Mutterkugel stirbt („erste Leiche“).</p>' + D.themen[4].merk[7].html + "</div></div>" +
      '<div class="card"><h2>4 Zellorganellen</h2><div class="tblwrap"><table class="tbl"><thead><tr><th>Bestandteil</th><th>Aufgabe</th><th>Wo?</th></tr></thead><tbody>' + orgRows + "</tbody></table></div></div>" +
      '<div class="sgrid"><div class="card"><h2>6 Lichtmikroskop</h2><p><b>Gesamtvergrößerung = Okular × Objektiv</b> (z. B. 10 × 40 = 400-fach)</p>' + D.themen[5].merk[3].html + "</div>" +
      '<div class="card"><h2>Arbeitsschritte</h2><ol>' + D.SCHRITTE.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol><p>Mit dem kleinsten Objektiv beginnen: größter Überblick, großer Abstand.</p></div></div>" +
      '<div class="card gpr"><div>' + GR.svg("pflanzenzelle", { mode: "names", labels: labP, title: "Pflanzenzelle beschriftet", margin: 380 }) + '<p class="center"><b>Pflanzenzelle</b></p></div><div>' + GR.svg("tierzelle", { mode: "names", labels: labP, title: "Tierzelle beschriftet", margin: 380 }) + '<p class="center"><b>Tierzelle</b></p></div><div>' + GR.svg("mikroskop", { mode: "names", labels: labM, title: "Mikroskop beschriftet", margin: 260 }) + '<p class="center"><b>Lichtmikroskop</b></p></div></div></div>');
    $("#print").addEventListener("click", () => window.print());
  }

  /* ---------- Einstellungen ---------- */
  function pageSettings() {
    const s = Store.state;
    setPage("Einstellungen", '<a class="back" href="#/">← Startseite</a><h1>Einstellungen</h1>' +
      '<div class="card"><h2>Darstellung</h2><div class="switch" role="group" aria-label="Farbschema">' + [["auto", "Automatisch"], ["light", "Hell"], ["dark", "Dunkel"]].map((x) => '<button type="button" data-th="' + x[0] + '" aria-pressed="' + (s.theme === x[0]) + '">' + x[1] + "</button>").join("") + "</div></div>" +
      '<div class="card"><h2>Fortschritt sichern</h2><p class="prose">Dein Fortschritt liegt nur auf diesem Gerät. Du kannst ihn als Datei sichern und auf einem anderen Gerät wieder einlesen.</p><div class="row"><button type="button" class="btn" id="exp">Exportieren (Datei)</button><button type="button" class="btn sec" id="expt">Als Text anzeigen</button></div><textarea id="exptext" hidden readonly aria-label="Fortschritt als JSON"></textarea></div>' +
      '<div class="card"><h2>Fortschritt einlesen</h2><div class="row"><label class="btn sec" for="impfile">Datei wählen</label><input type="file" id="impfile" accept="application/json,.json" class="sr-only"></div><p class="hint" style="margin-top:10px">… oder JSON hier einfügen:</p><textarea id="imptext" aria-label="JSON zum Einlesen"></textarea><div class="row" style="margin-top:8px"><button type="button" class="btn" id="imp">Einlesen</button></div><p id="impmsg" role="status" aria-live="polite"></p></div>' +
      '<div class="card"><h2>Alles zurücksetzen</h2><p>Löscht XP, Serie, Fehlerkiste und alle Ergebnisse auf diesem Gerät.</p><button type="button" class="btn ghost" id="reset">Fortschritt zurücksetzen</button></div>');
    $$("[data-th]").forEach((b) => b.addEventListener("click", () => { s.theme = b.dataset.th; Store.save(s); applyTheme(); $$("[data-th]").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false")); }));
    $("#exp").addEventListener("click", () => {
      const blob = new Blob([Store.export()], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "zell-labor-fortschritt-" + todayStr() + ".json";
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    $("#expt").addEventListener("click", () => { const t = $("#exptext"); t.hidden = false; t.value = Store.export(); t.select(); });
    const doImport = (txt) => {
      try { Store.import(txt); applyTheme(); updateHeader(); $("#impmsg").textContent = "✓ Fortschritt wurde eingelesen."; }
      catch (e) { $("#impmsg").textContent = "✗ Das hat nicht geklappt: " + e.message; }
    };
    $("#imp").addEventListener("click", () => doImport($("#imptext").value));
    $("#impfile").addEventListener("change", (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => doImport(String(r.result)); r.readAsText(f); });
    $("#reset").addEventListener("click", () => {
      if (!window.confirm("Wirklich den gesamten Fortschritt auf diesem Gerät löschen?")) return;
      Store.reset(); applyTheme(); updateHeader(); $("#impmsg").textContent = "Fortschritt wurde zurückgesetzt.";
    });
  }

  /* ================= Router ================= */
  function route() {
    const h = (location.hash || "#/").replace(/^#\/?/, "");
    const p = h.split("/").filter(Boolean);
    if (exam && exam.node && exam.node.parentNode && p[0] !== "arbeit") exam.node.remove();
    switch (p[0]) {
      case "thema": pageThema(p[1], p[2], p[3]); break;
      case "arbeit": pageArbeit(); break;
      case "fehler": pageFehler(p[1]); break;
      case "training": pageTraining(); break;
      case "spick": pageSpick(); break;
      case "einstellungen": pageSettings(); break;
      default: pageHome();
    }
  }

  /* ================= Start ================= */
  Store.load(); applyTheme(); updateHeader();
  window.addEventListener("hashchange", route);
  route();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  }
  // Für automatische Tests
  window.ZellLabor = { ITEMS: ITEMS, C: C, mastery: mastery, isCorrect: isCorrect };
})();
