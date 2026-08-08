#!/usr/bin/env node
/**
 * Verifica la parità EN/IT (tech-decisions.md §9):
 *   1. i dizionari di micro-copy (src/i18n/ui/en.ts vs it.ts) hanno le stesse chiavi, ricorsivamente
 *   2. ogni content collection ha lo stesso insieme di file in en/ e it/
 *
 * Una chiave dimenticata in una lingua produce una pagina monca che nessuno nota fino al lancio:
 * questo script è il gate che lo impedisce in build.
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
let hasErrors = false;

function fail(message) {
  console.error(`✗ ${message}`);
  hasErrors = true;
}

function diffKeys(pathPrefix, en, it) {
  const enKeys = new Set(Object.keys(en));
  const itKeys = new Set(Object.keys(it));

  for (const key of enKeys) {
    if (!itKeys.has(key)) {
      fail(`ui dictionary: "${pathPrefix}${key}" exists in en.ts but not in it.ts`);
    }
  }
  for (const key of itKeys) {
    if (!enKeys.has(key)) {
      fail(`ui dictionary: "${pathPrefix}${key}" exists in it.ts but not in en.ts`);
    }
  }
  for (const key of enKeys) {
    if (!itKeys.has(key)) continue;
    const enVal = en[key];
    const itVal = it[key];
    const enIsObj = enVal && typeof enVal === 'object';
    const itIsObj = itVal && typeof itVal === 'object';
    if (enIsObj && itIsObj) {
      diffKeys(`${pathPrefix}${key}.`, enVal, itVal);
    }
  }
}

async function checkUiDictionaries() {
  const enModule = await import('../src/i18n/ui/en.ts');
  const itModule = await import('../src/i18n/ui/it.ts');
  diffKeys('', enModule.ui, itModule.ui);
}

function listContentFiles(dir) {
  try {
    return readdirSync(dir).filter((f) => f !== '.gitkeep' && statSync(join(dir, f)).isFile());
  } catch {
    return null; // directory non esiste — segnalato separatamente
  }
}

function checkContentCollectionParity() {
  const contentDir = join(rootDir, 'src', 'content');
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
    const enDir = join(contentDir, collection, 'en');
    const itDir = join(contentDir, collection, 'it');
    const enFiles = listContentFiles(enDir);
    const itFiles = listContentFiles(itDir);

    if (enFiles === null || itFiles === null) {
      fail(`collection "${collection}": missing en/ or it/ subdirectory`);
      continue;
    }

    const enSet = new Set(enFiles);
    const itSet = new Set(itFiles);
    for (const f of enSet) {
      if (!itSet.has(f)) fail(`collection "${collection}": "${f}" exists in en/ but not in it/`);
    }
    for (const f of itSet) {
      if (!enSet.has(f)) fail(`collection "${collection}": "${f}" exists in it/ but not in en/`);
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
