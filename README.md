# Zell-Labor – Bio Klasse 7 · Die Zelle

Interaktive Lern-Web-App zur Vorbereitung auf die Biologie-Klassenarbeit „Die Zelle“ (Gymnasium, Klasse 7).
Statische Seite: reines HTML/CSS/JavaScript, kein Framework, kein Build, keine externen Ressourcen, kein Tracking.
Geplante Adresse: `https://bio.rosenbaum.hamburg` (GitHub Pages).

Themen: 1 Kennzeichen des Lebendigen · 2 Zellen und Organisationsstufen · 3 Tier- und Pflanzenzelle im Vergleich ·
4 Zellorganellen · 5 Vom Einzeller zum Vielzeller · 6 Das Lichtmikroskop.

## Lokal nutzen

- Doppelklick auf `index.html` (läuft auch über `file://`; der Service Worker wird dann nicht registriert), oder
- im Ordner `python3 -m http.server 8000` und `localhost:8000` im Browser öffnen (dann auch als App installierbar).

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | App-Gerüst (Single Page, Hash-Routing) |
| `styles.css` | Design, Hell/Dunkel, Grafikfarben, Druck-CSS für den Spickzettel |
| `app.js` | Store, Router, Übungs-Engine (alle Übungstypen), Fortschritt, Fehlerkiste, Probe-Klassenarbeit |
| `graphics.js` | alle SVG-Grafiken als Funktionen, Beschriftungs-Engine |
| `data.js` | Merkwissen, Fragenpool, interaktive Übungen, Bauplan der Probe-Klassenarbeit (nur Daten) |
| `manifest.webmanifest`, `sw.js` | PWA (installierbar, offline per Cache-First) |
| `icons/` | `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` |
| `CNAME` | `bio.rosenbaum.hamburg` |
| `tests/check-data.mjs` | Datenprüfung (`node tests/check-data.mjs`) |
| `tests/e2e.cjs` | Browser-Test mit Playwright (optional) |
| `tests/make-icons.py` | erzeugt die PNG-Icons mit Pillow |
| `tests/screenshots/` | Screenshots (375 px, 1280 px, Dunkelmodus) und Spickzettel-PDF |

Routen: `#/` · `#/thema/<id>/lernen|ueben|quiz` · `#/thema/<id>/ueben/<übungs-id>` · `#/arbeit` · `#/fehler` · `#/fehler/ueben` · `#/training` · `#/spick` · `#/einstellungen`.
Theme-IDs: `kennzeichen`, `organisation`, `vergleich`, `organellen`, `vielzeller`, `mikroskop`.

## Fragen ergänzen (`data.js`)

Neue Fragen ans Array `fragen` anhängen. Pflicht: eindeutige `id` (`t<Thema>-<Nr>`), `thema` (1–6), `typ`, `stufe` (1 leicht, 2 mittel, 3 schwer), `erklaerung` (außer bei FREI).

```js
{ id:"t4-21", thema:4, typ:"MC", stufe:1, frage:"…", richtig:"…", falsch:["…","…","…"], erklaerung:"…" }   // genau 3 Ablenker
{ id:"t4-22", thema:4, typ:"MC+", stufe:2, frage:"…", richtig:["…","…"], falsch:["…"], erklaerung:"…" }
{ id:"t4-23", thema:4, typ:"RF", stufe:1, aussage:"…", loesung:false, korrektur:"…", erklaerung:"…" }   // korrektur nötig bei false
{ id:"t4-24", thema:4, typ:"LUECKE", stufe:1, text:"Der {Zellkern} steuert …", woerter:["Zellkern","Tüpfel"], erklaerung:"…" }
{ id:"t4-25", thema:4, typ:"ZAHL", stufe:2, frage:"…", loesung:40, einheit:"-fach", erklaerung:"…" }
{ id:"t4-26", thema:4, typ:"FREI", stufe:3, aufgabe:"…", punkte:["…","…","…"], muster:"(optional)" } // mind. 3 Punkte
```

Interaktive Übungen stehen im Array `uebungen` (Typen `ZU`, `SORT`, `RH`, `BESCHR`, `ZEIG`, `ZELLE`, `CHECK`, `TABELLE`, `ZAHLGEN`, `EXPLORER`).
Danach immer `node tests/check-data.mjs` ausführen und in `sw.js` die Cache-Version erhöhen.

> **Wichtig:** Bei jeder Änderung an App-Dateien die Konstante `VERSION` in `sw.js` erhöhen (z. B. `zell-labor-v2`), sonst sehen installierte Geräte die alte Version.

## Umfang

| Thema | Fragen im Pool | Interaktive Übungen |
|---|---|---|
| 1 Kennzeichen des Lebendigen | 18 (t1-01 … t1-18) | 2 (Lebendig-Check, Welches Kennzeichen?) |
| 2 Zellen und Organisationsstufen | 19 (t2-01 … t2-19) | 5 |
| 3 Tier- und Pflanzenzelle | 14 (t3-01 … t3-14) | 3 |
| 4 Zellorganellen | 20 (t4-01 … t4-20) | 6 (inkl. Zell-Explorer) |
| 5 Einzeller → Vielzeller | 15 (t5-01 … t5-15) | 5 (inkl. Stufen-Explorer) |
| 6 Lichtmikroskop | 18 (t6-01 … t6-18) | 6 (inkl. Mikroskop-Explorer) |
| **Gesamt** | **104** | **27** |

## Abnahme-Checkliste

- [x] 1. Alle sechs Themen haben Lernen, Üben, Quiz; alle interaktiven Übungen aus dem Auftrag existieren.
- [x] 2. Alle Fragen t1-01 … t6-18 übernommen (Anzahl je Thema siehe Tabelle oben; die Datenprüfung prüft jede ID).
- [x] 3. `node tests/check-data.mjs` läuft fehlerfrei (IDs eindeutig, Typen bekannt, MC genau 3 Ablenker ≠ Lösung, RF-falsch mit Korrektur, Erklärungen, FREI ≥ 3 Punkte, ZU/SORT/RH vollständig und eindeutig, jedes BESCHR-/ZEIG-Label hat `data-part` und Anker in der Grafik, Lücken-Lösungen in der Wortauswahl, Lebendig-Check widerspruchsfrei, Probe-Klassenarbeit verweist nur auf vorhandene IDs).
- [x] 4. `node --check` für alle JS-Dateien ohne Fehler.
- [x] 5. Playwright vorhanden: `tests/e2e.cjs` ruft alle 51 Routen bei 375 px und 1280 px auf – keine Konsolenfehler; Screenshots in `tests/screenshots/` selbst angesehen (Beschriftungslinien kreuzen sich nicht, keine abgeschnittenen Texte); je Thema ein Quiz, alle Übungen und die Probe-Klassenarbeit automatisch vollständig durchgeklickt.
- [x] 6. Keine externen Requests: `grep -rn "http" *.html *.js *.css` findet nichts; der Browser-Test protokolliert zusätzlich alle Requests (nur eigene Dateien).
- [x] 7. Fortschritt bleibt nach Neuladen erhalten; Export → Zurücksetzen → Import stellt ihn wieder her (automatisch getestet).
- [x] 8. 375 px: kein horizontales Scrollen auf allen Routen (automatisch gemessen); Zuordnen/Beschriften per Tippen–Tippen.
- [x] 9. Hell- und Dunkelmodus (System oder in den Einstellungen wählbar), sichtbarer Fokus, alle Bedienelemente sind Buttons bzw. per Tab/Enter/Leertaste erreichbar (auch SVG-Teile).
- [x] 10. Rechtschreibung durchgesehen; Fachbegriffe wie im Merkwissen.

## Entscheidungen

- **Lückentext-Typ** heißt intern `LUECKE` (ASCII statt „LÜCKE“).
- **Zusätzliche interne Typen** für die geforderten Spezialübungen: `CHECK` (Lebendig-Check), `TABELLE` (Tabelle ausfüllen), `ZAHLGEN` (Vergrößerungstrainer), `EXPLORER` (Zell-, Stufen-, Mikroskop-Explorer).
- **Wann gilt eine Aufgabe als richtig?** MC, MC+, RF, ZAHL, Lückentext: nur wenn vollständig richtig. FREI: ab 75 % abgehakter Punkte (Vorgabe). Mehrteilige Übungen (ZU, SORT, RH, BESCHR, ZEIG, ZELLE, Tabelle, Lebendig-Check, Trainer): ab 80 % richtiger Elemente. Das gilt für „gemeistert“, Fehlerkiste und Abzeichen.
- **Gemeistert (%)** zählt Fragen und bewertete Übungen; die drei Explorer sind reine Erklär-Ansichten und zählen nicht mit.
- **Fehlerkiste:** Eine falsche Antwort setzt den Zähler auf 0; zwei richtige in Folge (egal ob im Quiz, Üben oder in der Fehlerkiste) nehmen die Aufgabe heraus. +5 XP pro richtiger Antwort im Fehlerkisten-Modus, sonst +10 XP.
- **Probe-Klassenarbeit:** Ergebnisse fließen in den Fortschritt ein (falsche Teile → Fehlerkiste), es gibt dafür aber nur die +50 XP für die ganze Arbeit, keine XP pro Aufgabe. FREI-Aufgaben werden nach der Abgabe selbst bewertet, erst dann erscheinen die Punkte. Nach Ablauf der 45 Minuten gibt es nur einen freundlichen Hinweis, keine Zeitstrafe. Teil 3 nutzt die Vergleichs-Sortierübung ohne die (leere) Spalte „nur Tierzelle“ – also „beide / nur Pflanzenzelle“ wie gefordert. Die Rechenaufgabe in Teil 6 kommt aus dem Pool (t6-02 oder t6-03). Die Arbeit bleibt erhalten, wenn man zwischendurch eine andere Seite öffnet (nur nicht beim Neuladen).
- **Lebendig-Check:** Neben ✓/✗ gibt es „~ nur scheinbar“ für Fälle, die der Auftrag so beschreibt (Kerze „wird größer“, „verbraucht Wachs und Sauerstoff“, „flackert“; Eiszapfen wird „nur durch Anlagern von Wasser größer“; Auto „verbraucht Treibstoff“). Beim Auto ist Bewegung ✓ (wie beim Roboter).
- **Fehlende Erklärungen im Auftrag** (z. B. t1-14, t2-01 … t2-06) wurden ausschließlich aus dem Merkwissen desselben Themas formuliert.
- **ZEIG Zellorganellen:** abwechselnd Pflanzen- und Tierzelle; der Button „Gibt es hier nicht“ ist in allen Runden sichtbar (sonst würde er die Lösung verraten).
- **Teil ↔ Aufgabe (Mikroskop):** 6 zufällige der 11 Paare pro Runde; in der Probe-Klassenarbeit wird „Organell ↔ Aufgabe“ mit allen 10 Paaren gestellt.
- **Beschriften auf dem Handy:** Die Nummern stehen in der Grafik und zusätzlich als große Tippfelder darunter (44-px-Ziele); man kann wahlweise die Nummer in der Grafik oder das Feld antippen.
- **Darstellung** (Automatisch/Hell/Dunkel) ist in den Einstellungen wählbar und wird im selben Speicherschlüssel `bio.v1` abgelegt.
- **Store-Schnittstelle** für einen späteren Sync-Server: `Store.load()`, `Store.save(state)`, `Store.export()`, `Store.import(json)` (global als `window.Store`). Gespeichert werden nur Ergebnisse je Aufgaben-ID (`r` richtig, `f` falsch, `last`, `serie`), XP, Tages-Serie, Fehlerkiste und Darstellung – keine Namen, keine Texte aus Freitextfeldern.
- **Git/GitHub:** In dieser Umgebung gibt es keine angemeldete GitHub-CLI. Das Repo wurde nur lokal angelegt (Branch `main`); die Veröffentlichung erfolgt nach den Schritten unten.

## Veröffentlichung (für den Domain-Inhaber)

1. Auf GitHub ein öffentliches Repository `bio` anlegen und diesen Ordner pushen:
   `git remote add origin git@github.com:<github-benutzername>/bio.git && git push -u origin main`
   Dann **Settings → Pages → Source: Deploy from a branch → Branch `main`, Ordner `/`** → Save.
2. Bei **IONOS** (DNS für `rosenbaum.hamburg`): CNAME-Eintrag **`bio` → `<github-benutzername>.github.io`** anlegen.
3. In GitHub Pages die Custom Domain **`bio.rosenbaum.hamburg`** prüfen (kommt aus der Datei `CNAME`) und **„Enforce HTTPS“** aktivieren, sobald verfügbar (kann nach der DNS-Änderung einige Minuten bis Stunden dauern).
4. Optional: Kachel „Zell-Labor – Bio Klasse 7“ auf der Startseite „Zettelkasten“ (www.rosenbaum.hamburg) ergänzen.

## Tests ausführen

```bash
node tests/check-data.mjs                      # Datenprüfung
for f in *.js; do node --check "$f"; done      # Syntax
python3 -m http.server 8765 &                  # dann:
node tests/e2e.cjs http://localhost:8765/      # Browser-Test (braucht Playwright + Chromium)
```
