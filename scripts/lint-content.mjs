#!/usr/bin/env node
/**
 * Verifica la parità EN/IT (tech-decisions.md §9):
 *   1. i dizionari di micro-copy (src/i18n/ui/en.ts vs it.ts) hanno le stesse chiavi, ricorsivamente
 *   2. le content collection "a più voci" (processSteps, packages, faq, legal — sottocartelle
 *      en/ e it/) hanno lo stesso insieme di file in entrambe le lingue
 *   3. le content collection "di pagina" (homePage, processPage, … — un file en.json/it.json)
 *      hanno le stesse chiavi, ricorsivamente, come i dizionari di micro-copy
 *
 * Una chiave dimenticata in una lingua produce una pagina monca che nessuno nota fino al lancio:
 * questo script è il gate che lo impedisce in build.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const contentDir = join(rootDir, 'src', 'content');
let hasErrors = false;

function fail(message) {
  console.error(`✗ ${message}`);
  hasErrors = true;
}

function diffKeys(context, pathPrefix, en, it) {
  const enKeys = new Set(Object.keys(en));
  const itKeys = new Set(Object.keys(it));

  for (const key of enKeys) {
    if (!itKeys.has(key)) {
      fail(`${context}: "${pathPrefix}${key}" exists in en but not in it`);
    }
  }
  for (const key of itKeys) {
    if (!enKeys.has(key)) {
      fail(`${context}: "${pathPrefix}${key}" exists in it but not in en`);
    }
  }
  for (const key of enKeys) {
    if (!itKeys.has(key)) continue;
    const enVal = en[key];
    const itVal = it[key];
    const enIsObj = enVal && typeof enVal === 'object' && !Array.isArray(enVal);
    const itIsObj = itVal && typeof itVal === 'object' && !Array.isArray(itVal);
    if (enIsObj && itIsObj) {
      diffKeys(context, `${pathPrefix}${key}.`, enVal, itVal);
    }
  }
}

async function checkUiDictionaries() {
  const enModule = await import('../src/i18n/ui/en.ts');
  const itModule = await import('../src/i18n/ui/it.ts');
  diffKeys('ui dictionary', '', enModule.ui, itModule.ui);
}

function listFiles(dir) {
  try {
    return readdirSync(dir).filter((f) => f !== '.gitkeep' && statSync(join(dir, f)).isFile());
  } catch {
    return null; // directory non esiste
  }
}

function hasLocaleSubdirs(collectionDir) {
  try {
    return (
      statSync(join(collectionDir, 'en')).isDirectory() &&
      statSync(join(collectionDir, 'it')).isDirectory()
    );
  } catch {
    return false;
  }
}

/** Collection "a più voci" (processSteps, packages, faq, legal): stesso insieme di file. */
function checkMultiEntryCollection(collection, collectionDir) {
  const enFiles = listFiles(join(collectionDir, 'en'));
  const itFiles = listFiles(join(collectionDir, 'it'));

  const enSet = new Set(enFiles ?? []);
  const itSet = new Set(itFiles ?? []);
  for (const f of enSet) {
    if (!itSet.has(f)) fail(`collection "${collection}": "${f}" exists in en/ but not in it/`);
  }
  for (const f of itSet) {
    if (!enSet.has(f)) fail(`collection "${collection}": "${f}" exists in it/ but not in en/`);
  }
}

/** Collection "di pagina" (homePage, processPage, …): un solo file per lingua, chiavi a confronto. */
function checkPageCollection(collection, collectionDir) {
  const enPath = join(collectionDir, 'en.json');
  const itPath = join(collectionDir, 'it.json');

  let enData;
  let itData;
  try {
    enData = JSON.parse(readFileSync(enPath, 'utf-8'));
  } catch {
    fail(`page collection "${collection}": missing or invalid en.json`);
    return;
  }
  try {
    itData = JSON.parse(readFileSync(itPath, 'utf-8'));
  } catch {
    fail(`page collection "${collection}": missing or invalid it.json`);
    return;
  }
  diffKeys(`page collection "${collection}"`, '', enData, itData);
}

function checkContentCollectionParity() {
  let collections;
  try {
    collections = readdirSync(contentDir).filter((f) =>
      statSync(join(contentDir, f)).isDirectory(),
    );
  } catch {
    fail(`content directory not found: ${contentDir}`);
    return;
  }

  for (const collection of collections) {
    const collectionDir = join(contentDir, collection);
    if (hasLocaleSubdirs(collectionDir)) {
      checkMultiEntryCollection(collection, collectionDir);
    } else {
      checkPageCollection(collection, collectionDir);
    }
  }
}

await checkUiDictionaries();
checkContentCollectionParity();

if (hasErrors) {
  console.error('\nlint:content failed — fix the EN/IT parity issues above.');
  process.exit(1);
}
console.log('✓ lint:content passed — EN and IT are in parity.');
