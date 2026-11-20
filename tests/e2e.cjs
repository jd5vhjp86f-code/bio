// Browser-Test (optional, braucht Playwright): node tests/e2e.cjs [basis-url]
// Startet keinen Server – vorher z. B. `python3 -m http.server 8765` im Projektordner.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:8765/";
const SHOTS = path.join(__dirname, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const ROUTES = ["#/", "#/arbeit", "#/fehler", "#/training", "#/spick", "#/einstellungen"];
const THEMEN = ["kennzeichen", "organisation", "vergleich", "organellen", "vielzeller", "mikroskop"];
THEMEN.forEach((t) => ROUTES.push("#/thema/" + t + "/lernen", "#/thema/" + t + "/ueben", "#/thema/" + t + "/quiz"));
const UEB = { kennzeichen: ["t1-u1", "t1-u2"], organisation: ["t2-u1", "t2-u2", "t2-u3", "t2-u4", "t2-u5"], vergleich: ["t3-u1", "t3-u2", "t3-u3"], organellen: ["t4-u1", "t4-u2", "t4-u3", "t4-u4", "t4-u5", "t4-u6"], vielzeller: ["t5-u1", "t5-u2", "t5-u3", "t5-u4", "t5-u5"], mikroskop: ["t6-u1", "t6-u2", "t6-u3", "t6-u4", "t6-u5", "t6-u6"] };
Object.keys(UEB).forEach((t) => UEB[t].forEach((u) => ROUTES.push("#/thema/" + t + "/ueben/" + u)));

const problems = [];
const external = [];

async function clickThrough(page) {
  // Beantwortet die aktuell sichtbare Aufgabe irgendwie und klickt „Prüfen“/„Weiter“.
  for (let guard = 0; guard < 60; guard++) {
    const did = await page.evaluate(() => {
      const vis = (el) => el && el.offsetParent !== null && !el.disabled;
      const q = (s) => Array.from(document.querySelectorAll(s)).filter(vis);
      const click = (el) => { el.click(); return true; };
      if (document.querySelector("#ex > .feedback.ok, #ex > .feedback.bad")) return false;
      // Weiter-/Nächste-Buttons innerhalb mehrstufiger Übungen
      for (const s of ["[data-znext]", "[data-cnext]", "[data-zn]"]) { const b = q(s)[0]; if (b) return click(b); }
      const opt = q(".opt:not(.ok):not(.bad)").filter((b) => b.getAttribute("aria-pressed") === "false");
      const zc = q("[data-zcheck]")[0];
      if (zc) { const art = q("[data-art]")[0]; if (art) art.click(); const cb = q("input[data-b]")[0]; if (cb) cb.click(); return click(zc); }
      const zg = q("[data-zc]")[0]; if (zg) { const i = q(".zahl input")[0]; if (i) i.value = "40"; return click(zg); }
      const svgPart = q(".zeig-q").length && document.querySelector(".interactive [data-part]");
      if (svgPart && !document.querySelector(".zfb .feedback")) { svgPart.dispatchEvent(new MouseEvent("click", { bubbles: true })); return true; }
      const show = q("[data-show]")[0]; if (show) return click(show);
      const fin = q("[data-fin]")[0]; if (fin) { const c = q(".checklist input")[0]; if (c) c.click(); return click(fin); }
      const check = q("[data-check]")[0];
      if (check) {
        // etwas eingeben/zuordnen
        const chip = q(".chips [data-chip]")[0]; const slot = q(".slot, .col")[0];
        if (chip && slot) { chip.click(); slot.click(); }
        const sel = q(".lu select")[0]; if (sel) { sel.selectedIndex = 1; }
        const inp = q(".zahl input")[0]; if (inp) inp.value = "10";
        const t = q(".tog")[0]; if (t) t.click();
        const o = q(".opt")[0]; if (o) o.click();
        return click(check);
      }
      if (opt.length && !document.querySelector(".ex .feedback.ok, .ex .feedback.bad") && !document.querySelector(".cfb .feedback")) return click(opt[0]);
      const weiter = q(".ex-next .btn")[0]; if (weiter) return click(weiter);
      return false;
    });
    if (!did) break;
    await page.waitForTimeout(40);
  }
}

(async () => {
  const browser = await chromium.launch();
  for (const width of [375, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 760 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error") problems.push(`[${width}] console: ${m.text()}`); });
    page.on("pageerror", (e) => problems.push(`[${width}] pageerror: ${e.message}`));
    page.on("dialog", (d) => d.accept());
    page.on("request", (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith("data:") && !r.url().startsWith("blob:")) external.push(r.url()); });
    await page.goto(BASE + "index.html#/");
    for (const r of ROUTES) {
      await page.goto(BASE + "index.html" + r);
      await page.waitForTimeout(120);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) problems.push(`[${width}] horizontales Scrollen auf ${r} (${overflow}px)`);
      const name = (r.replace(/[#/]+/g, "_").replace(/^_|_$/g, "") || "start") + "-" + width + ".png";
      if (width === 375 || !r.includes("/ueben/")) await page.screenshot({ path: path.join(SHOTS, name), fullPage: true });
    }
    // Quiz je Thema vollständig durchklicken
    for (const t of THEMEN) {
      await page.goto(BASE + "index.html#/thema/" + t + "/quiz");
      await page.waitForTimeout(80);
      await clickThrough(page);
      const ok = await page.evaluate(() => /Runde geschafft/.test(document.body.textContent));
      if (!ok) problems.push(`[${width}] Quiz ${t} nicht bis zum Ende durchgeklickt`);
    }
    // Alle Übungen durchklicken
    for (const t of Object.keys(UEB)) for (const u of UEB[t]) {
      if (/u1$/.test(u) && ["organellen", "vielzeller", "mikroskop"].includes(t)) continue; // Explorer
      await page.goto(BASE + "index.html#/thema/" + t + "/ueben/" + u);
      await page.waitForTimeout(60);
      await clickThrough(page);
      const ok = await page.evaluate(() => !!document.querySelector("#ex .feedback.ok, #ex .feedback.bad"));
      if (!ok) problems.push(`[${width}] Übung ${u} ohne Abschluss-Feedback`);
    }
    // Probe-Klassenarbeit durchklicken
    await page.goto(BASE + "index.html#/arbeit");
    await page.click("#start");
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      document.querySelectorAll(".task").forEach((t) => {
        const o = t.querySelector(".opt"); if (o) o.click();
        const chip = t.querySelector(".chips [data-chip]"); const slot = t.querySelector(".slot, .col"); if (chip && slot) { chip.click(); slot.click(); }
        const inp = t.querySelector(".zahl input"); if (inp) inp.value = "60";
        const ta = t.querySelector("textarea"); if (ta) ta.value = "Testantwort";
        const cb = t.querySelector("input[data-b]"); if (cb) cb.click();
      });
    });
    if (width === 375) await page.screenshot({ path: path.join(SHOTS, "arbeit-laufend-375.png"), fullPage: true });
    await page.click("#abgabe");
    await page.waitForTimeout(100);
    if (await page.$("#ergebnis")) { await page.evaluate(() => document.querySelectorAll(".muster input[type=checkbox]").forEach((c, i) => { if (i % 2 === 0) c.click(); })); await page.click("#ergebnis"); }
    await page.waitForTimeout(150);
    const res = await page.evaluate(() => (document.querySelector("#examres") || {}).textContent || "");
    if (!/Dein Ergebnis/.test(res)) problems.push(`[${width}] Probe-Klassenarbeit ohne Ergebnis`);
    if (/Note/.test(res)) problems.push(`[${width}] Ergebnis zeigt eine Note`);
    await page.screenshot({ path: path.join(SHOTS, "arbeit-ergebnis-" + width + ".png"), fullPage: true });

    // Fortschritt: Neuladen, Export → Reset → Import
    const before = await page.evaluate(() => localStorage.getItem("bio.v1"));
    await page.reload(); await page.waitForTimeout(100);
    const afterReload = await page.evaluate(() => localStorage.getItem("bio.v1"));
    if (!before || before !== afterReload) problems.push(`[${width}] Fortschritt nach Neuladen verändert`);
    const xpBefore = JSON.parse(before).xp;
    const exported = await page.evaluate(() => window.Store.export());
    await page.goto(BASE + "index.html#/einstellungen");
    await page.click("#reset"); await page.waitForTimeout(50);
    const xpReset = await page.evaluate(() => JSON.parse(localStorage.getItem("bio.v1")).xp);
    await page.fill("#imptext", exported); await page.click("#imp"); await page.waitForTimeout(50);
    const xpAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("bio.v1")).xp);
    if (!(xpReset === 0 && xpAfter === xpBefore && xpBefore > 0)) problems.push(`[${width}] Export/Reset/Import fehlerhaft (${xpBefore} → ${xpReset} → ${xpAfter})`);
    else console.log(`[${width}] Export → Reset → Import ok (XP ${xpBefore} → ${xpReset} → ${xpAfter})`);
    if (width === 375) await page.goto(BASE + "index.html#/"), await page.screenshot({ path: path.join(SHOTS, "start-mit-fortschritt-375.png"), fullPage: true });
    await ctx.close();
  }
  // Dunkelmodus
  const dctx = await browser.newContext({ viewport: { width: 375, height: 760 }, colorScheme: "dark" });
  const dp = await dctx.newPage();
  dp.on("pageerror", (e) => problems.push(`[dark] pageerror: ${e.message}`));
  for (const r of ["#/", "#/thema/organellen/lernen", "#/thema/mikroskop/ueben/t6-u2", "#/thema/vergleich/ueben/t3-u3", "#/thema/vielzeller/lernen"]) {
    await dp.goto(BASE + "index.html" + r); await dp.waitForTimeout(120);
    await dp.screenshot({ path: path.join(SHOTS, "dunkel" + r.replace(/[#/]+/g, "_").replace(/_$/, "") + ".png"), fullPage: true });
  }
  await dctx.close();
  // Druckansicht Spickzettel
  const pctx = await browser.newContext(); const pp = await pctx.newPage();
  await pp.goto(BASE + "index.html#/spick"); await pp.waitForTimeout(150);
  await pp.pdf({ path: path.join(SHOTS, "spickzettel.pdf"), format: "A4" });
  await pctx.close();
  await browser.close();

  if (external.length) problems.push("Externe Requests: " + [...new Set(external)].join(", "));
  console.log(`${ROUTES.length} Routen × 2 Breiten geprüft.`);
  if (problems.length) { console.log("PROBLEME:\n" + problems.join("\n")); process.exit(1); }
  console.log("✓ Keine Konsolenfehler, keine externen Requests, kein horizontales Scrollen. Quiz, Übungen und Probe-Klassenarbeit durchgeklickt.");
})();
