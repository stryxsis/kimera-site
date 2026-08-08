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
    // I due passi che l'analisi strategica e il brand-brief citano esplicitamente come i più
    // convincenti (visto, permesso entro 8 giorni) — marcati per enfasi visiva in FASE 5,
    // non un giudizio nuovo: riflette ciò che i documenti di strategia dicono già.
    keyMoment: z.boolean().optional(),
  }),
});

/** Uno dei tre livelli di servizio — Admission/Arrival/Settled, brand-brief.md §6. */
const packages = defineCollection({
  loader: glob({ base: './src/content/packages', pattern: '**/*.json' }),
  schema: z.object({
    order: z.number(),
    // NON chiamarlo "slug": il glob loader di Astro usa data.slug come ID dell'entry
    // (generateIdDefault, astro/dist/content/loaders/glob.js) — con lo stesso valore
    // in en/ e it/ le due lingue collidevano e una sovrascriveva l'altra in silenzio.
    key: z.enum(['admission', 'arrival', 'settled']),
    name: z.string(),
    tagline: z.string(),
    // Fin dove arriva il livello sul percorso. Sostituisce la barra di copertura
    // scartata al gate 4.2 (D-13): stessa informazione, detta a parole.
    coverage: z.string(),
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

/**
 * Testo di pagina (hero, intro, sezioni) — un file per lingua (en.json/it.json), non per
 * lingua+voce ripetuta come processSteps/packages/faq. Uno schema per pagina perché le
 * sezioni non sono intercambiabili tra pagine (content-map.md, sezioni H1–H7, P1–P17, …).
 */

const heading = z.object({ heading: z.string(), body: z.string() });

const homePage = defineCollection({
  loader: glob({ base: './src/content/homePage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      // Dichiara il destinatario nella prima riga: la home ha 8 secondi per
      // smistare studenti e agenzie su due percorsi diversi (content-map.md).
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
    }),
    problemScale: z.object({
      heading: z.string(),
      body: z.string(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    whatWeDo: z.object({
      heading: z.string(),
      pillars: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    /**
     * L'anteprima del percorso — nella direzione «Rotta» (D-13) non è una sezione
     * più in basso: è metà dell'hero. Il visitatore VEDE il percorso nei primi tre
     * secondi invece di leggere che esiste.
     * `key` marca le tappe critiche (nodo pieno in oro), `note` la scadenza.
     */
    processPreview: z.object({
      heading: z.string(),
      body: z.string(),
      ctaLabel: z.string(),
      pivot: z.string(),
      stopsBefore: z.array(
        z.object({ label: z.string(), key: z.boolean().optional(), note: z.string().optional() }),
      ),
      stopsAfter: z.array(
        z.object({ label: z.string(), key: z.boolean().optional(), note: z.string().optional() }),
      ),
    }),
    packagesPreview: z.object({ heading: z.string(), body: z.string() }),
    trustBuilding: heading,
    finalCta: z.object({ heading: z.string(), body: z.string(), ctaLabel: z.string() }),
  }),
});

const processPage = defineCollection({
  loader: glob({ base: './src/content/processPage', pattern: '*.json' }),
  schema: z.object({
    intro: heading,
    beforeDeparturePhaseLabel: z.string(),
    afterArrivalPhaseLabel: z.string(),
    // Etichette per la mappa del percorso completa (ILL-01, content-map.md P3).
    routeMap: z.object({ caption: z.string(), pivot: z.string() }),
    disclaimer: z.string(),
    ctaLabel: z.string(),
  }),
});

const servicesPage = defineCollection({
  loader: glob({ base: './src/content/servicesPage', pattern: '*.json' }),
  schema: z.object({
    intro: heading,
    comparisonNote: z.string(),
    whyNoPrices: heading,
    notIncluded: z.object({ heading: z.string(), items: z.array(z.string()) }),
    ctaLabel: z.string(),
  }),
});

const housingPage = defineCollection({
  loader: glob({ base: './src/content/housingPage', pattern: '*.json' }),
  schema: z.object({
    intro: heading,
    visaParadox: heading,
    scamWarning: z.object({
      heading: z.string(),
      body: z.string(),
      warningSigns: z.array(z.string()),
    }),
    whatWeDo: z.object({ heading: z.string(), items: z.array(z.string()) }),
    whatWeDontDo: z.object({ heading: z.string(), items: z.array(z.string()) }),
    costsByCity: z.object({
      heading: z.string(),
      cities: z.array(z.object({ city: z.string(), range: z.string() })),
    }),
    euSection: heading,
    ctaLabel: z.string(),
  }),
});

const costsPage = defineCollection({
  loader: glob({ base: './src/content/costsPage', pattern: '*.json' }),
  schema: z.object({
    intro: heading,
    tuition: z.object({
      heading: z.string(),
      body: z.string(),
      publicRange: z.string(),
      privateRange: z.string(),
    }),
    livingCosts: z.object({ heading: z.string(), body: z.string(), monthlyRange: z.string() }),
    visaRequirement: z.object({ heading: z.string(), body: z.string(), amount: z.string() }),
    scholarships: heading,
    workWhileStudying: z.object({
      heading: z.string(),
      body: z.string(),
      hoursPerWeek: z.string(),
      maxHoursPerYear: z.string(),
    }),
    healthCoverage: z.object({ heading: z.string(), body: z.string(), annualCost: z.string() }),
    afterGraduation: heading,
    disclaimer: z.string(),
    ctaLabel: z.string(),
  }),
});

const aboutPage = defineCollection({
  loader: glob({ base: './src/content/aboutPage', pattern: '*.json' }),
  schema: z.object({
    intro: heading,
    whyWeExist: heading,
    howWeWork: z.object({
      heading: z.string(),
      principles: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    whatWeDontDo: z.object({ heading: z.string(), items: z.array(z.string()) }),
    ctaLabel: z.string(),
  }),
});

const partnersPage = defineCollection({
  loader: glob({ base: './src/content/partnersPage', pattern: '*.json' }),
  schema: z.object({
    proposition: heading,
    collaborationModel: heading,
    // Etichette per ILL-04: la stessa frase di collaborationModel.body, riformulata
    // come diagramma. Nessun fatto nuovo — solo la sua controparte visiva.
    handoverDiagram: z.object({
      theirLabel: z.string(),
      theirItems: z.array(z.string()),
      handoverLabel: z.string(),
      ourLabel: z.string(),
    }),
    whatWeDoOnGround: z.object({ heading: z.string(), items: z.array(z.string()) }),
    howToStart: z.object({ heading: z.string(), steps: z.array(z.string()) }),
    forUniversities: heading,
    ctaLabel: z.string(),
  }),
});

const thankYouPage = defineCollection({
  loader: glob({ base: './src/content/thankYouPage', pattern: '*.json' }),
  schema: z.object({
    confirmation: heading,
    responseTime: z.string(),
    howToPrepare: z.object({ heading: z.string(), items: z.array(z.string()) }),
  }),
});

/**
 * Nomi localizzati dei paesi per il campo "cittadinanza" del form (src/data/countries.ts
 * ne fornisce i codici e il flag UE — dati strutturali, non testo). Un file per lingua,
 * come le altre collection "di pagina": `lint:content` verifica che i due elenchi di
 * codici coincidano esattamente.
 */
const countries = defineCollection({
  loader: glob({ base: './src/content/countries', pattern: '*.json' }),
  schema: z.record(z.string(), z.string()),
});

export const collections = {
  processSteps,
  packages,
  faq,
  legal,
  countries,
  homePage,
  processPage,
  servicesPage,
  housingPage,
  costsPage,
  aboutPage,
  partnersPage,
  thankYouPage,
};
