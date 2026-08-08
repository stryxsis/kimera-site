# Decisioni tecniche

> Vincola FASE 2 (scaffolding) e tutte le successive.
> Versioni verificate sul registry npm in data 2026-08-08.

---

## 1. Stack

| Livello | Scelta | Versione | Motivazione |
| :--- | :--- | :--- | :--- |
| Framework | **Astro** | `7.2.0` | Output statico puro, zero JS di default. Il sito è contenuto: ogni KB di runtime sarebbe puro costo. i18n e content collections sono nativi. |
| Output | **`static`** | — | Nessuna necessità di SSR: nessuna area riservata, nessun contenuto per utente. Statico = Lighthouse alto senza sforzo e superficie d'attacco minima su un sito che tratta dati sensibili. |
| CSS | **Tailwind CSS** | `4.3.3` via `@tailwindcss/vite` | Token come custom properties native in `@theme`, nessun file di config JS, tree-shaking automatico. Il design system della FASE 4 vive nei token, non nelle classi. |
| Hosting | **Netlify** | — | Come da master prompt. Forms integrati, deploy preview per branch, header di sicurezza da `netlify.toml`. |
| JS | **Vanilla, progressive enhancement** | — | Nessun framework UI. Le uniche isole interattive sono menu mobile, accordion, step del form e language switcher: si fanno in poche decine di righe. |
| Contenuti | **Content collections + JSON** | — | Vedi §4. |
| Formattazione | **Prettier** + `prettier-plugin-astro` `0.14.1` + `prettier-plugin-tailwindcss` | — | Vedi §9. |
| Type check | **`astro check`** | — | Vedi §9. |

**Runtime:** Node ≥ 22.12.0 richiesto da Astro 7 — in locale abbiamo 24.11.1 ✓

### Cosa NON entra nel progetto

Nessuna animation library (GSAP, Framer Motion, Lenis), nessuna UI library, nessun icon package,
nessun carousel, nessun analytics di terze parti in v1, nessun font da CDN.
Ogni aggiunta richiede approvazione esplicita del cliente (regola del master prompt).

---

## 2. Novità di Astro 7 che ci riguardano — verificate

Astro 7 introduce cambiamenti che condizionano l'implementazione. Verificati leggendo le dipendenze
reali del pacchetto `astro@7.2.0`, non solo la documentazione.

| Cambiamento | Impatto sul progetto | Azione |
| :--- | :--- | :--- |
| **Compilatore Rust** (`@astrojs/compiler-rs`) di default: tag non chiusi = errore, HTML semanticamente invalido non più auto-corretto | **Positivo.** Impone HTML valido, che è precondizione dell'accessibilità. Ma va scritto con disciplina fin dalla FASE 2. | Nessuna mitigazione: è il comportamento desiderato |
| **`compressHTML` passa da `true` a `'jsx'`**, rimuove più aggressivamente gli spazi tra elementi inline | ⚠️ **Rischio tipografico reale**: può mangiare gli spazi attorno a `<a>` e `<em>` dentro un paragrafo. Il nostro copy è pieno di link inline e termini in corsivo. | **Verificare in FASE 2** con un paragrafo di prova contenente link ed enfasi inline. Se degrada, impostare `compressHTML: true` |
| **Markdown: `@astrojs/markdown-satteri`** sostituisce remark/rehype | Impatto **basso**: la nostra strategia contenuti è JSON, non markdown (§4). Il markdown resta solo per eventuali testi lunghi nelle pagine legali. | Se servissero plugin markdown, valutare l'equivalente Satteri o reinstallare `@astrojs/markdown-remark` |
| **Zod 4** (`zod@^4.3.6`) | Gli schemi delle content collection usano l'API Zod 4. | Usare `z` importato da `astro:content`, non una versione separata |
| **Vite 8** | Nessun plugin Vite custom previsto. | Nessuna |
| **`src/fetch.ts` è un nome riservato** | Nessun conflitto: non usiamo quel percorso. | Evitare quel nome |

---

## 3. Internazionalizzazione

### Configurazione

```ts
// astro.config.ts
i18n: {
  locales: ['en', 'it'],
  defaultLocale: 'en',
  routing: {
    prefixDefaultLocale: true,
    redirectToDefaultLocale: true,
  },
}
```

### Decisione: `prefixDefaultLocale: true` → `/en/` e `/it/`, con `/` che redirige a `/en/`

Alternativa scartata: lasciare l'inglese senza prefisso (`/services/` e `/it/servizi/`).

| | `/en/` + `/it/` (**scelta**) | `/` + `/it/` (scartata) |
| :--- | :--- | :--- |
| Simmetria | Totale — ogni lingua è un cittadino di serie A | L'inglese resta privilegiato per sempre |
| Aggiungere una terza lingua | Nessuna modifica strutturale | Struttura asimmetrica permanente |
| `hreflang` e `x-default` | Espliciti e non ambigui | Richiede attenzione sul root |
| URL della home EN | `/en/` (un redirect dal root) | `/` (leggermente più pulito) |

Il vincolo di prodotto dice *"architettura predisposta per aggiungere altre lingue in futuro"*.
La simmetria vale più del singolo redirect sul root, che Netlify serve a livello edge a costo zero.

### Slug localizzati

Gli URL italiani sono in italiano (`/it/percorso/`, non `/it/process/`). Serve il canale B2B verso
agenzie e atenei italiani, che cercano in italiano.

Implementazione: **mappa centrale di route**, unica fonte di verità per router, navigazione,
language switcher, sitemap e `hreflang`.

```ts
// src/i18n/routes.ts
export const routes = {
  home:      { en: '',         it: ''                  },
  process:   { en: 'process',  it: 'percorso'          },
  services:  { en: 'services', it: 'servizi'           },
  housing:   { en: 'housing',  it: 'alloggio'          },
  costs:     { en: 'costs',    it: 'costi'             },
  about:     { en: 'about',    it: 'chi-siamo'         },
  faq:       { en: 'faq',      it: 'domande-frequenti' },
  partners:  { en: 'partners', it: 'partner'           },
  book:      { en: 'book',     it: 'prenota'           },
  thankYou:  { en: 'thank-you',it: 'grazie'            },
  privacy:   { en: 'privacy',  it: 'privacy'           },
  cookies:   { en: 'cookies',  it: 'cookie'            },
} as const;
```

Le pagine si generano con `getStaticPaths()` a partire da questa mappa, così una nuova lingua si
aggiunge inserendo una colonna, senza creare file.

### Testi di interfaccia vs contenuti di pagina

Separazione netta, ed è una decisione importante per la manutenibilità:

- **Micro-copy di interfaccia** (nav, bottoni, label del form, messaggi di errore, aria-label) → dizionari TypeScript in `src/i18n/ui/en.ts` e `it.ts`, con helper `t()` tipizzato. Sono stringhe che toccano gli sviluppatori.
- **Contenuti di pagina** (titoli di sezione, paragrafi, FAQ, passi del processo) → content collections in JSON. Sono testi che tocca il cliente.

Mescolarli è l'errore che rende impossibile passare a un CMS più tardi.

### Regole i18n

- Nessun redirect automatico per IP o `Accept-Language`: cambierebbe l'URL sotto i piedi e romperebbe la condivisione dei link. Si può suggerire, mai imporre.
- `<html lang>` corretto per locale.
- Date e numeri con `Intl.DateTimeFormat` / `Intl.NumberFormat`, mai formati hardcodati.
- `translate="no"` su "Kimere" e sui termini burocratici italiani, per evitare che Google Translate li massacri.
- Il language switcher porta alla **pagina equivalente**, mai alla home.

---

## 4. Strategia contenuti

### Perché JSON e non Markdown

Il contenuto di questo sito è **strutturato**, non prosa: sezioni con titolo, sottotitolo, elenchi di
passi, ognuno con campi ricorrenti (`cosa succede`, `chi decide`, `quanto dura`, `cosa fa Kimere`).
Il markdown lo renderebbe una poltiglia impossibile da validare e da tradurre in modo affidabile.

Il JSON validato da schema Zod dà tre cose che ci servono:
1. **Errori di build** se un contenuto manca o è malformato — impossibile pubblicare una pagina rotta.
2. **Parità linguistica verificabile**: si può controllare in build che IT e EN abbiano le stesse chiavi.
3. **Percorso pulito verso un CMS**: un headless CMS espone JSON. Il giorno in cui si innesta, cambia il `loader`, non i componenti.

### Struttura

```
src/content/
├── pages/          en/home.json, en/process.json, …  it/…
├── packages/       en/admission.json, arrival.json, settled.json   it/…
├── processSteps/   en/steps.json (array ordinato)     it/…
├── faq/            en/faq.json (array con gruppi)     it/…
└── legal/          en/privacy.md, cookies.md          it/…   ← markdown, qui ha senso
```

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    officialSource: z.string().url().optional(),
  }),
});
```

Il campo `officialSource` **è nello schema apposta**: rende strutturalmente difficile pubblicare
un'affermazione su una procedura senza la fonte ufficiale. Il vincolo legale diventa un vincolo di tipo.

### Regola invariante

**Nessun testo visibile all'utente è hardcodato in un componente `.astro`.**
Vale per FASE 3, 4, 5 e 6. Un testo hardcodato è un testo che non verrà mai tradotto.

---

## 5. Struttura delle cartelle

```
kimere-site/
├── astro.config.ts
├── netlify.toml
├── tsconfig.json
├── package.json
├── PLAN.md · PROGRESS.md · README.md
├── docs/                    brand-brief · personas · sitemap-ia · content-map ·
│                            tech-decisions · design-system · glossary · a11y-report ·
│                            test-report · handoff
├── design/                  direction-a/b/c.html (FASE 4.1)
├── public/
│   ├── fonts/               woff2 self-hosted, subsettati
│   ├── brand/               logo SVG (FASE 4), favicon, OG image
│   └── robots.txt
└── src/
    ├── assets/              logo originale, illustrazioni sorgente
    ├── components/
    │   ├── ui/              Button, Card, Badge, Accordion, Input, Field…
    │   ├── sections/        Hero, ProcessTimeline, PackageGrid, FaqList…
    │   ├── layout/          Header, Footer, Nav, LanguageSwitcher, SkipLink
    │   └── illustrations/   SVG come componenti .astro
    ├── content/             vedi §4
    ├── i18n/                routes.ts · ui/en.ts · ui/it.ts · utils.ts
    ├── layouts/             BaseLayout, PageLayout, LegalLayout
    ├── pages/
    │   ├── index.astro          → redirect a /en/
    │   └── [lang]/              route generate dalla mappa
    └── styles/              global.css (@theme con i token), fonts.css
```

---

## 6. Gestione del form

### Netlify Forms — confermato per la v1

Verificato: dal 14 aprile 2026 le submission sono incluse nei piani a credito Netlify
(il limite di 100/sito riguarda i vecchi piani Free e Starter legacy).

### Il vincolo che condiziona l'implementazione

Netlify rileva i form **analizzando l'HTML statico al momento del deploy**. Un form multi-step
costruito in JavaScript **non viene visto**. Serve quindi:

1. Una **dichiarazione statica nascosta** contenente *tutti* i campi di *tutti* gli step, con `name` identici a quelli reali. È il contratto con Netlify: se un campo manca lì, quel dato si perde silenziosamente.
2. `data-netlify="true"` e `name="..."` sul form.
3. `<input type="hidden" name="form-name" value="...">` nel form reale.
4. Honeypot con `data-netlify-honeypot="bot-field"`, nascosto con `clip`/`clip-path` e **non** con `display: none` (i bot ignorano `display: none`).
5. Invio via `fetch()` in POST `application/x-www-form-urlencoded` per restare in pagina e controllare gli stati.

**Due form distinti:** `student-enquiry` e `partner-enquiry`. Campi e destinatari diversi.

### Progressive enhancement

Senza JavaScript il form deve funzionare comunque: si degrada a un unico form lungo con submit
nativo verso la pagina di ringraziamento. Un utente con JS bloccato è un lead perso, e su questo
pubblico non è un caso di scuola.

### ⚠️ Implicazione GDPR da mettere per iscritto

Il form raccoglie cittadinanza e informazioni sulla situazione economica di persone fisiche, e
Netlify conserva le submission su infrastruttura extra-UE.

Conseguenze obbligatorie:
- La privacy policy deve **nominare Netlify come responsabile del trattamento** e dichiarare il trasferimento extra-UE con la relativa base giuridica (SCC / DPA Netlify).
- **Minimizzazione**: nessun campo con importi patrimoniali. Si chiede la *consapevolezza del requisito consolare*, non il patrimonio (vedi `content-map.md`).
- Consenso privacy **non pre-spuntato**, separato da quello marketing.
- Retention: definire ogni quanto si cancellano le submission dalla dashboard Netlify. 🔶 input cliente.

**Alternativa registrata per la v2:** Netlify Function che inoltra direttamente via email senza
persistere nulla. Migliore per la minimizzazione, ma introduce una dipendenza da un provider email.
Non necessaria in v1.

---

## 7. Cookie, consenso e privacy

### In v1 il sito non ha bisogno di un banner di consenso

Conseguenza diretta di due scelte: **nessun analytics di terze parti** e **nessun tool di booking
incorporato** (D-04). Restano solo cookie tecnici, che non richiedono consenso preventivo.

Questo è un vantaggio concreto, non una rinuncia: nessun banner significa nessun attrito sul primo
contatto, CLS a zero e la postura privacy più pulita possibile per un sito che tratta pratiche
migratorie.

**Se in futuro si aggiunge anche uno solo tra analytics, un embed di booking o un pixel social,
il banner di consenso diventa obbligatorio.** Va scritto nell'handoff (FASE 9) in modo che nessuno
aggiunga uno script "veloce veloce" senza saperlo.

Se servissero statistiche, la raccomandazione è **Plausible o Umami** (cookieless, aggregati,
nessun consenso richiesto), non GA4.

---

## 8. Performance e accessibilità

### Target

- **Lighthouse ≥ 95** su tutte e quattro le categorie, in modalità mobile.
- **WCAG 2.2 livello AA.**
- **CLS = 0.**

### Come ci si arriva

| Area | Decisione |
| :--- | :--- |
| Font | Self-hosted in `public/fonts/`, formato `woff2`, subsettati a latin + latin-ext (l'italiano ne ha bisogno). `<link rel="preload">` sui soli due tagli critici, `font-display: swap`, metriche di fallback per azzerare il salto di layout. |
| JS | Solo isole vanilla. Nessun JS bloccante. Nessun framework runtime. |
| Immagini | Nessuna foto in v1. Le illustrazioni sono SVG inline (nessuna richiesta di rete) o file con `width`/`height` espliciti. |
| CSS | Un solo foglio, generato da Tailwind, senza `@import` a catena. |
| Contrasti | Verificati per ogni coppia. La palette del logo è già stata testata (`PROGRESS.md`): l'oro **non** è utilizzabile su cream. |
| Motion | Ogni animazione dietro `prefers-reduced-motion`. Solo `transform` e `opacity`, mai `transition: all`. |
| Tastiera | Ogni percorso navigabile. Skip link come primo elemento focusabile. Focus visibile ovunque, mai `outline: none` senza sostituto. |
| Semantica | `<button>` per le azioni, `<a>` per la navigazione. Un solo `<h1>`. Landmark completi. |
| Stato nell'URL | Accordion FAQ e step del form linkabili. |

### SEO

Sitemap con `@astrojs/sitemap` `3.7.3` · `hreflang` reciproci EN/IT + `x-default` → `/en/` ·
dati strutturati `Organization`, `Service`, `FAQPage` · Open Graph e Twitter card per pagina ·
`noindex` su `/thank-you/` e `/styleguide/` · URL parlanti localizzati.

> ⚠️ Il markup `Organization` richiede dati societari reali. Finché la società non è costituita si
> usano solo i campi verificabili (nome, URL, logo, profili social). **Niente `address` o
> `vatID` inventati**: sarebbero dati falsi in markup strutturato, cosa che Google penalizza e che
> viola il divieto di invenzioni.

---

## 9. Qualità del codice

- **Prettier** con `prettier-plugin-astro` (`0.14.1`) e `prettier-plugin-tailwindcss` per l'ordinamento deterministico delle classi.
- **`astro check`** per il type-checking, in `npm run check` e come gate prima di ogni commit di fase.
- **Niente ESLint in v1.** Su un sito statico con poche decine di righe di JS vanilla, il rapporto tra configurazione da mantenere e bug intercettati non lo giustifica. Se il JS dovesse crescere, si aggiunge.
- **`npm run build` deve passare pulito** alla fine di ogni fase. È il criterio di accettazione minimo.

### Script

| Comando | Cosa fa |
| :--- | :--- |
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione in `dist/` |
| `npm run preview` | Anteprima locale del build |
| `npm run check` | `astro check` — tipi ed errori |
| `npm run format` | Prettier in scrittura |
| `npm run lint:content` | Script custom: verifica la parità di chiavi tra EN e IT |

`lint:content` non è un vezzo: con due lingue e contenuti in JSON, una chiave dimenticata in italiano
produce una pagina monca che nessuno nota fino al lancio.

---

## 10. Repository e deploy

- **`git init` in FASE 2** (il progetto non è ancora un repository).
- Un commit atomico per fase, messaggio in inglese, formato `feat(phase-n): …`.
- `.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.netlify/`, `.env*`, `.DS_Store`.
- **Nessun segreto nel repository.** Netlify esegue una scansione dei segreti dopo il build e fa fallire il deploy se ne trova.
- `netlify.toml` con comando di build, directory di pubblicazione, redirect `/` → `/en/` e header di sicurezza (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Deploy preview automatica per branch.
- **Nessun deploy senza conferma esplicita del cliente** (FASE 9).

---

## 11. Rischi tecnici aperti

| Rischio | Probabilità | Impatto | Mitigazione |
| :--- | :--- | :--- | :--- |
| `compressHTML: 'jsx'` degrada la spaziatura inline | Media | Medio | Test dedicato in FASE 2; fallback `compressHTML: true` |
| Netlify non rileva il form multi-step | Media | **Alto** — lead persi in silenzio | Dichiarazione statica nascosta + test end-to-end reale in FASE 6, con verifica che la mail arrivi |
| Astro 7 è recente: possibili spigoli in integrazioni di contorno | Media | Basso | Poche dipendenze, tutte di prima parte |
| Lighthouse < 95 per i font | Bassa | Medio | Subsetting, preload, metriche di fallback |
| Divergenza di contenuti tra EN e IT | **Alta** | Medio | `lint:content` come gate di build |
| Dati societari mancanti al lancio | Media | **Alto** — bloccante legale | Sollecitati fin dalla FASE 1 (questione #6 in `PROGRESS.md`) |
