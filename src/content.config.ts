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

/** I nomi ammessi dal set ILL-03/ILL-05 (src/components/illustrations/StepIcon.astro). */
const stepIconName = z.enum([
  'document',
  'calendar',
  'house',
  'permit',
  'building',
  'contract',
  'health',
  'compass',
]);

/**
 * Home — non è una vetrina, è uno smistatore. L'analisi strategica aggiornata
 * dà a Kimere QUATTRO destinatari con bisogni quasi disgiunti (studente che sa
 * dove andare, studente indeciso, ateneo, agenzia): la home ha pochi secondi
 * per mandare ciascuno nel proprio imbuto invece di parlare a tutti e a nessuno.
 *
 * Da qui la sequenza dei blocchi, che NON è arbitraria:
 *   hero            → promessa e primo bivio grossolano (B2C / B2B)
 *   routing         → il bivio fine, per problema e non per prodotto
 *   strengths       → il vantaggio vero: team multiculturale, sette lingue
 *   bureaucracy     → i pain point che fermano davvero (ISEE, borse, documenti)
 *   forUniversities → il canale B2B più pulito: il seminario gratuito
 *   languageCourses → l'ecosistema a 360°, non solo scartoffie
 *   finalCta        → chi ha scrollato tutto senza cliccare nessun box
 *
 * ⚠️ NESSUN PREZZO in questo schema, ed è una decisione confermata: i price
 * point esistono (analisi §2) ma restano fuori dal sito, la cifra si dice in
 * call. Non aggiungere un campo `price` qui né altrove.
 *
 * ⚠️ Le destinazioni dei box NON stanno nel contenuto: `audience` è una chiave,
 * e il template la risolve in un href tramite routes.ts. Un URL scritto in un
 * JSON di contenuto è un link morto che nessun controllo intercetta.
 */
const homePage = defineCollection({
  loader: glob({ base: './src/content/homePage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      /** Il bivio grossolano: B2C e B2B separati già sopra la piega. */
      ctaStudent: z.string(),
      ctaInstitution: z.string(),
    }),
    /**
     * Il bivio, per PROBLEMA e non per prodotto: il visitatore riconosce la
     * propria situazione, non deve dedurre quale servizio gli spetta.
     */
    routing: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      boxes: z.array(
        z.object({
          /** Chiave, non URL: il template la mappa sulla destinazione reale. */
          audience: z.enum(['student-abroad', 'student-undecided', 'university', 'agency']),
          icon: stepIconName,
          title: z.string(),
          body: z.string(),
          ctaLabel: z.string(),
        }),
      ),
    }),
    /**
     * Il differenziante dichiarato dall'analisi: team multiculturale e sette
     * lingue, con consulenti della stessa nazionalità dell'interlocutore.
     *
     * ⚠️ Le lingue sono quelle dell'analisi e NIENTE ALTRO (§1): inglese,
     * francese, spagnolo, portoghese, arabo, albanese, tedesco. L'italiano non
     * è nell'elenco — se i corsi lo includono va confermato dal cliente prima
     * di aggiungerlo, non dedotto dal fatto che l'azienda è italiana.
     */
    strengths: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      points: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
    }),
    /**
     * «Zero burocrazia»: il vero scoglio non è l'ammissione ma i soldi e i
     * documenti (analisi §4).
     *
     * ⚠️ `limitBody` è OBBLIGATORIA e non è una postilla difensiva. L'analisi
     * dice che Kimere «bypassa» la procedura CIMEA: sul sito non si può
     * scrivere, perché l'attestato di comparabilità lo rilascia CIMEA o
     * l'ateneo e nessun privato può renderlo superfluo. Prometterlo farebbe
     * arrivare lo studente con un fascicolo respinto. Quello che Kimere fa
     * davvero — traduzione interna e pratica seguita passo per passo — è già
     * un vantaggio verificabile e si regge da solo.
     */
    bureaucracy: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      items: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      limitHeading: z.string(),
      limitBody: z.string(),
      officialSource: z.url(),
    }),
    /**
     * Il canale B2B più pulito dell'analisi (§5): il seminario online gratuito,
     * modellato sul mercato dell'ateneo. La CTA di questo blocco non è
     * «contattaci» — è la prenotazione del seminario.
     */
    forUniversities: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      seminarHeading: z.string(),
      seminarBody: z.string(),
      seminarPoints: z.array(z.string()),
      ctaLabel: z.string(),
    }),
    languageCourses: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      languagesLabel: z.string(),
      languages: z.array(z.string()),
      ctaLabel: z.string(),
    }),
    /**
     * Per chi è arrivato in fondo senza cliccare nessun box: molto interessato
     * ma non si riconosce in nessuna delle quattro caselle. `surveyNote` cita
     * il sondaggio preliminare, che è ciò che giustifica il prezzo della
     * consulenza — la ricerca si fa PRIMA della call, non durante.
     */
    finalCta: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      surveyNote: z.string(),
      ctaLabel: z.string(),
    }),
  }),
});
/**
 * Servizi — la pagina commerciale del sito, e l'unica il cui compito non è
 * informare ma costruire il valore percepito prima che il prezzo esista.
 * Il prezzo NON compare da nessuna parte in questo schema, e non è una
 * dimenticanza: è la strategia di pricing del cliente (la cifra si dice solo
 * in call, sulla situazione reale). Non aggiungere un campo `price`.
 *
 * La sequenza delle sezioni è quella del brief commerciale:
 *   bottlenecks → il carico reale, detto prima di offrire qualsiasi cosa
 *   method      → perché un portale di upload non risolve quel carico
 *   levels      → i tre livelli, senza listino
 *   premium     → il livello a margine più alto, aperto in dettaglio
 *   housing     → la barriera più alta, che è anche l'aggancio più forte
 *   notIncluded → i limiti, dichiarati e non nascosti
 */
const servicesPage = defineCollection({
  loader: glob({ base: './src/content/servicesPage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
    }),
    /**
     * «L'elefante nella stanza». Ogni voce porta la sua conseguenza (`risk`)
     * perché è la conseguenza a costruire il valore, non l'elenco della
     * pratica. Tutte le affermazioni qui dentro devono essere procedure
     * pubblicate — le stesse già documentate in processSteps, mai numeri o
     * scadenze nuove inventate per far paura.
     */
    bottlenecks: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      /** Etichetta che introduce la riga di conseguenza in ogni scheda. */
      riskLabel: z.string(),
      items: z.array(
        z.object({
          icon: stepIconName,
          title: z.string(),
          body: z.string(),
          risk: z.string(),
        }),
      ),
      note: z.string(),
    }),
    method: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      principles: z.array(
        z.object({ icon: stepIconName, title: z.string(), body: z.string() }),
      ),
    }),
    /**
     * I tre livelli vengono dalla collection `packages` (condivisa con la home
     * e con il parametro `?level=` del form): qui c'è solo la cornice.
     * `featuredKey` marca il livello messo in evidenza — è un'affermazione di
     * copertura, non un giudizio inventato: `settled` è l'unico che arriva in
     * fondo alla rotta.
     */
    levels: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      featuredKey: z.enum(['admission', 'arrival', 'settled']),
      featuredLabel: z.string(),
      ctaLabel: z.string(),
      whyNoPrices: heading,
    }),
    premium: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      pillars: z.array(
        z.object({
          icon: stepIconName,
          title: z.string(),
          body: z.string(),
          items: z.array(z.string()),
        }),
      ),
      ctaLabel: z.string(),
    }),
    /**
     * ⚠️ NIENTE PARTNERSHIP DICHIARATE. Kimere non ha contratti firmati con
     * reti di studentati, e scrivere «grazie ai nostri partner» sarebbe
     * pubblicità ingannevole oltre che l'invenzione che il progetto vieta —
     * e contraddirebbe /housing/, che dichiara di non essere un'agenzia
     * immobiliare. Il vantaggio va detto per quello che è: dove si indirizza
     * la ricerca, che cosa si legge prima della firma, che cosa si registra.
     * `limits` è OBBLIGATORIO e non va spostato in fondo alla pagina.
     */
    housing: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      barriers: z.array(z.object({ title: z.string(), body: z.string() })),
      responseHeading: z.string(),
      response: z.array(z.string()),
      limitsHeading: z.string(),
      limits: z.array(z.string()),
    }),
    notIncluded: z.object({ heading: z.string(), items: z.array(z.string()) }),
    finalCta: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      ctaLabel: z.string(),
    }),
  }),
});

/**
 * «Perché l'Italia» — la sola pagina del sito pensata per il traffico organico:
 * intercetta chi cerca «study in Italy» o «cost of living Italy students» e sta
 * ancora valutando il PAESE, non l'agenzia. Vende il sogno con i numeri, poi lo
 * consegna al labirinto amministrativo che è il prodotto di Kimere (`pivot`).
 *
 * ⚠️ OGNI CIFRA QUI DENTRO È UN'AFFERMAZIONE VERIFICABILE, e questa pagina è
 * quella su cui un genitore che finanzia farà i suoi controlli. Regole:
 *   — nessun numero senza una fonte pubblica che lo dica (`officialSource`);
 *   — le cifre già dichiarate altrove nel sito (tasse, costo della vita, ore di
 *     lavoro) vanno ripetute IDENTICHE: una discrepanza interna costa più di un
 *     numero mancante;
 *   — importi e soglie cambiano per decreto ogni anno, quindi `costs.disclaimer`
 *     è obbligatorio e non va spostato in fondo alla pagina.
 * Niente classifiche, niente «migliore d'Europa», niente conteggi di corsi o di
 * studenti stranieri: sono i numeri che nessuno riesce a sostanziare.
 */
const studyInItalyPage = defineCollection({
  loader: glob({ base: './src/content/studyInItalyPage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
      /** Che cosa dovrà rappresentare la foto su licenza (MediaFrame). */
      imagePlaceholder: z.string(),
      /** La pastiglia sospesa sull'immagine: un solo dato, il più seducente. */
      badgeValue: z.string(),
      badgeLabel: z.string(),
    }),
    academics: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      points: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      /** La barriera d'ingresso più grande è linguistica: si abbatte subito. */
      language: z.object({
        heading: z.string(),
        body: z.string(),
        points: z.array(z.string()),
      }),
      officialSource: z.url(),
    }),
    costs: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      rows: z.array(z.object({ label: z.string(), value: z.string(), note: z.string() })),
      /** Obbligatorio: sono fasce indicative, e il sito non promette cifre. */
      disclaimer: z.string(),
    }),
    scholarships: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      benefits: z.array(z.object({ title: z.string(), body: z.string() })),
      note: z.string(),
    }),
    future: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      points: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      officialSource: z.url(),
    }),
    /** Il ponte verso Servizi: il sogno è reale, l'amministrazione è il problema. */
    pivot: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
    }),
  }),
});

/**
 * Chi siamo — la pagina con il vincolo più duro del progetto. Kimere è nata a
 * giugno 2026, non è ancora costituita in società (consorzio di P.IVA) e non ha
 * NESSUNA fotografia propria (PROGRESS.md, Rischio 1 e questione #18). Su un
 * sito che tratta passaporti, visti e bonifici internazionali, una pagina «chi
 * siamo» senza storia e senza volti è normalmente il punto in cui la fiducia
 * si rompe.
 *
 * La risposta dello schema è strutturale: non c'è nessun campo per anni di
 * attività, numeri di clienti, volti o nomi. Al loro posto ci sono `genesis`
 * (perché l'azienda esiste), `method` (come si lavora, verificabile prima di
 * pagare) ed `ecosystem` (le competenze che il percorso richiede, non le
 * persone che le tengono).
 *
 * ⚠️ NIENTE FOTO STOCK DI PERSONE, mai — nemmeno «provvisorie». Ritratti
 * d'archivio di gente che non lavora qui sono il modo più rapido di perdere
 * esattamente il lettore che verifica, cioè il genitore che paga. Il campo
 * `ecosystem.noPhotos*` esiste per dirlo apertamente invece di far notare
 * l'assenza: dichiararlo è più forte che nasconderlo.
 * ⚠️ `ecosystem.nodes` descrive DISCIPLINE, non organico e non partner
 * contrattualizzati: non esistono accordi firmati da dichiarare.
 */
const aboutPage = defineCollection({
  loader: glob({ base: './src/content/aboutPage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
    }),
    /** Il nemico comune: non le istituzioni, ma il vuoto di responsabilità fra loro. */
    genesis: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      paragraphs: z.array(z.string()),
      pullQuote: z.string(),
    }),
    /** Ciò che sostituisce lo storico: un metodo che si giudica prima di pagare. */
    method: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      steps: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    ecosystem: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      hubLabel: z.string(),
      hubNote: z.string(),
      nodes: z.array(z.object({ label: z.string(), body: z.string() })),
      /**
       * Il blocco «le persone». Il layout è definitivo, i media ancora no:
       * ogni scheda mostra un segnaposto dichiarato finché il file non arriva
       * in `public/media/`, esattamente come l'immagine dell'hero di
       * «Perché l'Italia». Appena si valorizzano `photo`/`video` il segnaposto
       * sparisce da solo, senza toccare il layout né questo schema.
       *
       * ⚠️ `name` è OPZIONALE e va lasciato vuoto finché non c'è il consenso
       * scritto della persona a comparire (PROGRESS.md, questione #18): il
       * nome e il volto di un professionista sono dati personali, e questo è
       * un sito che sul GDPR ha già preso posizione. Senza `name` la scheda
       * mostra il ruolo, che è pubblicabile da subito e comunque vero.
       * ⚠️ MAI ritratti d'archivio al posto delle foto vere: chi verifica li
       * riconosce, ed è il genitore che paga.
       */
      team: z.object({
        heading: z.string(),
        body: z.string(),
        members: z.array(
          z.object({
            /** Solo con consenso scritto. Assente → la scheda parte dal ruolo. */
            name: z.string().optional(),
            role: z.string(),
            bio: z.string(),
            /** Che cosa deve rappresentare il ritratto, per chi scatterà le foto. */
            photoPlaceholder: z.string(),
            photo: z.string().optional(),
            /** Obbligatorio quando c'è `photo`, altrimenti l'immagine è muta. */
            photoAlt: z.string().optional(),
          }),
        ),
        /** Il video di presentazione, se e quando esisterà. */
        intro: z.object({
          heading: z.string(),
          caption: z.string(),
          videoPlaceholder: z.string(),
          video: z.string().optional(),
          /** Fotogramma di copertina mostrato prima del play. */
          poster: z.string().optional(),
          /** WebVTT: obbligatorio se il video ha parlato. */
          captions: z.string().optional(),
        }),
      }),
    }),
    values: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
    }),
    /** I limiti dichiarati: ricorrono su Servizi e in home, e qui sono il finale. */
    limits: z.object({ heading: z.string(), items: z.array(z.string()) }),
    finalCta: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      ctaLabel: z.string(),
    }),
  }),
});

/**
 * Partnerships — l'unica pagina del sito che NON parla allo studente. Il lettore
 * è il direttore di un'agenzia di reclutamento estera o il referente di un ufficio
 * international: valuta volumi, rischio e margine, non un sogno di studio.
 *
 * ⚠️ Due vincoli che questo schema non può imporre ma che valgono per il copy:
 *
 * 1. NESSUN operatore terzo nominato. Citare per nome una rete di studentati o un
 *    ateneo suggerisce un rapporto che non esiste. `otherPartners` è un invito
 *    aperto a categorie di operatori, mai un elenco di partner.
 * 2. NESSUNA cifra non verificata. `market.metrics` riporta solo numeri che il
 *    sito già dichiara altrove con la loro fonte (vedi studyInItalyPage): conteggi
 *    di studenti internazionali e di corsi disponibili sono stati esclusi in quella
 *    pagina perché non verificabili, e non rientrano qui dalla porta di servizio.
 */
const partnersPage = defineCollection({
  loader: glob({ base: './src/content/partnersPage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
    }),
    /** L'opportunità di mercato, in numeri che il sito già sostiene con una fonte. */
    market: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })),
      points: z.array(z.string()),
      linkLabel: z.string(),
      officialSource: z.url(),
    }),
    /** Il modello B2B2C: etichette per ILL-04 più gli impegni che lo rendono firmabile. */
    model: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      handover: z.object({
        theirLabel: z.string(),
        theirItems: z.array(z.string()),
        handoverLabel: z.string(),
        ourLabel: z.string(),
        ourItems: z.array(z.string()),
      }),
      /**
       * La paura numero uno di chi valuta un partner sul territorio è che il
       * partner gli porti via il cliente. Sono impegni che Kimere prende su di
       * sé — legittimi da pubblicare — non affermazioni su terzi.
       */
      commitmentsHeading: z.string(),
      commitments: z.array(z.string()),
    }),
    advantages: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      /** Etichetta della riga «rischio rimosso», come `bottlenecks.riskLabel` in Servizi. */
      riskLabel: z.string(),
      items: z.array(
        z.object({
          icon: stepIconName,
          title: z.string(),
          body: z.string(),
          risk: z.string(),
        }),
      ),
    }),
    /** Atenei e operatori dell'housing: un invito aperto, mai un elenco di partner. */
    otherPartners: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      lookingLabel: z.string(),
      items: z.array(
        z.object({
          icon: stepIconName,
          title: z.string(),
          body: z.string(),
          looking: z.string(),
        }),
      ),
    }),
    howToStart: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      steps: z.array(z.object({ title: z.string(), body: z.string() })),
      /**
       * Ciò che un'agenzia scoprirebbe comunque facendo due diligence. Dirlo per
       * primi è l'unico modo in cui non diventa il motivo per cui la trattativa
       * si ferma: su questa pagina la trasparenza è un argomento di vendita.
       */
      dueDiligence: z.object({ heading: z.string(), items: z.array(z.string()) }),
    }),
    form: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      ctaLabel: z.string(),
    }),
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
  packages,
  faq,
  legal,
  countries,
  homePage,
  studyInItalyPage,
  servicesPage,
  aboutPage,
  partnersPage,
  thankYouPage,
};
