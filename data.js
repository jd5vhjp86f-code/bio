/* Zell-Labor – Lerninhalte und Fragenpool (nur Daten).
   Schema siehe README.md, Abschnitt „Fragen ergänzen“. */
(function (root) {
  "use strict";

  /* ---------- Themen und Merkwissen ---------- */
  const themen = [
    {
      id: "kennzeichen", nr: 1, titel: "Kennzeichen des Lebendigen", kurz: "Kennzeichen",
      farbe: "#7C3AED", lernGrafik: "kennzeichenRad",
      merk: [
        { titel: "Fünf Kennzeichen", html: "Lebewesen unterscheiden sich von unbelebten Dingen durch fünf Kennzeichen: <b>Wachstum, Stoffwechsel, Fortpflanzung und Entwicklung, Bewegung, Reizbarkeit.</b>" },
        { titel: "Alle fünf!", html: "<b>Nur wenn alle fünf zutreffen, ist es ein Lebewesen.</b> Fehlt auch nur eines, ist es keins." },
        { titel: "Merkhilfe W–S–F–B–R", html: "„<b>W</b>ilde <b>S</b>chweine <b>f</b>ressen <b>b</b>unte <b>R</b>üben.“" },
        { titel: "Wachstum", html: "Ein junger Pandabär wiegt bei der Geburt etwa 100 g, als Erwachsener über 100 kg. Auch Pflanzen wachsen; manche Bambusarten bis zu 10 cm am Tag." },
        { titel: "Stoffwechsel", html: "Lebewesen nehmen Stoffe auf, wandeln sie um und geben Stoffe ab. Eine Kuh frisst Gras, verdaut es und scheidet Unverdauliches als Kot aus. Pflanzen nehmen über die Wurzeln Wasser und über die Blätter Kohlenstoffdioxid auf, stellen daraus mit der Energie des Lichts Nährstoffe her und geben Sauerstoff ab." },
        { titel: "Bewegung", html: "Tiere und Pflanzen bewegen sich. Bei Pflanzen ist die Bewegung oft so langsam, dass man sie ohne Hilfsmittel kaum sieht. Schnell ist die Venusfliegenfalle: Berührt ein Insekt bestimmte Borsten, klappen die Blatthälften zu." },
        { titel: "Fortpflanzung und Entwicklung", html: "<b>Geschlechtlich:</b> z. B. Käfer paaren sich, aus der befruchteten Eizelle entwickelt sich ein neuer Käfer. Bei Blütenpflanzen findet die Befruchtung nach der Bestäubung in der Blüte statt.<br><b>Ungeschlechtlich:</b> Aus einem Teil des Lebewesens entsteht ein neues, z. B. aus einem Ableger eine neue Pflanze." },
        { titel: "Reizbarkeit", html: "Lebewesen reagieren auf Reize aus der Umwelt. Bienen erkennen Blüten an Farbe und Duft und fliegen auf sie zu. Buschwindröschen richten ihre Blüten nach dem Sonnenlicht aus." },
        { titel: "Roboter", html: "Roboter bewegen sich und reagieren über Sensoren auf Reize. Aber sie wachsen nicht, haben keinen Stoffwechsel und pflanzen sich nicht fort → <b>kein Lebewesen</b>." }
      ]
    },
    {
      id: "organisation", nr: 2, titel: "Zellen und Organisationsstufen", kurz: "Organisation",
      farbe: "#0F766E", lernGrafik: "leiterMensch",
      merk: [
        { titel: "Alles aus Zellen", html: "<b>Alle Lebewesen bestehen aus Zellen.</b> Zellen sind so klein, dass man sie meist nur mit dem Mikroskop sieht." },
        { titel: "Größen", html: "1 mm = 1000 µm (Mikrometer). Hautzelle etwa 25 µm (= 0,025 mm) → 40 Hautzellen liegen auf 1 mm nebeneinander. Rote Blutzelle etwa 8 µm, Mundschleimhautzelle etwa 70 µm, Eizelle etwa 100 µm (gerade noch mit bloßem Auge erkennbar). Manche Nervenzellen werden mit ihren Ausläufern bis zu 1 m lang." },
        { titel: "Bau passt zur Funktion", html: "Alle Tier- und Menschenzellen haben denselben <b>Grundbauplan</b>. Sie sehen aber unterschiedlich aus, weil sie auf verschiedene Aufgaben <b>spezialisiert</b> sind. <b>Der Bau passt zur Funktion.</b> Beim Menschen gibt es etwa 200 Zelltypen." },
        { titel: "Zelltypen Mensch/Tier", html: "<b>Nervenzellen</b> haben lange Ausläufer und leiten Informationen weiter. <b>Hautzellen</b> sind kompakt, grenzen den Körper nach außen ab und schützen ihn. <b>Muskelzellen</b> ziehen sich zusammen und ermöglichen Bewegung. <b>Knorpelzellen</b> bilden eine Grundsubstanz, die wie ein Kissen Stöße im Gelenk dämpft und für eine glatte Gleitfläche sorgt. <b>Knochenzellen</b> bilden das harte Knochenmaterial." },
        { titel: "Zelltypen Pflanze", html: "<b>Blattzelle mit Chloroplasten</b> → Fotosynthese. <b>Zelle des Blattabschlussgewebes</b> → schützt das Blatt vor schädlichen äußeren Einflüssen. <b>Zelle der Leitungsbahn</b> → transportiert den Traubenzucker aus den Blättern in andere Pflanzenteile, z. B. die Wurzel. <b>Drüsenzelle</b> → bildet Stoffe wie Duftstoffe, Harze oder Zucker und gibt sie ab." },
        { titel: "Organisationsstufen", html: "<ol><li><b>Zelle</b> – kleinste Einheit des Lebens</li><li><b>Gewebe</b> – viele gleich spezialisierte (differenzierte) Zellen bilden einen Verbund</li><li><b>Organ</b> – mehrere Gewebe, die zusammen eine bestimmte Aufgabe erfüllen und abgrenzbar sind</li><li><b>Organsystem</b> – mehrere Organe arbeiten zusammen</li><li><b>Organismus</b> – alle Organe und Organsysteme zusammen bilden das Lebewesen</li></ol>" },
        { titel: "Beispiel Herz", html: "Herzmuskelzellen → Herzmuskelgewebe → Herz (Organ aus mehreren Gewebetypen: Herzmuskelgewebe, Abschlussgewebe, Nervengewebe, Bindegewebe) → Herz-Kreislauf-System (Herz + Blutgefäße) → Mensch." },
        { titel: "Beispiel Verdauung", html: "Mund, Speiseröhre, Magen und Darm bilden das <b>Verdauungssystem</b>." },
        { titel: "Pflanzen", html: "<b>Wurzel, Sprossachse (Stängel) und Blatt sind Organe.</b> Ein Laubblatt besteht aus mehreren Geweben, die zusammen Fotosynthese betreiben." },
        { titel: "System", html: "Ein <b>System</b> ist eine abgegrenzte Einheit aus Teilen, die zusammenwirken und gemeinsam eine Funktion erfüllen. Ein Organismus überlebt nur, wenn alle Organe und Systeme zusammenspielen." }
      ]
    },
    {
      id: "vergleich", nr: 3, titel: "Tierzelle und Pflanzenzelle im Vergleich", kurz: "Tier- & Pflanzenzelle",
      farbe: "#D2643F", lernGrafik: "vergleich",
      merk: [
        { titel: "Gemeinsam", html: "<b>Beide haben:</b> Zellmembran, Zellplasma, Zellkern, Mitochondrien, Endoplasmatisches Reticulum (ER) mit Ribosomen." },
        { titel: "Nur Pflanzenzelle", html: "<b>Nur Pflanzenzellen haben zusätzlich:</b> Zellwand (mit Tüpfeln), eine große Vakuole (oder mehrere kleine) und Chloroplasten (in grünen Pflanzenteilen)." },
        { titel: "Nur Tierzelle?", html: "<b>Tierzellen haben nichts, was Pflanzenzellen fehlt.</b>" },
        { titel: "Form", html: "Pflanzenzellen sind durch die Zellwand meist eckig und regelmäßig. Tierzellen sind rundlich oder unregelmäßig, nur von der dünnen Zellmembran umgeben." },
        { titel: "Vakuole und Zellkern", html: "In ausgewachsenen Pflanzenzellen nimmt die Vakuole den größten Raum ein; der Zellkern liegt dann oft am Rand." },
        { titel: "Membran der Pflanzenzelle", html: "Auch Pflanzenzellen haben eine Zellmembran. Sie liegt der Zellwand innen an und ist so dünn, dass man im Lichtmikroskop nur die Zellwand sieht." },
        { titel: "Achtung, Falle!", html: "Nicht jede Pflanzenzelle ist grün. Zellen der Zwiebelhaut, der Wurzel oder von Blütenblättern haben keine Chloroplasten – sie sind trotzdem Pflanzenzellen (Zellwand, Vakuole). Rote Blütenblätter: Der rote Farbstoff ist in der Vakuole gelöst." },
        { titel: "So bestimmst du die Zellart", html: "Zellwand (eckige, deutliche, doppelte Umrandung) <b>oder</b> Chloroplasten <b>oder</b> große Vakuole → <b>Pflanzenzelle</b>.<br>Nur dünne Zellmembran, keine Zellwand, rundliche oder unregelmäßige Form → <b>Tierzelle</b>.<br>Ein Zellkern sagt nichts über die Zellart, denn beide haben einen." }
      ]
    },
    {
      id: "organellen", nr: 4, titel: "Zellorganellen: Bau und Aufgaben", kurz: "Zellorganellen",
      farbe: "#2E7D4F", lernGrafik: "zellExplorer",
      merk: [] // wird aus ORGANELLEN erzeugt (siehe unten)
    },
    {
      id: "vielzeller", nr: 5, titel: "Vom Einzeller zum Vielzeller", kurz: "Einzeller → Vielzeller",
      farbe: "#A16207", lernGrafik: "algen",
      merk: [
        { titel: "Einzeller", html: "Bei <b>Einzellern</b> erledigt eine einzige Zelle alle lebensnotwendigen Aufgaben." },
        { titel: "Vielzeller", html: "Die meisten Pflanzen und Tiere sind <b>Vielzeller</b> aus vielen verschieden spezialisierten Zellen. Vielzeller sind (laut Schulbuch vor etwa 600 Millionen Jahren) aus Einzellern hervorgegangen." },
        { titel: "Grünalgen als Modell", html: "Heute lebende <b>Grünalgen</b> zeigen, wie diese Entwicklung über Zwischenstufen abgelaufen sein könnte." },
        { titel: "1 Hüllengeißelalge (Chlamydomonas) – Einzeller", html: "Becherförmiger Chloroplast, <b>zwei Geißeln</b> zur Fortbewegung, <b>Augenfleck</b> zur Unterscheidung von hell und dunkel. Vermehrt sich ungeschlechtlich durch <b>Längsteilung</b>." },
        { titel: "2 Mosaikgrünalge (Gonium) – Kolonie", html: "<b>16 Zellen</b>, jede sieht aus wie eine Hüllengeißelalge. Sie liegen in einer <b>Gallerte</b> zusammen, Stoffaustausch zwischen ihnen ist möglich. Die Zellen sind <b>nicht differenziert</b> (alle gleich). Ungeschlechtliche Vermehrung durch Teilung. Vermutlich war die <b>Koloniebildung der erste Schritt</b> zur Entstehung von Vielzellern." },
        { titel: "3 Kugelalge (Volvox) – echter Vielzeller", html: "Viele Hundert bis Tausende Zellen bilden eine <b>Hohlkugel</b>; die Zellen sind durch <b>Plasmabrücken</b> verbunden. Die meisten Zellen tragen Geißeln, so bewegt sich die Kugel fort. Die Zellen <b>teilen sich die Arbeit</b> (Arbeitsteilung)." },
        { titel: "Volvox: Vermehrung", html: "<b>Ungeschlechtlich:</b> Einzelne Zellen teilen sich und geben Tochterzellen ins Innere der Kugel ab, die zu Tochterkugeln heranwachsen. Die Mutterkugel platzt, entlässt die Tochterkugeln und <b>stirbt</b>.<br><b>Geschlechtlich:</b> Ein größerer Zelltyp bildet Eizellen und Spermien. Aus einer befruchteten Eizelle entsteht eine neue Kugelalge." },
        { titel: "Kolonie vs. echter Vielzeller", html: "<table class=\"tbl\"><thead><tr><th>Zellkolonie (z. B. Gonium)</th><th>Echter Vielzeller (z. B. Volvox)</th></tr></thead><tbody><tr><td>alle Zellen gleich, nicht differenziert</td><td>Zellen spezialisiert, Arbeitsteilung</td></tr><tr><td>jede Zelle erfüllt alle Aufgaben</td><td>verschiedene Zellen übernehmen verschiedene Aufgaben (z. B. Bewegung, Fortpflanzung)</td></tr><tr><td>Zellen liegen in Gallerte zusammen</td><td>Zellen durch Plasmabrücken verbunden</td></tr><tr><td>eine einzelne Zelle könnte allein überleben</td><td>Zellen sind aufeinander angewiesen</td></tr></tbody></table>" },
        { titel: "„Erste natürliche Leiche“", html: "Bei Volvox stirbt die Mutterkugel, nachdem sie die Tochterkugeln entlassen hat – ein toter Körper bleibt zurück. Ein Einzeller dagegen teilt sich in zwei Tochterzellen; die alte Zelle lebt in ihnen weiter, es bleibt kein toter Körper zurück." }
      ]
    },
    {
      id: "mikroskop", nr: 6, titel: "Das Lichtmikroskop", kurz: "Lichtmikroskop",
      farbe: "#2563EB", lernGrafik: "mikroskop",
      merk: [
        { titel: "Zwei Linsen", html: "Ein Lichtmikroskop <b>kombiniert zwei Linsen</b> (Okular und Objektiv) und vergrößert viel stärker als eine Lupe." },
        { titel: "Durchlicht", html: "Das Objekt wird <b>von Licht durchstrahlt</b>. Es muss deshalb <b>sehr dünn oder durchsichtig</b> sein und liegt auf einem <b>Objektträger</b> aus Glas, abgedeckt mit einem <b>Deckglas</b>." },
        { titel: "Vergrößerung", html: "<b>Gesamtvergrößerung = Vergrößerung des Okulars × Vergrößerung des Objektivs.</b><br>Beispiel: 10 × 40 = 400-fach." },
        { titel: "Teile und Aufgaben", html: "" }, // wird aus MIKROSKOP erzeugt
        { titel: "Arbeitsschritte", html: "" }, // wird aus SCHRITTE erzeugt
        { titel: "Warum mit dem kleinsten Objektiv beginnen?", html: "Man hat den größten Überblick, findet das Objekt leichter, und der Abstand zum Objektträger ist groß – so geht nichts kaputt." }
      ]
    }
  ];

  /* ---------- Zellbestandteile (Thema 3/4) ---------- */
  const ORGANELLEN = {
    zellmembran: { name: "Zellmembran", aufgabe: "Dünne Haut, umhüllt die Zelle, grenzt sie nach außen ab, regelt den Stoffaustausch (wasser- und gasdurchlässig, transportiert bestimmte Stoffe aktiv hinein oder hinaus).", wo: "beide", merkhilfe: "Grenzkontrolle", sichtbar: "bei Tierzellen als Rand; bei Pflanzenzellen kaum" },
    zellplasma: { name: "Zellplasma", aufgabe: "Zähflüssige, durchsichtige Flüssigkeit, füllt die Zelle aus; alle Organellen liegen darin; hier laufen wichtige Stoffwechselvorgänge ab.", wo: "beide", merkhilfe: "Füllung", sichtbar: "ja" },
    zellkern: { name: "Zellkern", aufgabe: "Kugelförmig; enthält das genetische Material (Erbinformation) und steuert alle Vorgänge in der Zelle.", wo: "beide", merkhilfe: "Steuerzentrale", sichtbar: "ja" },
    mitochondrium: { name: "Mitochondrium", plural: "Mitochondrien", aufgabe: "Zellatmung: Traubenzucker wird abgebaut, dabei wird Energie für alle Lebensvorgänge bereitgestellt.", wo: "beide", merkhilfe: "„Kraftwerke der Zelle“", fach: true, sichtbar: "nein, zu klein" },
    er: { name: "Endoplasmatisches Reticulum", plural: "Endoplasmatisches Reticulum (ER)", aufgabe: "Röhren und flache Hohlräume; Transportsystem der Zelle.", wo: "beide", merkhilfe: "Straßennetz", sichtbar: "nein" },
    ribosomen: { name: "Ribosomen", aufgabe: "Winzige Körnchen, viele sitzen am ER; bilden alle benötigten Eiweiße.", wo: "beide", merkhilfe: "„Eiweißfabriken“", fach: true, sichtbar: "nein" },
    zellwand: { name: "Zellwand", aufgabe: "Aus dicken, langen Fasern; gibt Form, Festigkeit und Schutz; verbindet benachbarte Zellen.", wo: "nur Pflanze", merkhilfe: "Schutzmauer", sichtbar: "ja" },
    tuepfel: { name: "Tüpfel", aufgabe: "Kleine Öffnungen in der Zellwand; Nachbarzellen tauschen hier Stoffe aus.", wo: "nur Pflanze", merkhilfe: "Türen in der Mauer", sichtbar: "(Stellen in der Wand)" },
    vakuole: { name: "Vakuole", aufgabe: "Großer Speicher für Wasser und darin gelöste Stoffe (Salze, Farbstoffe, Geschmacksstoffe); eigene Membran; je stärker gefüllt, desto stabiler die Zelle.", wo: "nur Pflanze (groß)", merkhilfe: "Wassertank", sichtbar: "ja" },
    chloroplast: { name: "Chloroplast", plural: "Chloroplasten", aufgabe: "Enthalten grünes Chlorophyll; Fotosynthese: Mithilfe von Sonnenlicht wird Traubenzucker hergestellt.", wo: "nur Pflanze (grüne Teile)", merkhilfe: "Zuckerfabrik / Solaranlage", sichtbar: "ja" }
  };
  const PFLANZEN_TEILE = ["zellwand", "tuepfel", "zellmembran", "zellplasma", "zellkern", "vakuole", "chloroplast", "mitochondrium", "er", "ribosomen"];
  const TIER_TEILE = ["zellmembran", "zellplasma", "zellkern", "mitochondrium", "er", "ribosomen"];

  /* ---------- Mikroskop (Thema 6) ---------- */
  const MIKROSKOP = {
    okular: { name: "Okular", aufgabe: "Linse, durch die man schaut; vergrößert wie eine Lupe." },
    tubus: { name: "Tubus", aufgabe: "Hält das Okular." },
    objektivrevolver: { name: "Objektivrevolver", aufgabe: "Drehbar; trägt Objektive mit unterschiedlicher Vergrößerung." },
    objektiv: { name: "Objektiv", aufgabe: "Enthält eine Vergrößerungslinse." },
    objekttisch: { name: "Objekttisch", aufgabe: "Hat eine Öffnung; hier wird das Präparat (Objektträger mit Deckglas) aufgelegt." },
    kondensorblende: { name: "Kondensorblende", aufgabe: "Verändert den Kontrast." },
    beleuchtung: { name: "Beleuchtung", aufgabe: "Lampe oder beweglicher Spiegel; durchleuchtet das Objekt." },
    beleuchtungsregler: { name: "Beleuchtungsregler", aufgabe: "Stellt die Helligkeit der Lampe ein." },
    grobtrieb: { name: "Grobtrieb", aufgabe: "Großes Triebrad; bewegt den Objekttisch grob auf und ab." },
    feintrieb: { name: "Feintrieb", aufgabe: "Kleines Triebrad; bewegt den Objekttisch fein auf und ab zum Scharfstellen." },
    stativ: { name: "Stativ", aufgabe: "Verbindet alle Teile und gibt festen Halt; hier fasst man das Mikroskop zum Tragen an." }
  };
  const MIKROSKOP_TEILE = Object.keys(MIKROSKOP);
  const SCHRITTE = [
    "Mikroskop immer am Stativ anfassen und vorsichtig tragen.",
    "Strom anschließen, Licht einschalten, Objekttisch ganz nach unten drehen und das kleinste Objektiv einstellen.",
    "Objekt präparieren, Objektträger unten abtrocknen und in den Lichtstrahl auf den Objekttisch legen.",
    "Tisch langsam nach oben fahren und dabei von der Seite kontrollieren, dass das Objektiv nicht berührt wird; kurz davor stoppen.",
    "Durch das Okular schauen und mit dem Feintrieb scharf stellen.",
    "Helligkeit und Kontrast optimieren.",
    "Durch Verschieben des Objektträgers eine gute Stelle suchen.",
    "Beim Objektivwechsel von der Seite kontrollieren."
  ];

  /* Merkkarten für Thema 4 und 6 aus den Tabellen erzeugen */
  themen[3].merk = PFLANZEN_TEILE.map(function (k) {
    const o = ORGANELLEN[k];
    return {
      titel: o.plural || o.name,
      html: o.aufgabe + "<br><span class=\"meta\"><b>Wo?</b> " + o.wo + " · <b>Im Schul-Lichtmikroskop sichtbar?</b> " + o.sichtbar + "</span><br><span class=\"merkhilfe\">" + (o.fach ? "Fachbezeichnung: " : "Merkhilfe: ") + o.merkhilfe + "</span>"
    };
  });
  themen[5].merk[3].html = "<table class=\"tbl\"><thead><tr><th>Teil</th><th>Aufgabe</th></tr></thead><tbody>" +
    MIKROSKOP_TEILE.map(function (k) { return "<tr><td><b>" + MIKROSKOP[k].name + "</b></td><td>" + MIKROSKOP[k].aufgabe + "</td></tr>"; }).join("") + "</tbody></table>";
  themen[5].merk[4].html = "<ol>" + SCHRITTE.map(function (s) { return "<li>" + s.replace("kleinste", "<b>kleinste</b>").replace("von der Seite kontrollieren", "<b>von der Seite kontrollieren</b>") + "</li>"; }).join("") + "</ol>";

  /* ---------- Kennzeichen (Thema 1, Lern-Grafik) ---------- */
  const KENNZEICHEN = {
    wachstum: { name: "Wachstum", buchstabe: "W", text: themen[0].merk[3].html },
    stoffwechsel: { name: "Stoffwechsel", buchstabe: "S", text: themen[0].merk[4].html },
    fortpflanzung: { name: "Fortpflanzung und Entwicklung", buchstabe: "F", text: themen[0].merk[6].html },
    bewegung: { name: "Bewegung", buchstabe: "B", text: themen[0].merk[5].html },
    reizbarkeit: { name: "Reizbarkeit", buchstabe: "R", text: themen[0].merk[7].html }
  };

  /* ---------- Organisationsstufen (Thema 2, Lern-Grafik) ---------- */
  const STUFEN = [
    { id: "zelle", name: "Zelle", text: "Kleinste Einheit des Lebens.", bsp: "Herzmuskelzelle", grafik: "herzZelle" },
    { id: "gewebe", name: "Gewebe", text: "Viele gleich spezialisierte (differenzierte) Zellen bilden einen Verbund.", bsp: "Herzmuskelgewebe", grafik: "herzGewebe" },
    { id: "organ", name: "Organ", text: "Mehrere Gewebe, die zusammen eine bestimmte Aufgabe erfüllen und abgrenzbar sind.", bsp: "Herz (aus Herzmuskelgewebe, Abschlussgewebe, Nervengewebe, Bindegewebe)", grafik: "herz" },
    { id: "organsystem", name: "Organsystem", text: "Mehrere Organe arbeiten zusammen.", bsp: "Herz-Kreislauf-System (Herz + Blutgefäße)", grafik: "herzKreislauf" },
    { id: "organismus", name: "Organismus", text: "Alle Organe und Organsysteme zusammen bilden das Lebewesen.", bsp: "Mensch", grafik: "mensch" }
  ];

  /* ---------- Grünalgen (Thema 5) ---------- */
  const ALGEN = [
    { id: "chlamydomonas", name: "Hüllengeißelalge (Chlamydomonas)", stufe: "Einzeller", grafik: "chlamydomonas",
      merkmale: ["eine einzige Zelle", "becherförmiger Chloroplast", "zwei Geißeln zur Fortbewegung", "Augenfleck zur Unterscheidung von hell und dunkel", "vermehrt sich ungeschlechtlich durch Längsteilung"] },
    { id: "gonium", name: "Mosaikgrünalge (Gonium)", stufe: "Kolonie", grafik: "gonium",
      merkmale: ["16 Zellen, jede sieht aus wie eine Hüllengeißelalge", "Zellen liegen in einer Gallerte zusammen", "Stoffaustausch zwischen den Zellen möglich", "Zellen nicht differenziert (alle gleich)", "ungeschlechtliche Vermehrung durch Teilung", "Koloniebildung vermutlich erster Schritt zum Vielzeller"] },
    { id: "volvox", name: "Kugelalge (Volvox)", stufe: "echter Vielzeller", grafik: "volvox",
      merkmale: ["viele Hundert bis Tausende Zellen bilden eine Hohlkugel", "Zellen durch Plasmabrücken verbunden", "die meisten Zellen tragen Geißeln – so bewegt sich die Kugel fort", "Arbeitsteilung zwischen den Zellen", "Tochterkugeln wachsen im Inneren heran; die Mutterkugel platzt und stirbt"] }
  ];

  /* ---------- Fragenpool ---------- */
  const fragen = [
    /* ===== Thema 1 ===== */
    { id: "t1-01", thema: 1, typ: "MC", stufe: 1, frage: "Wie viele Kennzeichen des Lebendigen gibt es?", richtig: "5", falsch: ["3", "4", "6"], erklaerung: "Wachstum, Stoffwechsel, Fortpflanzung und Entwicklung, Bewegung, Reizbarkeit." },
    { id: "t1-02", thema: 1, typ: "MC", stufe: 1, frage: "Eine Kuh frisst Gras, verdaut es und scheidet Unverdauliches als Kot aus. Welches Kennzeichen zeigt das?", richtig: "Stoffwechsel", falsch: ["Wachstum", "Reizbarkeit", "Fortpflanzung"], erklaerung: "Stoffe werden aufgenommen, umgewandelt und abgegeben." },
    { id: "t1-03", thema: 1, typ: "MC", stufe: 1, frage: "Bienen fliegen gezielt auf Blüten zu, weil sie deren Farbe und Duft erkennen. Welches Kennzeichen steht im Vordergrund?", richtig: "Reizbarkeit", falsch: ["Stoffwechsel", "Wachstum", "Fortpflanzung"], erklaerung: "Farbe und Duft sind Reize, auf die die Biene reagiert." },
    { id: "t1-04", thema: 1, typ: "MC", stufe: 1, frage: "Ein Pandabär wiegt bei der Geburt etwa 100 g, später über 100 kg. Welches Kennzeichen?", richtig: "Wachstum", falsch: ["Bewegung", "Reizbarkeit", "Entwicklung von Blüten"], erklaerung: "Er wird größer und schwerer, weil er Nahrung aufnimmt." },
    { id: "t1-05", thema: 1, typ: "MC", stufe: 2, frage: "Was nehmen Pflanzen für ihren Stoffwechsel auf?", richtig: "Wasser über die Wurzeln und Kohlenstoffdioxid über die Blätter", falsch: ["Sauerstoff über die Wurzeln und Zucker über die Blätter", "Nur Erde über die Wurzeln", "Nur Wasser über die Blätter"], erklaerung: "Mit der Energie des Lichts stellen sie daraus Nährstoffe her und geben Sauerstoff ab." },
    { id: "t1-06", thema: 1, typ: "MC", stufe: 1, frage: "Welche Aussage über Bewegung bei Pflanzen stimmt?", richtig: "Pflanzen bewegen sich, oft aber so langsam, dass man es kaum sieht", falsch: ["Pflanzen bewegen sich nie", "Nur fleischfressende Pflanzen bewegen sich", "Pflanzen bewegen sich nur, wenn Wind weht"], erklaerung: "Beispiel: Blüten richten sich nach der Sonne aus." },
    { id: "t1-07", thema: 1, typ: "MC", stufe: 2, frage: "Aus einem abgeschnittenen Trieb wächst eine neue Pflanze. Das ist …", richtig: "ungeschlechtliche Fortpflanzung", falsch: ["geschlechtliche Fortpflanzung", "Stoffwechsel", "Reizbarkeit"], erklaerung: "Aus einem Teil des Organismus entsteht ein neues Lebewesen." },
    { id: "t1-08", thema: 1, typ: "MC", stufe: 2, frage: "Wo findet bei Blütenpflanzen die Befruchtung statt?", richtig: "In der Blüte, nach der Bestäubung", falsch: ["In der Wurzel", "Im Blatt durch Sonnenlicht", "Im Boden, ganz ohne Blüte"], erklaerung: "Auch Pflanzen pflanzen sich geschlechtlich fort." },
    { id: "t1-09", thema: 1, typ: "MC+", stufe: 1, frage: "Welche gehören zu den Kennzeichen der Lebewesen? Wähle alle richtigen.", richtig: ["Wachstum", "Stoffwechsel", "Fortpflanzung und Entwicklung", "Bewegung", "Reizbarkeit"], falsch: ["Sprechen", "Atmen mit einer Lunge", "Denken"], erklaerung: "Viele Lebewesen haben keine Lunge und sprechen nicht." },
    { id: "t1-10", thema: 1, typ: "RF", stufe: 1, aussage: "Ein Roboter, der laufen kann und auf Stimmen reagiert, ist ein Lebewesen.", loesung: false, korrektur: "Ein Roboter ist kein Lebewesen, weil er nicht wächst, keinen Stoffwechsel hat und sich nicht fortpflanzt.", erklaerung: "Es müssen alle fünf Kennzeichen erfüllt sein." },
    { id: "t1-11", thema: 1, typ: "RF", stufe: 1, aussage: "Wenn drei der fünf Kennzeichen zutreffen, handelt es sich um ein Lebewesen.", loesung: false, korrektur: "Nur wenn alle fünf Kennzeichen zutreffen, handelt es sich um ein Lebewesen.", erklaerung: "Fehlt auch nur ein Kennzeichen, ist es kein Lebewesen." },
    { id: "t1-12", thema: 1, typ: "RF", stufe: 1, aussage: "Auch Pflanzen reagieren auf Reize, zum Beispiel auf Licht.", loesung: true, erklaerung: "Buschwindröschen richten ihre Blüten nach dem Sonnenlicht aus." },
    { id: "t1-13", thema: 1, typ: "RF", stufe: 2, aussage: "Eine Kerzenflamme ist ein Lebewesen, weil sie größer wird und Sauerstoff verbraucht.", loesung: false, korrektur: "Eine Kerzenflamme ist kein Lebewesen: Sie reagiert nicht gezielt auf Reize, pflanzt sich nicht fort und entwickelt sich nicht.", erklaerung: "Nur wenn alle fünf Kennzeichen zutreffen, ist es ein Lebewesen." },
    { id: "t1-14", thema: 1, typ: "RF", stufe: 1, aussage: "Alle Lebewesen haben einen Stoffwechsel.", loesung: true, erklaerung: "Stoffwechsel ist eines der fünf Kennzeichen – Lebewesen nehmen Stoffe auf, wandeln sie um und geben Stoffe ab." },
    { id: "t1-15", thema: 1, typ: "LUECKE", stufe: 1, text: "Lebewesen erkennt man an fünf Kennzeichen: {Wachstum}, {Stoffwechsel}, {Fortpflanzung} und Entwicklung, {Bewegung} und {Reizbarkeit}. Fehlt nur {eines}, handelt es sich nicht um ein Lebewesen.", woerter: ["Wachstum", "Stoffwechsel", "Fortpflanzung", "Bewegung", "Reizbarkeit", "eines", "Sprache", "Atmung", "zwei", "Farbe"], erklaerung: "Nur wenn alle fünf Kennzeichen zutreffen, ist es ein Lebewesen." },
    { id: "t1-16", thema: 1, typ: "FREI", stufe: 3, aufgabe: "Erläutere am Beispiel der Venusfliegenfalle alle fünf Kennzeichen der Lebewesen.", punkte: [
      "Wachstum: Sie wächst aus einem Samen zu einer großen Pflanze heran.",
      "Stoffwechsel: Sie stellt mit Licht, Wasser und Kohlenstoffdioxid Nährstoffe her und verdaut gefangene Insekten mit Verdauungssäften.",
      "Bewegung: Die beiden Blatthälften klappen schnell zu.",
      "Reizbarkeit: Sie reagiert, wenn ein Insekt die Borsten auf dem Blatt berührt.",
      "Fortpflanzung und Entwicklung: Sie bildet Blüten und Samen, aus denen sich neue Pflanzen entwickeln."] },
    { id: "t1-17", thema: 1, typ: "FREI", stufe: 2, aufgabe: "Nenne die Beobachtungen, die nötig sind, um eine Muschel sicher den Lebewesen zuzuordnen.", punkte: [
      "Sie wird mit der Zeit größer (Wachstum).",
      "Sie nimmt Nahrung auf und scheidet Stoffe aus (Stoffwechsel).",
      "Sie öffnet und schließt ihre Schalen oder bewegt sich fort (Bewegung).",
      "Sie schließt bei Berührung die Schalen (Reizbarkeit).",
      "Sie pflanzt sich fort und die Nachkommen entwickeln sich (Fortpflanzung und Entwicklung)."] },
    { id: "t1-18", thema: 1, typ: "FREI", stufe: 2, aufgabe: "Erkläre, warum ein Roboter kein Lebewesen ist, obwohl er sich bewegt und auf Reize reagiert.", punkte: [
      "Bewegung und Reaktion auf Reize (über Sensoren) sind vorhanden.",
      "Er wächst nicht.",
      "Er hat keinen Stoffwechsel (er nimmt keine Nahrung auf und wandelt sie nicht in eigene Körperstoffe um).",
      "Er pflanzt sich nicht fort und entwickelt sich nicht.",
      "Ein Lebewesen muss alle fünf Kennzeichen erfüllen."] },

    /* ===== Thema 2 ===== */
    { id: "t2-01", thema: 2, typ: "MC", stufe: 1, frage: "Viele gleich spezialisierte Zellen bilden zusammen ein …", richtig: "Gewebe", falsch: ["Organ", "Organsystem", "Organismus"], erklaerung: "Gewebe: Viele gleich spezialisierte (differenzierte) Zellen bilden einen Verbund." },
    { id: "t2-02", thema: 2, typ: "MC", stufe: 1, frage: "Mehrere Gewebe, die gemeinsam eine bestimmte Aufgabe erfüllen und abgrenzbar sind, nennt man …", richtig: "Organ", falsch: ["Zelle", "Gewebe", "Organismus"], erklaerung: "Ein Organ besteht aus mehreren Geweben, z. B. das Herz." },
    { id: "t2-03", thema: 2, typ: "MC", stufe: 1, frage: "Herz und Blutgefäße bilden zusammen …", richtig: "das Herz-Kreislauf-System, ein Organsystem", falsch: ["ein Gewebe", "eine Zelle", "einen Organismus"], erklaerung: "Mehrere Organe, die zusammenarbeiten, bilden ein Organsystem." },
    { id: "t2-04", thema: 2, typ: "MC", stufe: 1, frage: "Mund, Speiseröhre, Magen und Darm bilden zusammen …", richtig: "das Verdauungssystem", falsch: ["das Herz-Kreislauf-System", "ein Gewebe", "ein einziges Organ"], erklaerung: "Diese Organe arbeiten zusammen und bilden ein Organsystem: das Verdauungssystem." },
    { id: "t2-05", thema: 2, typ: "MC", stufe: 1, frage: "Welche Reihenfolge stimmt (von klein nach groß)?", richtig: "Zelle – Gewebe – Organ – Organsystem – Organismus", falsch: ["Zelle – Organ – Gewebe – Organismus – Organsystem", "Gewebe – Zelle – Organ – Organsystem – Organismus", "Organ – Zelle – Gewebe – Organsystem – Organismus"], erklaerung: "Die Zelle ist die kleinste Einheit des Lebens, der Organismus ist das ganze Lebewesen." },
    { id: "t2-06", thema: 2, typ: "MC", stufe: 1, frage: "Welche sind Organe einer Pflanze?", richtig: "Wurzel, Sprossachse und Blatt", falsch: ["Zellwand, Vakuole und Chloroplast", "Blattzelle, Zellkern und Zellplasma", "Erde, Wasser und Licht"], erklaerung: "Wurzel, Sprossachse (Stängel) und Blatt sind Organe. Zellwand, Vakuole und Chloroplast sind Teile einer Zelle." },
    { id: "t2-07", thema: 2, typ: "MC", stufe: 2, frage: "Warum hat eine Nervenzelle lange Ausläufer?", richtig: "Damit sie Informationen über weite Strecken weiterleiten kann", falsch: ["Damit sie Fotosynthese betreiben kann", "Damit sie Wasser speichern kann", "Damit sie den Körper vor Kälte schützt"], erklaerung: "Der Bau passt zur Funktion." },
    { id: "t2-08", thema: 2, typ: "MC", stufe: 2, frage: "Wie viele Zelltypen gibt es beim Menschen ungefähr?", richtig: "etwa 200", falsch: ["etwa 5", "etwa 20", "etwa 2 Millionen"], erklaerung: "Beim Menschen gibt es etwa 200 Zelltypen – alle mit demselben Grundbauplan, aber auf verschiedene Aufgaben spezialisiert." },
    { id: "t2-09", thema: 2, typ: "MC", stufe: 2, frage: "Ein Mikrometer (µm) ist …", richtig: "ein Tausendstel Millimeter", falsch: ["ein Zehntel Millimeter", "ein Hundertstel Meter", "tausend Millimeter"], erklaerung: "1 mm = 1000 µm." },
    { id: "t2-10", thema: 2, typ: "ZAHL", stufe: 2, frage: "Eine Hautzelle ist etwa 25 µm breit. Wie viele Hautzellen liegen auf 1 mm nebeneinander?", loesung: 40, einheit: "Hautzellen", erklaerung: "1 mm = 1000 µm; 1000 : 25 = 40." },
    { id: "t2-11", thema: 2, typ: "RF", stufe: 1, aussage: "Alle Zellen eines Menschen sehen gleich aus und haben dieselbe Aufgabe.", loesung: false, korrektur: "Die Zellen haben denselben Grundbauplan, sind aber auf verschiedene Aufgaben spezialisiert und sehen deshalb unterschiedlich aus.", erklaerung: "Der Bau passt zur Funktion." },
    { id: "t2-12", thema: 2, typ: "RF", stufe: 2, aussage: "Das Herz besteht aus mehreren Gewebetypen, z. B. Muskelgewebe, Nervengewebe und Bindegewebe.", loesung: true, erklaerung: "Das Herz ist ein Organ aus Herzmuskelgewebe, Abschlussgewebe, Nervengewebe und Bindegewebe." },
    { id: "t2-13", thema: 2, typ: "RF", stufe: 1, aussage: "Eine Mundschleimhautzelle kann man nicht mit bloßem Auge sehen.", loesung: true, erklaerung: "Sie ist nur etwa 70 µm groß." },
    { id: "t2-14", thema: 2, typ: "RF", stufe: 2, aussage: "Manche menschlichen Nervenzellen können bis zu 1 m lang werden.", loesung: true, erklaerung: "Manche Nervenzellen werden mit ihren Ausläufern bis zu 1 m lang." },
    { id: "t2-15", thema: 2, typ: "RF", stufe: 2, aussage: "Ein Organismus kann nur überleben, wenn alle Organe und Organsysteme zusammenarbeiten.", loesung: true, erklaerung: "Ein Organismus überlebt nur, wenn alle Organe und Systeme zusammenspielen." },
    { id: "t2-16", thema: 2, typ: "LUECKE", stufe: 1, text: "Gleich spezialisierte Zellen bilden ein {Gewebe}. Mehrere Gewebe bilden zusammen ein {Organ}. Mehrere Organe bilden ein {Organsystem}. Alle Organe zusammen bilden einen {Organismus}.", woerter: ["Gewebe", "Organ", "Organsystem", "Organismus", "Zellkern", "Chloroplast"], erklaerung: "Zelle → Gewebe → Organ → Organsystem → Organismus." },
    { id: "t2-17", thema: 2, typ: "FREI", stufe: 3, aufgabe: "Erkläre, warum verschiedene Tierzellen trotz desselben Grundbauplans so unterschiedlich aussehen. Stelle einen Bezug zu Struktur und Funktion her.", punkte: [
      "Alle Tierzellen haben denselben Grundbauplan (Zellmembran, Zellplasma, Zellkern, Mitochondrien).",
      "Die Zellen sind auf unterschiedliche Aufgaben spezialisiert.",
      "Ihr Bau (Struktur) passt jeweils zu ihrer Aufgabe (Funktion).",
      "Beispiel: Nervenzellen haben lange Ausläufer, um Informationen weiterzuleiten.",
      "Zweites Beispiel: Hautzellen sind kompakt und schützen; oder Muskelzellen sind lang gestreckt und ziehen sich zusammen."] },
    { id: "t2-18", thema: 2, typ: "FREI", stufe: 2, aufgabe: "Nenne zwei weitere Organsysteme des Menschen und ihre Organe.",
      muster: "Atmungssystem – Nase, Luftröhre, Lunge; Nervensystem – Gehirn, Rückenmark, Nerven; Bewegungssystem – Knochen, Gelenke, Muskeln; Harnsystem – Nieren, Harnleiter, Harnblase.",
      punkte: ["Erstes Organsystem richtig benannt", "Passende Organe dazu genannt", "Zweites Organsystem richtig benannt", "Passende Organe dazu genannt"] },
    { id: "t2-19", thema: 2, typ: "FREI", stufe: 3, aufgabe: "Stelle Vermutungen an, an welchen Orten einer Pflanze Drüsenzellen zu finden sind.",
      muster: "In der Blüte – Duftstoffe und Zucker/Nektar locken Insekten an; an Blättern und Stängeln, z. B. Drüsenhaare mit Duftölen wie bei der Minze; in der Rinde von Nadelbäumen – Harz verschließt Wunden.",
      punkte: ["Ersten passenden Ort genannt", "Mit Begründung (welcher Stoff, wozu)", "Zweiten passenden Ort genannt", "Mit Begründung"] },

    /* ===== Thema 3 ===== */
    { id: "t3-01", thema: 3, typ: "MC", stufe: 1, frage: "Welche drei Bestandteile hat nur die Pflanzenzelle?", richtig: "Zellwand, Vakuole, Chloroplasten", falsch: ["Zellkern, Zellmembran, Zellplasma", "Mitochondrien, Zellwand, Zellkern", "Ribosomen, ER, Vakuole"], erklaerung: "Zellwand (mit Tüpfeln), große Vakuole und Chloroplasten hat nur die Pflanzenzelle." },
    { id: "t3-02", thema: 3, typ: "MC+", stufe: 2, frage: "Welche Bestandteile haben Tier- und Pflanzenzelle gemeinsam? Wähle alle richtigen.", richtig: ["Zellmembran", "Zellplasma", "Zellkern", "Mitochondrien", "ER mit Ribosomen"], falsch: ["Zellwand", "Chloroplasten", "große Vakuole"], erklaerung: "Zellwand, große Vakuole und Chloroplasten hat nur die Pflanzenzelle." },
    { id: "t3-03", thema: 3, typ: "MC", stufe: 1, frage: "Woran erkennst du im Mikroskop am sichersten eine Pflanzenzelle?", richtig: "An der Zellwand (eckige, deutliche Umrandung)", falsch: ["Am Zellkern", "Am Zellplasma", "An der runden Form"], erklaerung: "Einen Zellkern haben beide Zellarten." },
    { id: "t3-04", thema: 3, typ: "RF", stufe: 1, aussage: "Mitochondrien kommen nur in tierischen Zellen vor, Chloroplasten nur in pflanzlichen.", loesung: false, korrektur: "Mitochondrien kommen in Tier- und Pflanzenzellen vor; Chloroplasten nur in (grünen) Pflanzenzellen.", erklaerung: "Mitochondrien gehören zum gemeinsamen Grundbauplan beider Zellarten." },
    { id: "t3-05", thema: 3, typ: "RF", stufe: 1, aussage: "Tier- und Pflanzenzellen besitzen beide eine Zellwand, Zellplasma und einen Zellkern.", loesung: false, korrektur: "Beide besitzen Zellplasma und einen Zellkern, aber nur Pflanzenzellen haben eine Zellwand.", erklaerung: "Tierzellen sind nur von der dünnen Zellmembran umgeben." },
    { id: "t3-06", thema: 3, typ: "RF", stufe: 2, aussage: "Jede Pflanzenzelle besitzt Chloroplasten.", loesung: false, korrektur: "Nur Zellen aus grünen Pflanzenteilen besitzen Chloroplasten, z. B. nicht die Zwiebelhaut.", erklaerung: "Zwiebelhaut-, Wurzel- und Blütenblattzellen haben keine Chloroplasten – sie sind trotzdem Pflanzenzellen." },
    { id: "t3-07", thema: 3, typ: "RF", stufe: 2, aussage: "Auch Pflanzenzellen haben eine Zellmembran.", loesung: true, erklaerung: "Sie liegt der Zellwand innen an." },
    { id: "t3-08", thema: 3, typ: "RF", stufe: 1, aussage: "Tierzellen haben keinen Zellkern.", loesung: false, korrektur: "Tierzellen haben einen Zellkern.", erklaerung: "Beide Zellarten haben einen Zellkern – deshalb sagt er nichts über die Zellart." },
    { id: "t3-09", thema: 3, typ: "MC", stufe: 2, frage: "Warum sieht man bei Pflanzenzellen im Lichtmikroskop meist nur die Zellwand und nicht die Zellmembran?", richtig: "Die Zellmembran ist hauchdünn und liegt der Zellwand innen an", falsch: ["Pflanzenzellen haben keine Zellmembran", "Die Zellmembran liegt außen um die Zellwand herum", "Die Zellmembran ist grün gefärbt"], erklaerung: "Die Zellmembran ist so dünn, dass man im Lichtmikroskop nur die Zellwand sieht." },
    { id: "t3-10", thema: 3, typ: "MC", stufe: 2, frage: "Ein Präparat zeigt rundliche, unregelmäßige Zellen mit dünner Umrandung und Zellkern, aber ohne Zellwand und ohne Vakuole. Was ist es?", richtig: "Tierzellen", falsch: ["Pflanzenzellen", "Zwiebelhautzellen", "Blattzellen"], erklaerung: "Nur dünne Zellmembran, keine Zellwand, rundliche oder unregelmäßige Form → Tierzelle." },
    { id: "t3-11", thema: 3, typ: "LUECKE", stufe: 1, text: "Im Vergleich zur Tierzelle besitzt die Pflanzenzelle zusätzlich eine {Zellwand}, eine große {Vakuole} und {Chloroplasten}. Beide besitzen einen {Zellkern}.", woerter: ["Zellwand", "Vakuole", "Chloroplasten", "Zellkern", "Ausläufer", "Geißel"], erklaerung: "Zellwand, große Vakuole und Chloroplasten hat nur die Pflanzenzelle; einen Zellkern haben beide." },
    { id: "t3-12", thema: 3, typ: "FREI", stufe: 2, aufgabe: "Zwiebelhautzellen sind nicht grün. Begründe, warum es trotzdem Pflanzenzellen sind.", punkte: [
      "Sie haben eine Zellwand.",
      "Sie haben eine große Vakuole.",
      "Chloroplasten gibt es nur in grünen Pflanzenteilen; die Zwiebel ist kein grüner Pflanzenteil."] },
    { id: "t3-13", thema: 3, typ: "FREI", stufe: 2, aufgabe: "Erkläre, weshalb die Zellen eines Blütenblatts rot und nicht grün erscheinen.", punkte: [
      "Die Zellen haben keine Chloroplasten (kein grünes Chlorophyll).",
      "Rote Farbstoffe sind in der Vakuole gelöst.",
      "Die Vakuole nimmt einen großen Teil der Zelle ein, deshalb erscheint die Zelle rot."] },
    { id: "t3-14", thema: 3, typ: "FREI", stufe: 3, aufgabe: "Vergleiche Tier- und Pflanzenzelle. Nenne Gemeinsamkeiten und Unterschiede.", punkte: [
      "Gemeinsam: Zellmembran, Zellplasma, Zellkern",
      "Gemeinsam: Mitochondrien, ER mit Ribosomen",
      "Nur Pflanzenzelle: Zellwand (mit Tüpfeln)",
      "Nur Pflanzenzelle: große Vakuole",
      "Nur Pflanzenzelle: Chloroplasten",
      "Form: Pflanzenzelle meist eckig, Tierzelle rundlich/unregelmäßig"] },

    /* ===== Thema 4 ===== */
    { id: "t4-01", thema: 4, typ: "MC", stufe: 1, frage: "Wo findet die Fotosynthese statt?", richtig: "In den Chloroplasten", falsch: ["In den Mitochondrien", "Im Zellkern", "In der Vakuole"], erklaerung: "Chloroplasten enthalten den grünen Farbstoff Chlorophyll. Dort wird mithilfe von Licht Traubenzucker hergestellt." },
    { id: "t4-02", thema: 4, typ: "MC", stufe: 1, frage: "Welche Organellen nennt man „Kraftwerke der Zelle“?", richtig: "Mitochondrien", falsch: ["Chloroplasten", "Ribosomen", "Vakuolen"], erklaerung: "In den Mitochondrien wird Traubenzucker abgebaut und Energie für alle Lebensvorgänge bereitgestellt (Zellatmung)." },
    { id: "t4-03", thema: 4, typ: "MC", stufe: 1, frage: "Welcher Zellbestandteil enthält das genetische Material und steuert die Vorgänge in der Zelle?", richtig: "Zellkern", falsch: ["Ribosomen", "Zellplasma", "Zellwand"], erklaerung: "Der Zellkern enthält die Erbinformation und ist die Steuerzentrale der Zelle." },
    { id: "t4-04", thema: 4, typ: "MC", stufe: 1, frage: "Welche Bestandteile bilden die Eiweiße der Zelle?", richtig: "Ribosomen", falsch: ["Mitochondrien", "Vakuole", "Zellmembran"], erklaerung: "Ribosomen sind winzige Körnchen, viele sitzen am ER. Man nennt sie „Eiweißfabriken“." },
    { id: "t4-05", thema: 4, typ: "MC", stufe: 2, frage: "Welcher Bestandteil besteht aus Röhren und flachen Hohlräumen und ist das Transportsystem der Zelle?", richtig: "Endoplasmatisches Reticulum (ER)", falsch: ["Vakuole", "Zellkern", "Tüpfel"], erklaerung: "Das Endoplasmatische Reticulum ist das Transportsystem der Zelle." },
    { id: "t4-06", thema: 4, typ: "MC", stufe: 1, frage: "Was speichert die Vakuole?", richtig: "Wasser und darin gelöste Stoffe", falsch: ["Erbinformation", "Energie in Form von Licht", "Chlorophyll"], erklaerung: "Die Vakuole speichert Wasser und darin gelöste Stoffe wie Salze, Farbstoffe und Geschmacksstoffe." },
    { id: "t4-07", thema: 4, typ: "MC", stufe: 1, frage: "Welcher Bestandteil gibt der Pflanzenzelle Form, Festigkeit und Schutz?", richtig: "Zellwand", falsch: ["Zellmembran", "Zellplasma", "Mitochondrium"], erklaerung: "Die Zellwand besteht aus dicken, langen Fasern." },
    { id: "t4-08", thema: 4, typ: "MC", stufe: 1, frage: "Wie heißen die kleinen Öffnungen in der Zellwand?", richtig: "Tüpfel", falsch: ["Poren der Vakuole", "Ribosomen", "Plasmabrücken"], erklaerung: "Durch die Tüpfel tauschen Nachbarzellen Stoffe aus." },
    { id: "t4-09", thema: 4, typ: "MC", stufe: 1, frage: "Welcher Bestandteil ist zähflüssig, füllt die Zelle aus und enthält alle Organellen?", richtig: "Zellplasma", falsch: ["Vakuole", "Zellkern", "Zellwand"], erklaerung: "Im Zellplasma laufen wichtige Stoffwechselvorgänge ab." },
    { id: "t4-10", thema: 4, typ: "MC", stufe: 2, frage: "Welches Organell kann man im Schul-Lichtmikroskop nicht erkennen?", richtig: "Mitochondrien", falsch: ["Zellkern", "Zellwand", "Chloroplasten"], erklaerung: "Mitochondrien sind zu klein; man sieht sie erst im Elektronenmikroskop." },
    { id: "t4-11", thema: 4, typ: "MC", stufe: 2, frage: "Was passiert in den Mitochondrien?", richtig: "Zellatmung: Traubenzucker wird abgebaut und Energie bereitgestellt", falsch: ["Fotosynthese", "Eiweiße werden gebildet", "Wasser wird gespeichert"], erklaerung: "Mitochondrien heißen deshalb „Kraftwerke der Zelle“." },
    { id: "t4-12", thema: 4, typ: "RF", stufe: 1, aussage: "Die Ribosomen sind die Steuerzentrale der Zelle.", loesung: false, korrektur: "Der Zellkern ist die Steuerzentrale der Zelle; Ribosomen bilden Eiweiße.", erklaerung: "Der Zellkern enthält die Erbinformation und steuert alle Vorgänge in der Zelle." },
    { id: "t4-13", thema: 4, typ: "RF", stufe: 2, aussage: "Die Zellmembran lässt keine Stoffe hindurch.", loesung: false, korrektur: "Die Zellmembran ist wasser- und gasdurchlässig und regelt den Stoffaustausch.", erklaerung: "Sie transportiert bestimmte Stoffe aktiv hinein oder hinaus." },
    { id: "t4-14", thema: 4, typ: "RF", stufe: 2, aussage: "Je stärker die Vakuole gefüllt ist, desto stabiler ist die Pflanzenzelle.", loesung: true, erklaerung: "Die Vakuole ist ein großer Speicher für Wasser und darin gelöste Stoffe." },
    { id: "t4-15", thema: 4, typ: "RF", stufe: 2, aussage: "Viele Ribosomen sitzen am Endoplasmatischen Reticulum.", loesung: true, erklaerung: "Ribosomen sind winzige Körnchen; viele sitzen am ER." },
    { id: "t4-16", thema: 4, typ: "RF", stufe: 1, aussage: "Chloroplasten enthalten den grünen Farbstoff Chlorophyll.", loesung: true, erklaerung: "Dort findet die Fotosynthese statt." },
    { id: "t4-17", thema: 4, typ: "RF", stufe: 1, aussage: "Die Vakuole ist die Steuerzentrale der Pflanzenzelle.", loesung: false, korrektur: "Die Vakuole ist ein Speicher für Wasser und gelöste Stoffe; die Steuerzentrale ist der Zellkern.", erklaerung: "Der Zellkern enthält die Erbinformation." },
    { id: "t4-18", thema: 4, typ: "LUECKE", stufe: 1, text: "Der {Zellkern} steuert die Vorgänge in der Zelle. In den {Mitochondrien} wird Energie bereitgestellt. An den {Ribosomen} werden Eiweiße gebildet. In den {Chloroplasten} findet die Fotosynthese statt.", woerter: ["Zellkern", "Mitochondrien", "Ribosomen", "Chloroplasten", "Tüpfel", "Zellwand"], erklaerung: "Zellkern = Steuerzentrale, Mitochondrien = Kraftwerke, Ribosomen = Eiweißfabriken, Chloroplasten = Fotosynthese." },
    { id: "t4-19", thema: 4, typ: "FREI", stufe: 2, aufgabe: "Erkläre, warum die Zellwand Tüpfel enthält.", punkte: [
      "Die Zellwand ist dick und fest.",
      "Benachbarte Zellen müssen trotzdem Stoffe austauschen.",
      "Tüpfel sind kleine Öffnungen, durch die dieser Stoffaustausch möglich ist."] },
    { id: "t4-20", thema: 4, typ: "FREI", stufe: 3, aufgabe: "Die Anzahl der Mitochondrien unterscheidet sich je nach Zelltyp. Formuliere eine begründete Vermutung, welche tierischen Zelltypen besonders viele Mitochondrien besitzen.", punkte: [
      "Mitochondrien stellen Energie bereit.",
      "Zellen mit hohem Energiebedarf haben besonders viele Mitochondrien.",
      "Beispiel: Muskelzellen (z. B. Herzmuskel), weil sie sich ständig zusammenziehen.",
      "Weiteres Beispiel mit Begründung, z. B. Nervenzellen (ständige Informationsweiterleitung) oder Spermienzellen (Fortbewegung)."] },

    /* ===== Thema 5 ===== */
    { id: "t5-01", thema: 5, typ: "MC", stufe: 1, frage: "Was bedeutet „Einzeller“?", richtig: "Eine einzige Zelle erfüllt alle lebensnotwendigen Aufgaben", falsch: ["Ein Lebewesen mit genau einem Organ", "Eine Zelle in einem Gewebe", "Ein Lebewesen ohne Zellkern"], erklaerung: "Bei Einzellern erledigt eine einzige Zelle alle lebensnotwendigen Aufgaben." },
    { id: "t5-02", thema: 5, typ: "MC", stufe: 1, frage: "Womit unterscheidet die Hüllengeißelalge hell und dunkel?", richtig: "Mit dem Augenfleck", falsch: ["Mit den Geißeln", "Mit dem Zellkern", "Mit der Vakuole"], erklaerung: "Der Augenfleck dient zur Unterscheidung von hell und dunkel." },
    { id: "t5-03", thema: 5, typ: "MC", stufe: 1, frage: "Wozu dienen die zwei Geißeln der Hüllengeißelalge?", richtig: "Zur Fortbewegung", falsch: ["Zur Fotosynthese", "Zur Fortpflanzung", "Zum Speichern von Wasser"], erklaerung: "Mit ihren zwei Geißeln bewegt sich die Hüllengeißelalge fort." },
    { id: "t5-04", thema: 5, typ: "MC", stufe: 1, frage: "Aus wie vielen Zellen besteht die Mosaikgrünalge (Gonium)?", richtig: "16", falsch: ["1", "2", "mehrere Tausend"], erklaerung: "Gonium besteht aus 16 Zellen; jede sieht aus wie eine Hüllengeißelalge." },
    { id: "t5-05", thema: 5, typ: "MC", stufe: 2, frage: "Gonium ist …", richtig: "eine Kolonie aus gleichen, nicht spezialisierten Zellen", falsch: ["ein echter Vielzeller mit Arbeitsteilung", "ein Einzeller", "ein Gewebe aus spezialisierten Zellen"], erklaerung: "Die Zellen von Gonium sind nicht differenziert – alle gleich." },
    { id: "t5-06", thema: 5, typ: "MC", stufe: 2, frage: "Wodurch sind die Zellen von Volvox miteinander verbunden?", richtig: "Durch Plasmabrücken", falsch: ["Nur durch eine Gallerte", "Gar nicht", "Durch Tüpfel in der Zellwand"], erklaerung: "Bei Volvox sind die Zellen durch Plasmabrücken verbunden; bei Gonium liegen sie nur in einer Gallerte." },
    { id: "t5-07", thema: 5, typ: "MC", stufe: 2, frage: "Warum ist Volvox ein echter Vielzeller?", richtig: "Seine Zellen sind spezialisiert und teilen sich die Arbeit", falsch: ["Weil er aus vielen Zellen besteht", "Weil er grün ist", "Weil er Geißeln hat"], erklaerung: "Viele Zellen allein reichen nicht – Gonium hat auch mehrere Zellen und ist nur eine Kolonie." },
    { id: "t5-08", thema: 5, typ: "MC", stufe: 1, frage: "Wie vermehrt sich die Hüllengeißelalge ungeschlechtlich?", richtig: "Durch Längsteilung", falsch: ["Durch Tochterkugeln", "Durch Eizellen und Spermien", "Durch Samen"], erklaerung: "Die Hüllengeißelalge vermehrt sich ungeschlechtlich durch Längsteilung." },
    { id: "t5-09", thema: 5, typ: "MC", stufe: 2, frage: "Was gilt vermutlich als erster Schritt zur Entstehung von Vielzellern?", richtig: "Die Bildung von Kolonien", falsch: ["Die Bildung von Organen", "Die Entstehung von Samen", "Die Bildung von Knochen"], erklaerung: "Vermutlich war die Koloniebildung der erste Schritt zur Entstehung von Vielzellern." },
    { id: "t5-10", thema: 5, typ: "RF", stufe: 2, aussage: "Bei Gonium übernehmen verschiedene Zellen verschiedene Aufgaben.", loesung: false, korrektur: "Bei Gonium sind alle Zellen gleich und nicht differenziert; erst bei Volvox gibt es Arbeitsteilung.", erklaerung: "Bei einer Kolonie erfüllt jede Zelle alle Aufgaben." },
    { id: "t5-11", thema: 5, typ: "RF", stufe: 2, aussage: "Bei Volvox kann ein größerer Zelltyp Eizellen und Spermien bilden.", loesung: true, erklaerung: "Aus einer befruchteten Eizelle entsteht eine neue Kugelalge (geschlechtliche Vermehrung)." },
    { id: "t5-12", thema: 5, typ: "RF", stufe: 1, aussage: "Heute lebende Grünalgen geben Hinweise darauf, wie sich Vielzeller über Zwischenstufen aus Einzellern entwickelt haben.", loesung: true, erklaerung: "Einzeller (Chlamydomonas) → Kolonie (Gonium) → echter Vielzeller (Volvox)." },
    { id: "t5-13", thema: 5, typ: "RF", stufe: 2, aussage: "Ein Einzeller stirbt bei der Teilung und hinterlässt eine Leiche.", loesung: false, korrektur: "Bei der Teilung eines Einzellers entstehen zwei Tochterzellen; es bleibt kein toter Körper zurück.", erklaerung: "Die alte Zelle lebt in den Tochterzellen weiter." },
    { id: "t5-14", thema: 5, typ: "FREI", stufe: 3, aufgabe: "Erläutere die Aussage: „Bei Volvox tritt die erste natürliche ‚Leiche‘ auf. Dies trifft auf Einzeller nicht zu.“", punkte: [
      "Bei Volvox entstehen im Inneren der Kugel Tochterkugeln.",
      "Die Mutterkugel platzt und entlässt die Tochterkugeln.",
      "Die Mutterkugel stirbt; ihr toter Körper bleibt zurück (= Leiche).",
      "Ein Einzeller teilt sich in zwei Tochterzellen.",
      "Die alte Zelle lebt in den Tochterzellen weiter, es bleibt kein toter Körper zurück."] },
    { id: "t5-15", thema: 5, typ: "FREI", stufe: 3, aufgabe: "Erläutere, inwieweit sich Zellkolonien von echten Vielzellern unterscheiden.", punkte: [
      "Kolonie: Alle Zellen sind gleich (nicht differenziert).",
      "Kolonie: Jede Zelle erfüllt alle Aufgaben und könnte allein überleben.",
      "Vielzeller: Die Zellen sind spezialisiert, es gibt Arbeitsteilung.",
      "Vielzeller: Die Zellen sind verbunden (Plasmabrücken) und aufeinander angewiesen.",
      "Beispiel: Gonium ist eine Kolonie, Volvox ein echter Vielzeller."] },

    /* ===== Thema 6 ===== */
    { id: "t6-01", thema: 6, typ: "MC", stufe: 1, frage: "Okular 10-fach, Objektiv 40-fach. Wie groß ist die Gesamtvergrößerung?", richtig: "400-fach", falsch: ["50-fach", "30-fach", "4000-fach"], erklaerung: "10 × 40 = 400" },
    { id: "t6-02", thema: 6, typ: "ZAHL", stufe: 2, frage: "Ein Okular vergrößert 10-fach. Du willst 100-fach vergrößern. Welche Vergrößerung muss das Objektiv haben?", loesung: 10, einheit: "-fach", erklaerung: "100 : 10 = 10" },
    { id: "t6-03", thema: 6, typ: "ZAHL", stufe: 1, frage: "Okular 15-fach, Objektiv 4-fach. Wie groß ist die Gesamtvergrößerung?", loesung: 60, einheit: "-fach", erklaerung: "Gesamtvergrößerung = Okular × Objektiv: 15 × 4 = 60" },
    { id: "t6-04", thema: 6, typ: "MC", stufe: 1, frage: "Womit verändert man den Kontrast?", richtig: "Mit der Kondensorblende", falsch: ["Mit dem Beleuchtungsregler", "Mit dem Objektivrevolver", "Mit dem Tubus"], erklaerung: "Die Kondensorblende verändert den Kontrast." },
    { id: "t6-05", thema: 6, typ: "MC", stufe: 1, frage: "Womit stellt man die Helligkeit ein?", richtig: "Mit dem Beleuchtungsregler", falsch: ["Mit der Kondensorblende", "Mit dem Feintrieb", "Mit dem Okular"], erklaerung: "Der Beleuchtungsregler stellt die Helligkeit der Lampe ein." },
    { id: "t6-06", thema: 6, typ: "MC", stufe: 1, frage: "Womit stellt man das Bild scharf?", richtig: "Mit dem Grob- und Feintrieb", falsch: ["Mit der Kondensorblende", "Mit dem Beleuchtungsregler", "Mit dem Objektivrevolver"], erklaerung: "Grob- und Feintrieb bewegen den Objekttisch auf und ab; mit dem Feintrieb stellt man fein scharf." },
    { id: "t6-07", thema: 6, typ: "MC", stufe: 1, frage: "An welchem Teil trägt man das Mikroskop?", richtig: "Am Stativ", falsch: ["Am Tubus", "Am Objekttisch", "Am Okular"], erklaerung: "Das Stativ verbindet alle Teile und gibt festen Halt; hier fasst man das Mikroskop zum Tragen an." },
    { id: "t6-08", thema: 6, typ: "MC", stufe: 2, frage: "Warum muss das Objekt sehr dünn oder durchsichtig sein?", richtig: "Weil es von Licht durchstrahlt wird", falsch: ["Damit es auf den Objektträger passt", "Damit es nicht verrutscht", "Damit das Mikroskop nicht zu schwer wird"], erklaerung: "Beim Lichtmikroskop wird das Objekt von unten durchleuchtet." },
    { id: "t6-09", thema: 6, typ: "MC", stufe: 2, frage: "Mit welchem Objektiv beginnt man?", richtig: "Mit dem kleinsten Objektiv", falsch: ["Mit dem größten Objektiv", "Mit dem mittleren Objektiv", "Das ist egal"], erklaerung: "Größter Überblick, Objekt leicht zu finden, großer Abstand – nichts geht kaputt." },
    { id: "t6-10", thema: 6, typ: "MC", stufe: 1, frage: "Was trägt der Objektivrevolver?", richtig: "Objektive mit unterschiedlicher Vergrößerung", falsch: ["Das Okular", "Die Lampe", "Den Objektträger"], erklaerung: "Der Objektivrevolver ist drehbar und trägt die Objektive." },
    { id: "t6-11", thema: 6, typ: "MC", stufe: 1, frage: "Was hält der Tubus?", richtig: "Das Okular", falsch: ["Die Objektive", "Den Objekttisch", "Die Lampe"], erklaerung: "Der Tubus hält das Okular." },
    { id: "t6-12", thema: 6, typ: "MC", stufe: 1, frage: "Worauf liegt das Präparat?", richtig: "Auf einem Objektträger aus Glas, abgedeckt mit einem Deckglas", falsch: ["Direkt auf der Lampe", "Im Tubus", "Auf dem Okular"], erklaerung: "Der Objektträger mit Deckglas wird auf den Objekttisch gelegt." },
    { id: "t6-13", thema: 6, typ: "MC", stufe: 2, frage: "Was unterscheidet ein Lichtmikroskop von einer Lupe?", richtig: "Es kombiniert zwei Linsen und das Objekt wird von Licht durchstrahlt, dadurch vergrößert es viel stärker", falsch: ["Es hat nur eine größere Linse", "Es funktioniert ohne Licht", "Es zeigt Objekte räumlich"], erklaerung: "Okular und Objektiv sind die zwei Linsen des Lichtmikroskops." },
    { id: "t6-14", thema: 6, typ: "RF", stufe: 1, aussage: "Beim Hochfahren des Objekttisches schaut man durch das Okular.", loesung: false, korrektur: "Beim Hochfahren kontrolliert man von der Seite, damit das Objektiv den Objektträger nicht berührt.", erklaerung: "Erst danach schaut man durch das Okular und stellt mit dem Feintrieb scharf." },
    { id: "t6-15", thema: 6, typ: "RF", stufe: 1, aussage: "Die Gesamtvergrößerung berechnet man, indem man die Vergrößerungen von Okular und Objektiv addiert.", loesung: false, korrektur: "Man multipliziert die Vergrößerungen von Okular und Objektiv.", erklaerung: "Beispiel: 10 × 40 = 400-fach." },
    { id: "t6-16", thema: 6, typ: "RF", stufe: 1, aussage: "Vor dem Auflegen trocknet man den Objektträger unten ab.", loesung: true, erklaerung: "Danach legt man ihn in den Lichtstrahl auf den Objekttisch." },
    { id: "t6-17", thema: 6, typ: "RF", stufe: 1, aussage: "Auch beim Wechsel des Objektivs kontrolliert man von der Seite.", loesung: true, erklaerung: "So stößt das Objektiv nicht gegen den Objektträger." },
    { id: "t6-18", thema: 6, typ: "RF", stufe: 2, aussage: "Mit dem Feintrieb stellt man die Helligkeit ein.", loesung: false, korrektur: "Mit dem Feintrieb stellt man das Bild scharf; die Helligkeit stellt man mit dem Beleuchtungsregler ein.", erklaerung: "Der Feintrieb bewegt den Objekttisch fein auf und ab." }
  ];

  /* ---------- Interaktive Übungen ---------- */
  const ZELLE_BEGRUENDUNGEN = {
    a: "hat eine Zellwand (eckige, doppelte Umrandung)",
    b: "hat Chloroplasten",
    c: "hat eine große Vakuole",
    d: "hat nur eine dünne Zellmembran, keine Zellwand",
    e: "hat eine rundliche oder unregelmäßige Form",
    f: "hat einen Zellkern"
  };

  const uebungen = [
    /* Thema 1 */
    { id: "t1-u1", thema: 1, typ: "CHECK", titel: "Lebendig-Check", erklaerung: "Nur wenn alle fünf Kennzeichen zutreffen, ist es ein Lebewesen.",
      objekte: [
        { id: "hund", name: "Hund", lebewesen: true, k: { w: 1, s: 1, f: 1, b: 1, r: 1 }, begruendung: "Ja, alle fünf Kennzeichen treffen zu." },
        { id: "sonnenblume", name: "Sonnenblume", lebewesen: true, k: { w: 1, s: 1, f: 1, b: 1, r: 1 }, begruendung: "Ja, alle fünf (Bewegung: Blüte und Blätter richten sich zur Sonne aus)." },
        { id: "regenwurm", name: "Regenwurm", lebewesen: true, k: { w: 1, s: 1, f: 1, b: 1, r: 1 }, begruendung: "Ja, alle fünf Kennzeichen treffen zu." },
        { id: "venusfliegenfalle", name: "Venusfliegenfalle", lebewesen: true, k: { w: 1, s: 1, f: 1, b: 1, r: 1 }, begruendung: "Ja, alle fünf Kennzeichen treffen zu." },
        { id: "muschel", name: "Muschel", lebewesen: true, k: { w: 1, s: 1, f: 1, b: 1, r: 1 }, begruendung: "Ja, alle fünf (öffnet und schließt die Schalen, schließt sie bei Berührung)." },
        { id: "roboter", name: "Roboter", lebewesen: false, k: { w: 0, s: 0, f: 0, b: 1, r: 1 }, notiz: { r: "technisch, über Sensoren" }, begruendung: "Nein: Er bewegt sich und reagiert über Sensoren (technisch), aber er wächst nicht, hat keinen Stoffwechsel und pflanzt sich nicht fort." },
        { id: "kerze", name: "Kerzenflamme", lebewesen: false, k: { w: 2, s: 2, f: 0, b: 2, r: 0 }, notiz: { w: "wird größer", s: "verbraucht Wachs und Sauerstoff", b: "flackert", f: "pflanzt sich nicht fort, entwickelt sich nicht", r: "reagiert nicht gezielt" }, begruendung: "Nein: Sie flackert und wird größer, verbraucht Wachs und Sauerstoff – aber sie reagiert nicht gezielt auf Reize, pflanzt sich nicht fort, entwickelt sich nicht und besteht nicht aus Zellen." },
        { id: "eiszapfen", name: "Eiszapfen", lebewesen: false, k: { w: 2, s: 0, f: 0, b: 0, r: 0 }, notiz: { w: "nur durch Anlagern von Wasser" }, begruendung: "Nein: Er wird nur durch Anlagern von Wasser größer; kein Stoffwechsel, keine Bewegung, keine Reizbarkeit, keine Fortpflanzung." },
        { id: "auto", name: "Auto", lebewesen: false, k: { w: 0, s: 2, f: 0, b: 1, r: 0 }, notiz: { s: "verbraucht Treibstoff", r: "nicht von selbst" }, begruendung: "Nein: Es bewegt sich und verbraucht Treibstoff, wächst aber nicht, pflanzt sich nicht fort und reagiert nicht von selbst auf Reize." }
      ] },
    { id: "t1-u2", thema: 1, typ: "SORT", titel: "Welches Kennzeichen?", anleitung: "Ordne jede Beobachtung dem passenden Kennzeichen zu.", erklaerung: "W–S–F–B–R: Wachstum, Stoffwechsel, Fortpflanzung und Entwicklung, Bewegung, Reizbarkeit.",
      spalten: [{ id: "w", titel: "Wachstum" }, { id: "s", titel: "Stoffwechsel" }, { id: "f", titel: "Fortpflanzung und Entwicklung" }, { id: "b", titel: "Bewegung" }, { id: "r", titel: "Reizbarkeit" }],
      karten: [
        { text: "Ein Pandabär nimmt von 100 g auf über 100 kg zu.", spalte: "w" },
        { text: "Bambus wächst bis zu 10 cm am Tag.", spalte: "w" },
        { text: "Eine Kuh frisst Gras und scheidet Unverdauliches als Kot aus.", spalte: "s" },
        { text: "Eine Pflanze nimmt Wasser und Kohlenstoffdioxid auf und gibt Sauerstoff ab.", spalte: "s" },
        { text: "Aus der befruchteten Eizelle eines Käfers entsteht ein neuer Käfer.", spalte: "f" },
        { text: "Aus einem Ableger wächst eine neue Pflanze.", spalte: "f" },
        { text: "Eine Schnecke kriecht über ein Blatt.", spalte: "b" },
        { text: "Die Venusfliegenfalle klappt ihre Blatthälften zu.", spalte: "b" },
        { text: "Eine Biene erkennt Blüten an Farbe und Duft.", spalte: "r" },
        { text: "Die Pupille wird bei hellem Licht kleiner.", spalte: "r" }
      ] },

    /* Thema 2 */
    { id: "t2-u1", thema: 2, typ: "RH", titel: "Stufenleiter Mensch", anleitung: "Bringe die Stufen in die richtige Reihenfolge – von klein nach groß.", erklaerung: "Zelle → Gewebe → Organ → Organsystem → Organismus.",
      karten: ["Herzmuskelzelle", "Herzmuskelgewebe", "Herz", "Herz-Kreislauf-System", "Mensch"],
      fachbegriffe: ["Zelle", "Gewebe", "Organ", "Organsystem", "Organismus"],
      bilder: ["herzZelle", "herzGewebe", "herz", "herzKreislauf", "mensch"] },
    { id: "t2-u2", thema: 2, typ: "RH", titel: "Stufenleiter Pflanze", anleitung: "Bringe die Stufen in die richtige Reihenfolge – von klein nach groß.", erklaerung: "Blattzelle (Zelle) → Blattgewebe (Gewebe) → Laubblatt (Organ) → Baum (Organismus).",
      karten: ["Blattzelle", "Blattgewebe", "Laubblatt", "Baum"],
      fachbegriffe: ["Zelle", "Gewebe", "Organ", "Organismus"],
      bilder: ["blattZelle", "blattGewebe", "laubblatt", "baum"] },
    { id: "t2-u3", thema: 2, typ: "ZU", titel: "Systemebenen-Bilder", anleitung: "Ordne jedem Bild die passende Systemebene zu.", erklaerung: "Zelle → Gewebe → Organ → Organsystem → Organismus.",
      paare: [
        { links: "A", bild: "sysMagen", rechts: "Organ" },
        { links: "B", bild: "sysDarmzelle", rechts: "Zelle" },
        { links: "C", bild: "mensch", rechts: "Organismus" },
        { links: "D", bild: "sysSchleimhaut", rechts: "Gewebe" },
        { links: "E", bild: "sysMagenDarm", rechts: "Organsystem" }
      ] },
    { id: "t2-u4", thema: 2, typ: "ZU", titel: "Zelltyp und Funktion (Tier)", anleitung: "Ordne jedem Zelltyp seine Aufgabe zu.", erklaerung: "Der Bau passt zur Funktion.",
      paare: [
        { links: "Nervenzelle", rechts: "hat lange Ausläufer und leitet Informationen weiter" },
        { links: "Hautzelle", rechts: "grenzt den Körper nach außen ab und schützt ihn" },
        { links: "Muskelzelle", rechts: "zieht sich zusammen und ermöglicht Bewegung" },
        { links: "Knorpelzelle", rechts: "bildet eine Grundsubstanz, die Stöße im Gelenk dämpft" },
        { links: "Knochenzelle", rechts: "bildet das harte Knochenmaterial" }
      ] },
    { id: "t2-u5", thema: 2, typ: "ZU", titel: "Zelltyp und Funktion (Pflanze)", anleitung: "Ordne jedem Zelltyp seine Aufgabe zu.", erklaerung: "Auch bei Pflanzen passt der Bau zur Funktion.",
      paare: [
        { links: "Blattzelle mit Chloroplasten", rechts: "betreibt Fotosynthese" },
        { links: "Zelle des Blattabschlussgewebes", rechts: "schützt das Blatt vor schädlichen äußeren Einflüssen" },
        { links: "Zelle der Leitungsbahn", rechts: "transportiert Traubenzucker aus den Blättern in andere Pflanzenteile" },
        { links: "Drüsenzelle", rechts: "bildet Duftstoffe, Harze oder Zucker und gibt sie ab" }
      ] },

    /* Thema 3 */
    { id: "t3-u1", thema: 3, typ: "SORT", titel: "Vergleich: Wer hat was?", anleitung: "Sortiere die Bestandteile in die richtige Spalte.", erklaerung: "Tierzellen haben nichts, was Pflanzenzellen fehlt – deshalb bleibt die Spalte „nur Tierzelle“ leer.",
      leerHinweis: "Die Spalte „nur Tierzelle“ bleibt richtigerweise leer: Tierzellen haben nichts, was Pflanzenzellen fehlt.",
      spalten: [{ id: "tier", titel: "nur Tierzelle" }, { id: "beide", titel: "beide" }, { id: "pflanze", titel: "nur Pflanzenzelle" }],
      karten: [
        { text: "Zellmembran", spalte: "beide" }, { text: "Zellplasma", spalte: "beide" }, { text: "Zellkern", spalte: "beide" },
        { text: "Mitochondrien", spalte: "beide" }, { text: "ER mit Ribosomen", spalte: "beide" },
        { text: "Zellwand", spalte: "pflanze" }, { text: "Tüpfel", spalte: "pflanze" }, { text: "große Vakuole", spalte: "pflanze" }, { text: "Chloroplasten", spalte: "pflanze" }
      ] },
    { id: "t3-u2", thema: 3, typ: "TABELLE", titel: "Tabelle ausfüllen", anleitung: "Tippe auf die Felder: ✓ = kommt vor, ✗ = kommt nicht vor.", erklaerung: "Zellwand, große Vakuole und Chloroplasten hat nur die Pflanzenzelle.",
      zeilen: [
        { name: "Zellmembran", tier: true, pflanze: true },
        { name: "Zellplasma", tier: true, pflanze: true },
        { name: "Zellkern", tier: true, pflanze: true },
        { name: "Mitochondrien", tier: true, pflanze: true },
        { name: "ER mit Ribosomen", tier: true, pflanze: true },
        { name: "Zellwand mit Tüpfeln", tier: false, pflanze: true },
        { name: "große Vakuole", tier: false, pflanze: true },
        { name: "Chloroplasten", tier: false, pflanze: true, notiz: "in grünen Teilen" }
      ] },
    { id: "t3-u3", thema: 3, typ: "ZELLE", titel: "Welche Zelle bin ich?", anleitung: "Bestimme die Zellart und kreuze passende Begründungen an.", erklaerung: "Zellwand, Chloroplasten oder große Vakuole → Pflanzenzelle. Ein Zellkern sagt nichts über die Zellart.",
      begruendungen: ZELLE_BEGRUENDUNGEN,
      zellen: [
        { id: "mundschleimhaut", name: "Mundschleimhautzelle", grafik: "zMund", loesung: "tier", richtig: ["d", "e"], hinweis: "Flach, unregelmäßig, Kern in der Mitte." },
        { id: "zwiebelhaut", name: "Zwiebelhautzelle", grafik: "zZwiebel", loesung: "pflanze", richtig: ["a", "c"], hinweis: "Keine Chloroplasten, weil die Zwiebel ein nicht grüner Pflanzenteil ist." },
        { id: "blatt", name: "Blattzelle", grafik: "zBlatt", loesung: "pflanze", richtig: ["a", "b", "c"], hinweis: "Viele Chloroplasten → Fotosynthese." },
        { id: "nerv", name: "Nervenzelle", grafik: "zNerv", loesung: "tier", richtig: ["d", "e"], hinweis: "Lange Ausläufer zum Weiterleiten von Informationen." },
        { id: "muskel", name: "Muskelzelle", grafik: "zMuskel", loesung: "tier", richtig: ["d", "e"], hinweis: "Spindelförmig, zieht sich zusammen." },
        { id: "knorpel", name: "Knorpelzellen", grafik: "zKnorpel", loesung: "tier", richtig: ["d", "e"], hinweis: "Liegen einzeln oder zu zweit in einer Grundsubstanz." },
        { id: "bluete", name: "Blütenblattzelle (rot)", grafik: "zBluete", loesung: "pflanze", richtig: ["a", "c"], hinweis: "Rot, weil Farbstoff in der Vakuole; keine Chloroplasten." },
        { id: "leitung", name: "Zelle der Leitungsbahn", grafik: "zLeitung", loesung: "pflanze", richtig: ["a"], hinweis: "Lange Röhre mit Wandverstärkungen, transportiert Stoffe." }
      ] },

    /* Thema 4 */
    { id: "t4-u1", thema: 4, typ: "EXPLORER", titel: "Zell-Explorer", grafiken: ["pflanzenzelle", "tierzelle"], info: "organellen",
      hinweis: "Diese Bestandteile fehlen der Tierzelle: Zellwand, Tüpfel, Vakuole, Chloroplasten." },
    { id: "t4-u2", thema: 4, typ: "BESCHR", titel: "Pflanzenzelle beschriften", grafik: "pflanzenzelle", teile: PFLANZEN_TEILE, info: "organellen", erklaerung: "Die Pflanzenzelle hat zusätzlich Zellwand, Tüpfel, Vakuole und Chloroplasten." },
    { id: "t4-u3", thema: 4, typ: "BESCHR", titel: "Tierzelle beschriften", grafik: "tierzelle", teile: TIER_TEILE, info: "organellen", erklaerung: "Die Tierzelle hat keine Zellwand, keine Vakuole und keine Chloroplasten." },
    { id: "t4-u4", thema: 4, typ: "ZEIG", titel: "Zeig mir …", grafiken: ["pflanzenzelle", "tierzelle"], teile: PFLANZEN_TEILE, info: "organellen", runden: 8, erklaerung: "Zellwand, Tüpfel, Vakuole und Chloroplasten gibt es in der Tierzelle nicht." },
    { id: "t4-u5", thema: 4, typ: "ZU", titel: "Organell und Aufgabe", anleitung: "Ordne jedem Bestandteil seine Aufgabe zu.", erklaerung: "Jeder Zellbestandteil hat eine bestimmte Aufgabe.",
      paare: [
        { links: "Zellmembran", rechts: "grenzt die Zelle ab und regelt den Stoffaustausch" },
        { links: "Zellplasma", rechts: "füllt die Zelle aus, alle Organellen liegen darin" },
        { links: "Zellkern", rechts: "enthält die Erbinformation und steuert die Zelle" },
        { links: "Mitochondrien", rechts: "Zellatmung: stellen Energie bereit" },
        { links: "Endoplasmatisches Reticulum", rechts: "Transportsystem der Zelle" },
        { links: "Ribosomen", rechts: "bilden Eiweiße" },
        { links: "Zellwand", rechts: "gibt Form, Festigkeit und Schutz" },
        { links: "Tüpfel", rechts: "Öffnungen für den Stoffaustausch zwischen Nachbarzellen" },
        { links: "Vakuole", rechts: "speichert Wasser und darin gelöste Stoffe" },
        { links: "Chloroplasten", rechts: "Fotosynthese: stellen Traubenzucker her" }
      ] },
    { id: "t4-u6", thema: 4, typ: "ZU", titel: "Merkhilfe und Organell", anleitung: "Welche Merkhilfe passt zu welchem Bestandteil? „Kraftwerk“ und „Eiweißfabrik“ sind gängige Fachbezeichnungen, die anderen sind Merkhilfen.", erklaerung: "Merkhilfen helfen dir, die Aufgaben zu behalten.",
      paare: [
        { links: "Steuerzentrale", rechts: "Zellkern" },
        { links: "Kraftwerk", rechts: "Mitochondrium" },
        { links: "Eiweißfabrik", rechts: "Ribosom" },
        { links: "Transportsystem", rechts: "Endoplasmatisches Reticulum" },
        { links: "Wassertank", rechts: "Vakuole" },
        { links: "Grenzkontrolle", rechts: "Zellmembran" },
        { links: "Schutzmauer", rechts: "Zellwand" },
        { links: "Zuckerfabrik", rechts: "Chloroplast" }
      ] },

    /* Thema 5 */
    { id: "t5-u1", thema: 5, typ: "EXPLORER", titel: "Stufen-Explorer", grafiken: ["algen"], info: "algen" },
    { id: "t5-u2", thema: 5, typ: "RH", titel: "Entwicklungsstufen", anleitung: "Ordne vom Einzeller zum Vielzeller.", erklaerung: "Einzeller → Kolonie → echter Vielzeller.",
      karten: ["Hüllengeißelalge (Einzeller)", "Mosaikgrünalge (Kolonie)", "Kugelalge (Vielzeller)"], bilder: ["chlamydomonas", "gonium", "volvox"] },
    { id: "t5-u3", thema: 5, typ: "SORT", titel: "Merkmale und Alge", anleitung: "Ordne jedes Merkmal der richtigen Alge zu.", erklaerung: "Chlamydomonas ist ein Einzeller, Gonium eine Kolonie, Volvox ein echter Vielzeller.",
      spalten: [{ id: "chl", titel: "Chlamydomonas" }, { id: "gon", titel: "Gonium" }, { id: "vol", titel: "Volvox" }],
      karten: [
        { text: "zwei Geißeln und ein Augenfleck", spalte: "chl" }, { text: "becherförmiger Chloroplast", spalte: "chl" },
        { text: "vermehrt sich durch Längsteilung", spalte: "chl" }, { text: "eine einzige Zelle", spalte: "chl" },
        { text: "16 gleiche Zellen", spalte: "gon" }, { text: "Zellen liegen in einer Gallerte", spalte: "gon" },
        { text: "Kolonie", spalte: "gon" }, { text: "Zellen sind nicht differenziert", spalte: "gon" },
        { text: "Hohlkugel", spalte: "vol" }, { text: "Plasmabrücken", spalte: "vol" },
        { text: "Tochterkugeln im Inneren", spalte: "vol" }, { text: "Arbeitsteilung zwischen den Zellen", spalte: "vol" }
      ] },
    { id: "t5-u4", thema: 5, typ: "SORT", titel: "Kolonie oder echter Vielzeller?", anleitung: "Ordne jedes Merkmal zu.", erklaerung: "Kolonie: alle Zellen gleich. Echter Vielzeller: Arbeitsteilung.",
      spalten: [{ id: "kol", titel: "Zellkolonie (z. B. Gonium)" }, { id: "viel", titel: "Echter Vielzeller (z. B. Volvox)" }],
      karten: [
        { text: "alle Zellen gleich, nicht differenziert", spalte: "kol" },
        { text: "jede Zelle erfüllt alle Aufgaben", spalte: "kol" },
        { text: "Zellen liegen in Gallerte zusammen", spalte: "kol" },
        { text: "eine einzelne Zelle könnte allein überleben", spalte: "kol" },
        { text: "Zellen spezialisiert, Arbeitsteilung", spalte: "viel" },
        { text: "verschiedene Zellen übernehmen verschiedene Aufgaben (z. B. Bewegung, Fortpflanzung)", spalte: "viel" },
        { text: "Zellen durch Plasmabrücken verbunden", spalte: "viel" },
        { text: "Zellen sind aufeinander angewiesen", spalte: "viel" }
      ] },
    { id: "t5-u5", thema: 5, typ: "RH", titel: "Vermehrung von Volvox", anleitung: "Bringe die Schritte der ungeschlechtlichen Vermehrung in die richtige Reihenfolge.", erklaerung: "Am Ende stirbt die Mutterkugel – die „erste natürliche Leiche“.",
      karten: ["Einzelne Zellen teilen sich.", "Tochterzellen gelangen ins Innere der Kugel.", "Sie wachsen zu Tochterkugeln heran.", "Die Mutterkugel platzt und entlässt die Tochterkugeln.", "Die Mutterkugel stirbt."] },

    /* Thema 6 */
    { id: "t6-u1", thema: 6, typ: "EXPLORER", titel: "Mikroskop-Explorer", grafiken: ["mikroskop"], info: "mikroskop" },
    { id: "t6-u2", thema: 6, typ: "BESCHR", titel: "Mikroskop beschriften", grafik: "mikroskop", teile: MIKROSKOP_TEILE, info: "mikroskop", erklaerung: "Okular und Objektiv sind die zwei Linsen des Lichtmikroskops." },
    { id: "t6-u3", thema: 6, typ: "ZEIG", titel: "Zeig mir …", grafiken: ["mikroskop"], teile: MIKROSKOP_TEILE, info: "mikroskop", runden: 8, erklaerung: "Jedes Teil des Mikroskops hat eine eigene Aufgabe." },
    { id: "t6-u4", thema: 6, typ: "ZU", titel: "Teil und Aufgabe", anleitung: "Ordne jedem Teil seine Aufgabe zu. Jede Runde kommen 6 zufällige Teile.", erklaerung: "Jedes Teil des Mikroskops hat eine eigene Aufgabe.", anzahl: 6,
      paare: MIKROSKOP_TEILE.map(function (k) { return { links: MIKROSKOP[k].name, rechts: MIKROSKOP[k].aufgabe }; }) },
    { id: "t6-u5", thema: 6, typ: "ZAHLGEN", titel: "Vergrößerungstrainer", anleitung: "Rechne mit: Gesamtvergrößerung = Okular × Objektiv.", erklaerung: "Gesamtvergrößerung = Vergrößerung des Okulars × Vergrößerung des Objektivs.",
      okulare: [5, 10, 15], objektive: [4, 10, 40], runden: 10 },
    { id: "t6-u6", thema: 6, typ: "RH", titel: "Arbeitsschritte", anleitung: "Bringe die Arbeitsschritte in die richtige Reihenfolge.", erklaerung: "Immer mit dem kleinsten Objektiv beginnen und beim Hochfahren von der Seite kontrollieren.",
      karten: SCHRITTE.slice() }
  ];

  /* ---------- Probe-Klassenarbeit: Bauplan ---------- */
  const ARBEIT = [
    { thema: 1, titel: "Kennzeichen des Lebendigen", teile: [{ aus: ["t1-16", "t1-17"] }, { pool: { thema: 1, typen: ["RF", "MC"] }, anzahl: 2 }] },
    { thema: 2, titel: "Zellen und Organisationsstufen", teile: [{ aus: ["t2-u1"] }, { aus: ["t2-u3"] }, { pool: { thema: 2, typen: ["MC"] }, anzahl: 1 }] },
    { thema: 3, titel: "Tierzelle und Pflanzenzelle", teile: [{ aus: ["t3-u3"], opts: { einzel: true } }, { aus: ["t3-u1"], opts: { ohneLeere: true } }] },
    { thema: 4, titel: "Zellorganellen", teile: [{ aus: ["t4-u2", "t4-u3"] }, { aus: ["t4-u5"] }] },
    { thema: 5, titel: "Vom Einzeller zum Vielzeller", teile: [{ aus: ["t5-14", "t5-15"] }, { aus: ["t5-u3"] }] },
    { thema: 6, titel: "Das Lichtmikroskop", teile: [{ aus: ["t6-u2"] }, { aus: ["t6-02", "t6-03"] }, { aus: ["t6-u6"] }] }
  ];

  const DATA = {
    themen, fragen, uebungen, ORGANELLEN, PFLANZEN_TEILE, TIER_TEILE, MIKROSKOP, MIKROSKOP_TEILE,
    SCHRITTE, KENNZEICHEN, STUFEN, ALGEN, ARBEIT, ZELLE_BEGRUENDUNGEN
  };
  root.DATA = DATA;
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
})(typeof window !== "undefined" ? window : globalThis);
