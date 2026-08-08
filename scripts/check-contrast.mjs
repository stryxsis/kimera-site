/**
 * Verifica dei contrasti WCAG su ogni coppia di colori realmente usata dal design system.
 *
 * Perché è uno script e non un controllo a occhio: la regola «l'oro non va su fondo
 * chiaro» è vera per aritmetica (2.33), non per gusto, e con due superfici e un
 * accento che cambia in base alla superficie è facilissimo introdurre una coppia
 * sbagliata mesi dopo, in una pagina qualsiasi, senza accorgersene.
 *
 *   npm run check:contrast
 *
 * Le soglie: 4.5 per il testo corrente (WCAG 1.4.3 AA), 3.0 per il testo grande e
 * per i confini degli elementi d'interfaccia necessari a riconoscerli (1.4.11).
 * I bordi puramente decorativi sono elencati come informativi, senza soglia.
 */

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const parse = (hex) => {
  const n = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};

const lum = (hex) => {
  const [r, g, b] = parse(hex).map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/** Colore semitrasparente appiattito sul suo fondo: è ciò che l'occhio vede davvero. */
const over = (hex, alpha, bg) => {
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(bg);
  const mix = (a, b) => Math.round(a * alpha + b * (1 - alpha));
  return (
    '#' +
    [mix(r1, r2), mix(g1, g2), mix(b1, b2)].map((v) => v.toString(16).padStart(2, '0')).join('')
  );
};

// ── Token (devono restare allineati a src/styles/global.css) ───────────────
const c = {
  ground: '#071F3D',
  panel: '#0A2546',
  panelLine: '#164668',
  cream: '#FBF7EB',
  ink: '#0A2546',
  inkSoft: '#103E5D',
  inkMuted: '#4A5A6B',
  onDark: '#FBF7EB',
  onDarkSoft: '#D5DEE7',
  onDarkMuted: '#B6C4D4',
  gold: '#BDA15D',
  goldBright: '#D6B86C',
  teal: '#2B9EB0',
  tealInk: '#1B7087',
  controlLineDark: '#6F7D8B',
  controlLineLight: '#7C8590',
  warningDark: '#E8896E',
  warningLight: '#9C3C26',
};

/** [contesto, uso, primo piano, fondo, soglia | null se informativo] */
const pairs = [
  // ── surface-dark ──────────────────────────────────────────────────────
  ['dark', 'testo corrente', c.onDark, c.ground, 4.5],
  ['dark', 'elenchi e voci incluse', c.onDarkSoft, c.ground, 4.5],
  ['dark', 'testo secondario', c.onDarkMuted, c.ground, 4.5],
  ['dark', 'accento ed etichette', c.goldBright, c.ground, 4.5],
  ['dark', 'anello di focus', c.goldBright, c.ground, 3.0],
  ['dark', 'linea di rotta e nodi', c.teal, c.ground, 3.0],
  ['dark', 'bordo dei campi di modulo', c.controlLineDark, c.panel, 3.0],
  ['dark', 'titolo del callout di avviso (FASE 5)', c.warningDark, c.ground, 4.5],

  // ── surface-panel ─────────────────────────────────────────────────────
  ['panel', 'testo corrente', c.onDark, c.panel, 4.5],
  ['panel', 'elenchi e voci incluse', c.onDarkSoft, c.panel, 4.5],
  ['panel', 'testo secondario', c.onDarkMuted, c.panel, 4.5],
  ['panel', 'accento ed etichette', c.goldBright, c.panel, 4.5],
  ['panel', 'linea di rotta e nodi', c.teal, c.panel, 3.0],
  ['panel', 'titolo del callout di avviso (FASE 5)', c.warningDark, c.panel, 4.5],

  // ── surface-light ─────────────────────────────────────────────────────
  ['light', 'testo corrente', c.ink, c.cream, 4.5],
  ['light', 'lead', c.inkSoft, c.cream, 4.5],
  ['light', 'testo secondario', c.inkMuted, c.cream, 4.5],
  ['light', 'accento ed etichette', c.tealInk, c.cream, 4.5],
  ['light', 'anello di focus', c.tealInk, c.cream, 3.0],
  ['light', 'bordo dei campi di modulo', c.controlLineLight, c.cream, 3.0],
  ['light', 'titolo del callout di avviso (FASE 5)', c.warningLight, c.cream, 4.5],

  // ── Componenti indipendenti dalla superficie ──────────────────────────
  ['btn', 'testo del bottone primario su oro', c.ground, c.gold, 4.5],
  ['btn', 'testo del bottone primario su oro chiaro (hover)', c.ground, c.goldBright, 4.5],
  ['btn', 'skip link: testo su oro', c.ground, c.gold, 4.5],
  ['badge', 'badge pieno: testo su oro', c.ground, c.gold, 4.5],
  ['lang', 'lingua attiva su scuro: testo su oro chiaro', c.ground, c.goldBright, 4.5],
  ['lang', 'lingua attiva su chiaro: testo su navy', c.cream, c.ink, 4.5],

  // ── Informativi: decorazioni che non veicolano informazione da sole ───
  ['info', 'filetti di separazione su scuro', over(c.cream, 0.15, c.ground), c.ground, null],
  ['info', 'filetti di separazione su chiaro', over(c.ink, 0.16, c.cream), c.cream, null],
  ['info', 'bordo delle card su scuro', c.panelLine, c.ground, null],
  ['info', 'casella della spunta su scuro', over(c.goldBright, 0.7, c.ground), c.ground, null],
  ['info', 'casella della spunta su chiaro', over(c.tealInk, 0.7, c.cream), c.cream, null],
];

const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large/UI' : 'sotto soglia');

let failures = 0;
console.log('CONTESTO  ESITO  RATIO  SOGLIA  USO');
console.log('─'.repeat(78));

for (const [context, use, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  if (min === null) {
    console.log(`${context.padEnd(9)} info   ${r.toFixed(2).padStart(5)}     —    ${use}`);
    continue;
  }
  const ok = r >= min;
  if (!ok) failures++;
  console.log(
    `${context.padEnd(9)} ${ok ? 'OK  ' : 'FAIL'}   ${r.toFixed(2).padStart(5)}   ${String(min).padStart(4)}  ${use} (${grade(r)})`,
  );
}

const checked = pairs.filter((p) => p[4] !== null).length;
console.log('─'.repeat(78));
console.log(`${checked} coppie verificate — ${failures} sotto soglia.`);
process.exit(failures ? 1 : 0);
