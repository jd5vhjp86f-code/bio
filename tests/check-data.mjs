// Datenprüfung für Zell-Labor: node tests/check-data.mjs
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {}, console };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(readFileSync(path.join(dir, "data.js"), "utf8"), ctx, { filename: "data.js" });
vm.runInContext(readFileSync(path.join(dir, "graphics.js"), "utf8"), ctx, { filename: "graphics.js" });
const D = ctx.window.DATA, G = ctx.window.Graphics;

const errors = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);
const TYPES = ["MC", "MC+", "RF", "ZU", "SORT", "RH", "BESCHR", "ZEIG", "LUECKE", "ZAHL", "ZELLE", "FREI", "CHECK", "TABELLE", "EXPLORER", "ZAHLGEN"];
const nonEmpty = (s) => typeof s === "string" && s.trim().length > 0;

// Grafiken: jede Funktion muss ausführbar sein
const gnames = G.list();
for (const n of gnames) { try { const g = G.G[n](); if (!g.body || !g.w || !g.h) err(n, "Grafik unvollständig"); } catch (e) { err(n, "Grafik wirft Fehler: " + e.message); } }
const hasPart = (graf, part) => G.dataPartsIn(graf).includes(part);
const hasAnchor = (graf, part) => { const g = G.G[graf](); return g.parts && g.parts[part] && Array.isArray(g.parts[part].anker); };

const all = [...D.fragen, ...D.uebungen];
const ids = new Set();
for (const q of all) {
  if (!q.id) { err("?", "Eintrag ohne ID"); continue; }
  if (ids.has(q.id)) err(q.id, "ID doppelt");
  ids.add(q.id);
  if (!TYPES.includes(q.typ)) err(q.id, "unbekannter Typ " + q.typ);
  if (![1, 2, 3, 4, 5, 6].includes(q.thema)) err(q.id, "Thema fehlt/ungültig");
  if (!/^t[1-6]-(\d\d|u\d+)$/.test(q.id) || q.id[1] !== String(q.thema)) err(q.id, "ID passt nicht zum Thema");
}

// Fragenpool
for (const q of D.fragen) {
  if (![1, 2, 3].includes(q.stufe)) err(q.id, "Stufe fehlt");
  if (q.typ === "FREI") {
    if (!nonEmpty(q.aufgabe)) err(q.id, "FREI ohne Aufgabe");
    if (!Array.isArray(q.punkte) || q.punkte.length < 3) err(q.id, "FREI braucht mindestens 3 Punkte");
  } else if (!nonEmpty(q.erklaerung)) err(q.id, "Erklärung fehlt");
  switch (q.typ) {
    case "MC":
      if (!nonEmpty(q.frage) || !nonEmpty(q.richtig)) err(q.id, "MC unvollständig");
      if (!Array.isArray(q.falsch) || q.falsch.length !== 3) err(q.id, "MC braucht genau 3 Ablenker");
      else { if (q.falsch.includes(q.richtig)) err(q.id, "Ablenker = Lösung"); if (new Set(q.falsch).size !== 3) err(q.id, "Ablenker doppelt"); }
      break;
    case "MC+":
      if (!Array.isArray(q.richtig) || q.richtig.length < 2 || !Array.isArray(q.falsch) || !q.falsch.length) err(q.id, "MC+ unvollständig");
      else if (q.falsch.some((f) => q.richtig.includes(f))) err(q.id, "MC+: Ablenker = Lösung");
      break;
    case "RF":
      if (!nonEmpty(q.aussage) || typeof q.loesung !== "boolean") err(q.id, "RF unvollständig");
      if (q.loesung === false && !nonEmpty(q.korrektur)) err(q.id, "RF falsch ohne Korrektur");
      break;
    case "LUECKE": {
      const gaps = [...q.text.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
      if (!gaps.length) err(q.id, "Lückentext ohne Lücken");
      for (const w of gaps) if (!q.woerter.includes(w)) err(q.id, `Lösung „${w}“ fehlt in der Wortauswahl`);
      if (q.woerter.length <= new Set(gaps).size) err(q.id, "keine Ablenker in der Wortauswahl");
      if (new Set(q.woerter).size !== q.woerter.length) err(q.id, "Wortauswahl doppelt");
      break;
    }
    case "ZAHL":
      if (!nonEmpty(q.frage) || typeof q.loesung !== "number") err(q.id, "ZAHL unvollständig");
      break;
    case "FREI": break;
    default: err(q.id, "Typ im Fragenpool nicht erwartet: " + q.typ);
  }
}

// Übungen
for (const u of D.uebungen) {
  if (!nonEmpty(u.titel)) err(u.id, "Titel fehlt");
  if (u.typ !== "EXPLORER" && !nonEmpty(u.erklaerung)) err(u.id, "Erklärung fehlt");
  switch (u.typ) {
    case "ZU": {
      if (!Array.isArray(u.paare) || u.paare.length < 2) { err(u.id, "ZU braucht Paare"); break; }
      const l = u.paare.map((p) => p.links), r = u.paare.map((p) => p.rechts);
      if (new Set(l).size !== l.length) err(u.id, "ZU: linke Seite doppelt");
      if (new Set(r).size !== r.length) err(u.id, "ZU: rechte Seite doppelt (nicht eindeutig)");
      if (u.paare.some((p) => !nonEmpty(p.links) || !nonEmpty(p.rechts))) err(u.id, "ZU: leeres Element");
      u.paare.forEach((p) => { if (p.bild && !gnames.includes(p.bild)) err(u.id, "ZU: Bild fehlt " + p.bild); });
      if (u.anzahl && u.anzahl > u.paare.length) err(u.id, "ZU: anzahl > Paare");
      break;
    }
    case "SORT": {
      const sp = new Set(u.spalten.map((s) => s.id));
      if (sp.size !== u.spalten.length) err(u.id, "SORT: Spalten-ID doppelt");
      if (!u.karten.length) err(u.id, "SORT ohne Karten");
      u.karten.forEach((k) => { if (!sp.has(k.spalte)) err(u.id, `SORT: Karte „${k.text}“ ohne gültige Spalte`); });
      const t = u.karten.map((k) => k.text); if (new Set(t).size !== t.length) err(u.id, "SORT: Karte doppelt");
      break;
    }
    case "RH":
      if (!Array.isArray(u.karten) || u.karten.length < 3) err(u.id, "RH braucht mindestens 3 Karten");
      if (new Set(u.karten).size !== u.karten.length) err(u.id, "RH: Karte doppelt");
      if (u.fachbegriffe && u.fachbegriffe.length !== u.karten.length) err(u.id, "RH: Fachbegriffe passen nicht");
      if (u.bilder && (u.bilder.length !== u.karten.length || u.bilder.some((b) => !gnames.includes(b)))) err(u.id, "RH: Bilder passen nicht");
      break;
    case "BESCHR":
      if (!gnames.includes(u.grafik)) { err(u.id, "Grafik fehlt"); break; }
      for (const p of u.teile) {
        if (!hasPart(u.grafik, p)) err(u.id, `Label „${p}“ hat kein data-part in ${u.grafik}`);
        if (!hasAnchor(u.grafik, p)) err(u.id, `Label „${p}“ hat keinen Ankerpunkt in ${u.grafik}`);
      }
      break;
    case "ZEIG":
      for (const g of u.grafiken) if (!gnames.includes(g)) err(u.id, "Grafik fehlt " + g);
      for (const p of u.teile) {
        // muss in mindestens einer Grafik vorkommen; in der ersten (Hauptgrafik) immer
        if (!hasPart(u.grafiken[0], p)) err(u.id, `ZEIG-Label „${p}“ hat kein data-part in ${u.grafiken[0]}`);
      }
      // Teile, die in einer Grafik vorkommen, brauchen dort einen Anker
      for (const g of u.grafiken) for (const p of G.dataPartsIn(g)) if (!hasAnchor(g, p)) err(u.id, `data-part „${p}“ ohne Anker in ${g}`);
      break;
    case "ZELLE": {
      const keys = Object.keys(u.begruendungen);
      u.zellen.forEach((z) => {
        if (!gnames.includes(z.grafik)) err(u.id, "ZELLE: Grafik fehlt " + z.grafik);
        if (!["tier", "pflanze"].includes(z.loesung)) err(u.id, "ZELLE: Lösung ungültig " + z.id);
        if (!z.richtig.length || z.richtig.some((b) => !keys.includes(b))) err(u.id, "ZELLE: Begründungen ungültig " + z.id);
        if (z.richtig.includes("f")) err(u.id, "ZELLE: (f) Zellkern darf nie richtig sein");
        if (z.loesung === "tier" && z.richtig.some((b) => ["a", "b", "c"].includes(b))) err(u.id, "ZELLE: Widerspruch Tier/Pflanze " + z.id);
        if (z.loesung === "pflanze" && z.richtig.some((b) => ["d", "e"].includes(b))) err(u.id, "ZELLE: Widerspruch Pflanze/Tier " + z.id);
      });
      if (u.zellen.length !== 8) err(u.id, "ZELLE: genau 8 Zellen erwartet");
      break;
    }
    case "CHECK":
      u.objekte.forEach((o) => {
        const all5 = ["w", "s", "f", "b", "r"].every((k) => o.k[k] === 1);
        if (all5 !== o.lebewesen) err(u.id, `CHECK: ${o.id} – Lebewesen nur, wenn alle fünf Kennzeichen zutreffen`);
      });
      break;
    case "TABELLE":
      if (!u.zeilen.length) err(u.id, "TABELLE leer");
      break;
    case "EXPLORER":
      (u.grafiken || []).forEach((g) => { if (g !== "algen" && !gnames.includes(g)) err(u.id, "Grafik fehlt " + g); });
      break;
    case "ZAHLGEN":
      if (!u.okulare.length || !u.objektive.length || !u.runden) err(u.id, "ZAHLGEN unvollständig");
      break;
  }
}

// Erwartete IDs aus dem Bauauftrag (t1-01 … t6-18)
const expected = { 1: 18, 2: 19, 3: 14, 4: 20, 5: 15, 6: 18 };
for (const [t, n] of Object.entries(expected)) {
  for (let i = 1; i <= n; i++) { const id = `t${t}-${String(i).padStart(2, "0")}`; if (!D.fragen.some((q) => q.id === id)) err(id, "Frage fehlt"); }
  const count = D.fragen.filter((q) => q.thema === +t).length;
  if (count !== n) err("Thema " + t, `erwartet ${n} Fragen, gefunden ${count}`);
}

// Probe-Klassenarbeit: alle referenzierten IDs müssen existieren
for (const p of D.ARBEIT) for (const tl of p.teile) {
  if (tl.aus) tl.aus.forEach((id) => { if (!ids.has(id)) err("ARBEIT", "unbekannte ID " + id); });
  if (tl.pool && D.fragen.filter((f) => f.thema === tl.pool.thema && tl.pool.typen.includes(f.typ)).length < tl.anzahl) err("ARBEIT", "Pool zu klein");
}

// Merkwissen
for (const t of D.themen) { if (!t.merk.length) err(t.id, "Merkwissen fehlt"); t.merk.forEach((m) => { if (!nonEmpty(m.html)) err(t.id, "leere Merkkarte " + m.titel); }); }

// Ausgabe
const perTheme = D.themen.map((t) => `Thema ${t.nr} (${t.id}): ${D.fragen.filter((q) => q.thema === t.nr).length} Fragen, ${D.uebungen.filter((u) => u.thema === t.nr).length} Übungen`);
console.log(perTheme.join("\n"));
console.log(`Gesamt: ${D.fragen.length} Fragen, ${D.uebungen.length} interaktive Übungen, ${gnames.length} Grafiken`);
if (errors.length) { console.error("\nFEHLER (" + errors.length + "):\n" + errors.join("\n")); process.exit(1); }
console.log("\n✓ Alle Datenprüfungen bestanden.");
