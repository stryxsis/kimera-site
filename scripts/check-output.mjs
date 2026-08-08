/**
 * Controlli sull'HTML generato, da eseguire DOPO `npm run build`.
 *
 *   npm run check:output
 *
 * Verificano invarianti che non si vedono nel codice sorgente e che sono già
 * sfuggite due volte in questo progetto:
 *
 * 1. ASTERISCHI VAGANTI. Il copy inglese marca i termini burocratici italiani con
 *    `*permesso di soggiorno*` (docs/glossary.md). L'interpolazione `{}` di Astro
 *    stampa testo puro: se un template dimentica renderEmphasis(), gli asterischi
 *    finiscono a video e nessuno se ne accorge finché non guarda la pagina.
 * 2. UN SOLO <h1> per pagina.
 * 3. NESSUNA SOTTORISORSA DA DOMINI TERZI. I font sono self-hosted apposta: basta un
 *    @import distratto per rimettere l'IP di ogni visitatore nelle mani di un terzo.
 *    Attenzione: si controllano solo le risorse che il browser scarica DA SOLO
 *    (script, link, img, iframe, url() nei CSS). I <a href> verso siti esterni sono
 *    voluti — ogni affermazione procedurale rimanda a una fonte ufficiale
 *    (Universitaly, CIMEA, Agenzia delle Entrate) ed è un vincolo di prodotto.
 * 4. Ogni pagina dichiara `lang`.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

if (!existsSync(dist)) {
  console.error('✗ dist/ non esiste. Esegui prima `npm run build`.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith('.html') ? [full] : [];
  });

// Elementi le cui risorse il browser scarica da solo, senza che l'utente clicchi.
// <a> è deliberatamente escluso: i link alle fonti ufficiali sono un vincolo di prodotto.
const SUBRESOURCE = /<(script|link|img|iframe|video|audio|source|embed|object)\b([^>]*)>/g;

// Un <link> scarica qualcosa solo con questi rel. `canonical` e `alternate` sono
// metadati verso il sito stesso: non generano nessuna richiesta.
const FETCHING_REL =
  /\brel="(?:stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch|icon|shortcut icon|apple-touch-icon|manifest)"/i;

const problems = [];
const files = walk(dist);

for (const file of files) {
  const name = relative(dist, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');

  // La root è lo stub di redirect generato da Astro per l'i18n: niente <h1>, niente
  // lang, ed è corretto così. Si verifica solo che sia davvero un redirect.
  if (name === 'index.html') {
    if (!/http-equiv="refresh"/i.test(html)) {
      problems.push(`${name}: la root non è più un redirect — controlla la config i18n`);
    }
    continue;
  }

  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const text = withoutScripts.replace(/<[^>]+>/g, '');

  // 1 — asterischi rimasti nel testo visibile
  const asterisks = (text.match(/\*/g) || []).length;
  if (asterisks) {
    const sample = text.match(/[^.\n]{0,60}\*[^.\n]{0,60}/)?.[0].trim();
    problems.push(
      `${name}: ${asterisks} asterischi nel testo visibile — manca renderEmphasis()\n    …${sample}…`,
    );
  }

  // 2 — esattamente un <h1>
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${name}: ${h1} elementi <h1> (deve essere esattamente 1)`);

  // 3 — sottorisorse da domini terzi (i <a href> esterni sono voluti: vedi in cima)
  // L'origine del sito si ricava dal canonical, così il controllo non va aggiornato
  // quando in FASE 9 il dominio placeholder diventa quello vero.
  const selfOrigin = html.match(/rel="canonical"\s+href="(https?:\/\/[^/"]+)/)?.[1];
  for (const [, tag, attrs] of html.matchAll(SUBRESOURCE)) {
    if (tag === 'link' && !FETCHING_REL.test(attrs)) continue;
    const url = attrs.match(/\b(?:src|href|data)="(https?:\/\/[^"]+)"/)?.[1];
    if (url && !(selfOrigin && url.startsWith(selfOrigin))) {
      problems.push(`${name}: <${tag}> carica una risorsa da dominio terzo — ${url}`);
    }
  }

  // 4 — lingua dichiarata
  if (!/<html[^>]+\blang="[a-z]{2}/.test(html)) problems.push(`${name}: manca l'attributo lang`);
}

// I CSS emessi: è lì che si nasconderebbe un @font-face verso un CDN.
const cssDir = join(dist, '_astro');
if (existsSync(cssDir)) {
  for (const css of readdirSync(cssDir).filter((f) => f.endsWith('.css'))) {
    const source = readFileSync(join(cssDir, css), 'utf8');
    for (const [, url] of source.matchAll(/url\(\s*['"]?(https?:\/\/[^'")]+)/g)) {
      problems.push(`_astro/${css}: url() verso dominio terzo — ${url}`);
    }
  }
}

if (problems.length) {
  console.error(`✗ check:output — ${problems.length} problemi su ${files.length} pagine:\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`✓ check:output passed — ${files.length} pagine, nessun problema.`);
