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
    // Niente campo "price": i tre livelli non hanno listino pubblico, la cifra si
    // dice in call. L'unica eccezione del sito è la Consulenza Strategica Base,
    // che ha un prezzo pubblicato in `forStudentsPage.pricing` — vedi lì il
    // perché. Non è un precedente per questi tre.
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
 * ⚠️ NESSUN PREZZO in questo schema: la home smista, non vende. Dal 2026-08-11
 * esiste UNA eccezione in tutto il sito — la Consulenza Strategica Base, il cui
 * prezzo è pubblicato in `forStudentsPage.pricing` per decisione esplicita del
 * cliente. Qui resta fuori di proposito: un prezzo sopra la piega, prima ancora
 * che il lettore sappia che cosa comprende, filtra chi avrebbe convertito.
 * Non aggiungere un campo `price` qui né in `packages`.
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
     * Le lingue erano in origine solo le sette dell'analisi (§1): inglese,
     * francese, spagnolo, portoghese, arabo, albanese, tedesco — SENZA
     * l'italiano, deliberatamente non dedotto dal fatto che l'azienda è
     * italiana. Il cliente ha poi confermato che i corsi lo includono
     * (2026-08-11): `languageCourses.languages`, in `homePage`, ora lo elenca.
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
 * Per gli studenti — la pagina B2C, e l'unica del sito il cui compito non è
 * informare né rassicurare in generale: deve abbattere l'ansia di una persona
 * di vent'anni che ha paura delle scartoffie, dei soldi e della lingua più che
 * dell'esame di ammissione, e poi portarla dentro il questionario.
 *
 * La sequenza dei blocchi è quella del brief commerciale (2026-08-11):
 *   hero       → la promessa emotiva, non l'elenco dei servizi
 *   identikit  → auto-segmentazione: studente internazionale / italiano indeciso
 *   lifelines  → i pain point tecnici risolti, uno per uno
 *   documents  → traduzione e legalizzazione, il vantaggio competitivo vero
 *   pricing    → la Consulenza Strategica Base, a prezzo scoperto
 *   finalCta   → il questionario preliminare, unico ingresso all'imbuto
 *
 * ⚠️ QUESTO È L'UNICO SCHEMA DEL SITO CON UN PREZZO, ed è una deroga esplicita
 * del cliente, non una svista: il prezzo in chiaro qualifica il contatto prima
 * della call e giustifica il questionario. Vale SOLO per la Consulenza
 * Strategica Base. I tre livelli di `packages` e la home restano senza listino.
 *
 * ⚠️ `pricing.billingNote` è OBBLIGATORIA. La cifra dell'analisi è in dollari,
 * il venditore è italiano e il lettore italiano è un consumatore: il Codice del
 * consumo vuole un prezzo comprensibile e comprensivo di imposte, e nessuno qui
 * può dedurre il regime IVA di Kimere. La nota dice la valuta e rimanda la cifra
 * definitiva a una conferma scritta prima di qualsiasi pagamento — che è vero,
 * verificabile e non inventa un trattamento fiscale.
 *
 * ⚠️ `pricing.notIncluded` è OBBLIGATORIO. Una sessione di consulenza pagata non
 * è il pacchetto di relocation e non garantisce un'ammissione: senza questo
 * elenco il blocco vende implicitamente un risultato che nessuno può promettere.
 *
 * ⚠️ `documents.limitBody` è la stessa riga su CIMEA che portano home e Chi
 * siamo, e per la stessa ragione: l'attestato di comparabilità lo rilascia CIMEA
 * o l'ateneo, nessun privato lo scavalca. Il brief chiede di dire «bypassare»:
 * non si può, e su questa pagina meno che mai — è quella che il lettore usa per
 * decidere se pagare.
 *
 * ⚠️ `identikit.paths[].audience` è una CHIAVE, non un URL: il template la
 * risolve in un'ancora di questa pagina. Vale la regola della home.
 */
const forStudentsPage = defineCollection({
  loader: glob({ base: './src/content/forStudentsPage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
      /** La riga sotto i bottoni: toglie l'ultimo attrito prima del clic. */
      reassurance: z.string(),
    }),
    /** Auto-segmentazione: due lettori con quasi nulla in comune da chiedere. */
    identikit: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      paths: z.array(
        z.object({
          audience: z.enum(['international', 'undecided']),
          icon: stepIconName,
          title: z.string(),
          body: z.string(),
          points: z.array(z.string()),
          ctaLabel: z.string(),
        }),
      ),
    }),
    /**
     * Il blocco «salvavita». Ogni voce è un ostacolo che il sito già descrive
     * altrove con la sua fonte: qui non entrano cifre, soglie o scadenze nuove.
     */
    lifelines: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      items: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      note: z.string(),
      officialSource: z.url(),
    }),
    documents: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      items: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      /** OBBLIGATORIE: il limite su CIMEA. Vedi il commento in testa. */
      limitHeading: z.string(),
      limitBody: z.string(),
      officialSource: z.url(),
    }),
    pricing: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      planName: z.string(),
      /** La cifra dell'analisi, testuale: nessun calcolo, nessuna conversione. */
      price: z.string(),
      priceUnit: z.string(),
      /** OBBLIGATORIA: valuta e conferma scritta. Vedi il commento in testa. */
      billingNote: z.string(),
      stepsHeading: z.string(),
      steps: z.array(z.object({ title: z.string(), body: z.string() })),
      includedHeading: z.string(),
      included: z.array(z.string()),
      /** OBBLIGATORIO: cosa il prezzo NON compra. Vedi il commento in testa. */
      notIncludedHeading: z.string(),
      notIncluded: z.array(z.string()),
      ctaLabel: z.string(),
    }),
    finalCta: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      ctaLabel: z.string(),
      /** Che cosa succede dopo l'invio: nessun imbuto che finisce nel buio. */
      note: z.string(),
    }),
  }),
});

/**
 * Corsi di lingua e traduzioni — l'area che l'analisi (§3) chiede esplicitamente
 * e che tiene insieme le due cose che Kimere fa con le STESSE persone: insegnare
 * le lingue e tradurre i documenti. Non è un servizio accessorio: è il motivo per
 * cui una traduzione può partire il giorno in cui la chiedi invece di uscire a un
 * fornitore, ed è l'unico vantaggio competitivo dell'azienda che non dipenda da
 * accordi con terzi.
 *
 * La sequenza dei blocchi è quella del brief (2026-08-11):
 *   hero       → la doppia promessa: la lingua e la burocrazia
 *   academy    → i corsi, e chi li tiene
 *   documents  → traduzione e legalizzazione, con il confine su CIMEA
 *   comparison → metodo tradizionale contro metodo Kimere
 *   forms      → due moduli distinti, uno per intento
 *
 * ⚠️ `documents.institutions` è OBBLIGATORIO ed è il cuore onesto della pagina.
 * Il brief chiede per la terza volta di scrivere che Kimere «bypassa» la
 * procedura CIMEA. Non si può, e qui la distinzione va fatta per esteso perché è
 * questa la pagina che vende quel servizio: la TRADUZIONE e la LEGALIZZAZIONE
 * sono passaggi che Kimere gestisce davvero in casa, mentre l'ATTESTATO DI
 * COMPARABILITÀ lo rilascia CIMEA o lo valuta l'ateneo e resta dov'è. Chi
 * confonde le due cose arriva con la domanda respinta. Separarle non indebolisce
 * l'offerta: la rende l'unica verificabile sul mercato.
 *
 * ⚠️ `academy.languages` deve restare identico a `languageCourses.languages` di
 * `homePage` e a `languages.languages` di `aboutPage`: sono la stessa
 * affermazione sulla stessa azienda in tre punti del sito. Sono OTTO — le sette
 * lingue dell'analisi più l'italiano, aggiunto su conferma del cliente
 * (2026-08-11). Il brief di questa pagina ne elenca sette perché ricopia
 * l'analisi, che è precedente a quella conferma.
 *
 * ⚠️ `comparison.note` non può promettere che un documento non verrà «mai»
 * respinto. Nessuno controlla la commissione che lo riceve: si dice quale causa
 * di rigetto si toglie di mezzo, non che il rigetto sia impossibile.
 */
const languageCoursesPage = defineCollection({
  loader: glob({ base: './src/content/languageCoursesPage', pattern: '*.json' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      /** Le due porte, già sopra la piega: l'urgenza e la pianificazione. */
      ctaDocuments: z.string(),
      ctaCourses: z.string(),
      reassurance: z.string(),
    }),
    academy: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      languagesLabel: z.string(),
      /** ⚠️ Identico a home e Chi siamo. Vedi il commento in testa. */
      languages: z.array(z.string()),
      points: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      ctaLabel: z.string(),
    }),
    documents: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      steps: z.array(z.object({ title: z.string(), body: z.string() })),
      handledHeading: z.string(),
      handled: z.array(z.string()),
      /** ⚠️ OBBLIGATORIO: cosa resta agli enti. Vedi il commento in testa. */
      institutionsHeading: z.string(),
      institutions: z.array(z.string()),
      limitHeading: z.string(),
      limitBody: z.string(),
      officialSource: z.url(),
      ctaLabel: z.string(),
    }),
    comparison: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      traditionalLabel: z.string(),
      traditional: z.array(z.string()),
      kimereLabel: z.string(),
      kimere: z.array(z.string()),
      /** ⚠️ Nessun «mai respinto». Vedi il commento in testa. */
      note: z.string(),
    }),
    /**
     * Due moduli e non uno: chi arriva qui con un diploma da tradurre entro
     * venerdì e chi vuole imparare il tedesco per settembre prossimo hanno
     * intenti opposti, e le domande da fare sono diverse. Un modulo unico li
     * mescolerebbe e renderebbe inutilizzabili entrambe le liste di contatti.
     */
    forms: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      quote: z.object({
        heading: z.string(),
        body: z.string(),
        ctaLabel: z.string(),
      }),
      course: z.object({
        heading: z.string(),
        body: z.string(),
        ctaLabel: z.string(),
      }),
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
/**
 * Chi siamo — la pagina che deve costruire fiducia senza avere niente di ciò
 * con cui la fiducia si costruisce di solito: nessuno storico, nessun cliente
 * da citare, nessuna fotografia del team, una società non ancora formalizzata.
 *
 * La risposta non è nascondere quel vuoto, è cambiare l'oggetto della prova:
 * invece di «guardate quanto siamo grandi», la pagina racconta COME è fatta
 * l'azienda — una rete di professionisti indipendenti in più paesi — e perché
 * quella forma è un vantaggio e non un ripiego. Da qui la sequenza:
 *   hero      → il manifesto: nessun confine, solo ponti
 *   match     → l'asso nella manica: il consulente della tua nazionalità
 *   network   → di che cosa è fatta la rete, e chi la compone
 *   languages → le lingue e i documenti gestiti in casa
 *   connected → come si lavora insieme (chiamate frequenti, cliente dentro)
 *   limits    → cosa NON facciamo, per primi
 *   finalCta  → due porte, B2C e B2B
 *
 * ⚠️ Tre campi di questo schema esistono solo per impedire una promessa falsa,
 * e non sono opzionali:
 *
 * `match.honestNote` — Kimere non può schierare un connazionale per ognuna
 * delle ~190 nazionalità possibili. Senza questa riga il blocco promette una
 * copertura universale che non esiste, e la promessa si rompe alla prima call.
 *
 * `languages.limitBody` — l'analisi dice che Kimere «bypassa» la procedura
 * CIMEA. Sul sito non si può scrivere: l'attestato di comparabilità lo rilascia
 * CIMEA o l'ateneo, e nessun privato lo rende superfluo. Prometterlo farebbe
 * arrivare lo studente con un fascicolo respinto — il danno ricadrebbe su di
 * lui e la colpa su Kimere. Il vantaggio vero (traduzione interna, pratica
 * seguita) è già sufficiente e si regge da solo. La stessa riga sta in home.
 *
 * `limits` — non è nel brief di questa pagina, ed è tenuto comunque: è la
 * pagina dove un lettore diffidente va a cercare cosa NON si può fare, e su un
 * sito che tratta visti e bonifici toglierlo sarebbe una regressione, non una
 * semplificazione.
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
    /** Il match culturale: il differenziante più forte dell'analisi (§1). */
    match: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      points: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      /** OBBLIGATORIA: vedi il commento sopra. Nessuna copertura universale. */
      honestNote: z.string(),
    }),
    /** Di che cosa è fatta la rete, e chi la compone. */
    network: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      points: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      /**
       * Le persone. Il layout è definitivo, i media ancora no: ogni scheda
       * mostra un segnaposto dichiarato finché il file non arriva in
       * `public/media/`, e sparisce da sé appena si valorizza `photo`/`video`.
       *
       * ⚠️ `name` è OPZIONALE e va lasciato vuoto finché non c'è il consenso
       * scritto della persona (PROGRESS.md, questione #18): nome e volto di un
       * professionista sono dati personali, e questo sito sul GDPR ha già preso
       * posizione. Senza `name` la scheda parte dal ruolo, vero e pubblicabile.
       * ⚠️ MAI ritratti d'archivio: chi verifica li riconosce, ed è il genitore
       * che paga.
       */
      team: z.object({
        heading: z.string(),
        body: z.string(),
        members: z.array(
          z.object({
            name: z.string().optional(),
            role: z.string(),
            bio: z.string(),
            photoPlaceholder: z.string(),
            photo: z.string().optional(),
            /** Obbligatorio quando c'è `photo`, altrimenti l'immagine è muta. */
            photoAlt: z.string().optional(),
          }),
        ),
        intro: z.object({
          heading: z.string(),
          caption: z.string(),
          videoPlaceholder: z.string(),
          video: z.string().optional(),
          poster: z.string().optional(),
          /** WebVTT: obbligatorio se il video ha parlato. */
          captions: z.string().optional(),
        }),
      }),
    }),
    /**
     * Le lingue e i servizi in casa.
     *
     * ⚠️ L'elenco deve restare identico a `languageCourses.languages` di
     * `homePage`: sono la stessa affermazione sulla stessa azienda, e due
     * elenchi che divergono è il tipo di incoerenza che nota esattamente il
     * lettore che sta verificando. Sette lingue straniere più l'italiano.
     */
    languages: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      languagesLabel: z.string(),
      languages: z.array(z.string()),
      inHouse: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
      /** OBBLIGATORIE: il limite su CIMEA. Vedi il commento in testa. */
      limitHeading: z.string(),
      limitBody: z.string(),
      officialSource: z.url(),
    }),
    /** «Sempre connessi»: la vision operativa dell'analisi (§1). */
    connected: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      points: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    limits: z.object({ heading: z.string(), items: z.array(z.string()) }),
    /**
     * CTA sdoppiata: lo studente e l'istituzione non vanno nello stesso imbuto.
     * Le destinazioni le decide il template (routes.ts), non il contenuto.
     */
    finalCta: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      studentLabel: z.string(),
      studentNote: z.string(),
      institutionLabel: z.string(),
      institutionNote: z.string(),
    }),
  }),
});
/**
 * Partner B2B — l'unica pagina del sito che NON parla allo studente. Il lettore
 * è il direttore di un'agenzia di reclutamento estera o il referente di un
 * ufficio international: valuta volumi, rischio e margine, non un sogno di
 * studio. Qui Kimere smette di rassicurare e comincia a proporre un accordo.
 *
 * La sequenza dei blocchi è quella del brief commerciale (2026-08-11):
 *   hero         → la promessa commerciale, non emotiva
 *   segments     → due interlocutori, due conversazioni separate
 *   seminar      → il lead magnet, ed è il blocco dominante della pagina
 *   obstacle     → perché un ateneo estero si ferma davanti all'Italia
 *   pricing      → le due tariffe B2B, scoperte
 *   dueDiligence → cosa scoprirebbero comunque verificando
 *   form         → la prenotazione del seminario
 *
 * ⚠️ QUATTRO vincoli che questo schema non può imporre ma che valgono per il copy.
 *
 * 1. NESSUN operatore terzo nominato, mai. Citare per nome una rete di studentati
 *    o un ateneo suggerisce un rapporto che non esiste, e chi legge questa pagina
 *    verifica per mestiere.
 * 2. NESSUNA percentuale di conversione, e nessuna promessa di iscrizioni.
 *    L'analisi dice che gli atenei privati sono attratti dalle «percentuali di
 *    conversione»: è la loro motivazione, non un dato che Kimere possieda. Kimere
 *    opera da giugno 2026 e non ha uno storico: pubblicare un tasso — o anche solo
 *    «alte percentuali» — sarebbe un numero inventato su una pagina che si legge
 *    con il contratto in mano. Si dice cosa si toglie di mezzo, non quanto rende.
 * 3. NESSUNA cifra non verificata. `obstacle.metrics` riporta solo numeri che il
 *    sito già dichiara altrove con la loro fonte (vedi studyInItalyPage): conteggi
 *    di studenti internazionali e di corsi disponibili erano stati esclusi in
 *    quella pagina perché non verificabili, e non rientrano qui di soppiatto.
 * 4. NESSUNA affermazione sullo stato d'animo di atenei terzi. L'analisi dice che
 *    «molte università estere (es. argentine) temono l'Italia»: sul sito il fatto
 *    si racconta dal lato di Kimere — la domanda che ci arriva più spesso — non
 *    come diagnosi di ciò che pensano istituzioni reali e nominabili.
 *
 * ⚠️ `pricing.billingNote` e `pricing.limits` sono OBBLIGATORIE, per le stesse
 * ragioni di `forStudentsPage`: la valuta è il dollaro, l'importo definitivo va
 * confermato per iscritto, e una tariffa per studente non è una garanzia di
 * visto, ammissione o borsa — decisioni che spettano a consolati, atenei ed enti
 * erogatori. Senza quei due campi il listino promette un esito.
 *
 * ⚠️ `dueDiligence` sta PRIMA del modulo e non in fondo alla pagina: un'agenzia
 * scopre comunque che Kimere opera da giugno 2026 e non ha accreditamenti, e
 * scoprirlo da sé dopo tre schermate di promesse ferma la trattativa.
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
    /**
     * I due interlocutori hanno bisogni disgiunti e vanno separati: l'ateneo è un
     * canale di acquisizione e il suo approfondimento è il seminario qui sotto;
     * l'agenzia è una trattativa commerciale, e ha bisogno del confine disegnato,
     * degli impegni scritti e della sequenza con cui si comincia. L'asimmetria
     * delle due metà è voluta, non una dimenticanza.
     */
    segments: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      universities: z.object({
        eyebrow: z.string(),
        heading: z.string(),
        body: z.string(),
        points: z.array(z.object({ icon: stepIconName, title: z.string(), body: z.string() })),
        ctaLabel: z.string(),
      }),
      agencies: z.object({
        eyebrow: z.string(),
        heading: z.string(),
        body: z.string(),
        /** Etichette per ILL-04: dove finisce il loro lavoro e comincia il nostro. */
        handover: z.object({
          theirLabel: z.string(),
          theirItems: z.array(z.string()),
          handoverLabel: z.string(),
          ourLabel: z.string(),
          ourItems: z.array(z.string()),
        }),
        /**
         * La paura numero uno di chi valuta un partner sul territorio è che il
         * partner gli porti via il cliente — simmetrica al rischio che l'analisi
         * attribuisce alle agenzie. Sono impegni che Kimere prende su di sé,
         * legittimi da pubblicare, non affermazioni su terzi.
         */
        commitmentsHeading: z.string(),
        commitments: z.array(z.string()),
        startHeading: z.string(),
        steps: z.array(z.object({ title: z.string(), body: z.string() })),
        ctaLabel: z.string(),
      }),
    }),
    /**
     * Il lead magnet, e il blocco che deve dominare la pagina: la prima sessione
     * di seminario online è gratuita ed è modellata sul mercato dell'ateneo, non
     * sul nostro. `points` deve restare identico a `forUniversities.seminarPoints`
     * della home: è la stessa offerta descritta due volte, e due descrizioni che
     * divergono si notano.
     */
    seminar: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      points: z.array(z.string()),
      stepsHeading: z.string(),
      steps: z.array(z.object({ title: z.string(), body: z.string() })),
      ctaLabel: z.string(),
      note: z.string(),
    }),
    /**
     * L'ostacolo vero: non gli atenei italiani, ma il fatto che nessuno nella
     * stanza sappia come funzionano borse di studio e ISEE. Ogni voce porta la
     * risposta operativa accanto alla paura — la paura da sola è solo un ostacolo
     * in più. Vedi il vincolo 4 in testa: si racconta dal lato di Kimere.
     */
    obstacle: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })),
      answerLabel: z.string(),
      fears: z.array(
        z.object({
          icon: stepIconName,
          title: z.string(),
          body: z.string(),
          answer: z.string(),
        }),
      ),
      linkLabel: z.string(),
      officialSource: z.url(),
    }),
    /**
     * Le due tariffe B2B, scoperte. Deroga esplicita del cliente alla regola
     * «nessun prezzo sul sito», come in `forStudentsPage`: qui il prezzo serve
     * all'agenzia per calcolare il proprio costo per pratica prima di preventivare
     * al cliente finale, e all'ateneo per vedere quanto vale lo sconto riservato.
     *
     * ⚠️ La quota all-inclusive va dichiarata PER L'ITALIA. È il mercato in cui
     * Kimere gestisce il percorso di persona, e l'accompagnamento fisico sul
     * territorio non diventa replicabile altrove per decreto: una tariffa unica
     * «per qualsiasi destinazione» sarebbe una promessa che si rompe alla prima
     * pratica fuori dall'Italia.
     */
    pricing: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      plans: z.array(
        z.object({
          audience: z.enum(['agency', 'university']),
          name: z.string(),
          /** La cifra dell'analisi, testuale: nessun calcolo, nessuna conversione. */
          price: z.string(),
          priceUnit: z.string(),
          body: z.string(),
          includesHeading: z.string(),
          includes: z.array(z.string()),
          note: z.string(),
        }),
      ),
      /** Rimando alla tariffa pubblica su «Per gli studenti»: rende reale lo sconto. */
      compareLabel: z.string(),
      /** OBBLIGATORIA: valuta e conferma scritta. Vedi il commento in testa. */
      billingNote: z.string(),
      /** OBBLIGATORIE: cosa la tariffa NON compra. Vedi il commento in testa. */
      limitsHeading: z.string(),
      limits: z.array(z.string()),
    }),
    /**
     * Ciò che un'agenzia scoprirebbe comunque verificando. Dirlo per primi è
     * l'unico modo in cui non diventa il motivo per cui la trattativa si ferma:
     * su questa pagina la trasparenza è un argomento di vendita.
     */
    dueDiligence: z.object({ heading: z.string(), items: z.array(z.string()) }),
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
  forStudentsPage,
  languageCoursesPage,
  studyInItalyPage,
  servicesPage,
  aboutPage,
  partnersPage,
  thankYouPage,
};
