/* Zell-Labor – eigene SVG-Grafiken.
   Jede Grafik ist eine Funktion und liefert { w, h, body, parts }.
   parts: { id: { anker:[x,y], seite:"l"|"r" } } – Ankerpunkte für Beschriftungen.
   Farben kommen über CSS-Klassen (g-…), damit der Dunkelmodus funktioniert. */
(function (root) {
  "use strict";

  const r1 = (n) => Math.round(n * 10) / 10;
  const pts = (arr) => arr.map((p) => r1(p[0]) + "," + r1(p[1])).join(" ");
  const pathOf = (arr) => "M" + arr.map((p) => r1(p[0]) + " " + r1(p[1])).join(" L") + " Z";
  const scaleP = (arr, s, c) => arr.map((p) => [c[0] + (p[0] - c[0]) * s, c[1] + (p[1] - c[1]) * s]);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const angle = (a, b) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

  /* ---- Bausteine ---- */
  function chloro(x, y, rot, s) {
    s = s || 1;
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ") scale(" + s + ')">' +
      '<ellipse rx="20" ry="10" class="g-chl"/>' +
      '<path d="M-9 -5 V5 M0 -6.5 V6.5 M9 -5 V5" class="g-chl-s"/></g>';
  }
  function mito(x, y, rot, s) {
    s = s || 1;
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ") scale(" + s + ')">' +
      '<ellipse rx="17" ry="8" class="g-mito"/>' +
      '<path d="M-12 0 q3 -6 6 0 t6 0 t6 0 t6 0" class="g-mito-s"/></g>';
  }
  function kern(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="g-kern"/>' +
      '<circle cx="' + (x + r * 0.2) + '" cy="' + (y - r * 0.2) + '" r="' + r * 0.3 + '" class="g-nucleolus"/>';
  }
  function wave(x1, x2, y, amp, step) {
    let d = "M" + x1 + " " + y;
    let up = true;
    for (let x = x1; x < x2; x += step) {
      d += " Q" + (x + step / 2) + " " + (y + (up ? -amp : amp)) + " " + Math.min(x + step, x2) + " " + y;
      up = !up;
    }
    return d;
  }
  function erBands(bands) {
    return bands.map((b) => '<path d="' + wave(b[0], b[1], b[2], 5, 14) + '" class="g-er"/><path d="' + wave(b[0], b[1], b[2], 5, 14) + '" class="g-er-in"/>').join("");
  }
  function erRibos(bands) {
    let s = "";
    bands.forEach((b) => {
      for (let x = b[0] + 7; x < b[1] - 2; x += 14) {
        const up = Math.round((x - b[0] - 7) / 14) % 2 === 0;
        s += '<circle cx="' + x + '" cy="' + (b[2] + (up ? -7.5 : 7.5)) + '" r="2.6" class="g-ribo"/>';
      }
    });
    return s;
  }
  const hitC = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="hit-fill"/>';

  const G = {};

  /* ============ 9.1 Pflanzenzelle ============ */
  G.pflanzenzelle = function () {
    const C = [300, 212];
    const P = [[150, 50], [450, 40], [490, 200], [460, 380], [140, 385], [115, 210]];
    const wallMid = scaleP(P, 0.975, C);
    const inner = scaleP(P, 0.95, C);
    const tPos = [[0, 1, 0.6], [2, 3, 0.55], [4, 5, 0.45]].map((e) => {
      const a = wallMid[e[0]], b = wallMid[e[1]];
      return { p: lerp(a, b, e[2]), rot: angle(a, b) };
    });
    const wallAnchor = lerp(wallMid[5], wallMid[0], 0.28);
    const memAnchor = lerp(inner[2], inner[3], 0.12);
    const erB = [[150, 222, 262], [148, 226, 284], [152, 214, 306]];
    const chl = [[250, 85, -2], [345, 78, -2], [425, 88, 10], [458, 165, 75], [456, 262, 95], [392, 346, -5], [300, 352, 0], [212, 348, 3], [170, 120, -60]];
    const mit = [[265, 118, 10], [345, 328, -8], [430, 325, -40]];
    const freeR = [[200, 246], [235, 150], [215, 110], [440, 222], [280, 330], [380, 120]];

    let b = "";
    b += '<g data-part="zellwand" class="part"><path d="' + pathOf(P) + '" class="g-wall"/></g>';
    b += '<g data-part="zellplasma" class="part"><path d="' + pathOf(inner) + '" class="g-plasma-p"/></g>';
    b += '<g data-part="zellmembran" class="part"><path d="' + pathOf(inner) + '" class="g-membran"/></g>';
    b += '<g data-part="tuepfel" class="part">' + tPos.map((t) =>
      '<g transform="translate(' + r1(t.p[0]) + " " + r1(t.p[1]) + ") rotate(" + r1(t.rot) + ')"><rect x="-8" y="-9" width="16" height="18" class="g-tuepfel"/><path d="M-8 -9 V9 M8 -9 V9" class="g-wall-s"/></g>').join("") + "</g>";
    b += '<g data-part="vakuole" class="part"><ellipse cx="330" cy="215" rx="100" ry="100" class="g-vak"/><path d="M300 170 q20 -10 40 0" class="g-vak-hl"/></g>';
    b += '<g data-part="zellkern" class="part">' + kern(175, 200, 38) + "</g>";
    b += '<g data-part="er" class="part">' + erBands(erB) + '<path d="M140 250 H232 V318 H140 Z" class="hit-fill"/></g>';
    b += '<g data-part="chloroplast" class="part">' + chl.map((c) => chloro(c[0], c[1], c[2]) + hitC(c[0], c[1], 20)).join("") + "</g>";
    b += '<g data-part="mitochondrium" class="part">' + mit.map((m) => mito(m[0], m[1], m[2]) + hitC(m[0], m[1], 18)).join("") + "</g>";
    b += '<g data-part="ribosomen" class="part">' + erRibos(erB) + freeR.map((r) => '<circle cx="' + r[0] + '" cy="' + r[1] + '" r="2.8" class="g-ribo"/>' + hitC(r[0], r[1], 10)).join("") + "</g>";
    // Trefferflächen für dünne Teile (oben)
    b += '<path data-part="zellwand" d="' + pathOf(wallMid) + '" class="hit" stroke-width="14"/>';
    b += '<path data-part="zellmembran" d="' + pathOf(scaleP(P, 0.935, C)) + '" class="hit" stroke-width="10"/>';
    b += tPos.map((t) => '<circle data-part="tuepfel" cx="' + r1(t.p[0]) + '" cy="' + r1(t.p[1]) + '" r="16" class="hit-fill"/>').join("");

    return {
      w: 600, h: 420, body: b,
      parts: {
        chloroplast: { anker: [170, 120], seite: "l" },
        zellwand: { anker: wallAnchor, seite: "l" },
        zellkern: { anker: [158, 205], seite: "l" },
        ribosomen: { anker: [200, 246], seite: "l" },
        er: { anker: [165, 290], seite: "l" },
        zellplasma: { anker: [432, 128], seite: "r" },
        vakuole: { anker: [395, 200], seite: "r" },
        zellmembran: { anker: memAnchor, seite: "r" },
        tuepfel: { anker: tPos[1].p, seite: "r" },
        mitochondrium: { anker: [430, 325], seite: "r" }
      }
    };
  };

  /* ============ 9.2 Tierzelle ============ */
  G.tierzelle = function () {
    const blob = "M300 55 C400 50 480 110 478 200 C476 290 420 365 310 368 C200 371 125 320 122 225 C119 130 200 60 300 55 Z";
    const erB = [[360, 432, 170], [362, 440, 192], [360, 436, 214], [366, 428, 236]];
    const mit = [[175, 180, 70], [190, 280, -20], [250, 330, 10], [360, 320, -15], [400, 115, 20]];
    const freeR = [[432, 258], [260, 285], [330, 110], [160, 235], [300, 300], [215, 145], [410, 290]];
    let b = "";
    b += '<g data-part="zellplasma" class="part"><path d="' + blob + '" class="g-plasma-t"/></g>';
    b += '<g data-part="zellmembran" class="part"><path d="' + blob + '" class="g-membran-t"/></g>';
    b += '<g data-part="zellkern" class="part">' + kern(300, 205, 45) + "</g>";
    b += '<g data-part="er" class="part">' + erBands(erB) + '<path d="M352 158 H446 V246 H352 Z" class="hit-fill"/></g>';
    b += '<g data-part="mitochondrium" class="part">' + mit.map((m) => mito(m[0], m[1], m[2]) + hitC(m[0], m[1], 18)).join("") + "</g>";
    b += '<g data-part="ribosomen" class="part">' + erRibos(erB) + freeR.map((r) => '<circle cx="' + r[0] + '" cy="' + r[1] + '" r="2.8" class="g-ribo"/>' + hitC(r[0], r[1], 10)).join("") + "</g>";
    b += '<path data-part="zellmembran" d="' + blob + '" class="hit" stroke-width="16"/>';
    return {
      w: 600, h: 420, body: b,
      parts: {
        zellplasma: { anker: [240, 105], seite: "l" },
        mitochondrium: { anker: [175, 180], seite: "l" },
        zellkern: { anker: [272, 215], seite: "l" },
        er: { anker: [415, 175], seite: "r" },
        zellmembran: { anker: [478, 200], seite: "r" },
        ribosomen: { anker: [432, 258], seite: "r" }
      }
    };
  };

  /* ============ 9.4 Lichtmikroskop ============ */
  G.mikroskop = function () {
    // Tubus-Achse
    const P0 = [262, 128], u = [-Math.sin(0.61), -Math.cos(0.61)];
    const at = (d) => [P0[0] + u[0] * d, P0[1] + u[1] * d];
    const rot = -35;
    const tub = at(40), oku = at(102);
    let b = "";
    // Stativ (Fuß + Arm)
    b += '<g data-part="stativ" class="part">' +
      '<rect x="140" y="470" width="270" height="52" rx="14" class="g-metal-d"/>' +
      '<path d="M338 472 L392 472 L392 300 Q392 168 326 112 L286 146 Q338 196 338 300 Z" class="g-metal-d"/>' +
      '<path d="M236 104 L330 104 L340 156 L230 156 Z" class="g-metal-d"/>' +
      '<path d="M338 238 h40 v30 h-40 z" class="g-metal-d"/></g>';
    // Tubus und Okular
    b += '<g data-part="tubus" class="part"><g transform="translate(' + r1(tub[0]) + " " + r1(tub[1]) + ") rotate(" + rot + ')"><rect x="-17" y="-48" width="34" height="96" rx="3" class="g-metal"/></g></g>';
    b += '<g data-part="okular" class="part"><g transform="translate(' + r1(oku[0]) + " " + r1(oku[1]) + ") rotate(" + rot + ')"><rect x="-13" y="-16" width="26" height="34" rx="2" class="g-metal-d"/><rect x="-17" y="-24" width="34" height="10" rx="3" class="g-metal-d"/><ellipse cx="0" cy="-24" rx="14" ry="3" class="g-glass"/></g></g>';
    // Objektivrevolver
    b += '<g data-part="objektivrevolver" class="part"><path d="M222 156 L312 156 L302 182 L232 182 Z" class="g-metal"/><path d="M228 168 H306" class="g-line"/></g>';
    // Objektive (das mittlere ist die Trefferfläche)
    b += '<rect x="236" y="182" width="16" height="26" rx="2" class="g-metal"/><rect x="238" y="206" width="12" height="5" class="g-metal-d"/>';
    b += '<rect x="282" y="182" width="16" height="40" rx="2" class="g-metal"/><rect x="284" y="220" width="12" height="5" class="g-metal-d"/>';
    b += '<g data-part="objektiv" class="part"><rect x="258" y="182" width="16" height="33" rx="2" class="g-metal"/><rect x="260" y="213" width="12" height="5" class="g-metal-d"/><rect x="248" y="180" width="36" height="44" class="hit-fill"/></g>';
    // Objekttisch mit Objektträger, Deckglas und Klemmen
    b += '<g data-part="objekttisch" class="part"><path d="M170 254 H254 V268 H170 Z M278 254 H372 V268 H278 Z" class="g-stage"/>' +
      '<rect x="212" y="248" width="104" height="6" class="g-glass"/><rect x="256" y="245" width="22" height="3" class="g-glass-d"/>' +
      '<path d="M186 250 L226 246 M336 246 L362 250" class="g-clip"/><rect x="166" y="240" width="210" height="34" class="hit-fill"/></g>';
    // Kondensorblende
    b += '<g data-part="kondensorblende" class="part"><ellipse cx="266" cy="285" rx="30" ry="8" class="g-metal"/><ellipse cx="266" cy="285" rx="12" ry="3.5" class="g-dark"/><path d="M296 286 l22 6" class="g-line-thick"/><rect x="230" y="274" width="96" height="24" class="hit-fill"/></g>';
    // Lichtkegel
    b += '<path d="M252 440 L280 440 L274 292 L258 292 Z" class="g-beam"/>';
    // Beleuchtung
    b += '<g data-part="beleuchtung" class="part"><rect x="244" y="440" width="44" height="32" rx="4" class="g-metal"/><ellipse cx="266" cy="440" rx="22" ry="6" class="g-lamp"/></g>';
    // Beleuchtungsregler
    b += '<g data-part="beleuchtungsregler" class="part"><circle cx="186" cy="496" r="14" class="g-metal"/><path d="M186 484 V492" class="g-line-thick"/>' + hitC(186, 496, 20) + "</g>";
    // Grob- und Feintrieb (konzentrisch)
    b += '<g data-part="grobtrieb" class="part"><circle cx="365" cy="322" r="30" class="g-metal"/><path d="M365 292 v8 M395 322 h-8 M365 352 v-8 M335 322 h8" class="g-line"/></g>';
    b += '<g data-part="feintrieb" class="part"><circle cx="365" cy="322" r="14" class="g-metal-l"/><circle cx="365" cy="322" r="4" class="g-dark"/></g>';
    b += '<path data-part="grobtrieb" d="M365 288 a34 34 0 1 0 0.1 0 Z M365 306 a16 16 0 1 1 -0.1 0 Z" fill-rule="evenodd" class="hit-fill"/>';
    b += '<circle data-part="feintrieb" cx="365" cy="322" r="15" class="hit-fill"/>';
    return {
      w: 520, h: 560, body: b,
      parts: {
        okular: { anker: oku, seite: "l" },
        tubus: { anker: tub, seite: "l" },
        objektiv: { anker: [262, 214], seite: "l" },
        objekttisch: { anker: [190, 261], seite: "l" },
        kondensorblende: { anker: [240, 287], seite: "l" },
        beleuchtung: { anker: [250, 456], seite: "l" },
        beleuchtungsregler: { anker: [178, 500], seite: "l" },
        objektivrevolver: { anker: [306, 168], seite: "r" },
        grobtrieb: { anker: [384, 300], seite: "r" },
        feintrieb: { anker: [368, 326], seite: "r" },
        stativ: { anker: [390, 410], seite: "r" }
      }
    };
  };

  /* ============ 9.3 Zellzeichnungen (300 × 220) ============ */
  G.zMund = function () {
    let b = '<path d="M60 70 C90 30 170 40 210 50 C260 60 262 110 248 140 C236 172 190 188 140 180 C90 175 50 160 46 120 C44 100 50 82 60 70 Z" class="g-plasma-t"/>' +
      '<path d="M60 70 C90 30 170 40 210 50 C260 60 262 110 248 140 C236 172 190 188 140 180 C90 175 50 160 46 120 C44 100 50 82 60 70 Z" class="g-membran-t"/>';
    const dots = [[90, 90], [110, 140], [180, 80], [200, 150], [220, 110], [80, 130], [160, 160], [130, 70], [190, 120]];
    b += dots.map((d) => '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="2" class="g-ribo"/>').join("");
    b += '<circle cx="150" cy="112" r="15" class="g-kern"/>';
    return { w: 300, h: 220, body: b };
  };
  G.zZwiebel = function () {
    let b = "";
    // Nachbarzellen angeschnitten
    b += '<rect x="-20" y="20" width="60" height="80" class="g-wall"/><rect x="-14" y="27" width="48" height="66" class="g-plasma-p"/>';
    b += '<rect x="260" y="120" width="60" height="80" class="g-wall"/><rect x="266" y="127" width="48" height="66" class="g-plasma-p"/>';
    b += '<rect x="40" y="60" width="220" height="100" class="g-wall"/><rect x="48" y="68" width="204" height="84" class="g-plasma-p"/><rect x="48" y="68" width="204" height="84" class="g-membran"/>';
    b += '<rect x="62" y="76" width="178" height="68" rx="20" class="g-vak"/>';
    b += kern(232, 128, 12);
    return { w: 300, h: 220, body: b };
  };
  G.zBlatt = function () {
    const P = [[60, 40], [240, 34], [262, 110], [238, 186], [64, 190], [40, 112]];
    const I = scaleP(P, 0.93, [150, 112]);
    let b = '<path d="' + pathOf(P) + '" class="g-wall"/><path d="' + pathOf(I) + '" class="g-plasma-p"/><path d="' + pathOf(I) + '" class="g-membran"/>';
    b += '<ellipse cx="158" cy="112" rx="66" ry="46" class="g-vak"/>';
    const c = [[80, 60, -10], [120, 52, 0], [165, 50, 0], [208, 54, 8], [238, 90, 70], [240, 135, 100], [205, 172, -5], [160, 176, 0], [115, 174, 0], [72, 160, 20], [60, 112, 90]];
    b += c.map((x) => chloro(x[0], x[1], x[2], 0.62)).join("");
    b += kern(82, 108, 14);
    return { w: 300, h: 220, body: b };
  };
  G.zNerv = function () {
    let b = '<path d="M90 110 L70 70 M70 70 L55 50 M70 70 L82 46 M88 100 L40 96 M40 96 L22 84 M40 96 L24 112 M98 130 L70 170 M70 170 L52 182 M70 170 L76 196 M110 86 L118 44 M118 44 L104 26 M118 44 L136 30" class="g-nerv-s"/>';
    b += '<path d="M120 110 C170 108 210 112 290 104" class="g-nerv-axon"/>';
    b += '<path d="M78 96 C82 76 112 72 124 90 C140 100 140 124 124 134 C108 146 84 142 80 124 C76 112 76 104 78 96 Z" class="g-plasma-t"/>';
    b += '<path d="M78 96 C82 76 112 72 124 90 C140 100 140 124 124 134 C108 146 84 142 80 124 C76 112 76 104 78 96 Z" class="g-membran-t"/>';
    b += '<circle cx="106" cy="110" r="11" class="g-kern"/>';
    return { w: 300, h: 220, body: b };
  };
  G.zMuskel = function () {
    const d = "M20 110 C80 80 220 80 280 110 C220 140 80 140 20 110 Z";
    let b = '<path d="' + d + '" class="g-plasma-t"/><path d="' + d + '" class="g-membran-t"/>';
    b += '<ellipse cx="150" cy="110" rx="18" ry="8" class="g-kern"/>';
    return { w: 300, h: 220, body: b };
  };
  G.zKnorpel = function () {
    let b = '<rect x="10" y="10" width="280" height="200" rx="30" class="g-matrix"/>';
    b += '<ellipse cx="110" cy="100" rx="40" ry="32" class="g-lacuna"/>';
    b += '<ellipse cx="104" cy="98" rx="30" ry="24" class="g-plasma-t"/><ellipse cx="104" cy="98" rx="30" ry="24" class="g-membran-t"/><circle cx="104" cy="98" r="10" class="g-kern"/>';
    b += '<ellipse cx="200" cy="136" rx="36" ry="30" class="g-lacuna"/>';
    b += '<ellipse cx="196" cy="134" rx="26" ry="22" class="g-plasma-t"/><ellipse cx="196" cy="134" rx="26" ry="22" class="g-membran-t"/><circle cx="196" cy="134" r="9" class="g-kern"/>';
    return { w: 300, h: 220, body: b };
  };
  G.zBluete = function () {
    const O = "M150 20 C190 20 230 110 230 170 L230 195 L70 195 L70 170 C70 110 110 20 150 20 Z";
    const I = "M150 31 C184 31 220 112 220 170 L220 186 L80 186 L80 170 C80 112 116 31 150 31 Z";
    let b = '<path d="' + O + '" class="g-wall"/><path d="' + I + '" class="g-plasma-p"/><path d="' + I + '" class="g-membran"/>';
    b += '<path d="M150 44 C178 44 208 116 208 166 L208 176 L92 176 L92 166 C92 116 122 44 150 44 Z" class="g-vak-rot"/>';
    b += kern(150, 182, 7);
    return { w: 300, h: 220, body: b };
  };
  G.zLeitung = function () {
    let b = '<rect x="10" y="78" width="280" height="64" class="g-wall"/><rect x="10" y="88" width="280" height="44" class="g-plasma-p"/>';
    b += '<path d="M10 88 H290 M10 132 H290" class="g-membran"/>';
    for (let x = 30; x < 290; x += 30) b += '<rect x="' + (x - 4) + '" y="84" width="8" height="52" rx="3" class="g-wall-ring"/>';
    return { w: 300, h: 220, body: b };
  };

  /* ============ 9.5 Grünalgen (260 × 260) ============ */
  G.chlamydomonas = function () {
    let b = '<path d="M118 70 C100 40 80 30 60 12 M142 70 C160 40 180 30 200 12" class="g-geissel"/>';
    b += '<ellipse cx="130" cy="150" rx="62" ry="82" class="g-algae-cell"/>';
    b += '<path d="M76 130 C74 200 104 228 130 228 C156 228 186 200 184 130 C176 150 162 186 130 186 C98 186 84 150 76 130 Z" class="g-chl"/>';
    b += '<circle cx="130" cy="128" r="18" class="g-kern"/>';
    b += '<ellipse cx="168" cy="100" rx="9" ry="6" class="g-eye"/>';
    return { w: 260, h: 260, body: b };
  };
  G.gonium = function () {
    let b = '<rect x="22" y="22" width="216" height="216" rx="40" class="g-gallerte"/>';
    const cells = [];
    [[106, 106], [154, 106], [106, 154], [154, 154]].forEach((c) => cells.push(c));
    const ring = [[58, 70], [100, 50], [150, 50], [192, 70], [210, 108], [210, 152], [192, 190], [150, 210], [100, 210], [58, 190], [40, 152], [40, 108]];
    ring.forEach((c) => cells.push(c));
    cells.forEach((c) => {
      const dx = c[0] - 130, dy = c[1] - 130, len = Math.hypot(dx, dy) || 1;
      const ex = c[0] + (dx / len) * 22, ey = c[1] + (dy / len) * 22;
      b += '<path d="M' + c[0] + " " + c[1] + " L" + r1(ex - dy / len * 5) + " " + r1(ey + dx / len * 5) + " M" + c[0] + " " + c[1] + " L" + r1(ex + dy / len * 5) + " " + r1(ey - dx / len * 5) + '" class="g-geissel-s"/>';
      b += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="15" ry="17" class="g-algae-cell"/><ellipse cx="' + c[0] + '" cy="' + (c[1] + 4) + '" rx="11" ry="10" class="g-chl"/>';
    });
    return { w: 260, h: 260, body: b };
  };
  G.volvox = function () {
    let b = '<circle cx="120" cy="120" r="102" class="g-gallerte"/>';
    const n = 46;
    const ptsA = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      ptsA.push([120 + Math.cos(a) * 96, 120 + Math.sin(a) * 96]);
    }
    for (let i = 0; i < n; i++) {
      const p = ptsA[i], q = ptsA[(i + 1) % n];
      b += '<path d="M' + r1(p[0]) + " " + r1(p[1]) + " L" + r1(q[0]) + " " + r1(q[1]) + '" class="g-bruecke"/>';
    }
    // Zellen der Vorderseite (versetzt)
    const front = [[80, 70], [120, 56], [160, 70], [60, 110], [100, 104], [140, 100], [180, 110], [70, 150], [112, 150], [152, 146], [176, 160], [100, 186], [140, 188]];
    front.forEach((p, i) => { if (i < front.length - 1 && i % 3 !== 2) { const q = front[i + 1]; b += '<path d="M' + p[0] + " " + p[1] + " L" + q[0] + " " + q[1] + '" class="g-bruecke"/>'; } });
    ptsA.forEach((p) => { b += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="4" class="g-chl"/>'; });
    front.forEach((p) => { b += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.3" class="g-chl"/>'; });
    // Tochterkugeln
    [[96, 118, 20], [146, 130, 24], [118, 168, 16], [150, 82, 14]].forEach((t) => { b += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="' + t[2] + '" class="g-tochter"/>'; });
    // Lupenausschnitt
    b += '<path d="M190 190 L206 206" class="g-line-thick"/>';
    b += '<circle cx="222" cy="222" r="34" class="g-lupe"/>';
    [[208, 210], [236, 210], [208, 236], [236, 236]].forEach((p) => { b += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" class="g-chl"/>'; });
    b += '<path d="M215 210 H229 M215 236 H229 M208 217 V229 M236 217 V229" class="g-bruecke-d"/>';
    return { w: 260, h: 260, body: b };
  };

  /* ============ 9.6 Systemebenen (160 × 160) ============ */
  G.sysMagen = function () {
    return { w: 160, h: 160, body: '<path d="M62 14 C62 40 52 50 44 66 C30 96 44 140 92 140 C130 140 146 112 138 86 C132 66 112 62 100 74 C90 84 84 70 84 50 L84 14 Z" class="g-organ"/><path d="M60 100 C80 120 110 118 124 100" class="g-organ-s"/>' };
  };
  G.sysDarmzelle = function () {
    let top = "M50 34";
    for (let x = 50; x < 110; x += 6) top += " L" + (x + 3) + " 24 L" + (x + 6) + " 34";
    return { w: 160, h: 160, body: '<path d="' + top + ' L110 140 L50 140 Z" class="g-plasma-t"/><path d="' + top + ' L110 140 L50 140 Z" class="g-membran-t"/><ellipse cx="80" cy="106" rx="13" ry="17" class="g-kern"/>' };
  };
  G.sysSchleimhaut = function () {
    let b = '<rect x="10" y="110" width="140" height="36" rx="4" class="g-muskel"/>';
    for (let x = 16; x < 130; x += 25) b += '<path d="M' + x + " 112 L" + x + " 46 C" + x + " 30 " + (x + 18) + " 30 " + (x + 18) + " 46 L" + (x + 18) + ' 112 Z" class="g-zotte"/>';
    return { w: 160, h: 160, body: b };
  };
  G.sysMagenDarm = function () {
    return { w: 160, h: 160, body: '<path d="M46 8 C46 26 38 34 32 44 C22 64 32 88 62 88 C88 88 98 70 92 54 C88 42 74 40 66 48 C58 56 56 46 56 34 L56 8 Z" class="g-organ"/>' +
      '<path d="M88 82 C110 90 128 96 128 108 C128 120 30 112 30 124 C30 136 130 128 130 140 C130 152 40 150 34 150" class="g-darm"/>' };
  };

  /* Stufenleiter Mensch (120 × 120) */
  G.herzZelle = function () {
    return { w: 120, h: 120, body: '<path d="M34 44 H86 L106 60 L86 76 H34 L14 60 Z" class="g-herzzelle"/><path d="M44 48 V72 M54 48 V72 M66 48 V72 M76 48 V72" class="g-streifen"/><ellipse cx="60" cy="60" rx="8" ry="5" class="g-kern"/>' };
  };
  G.herzGewebe = function () {
    let b = "";
    [[10, 22], [50, 22], [-30, 52], [30, 52], [70, 52], [10, 82], [50, 82]].forEach((p) => {
      b += '<g transform="translate(' + p[0] + " " + p[1] + ')"><path d="M6 8 H44 L54 16 L44 24 H6 L0 16 Z" class="g-herzzelle"/><path d="M14 10 V22 M22 10 V22 M34 10 V22" class="g-streifen"/><ellipse cx="26" cy="16" rx="4" ry="3" class="g-kern"/></g>';
    });
    return { w: 120, h: 120, body: b };
  };
  G.herz = function () {
    return { w: 120, h: 120, body: '<path d="M60 104 C30 84 14 66 14 46 C14 30 26 20 40 20 C50 20 56 26 60 34 C64 26 70 20 80 20 C94 20 106 30 106 46 C106 66 90 84 60 104 Z" class="g-organ"/><path d="M60 34 C58 50 64 66 60 84" class="g-organ-s"/>' };
  };
  G.herzKreislauf = function () {
    return { w: 120, h: 120, body: '<path d="M54 46 C30 30 16 50 16 70 C16 96 40 110 60 110 C80 110 104 96 104 70 C104 50 90 30 66 46" class="g-gefaess-r"/>' +
      '<path d="M54 62 C40 56 30 64 30 76 C30 90 46 98 60 98 C74 98 90 90 90 76 C90 64 80 56 66 62" class="g-gefaess-b"/>' +
      '<path d="M60 74 C44 64 36 56 36 46 C36 38 42 32 49 32 C54 32 57 35 60 39 C63 35 66 32 71 32 C78 32 84 38 84 46 C84 56 76 64 60 74 Z" class="g-organ"/>' };
  };
  G.mensch = function () {
    return { w: 120, h: 120, body: '<circle cx="60" cy="18" r="11" class="g-person"/><path d="M44 34 H76 C82 34 86 38 86 44 V70 C86 74 80 74 80 70 V48 H78 V108 C78 114 68 114 68 108 V76 H52 V108 C52 114 42 114 42 108 V48 H40 V70 C40 74 34 74 34 70 V44 C34 38 38 34 44 34 Z" class="g-person"/>' };
  };
  /* Stufenleiter Pflanze */
  G.blattZelle = function () {
    let b = '<rect x="20" y="24" width="80" height="72" rx="4" class="g-wall"/><rect x="26" y="30" width="68" height="60" class="g-plasma-p"/><rect x="38" y="42" width="44" height="36" rx="8" class="g-vak"/>';
    [[32, 36, 0], [60, 34, 0], [88, 40, 90], [88, 72, 90], [62, 86, 0], [34, 84, 0], [30, 60, 90]].forEach((c) => { b += chloro(c[0], c[1], c[2], 0.35); });
    b += kern(80, 60, 6);
    return { w: 120, h: 120, body: b };
  };
  G.blattGewebe = function () {
    let b = "";
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const x = 8 + c * 36, y = 8 + r * 36;
      b += '<rect x="' + x + '" y="' + y + '" width="34" height="34" class="g-wall"/><rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="28" height="28" class="g-plasma-p"/>';
      b += chloro(x + 10, y + 9, 0, 0.28) + chloro(x + 24, y + 25, 0, 0.28) + chloro(x + 9, y + 24, 90, 0.28);
    }
    return { w: 120, h: 120, body: b };
  };
  G.laubblatt = function () {
    return { w: 120, h: 120, body: '<path d="M20 100 C20 50 50 16 104 14 C104 70 70 100 20 100 Z" class="g-leaf"/><path d="M20 100 L96 22 M44 76 L44 52 M44 76 L68 76 M62 58 L62 38 M62 58 L82 58" class="g-leaf-s"/><path d="M20 100 L10 110" class="g-leaf-s"/>' };
  };
  G.baum = function () {
    return { w: 120, h: 120, body: '<path d="M54 112 L56 70 L64 70 L66 112 Z" class="g-stamm"/><circle cx="60" cy="46" r="30" class="g-leaf"/><circle cx="36" cy="60" r="20" class="g-leaf"/><circle cx="84" cy="60" r="20" class="g-leaf"/>' };
  };

  /* ============ Lebendig-Check-Objekte (100 × 100) ============ */
  G.oHund = function () {
    return { w: 100, h: 100, body: '<path d="M22 50 H66 L72 34 L80 30 L88 36 L90 46 L80 50 L74 60 V84 H68 V64 H32 V84 H26 V62 C18 60 14 54 12 44 L18 46 C20 48 20 50 22 50 Z" class="g-obj"/><circle cx="82" cy="38" r="1.8" class="g-obj-eye"/>' };
  };
  G.oSonnenblume = function () {
    let b = '<path d="M50 54 V96" class="g-stem"/><path d="M50 78 C40 70 30 72 26 78 C34 84 44 82 50 78 Z" class="g-leaf"/>';
    for (let i = 0; i < 12; i++) b += '<ellipse cx="50" cy="16" rx="6" ry="13" transform="rotate(' + i * 30 + ' 50 34)" class="g-petal"/>';
    b += '<circle cx="50" cy="34" r="13" class="g-seed"/>';
    return { w: 100, h: 100, body: b };
  };
  G.oRegenwurm = function () {
    let b = '<path d="M10 64 C24 40 40 40 50 58 C60 76 76 76 90 52" class="g-wurm"/>';
    b += '<path d="M28 47 l2 6 M60 70 l-1 6 M74 66 l-2 6 M40 48 l0 6" class="g-wurm-s"/>';
    return { w: 100, h: 100, body: b };
  };
  G.oVenus = function () {
    let b = '<path d="M50 96 V58" class="g-stem"/>';
    b += '<path d="M50 58 C28 54 18 36 22 20 C38 26 48 40 50 58 Z" class="g-leaf"/><path d="M50 58 C72 54 82 36 78 20 C62 26 52 40 50 58 Z" class="g-trap"/>';
    b += '<path d="M22 20 l-5 -5 M27 23 l-3 -7 M33 27 l-1 -7 M78 20 l5 -5 M73 23 l3 -7 M67 27 l1 -7" class="g-leaf-s"/>';
    return { w: 100, h: 100, body: b };
  };
  G.oMuschel = function () {
    return { w: 100, h: 100, body: '<path d="M14 56 C14 30 34 18 50 18 C66 18 86 30 86 56 C70 64 30 64 14 56 Z" class="g-shell"/><path d="M14 60 C30 70 70 70 86 60 C80 76 66 84 50 84 C34 84 20 76 14 60 Z" class="g-shell"/><path d="M50 22 V58 M32 26 L40 58 M68 26 L60 58" class="g-shell-s"/>' };
  };
  G.oRoboter = function () {
    return { w: 100, h: 100, body: '<path d="M50 8 V18" class="g-line-thick"/><circle cx="50" cy="7" r="3" class="g-obj"/><rect x="30" y="18" width="40" height="26" rx="6" class="g-robot"/><circle cx="41" cy="31" r="4" class="g-obj-eye-l"/><circle cx="59" cy="31" r="4" class="g-obj-eye-l"/><rect x="26" y="48" width="48" height="30" rx="5" class="g-robot"/><path d="M26 54 L14 70 M74 54 L86 70 M38 78 V94 M62 78 V94" class="g-robot-s"/>' };
  };
  G.oKerze = function () {
    return { w: 100, h: 100, body: '<rect x="38" y="46" width="24" height="48" rx="3" class="g-wachs"/><path d="M50 46 V38" class="g-line"/><path d="M50 8 C60 20 62 30 50 40 C38 30 40 20 50 8 Z" class="g-flamme"/><path d="M50 22 C54 28 54 32 50 36 C46 32 46 28 50 22 Z" class="g-flamme-in"/>' };
  };
  G.oEis = function () {
    return { w: 100, h: 100, body: '<rect x="8" y="8" width="84" height="12" rx="3" class="g-dach"/><path d="M18 20 L24 74 L30 20 Z M36 20 L44 92 L52 20 Z M58 20 L63 60 L68 20 Z M72 20 L78 80 L84 20 Z" class="g-eis"/>' };
  };
  G.oAuto = function () {
    return { w: 100, h: 100, body: '<path d="M8 66 V54 C8 50 12 48 16 48 L28 34 H66 L80 48 H86 C90 48 92 52 92 56 V66 Z" class="g-auto"/><path d="M32 38 H48 V48 H24 Z M52 38 H64 L74 48 H52 Z" class="g-auto-win"/><circle cx="28" cy="68" r="10" class="g-reifen"/><circle cx="72" cy="68" r="10" class="g-reifen"/>' };
  };

  /* ============ Kennzeichen-Rad (Thema 1, 300 × 300) ============ */
  G.kennzeichenRad = function () {
    const ids = ["wachstum", "stoffwechsel", "fortpflanzung", "bewegung", "reizbarkeit"];
    const lab = ["W", "S", "F", "B", "R"];
    const names = ["Wachstum", "Stoffwechsel", "Fortpflanzung", "Bewegung", "Reizbarkeit"];
    const cx = 150, cy = 150, R = 140, r = 52;
    let b = "";
    const parts = {};
    ids.forEach((id, i) => {
      const a0 = (-90 + i * 72 + 2) * Math.PI / 180, a1 = (-90 + (i + 1) * 72 - 2) * Math.PI / 180;
      const p = (rad, a) => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
      const A = p(R, a0), B = p(R, a1), Cc = p(r, a1), D = p(r, a0);
      const d = "M" + r1(A[0]) + " " + r1(A[1]) + " A" + R + " " + R + " 0 0 1 " + r1(B[0]) + " " + r1(B[1]) + " L" + r1(Cc[0]) + " " + r1(Cc[1]) + " A" + r + " " + r + " 0 0 0 " + r1(D[0]) + " " + r1(D[1]) + " Z";
      const am = (a0 + a1) / 2, L0 = p(96, am), L = [L0[0], L0[1] - 6], N = [L0[0], L0[1] + 22];
      b += '<g data-part="' + id + '" class="part"><path d="' + d + '" class="g-seg g-seg' + i + '"/>' +
        '<text x="' + r1(L[0]) + '" y="' + r1(L[1] + 4) + '" class="g-seg-l" text-anchor="middle">' + lab[i] + '</text>' +
        '<text x="' + r1(N[0]) + '" y="' + r1(N[1] + 4) + '" class="g-seg-n" text-anchor="middle">' + names[i] + "</text></g>";
      parts[id] = { anker: L, seite: L[0] < cx ? "l" : "r" };
    });
    b += '<circle cx="150" cy="150" r="46" class="g-center"/><text x="150" y="146" class="g-center-t" text-anchor="middle">Lebewesen?</text><text x="150" y="164" class="g-center-s" text-anchor="middle">alle 5!</text>';
    return { w: 300, h: 300, body: b, parts: parts };
  };

  /* ============ Themen-Icons (48 × 48, currentColor) ============ */
  const ICON = {
    kennzeichen: '<path d="M24 44 V22" /><path d="M24 26 C24 16 16 10 8 10 C8 20 14 26 24 26 Z"/><path d="M24 22 C24 12 32 6 40 6 C40 16 34 22 24 22 Z"/>',
    organisation: '<rect x="4" y="34" width="10" height="10" rx="2"/><rect x="18" y="24" width="10" height="20" rx="2"/><rect x="32" y="8" width="12" height="36" rx="2"/>',
    vergleich: '<path d="M6 12 L18 8 L22 20 L18 34 L6 36 L3 22 Z"/><circle cx="12" cy="22" r="3"/><circle cx="35" cy="24" r="10"/><circle cx="35" cy="24" r="3"/>',
    organellen: '<circle cx="24" cy="24" r="19"/><circle cx="20" cy="22" r="6"/><ellipse cx="33" cy="15" rx="4" ry="2" transform="rotate(30 33 15)"/><ellipse cx="32" cy="33" rx="4" ry="2" transform="rotate(-30 32 33)"/>',
    vielzeller: '<circle cx="8" cy="24" r="5"/><path d="M16 24 H20" /><circle cx="28" cy="20" r="3"/><circle cx="34" cy="20" r="3"/><circle cx="28" cy="28" r="3"/><circle cx="34" cy="28" r="3"/><circle cx="31" cy="24" r="13"/>',
    mikroskop: '<path d="M10 44 H38"/><path d="M30 44 C38 38 38 24 30 18"/><path d="M16 6 L24 4 L30 22 L22 24 Z"/><path d="M22 24 L22 30"/><path d="M14 32 H32"/>'
  };

  /* ============ Rendering ============ */
  function layout(g, opts) {
    const minGap = opts.minGap || 38;
    const out = [];
    ["l", "r"].forEach((side) => {
      const list = Object.keys(g.parts).filter((k) => g.parts[k].seite === side && (!opts.only || opts.only.indexOf(k) >= 0))
        .map((k) => ({ id: k, ax: g.parts[k].anker[0], ay: g.parts[k].anker[1], side: side }))
        .sort((a, b) => a.ay - b.ay);
      let prev = -Infinity;
      list.forEach((it) => { it.ly = Math.max(it.ay, prev + minGap, 22); prev = it.ly; });
      let next = Infinity;
      for (let i = list.length - 1; i >= 0; i--) { list[i].ly = Math.min(list[i].ly, next - minGap, g.h - 22); next = list[i].ly; }
      list.forEach((it) => out.push(it));
    });
    return out;
  }

  /* opts.mode: "plain" | "numbers" | "names"; opts.only: Teil-IDs für Markierungen;
     opts.cls: zusätzliche CSS-Klasse; opts.title: zugänglicher Titel */
  function svg(name, opts) {
    opts = opts || {};
    const g = G[name]();
    const mode = opts.mode || "plain";
    let vb = "0 0 " + g.w + " " + g.h;
    let overlay = "";
    let order = [];
    if ((mode === "numbers" || mode === "names") && g.parts) {
      const L = layout(g, opts);
      order = L.map((x) => x.id);
      if (mode === "numbers") {
        L.forEach((it, i) => {
          const lx = it.side === "l" ? 24 : g.w - 24;
          const ex = it.side === "l" ? lx + 17 : lx - 17;
          overlay += '<g class="marker" data-marker="' + it.id + '"><path d="M' + r1(it.ax) + " " + r1(it.ay) + " L" + r1(ex) + " " + r1(it.ly) + '" class="g-labelline"/><circle cx="' + r1(it.ax) + '" cy="' + r1(it.ay) + '" r="3.5" class="g-labeldot"/>' +
            '<circle cx="' + lx + '" cy="' + r1(it.ly) + '" r="17" class="g-num"/><text x="' + lx + '" y="' + r1(it.ly + 6) + '" text-anchor="middle" class="g-num-t">' + (i + 1) + "</text></g>";
        });
      } else {
        const m = opts.margin || 150;
        vb = -m + " 0 " + (g.w + 2 * m) + " " + g.h;
        L.forEach((it) => {
          const lx = it.side === "l" ? -6 : g.w + 6;
          const txt = (opts.labels && opts.labels[it.id]) || it.id;
          overlay += '<g class="marker"><path d="M' + r1(it.ax) + " " + r1(it.ay) + " L" + (it.side === "l" ? 0 : g.w) + " " + r1(it.ly) + '" class="g-labelline"/><circle cx="' + r1(it.ax) + '" cy="' + r1(it.ay) + '" r="3.5" class="g-labeldot"/>' +
            '<text x="' + lx + '" y="' + r1(it.ly + 6) + '" text-anchor="' + (it.side === "l" ? "end" : "start") + '" class="g-name-t">' + txt + "</text></g>";
        });
      }
    }
    const title = opts.title ? "<title>" + opts.title + "</title>" : "";
    const role = opts.title ? ' role="img" aria-label="' + opts.title + '"' : ' aria-hidden="true"';
    const html = '<svg class="gfx ' + (opts.cls || "") + '" viewBox="' + vb + '"' + role + ">" + title + '<g class="body">' + g.body + "</g>" + overlay + "</svg>";
    return opts.withOrder ? { html: html, order: order, parts: g.parts } : html;
  }

  function icon(themeId) {
    return '<svg class="ticon" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + (ICON[themeId] || "") + "</svg>";
  }

  function partsOf(name) { const g = G[name](); return g.parts ? Object.keys(g.parts) : []; }
  function dataPartsIn(name) {
    const g = G[name](); const set = {};
    g.body.replace(/data-part="([^"]+)"/g, (m, p) => { set[p] = true; return m; });
    return Object.keys(set);
  }

  const Graphics = { G: G, svg: svg, icon: icon, layout: layout, partsOf: partsOf, dataPartsIn: dataPartsIn, list: () => Object.keys(G) };
  root.Graphics = Graphics;
  if (typeof module !== "undefined" && module.exports) module.exports = Graphics;
})(typeof window !== "undefined" ? window : globalThis);
