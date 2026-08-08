import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Contenuti di pagina strutturati in JSON (tech-decisions.md §4) — separati dalla
 * micro-copy di interfaccia (src/i18n/ui/). Popolati in FASE 3; qui solo lo schema.
 *
 * Ogni collection è divisa per lingua (en/, it/) così `lint:content` (FASE 2 tooling)
 * può verificare la parità di chiavi senza logica speciale.
 */

/** Un passo del percorso studente — Process P4–P14 in content-map.md. */
const processSteps = defineCollection({
  loader: glob({ base: './src/content/processSteps', pattern: '**/*.json' }),
  schema: z.object({
    phase: z.enum(['before-departure', 'after-arrival']),
    order: z.number(),
    title: z.string(),
    whatHappens: z.string(),
    whoDecides: z.string(),
    timing: z.string(),
    whatCanGoWrong: z.string().optional(),
    whatKimereDoes: z.string(),
    // Bloccante di prodotto: ogni affermazione procedurale rimanda a una fonte ufficiale
    // (Kimere_Analisi_Strategica.md, vincolo "Niente invenzioni" del master prompt).
    officialSource: z.url().optional(),
  }),
});

/** Uno dei tre livelli di servizio — Admission/Arrival/Settled, brand-brief.md §6. */
const packages = defineCollection({
  loader: glob({ base: './src/content/packages', pattern: '**/*.json' }),
  schema: z.object({
    order: z.number(),
    slug: z.enum(['admission', 'arrival', 'settled']),
    name: z.string(),
    tagline: z.string(),
    includes: z.array(z.string()),
    // Niente campo "price": vincolo di prodotto non negoziabile (nessun prezzo pubblico).
  }),
});

/** Una domanda frequente, raggruppata per tema — content-map.md /faq/. */
const faq = defineCollection({
  loader: glob({ base: './src/content/faq', pattern: '**/*.json' }),
  schema: z.object({
    group: z.enum([
      'before-departure',
      'money',
      'housing',
      'after-arrival',
      'work-and-stay',
      'about-kimere',
    ]),
    order: z.number(),
    question: z.string(),
    answer: z.string(),
    officialSource: z.url().optional(),
  }),
});

/** Pagine legali — qui il markdown ha senso: sono prosa lunga, non dati strutturati. */
const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

export const collections = { processSteps, packages, faq, legal };
