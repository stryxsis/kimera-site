# Kimere International Academy & Consulting — sito web

Sito istituzionale per Kimere, agenzia di consulenza e relocation per studenti internazionali
diretti in Italia. Costruito in Astro 7 (output statico), Tailwind CSS 4, contenuti in JSON
validati con Zod, deploy su Netlify.

Il progetto procede per fasi con gate di approvazione — vedi [`PLAN.md`](PLAN.md) per la roadmap
completa e [`PROGRESS.md`](PROGRESS.md) per lo stato corrente e le decisioni prese.
La strategia (posizionamento, persona, sitemap, mappa dei contenuti, decisioni tecniche) è in
[`docs/`](docs/).

## Setup

Requisiti: Node ≥ 22.12 (verificato con 24.11.1), npm ≥ 9.6.5.

```bash
npm install
npm run dev        # server di sviluppo — http://localhost:4321
```

## Script disponibili

| Comando                | Cosa fa                                                                    |
| :--------------------- | :------------------------------------------------------------------------- |
| `npm run dev`          | Server di sviluppo con hot reload                                          |
| `npm run build`        | Build di produzione in `dist/`                                             |
| `npm run preview`      | Serve il build di produzione in locale                                     |
| `npm run check`        | Type-check (`astro check`)                                                 |
| `npm run format`       | Formatta con Prettier (astro + tailwind plugin)                            |
| `npm run format:check` | Verifica la formattazione senza scrivere                                   |
| `npm run lint:content` | Verifica la parità di chiavi tra i dizionari e le content collection EN/IT |
| `npm run check:contrast` | Calcola il contrasto WCAG di ogni coppia di colori usata dal design system |
| `npm run check:output` | Controlla l'HTML generato: asterischi non renderizzati, `<h1>` duplicati, risorse da domini terzi, `lang` mancante |
| **`npm run verify`**   | **La catena completa: contenuti → contrasti → tipi → build → output.** È il comando da lanciare prima di ogni commit |

## Struttura del progetto

```
src/
├── i18n/            routes.ts (mappa slug EN/IT) · ui/en.ts, ui/it.ts (micro-copy) · utils.ts
├── lib/             field.ts (convenzione degli id per aria-describedby)
├── content.config.ts   schema Zod delle 12 content collection
├── content/         contenuti JSON per lingua (en/, it/) — 96 file
├── layouts/          BaseLayout (shell HTML, meta, hreflang) · PageLayout (header/main/footer)
├── components/
│   ├── layout/        Header, Footer, Nav, LanguageSwitcher, SkipLink
│   ├── ui/            Section, Button, Card, Badge, Accordion, Field, Input
│   ├── brand/         Logo, LogoMark — il marchio ridisegnato in SVG
│   └── illustrations/ RouteMap (ILL-01) · OfficesGrid · StepIcon · HandoverDiagram · BrokenRoute
├── styles/global.css   token del design system (@theme), superfici, componenti CSS
├── assets/brand/       il JPG ricevuto dal cliente — riferimento, non asset di produzione
└── pages/en/, pages/it/  una route per lingua, generata secondo src/i18n/routes.ts
```

Le due lingue di ogni pagina sono **lo stesso file con una riga diversa** (`const locale`):
ogni testo visibile viene dalle content collection o dal dizionario UI, nessuno è scritto nel
template. `npm run lint:content` verifica che le due lingue non divergano.

## Design system

Direzione **«Rotta»**, documentata in [`docs/design-system.md`](docs/design-system.md) e navigabile
su **`/en/styleguide/`** (pagina interna, `noindex`).

Il principio in una riga: il colore d'accento **non è una costante, dipende dalla superficie** —
l'oro del brand è illeggibile su chiaro (2.33) e AAA su scuro (8.59), il teal fa l'opposto. Le classi
`.surface-dark` / `.surface-panel` / `.surface-light` ridefiniscono un set di variabili e ogni
componente legge quelle, così prende da solo la variante conforme. `npm run check:contrast` verifica
tutte le coppie in uso.

Il routing usa l'i18n nativo di Astro: `defaultLocale: 'en'`, `prefixDefaultLocale: true`.
`/` reindirizza a `/en/`. Gli slug italiani sono localizzati (es. `/it/percorso/`, non
`/it/process/`) — la mappa unica è in `src/i18n/routes.ts`.

## Internazionalizzazione

- **Micro-copy di interfaccia** (nav, bottoni, aria-label) → `src/i18n/ui/{en,it}.ts`, tipizzati.
- **Contenuti di pagina** (testi, FAQ, passi del processo) → `src/content/*` in JSON, validati da
  Zod in `src/content.config.ts`. Popolati in FASE 3.
- Aggiungere una lingua: aggiungere una colonna in `src/i18n/routes.ts` e un file `ui/<lingua>.ts`.
  Nessuna modifica strutturale al router.
- `npm run lint:content` intercetta in CI/build una chiave dimenticata in una delle due lingue.

## Stato del progetto

**FASE 4 completata** — design system, marchio ridisegnato in SVG, illustrazioni e home implementata
end-to-end in entrambe le lingue. Le pagine restanti (Percorso, Servizi, Alloggio, Costi, Chi siamo,
FAQ, Partner) hanno già il contenuto reale ma non ancora il trattamento visivo: arriva in FASE 5.
`book`, `privacy` e `cookies` restano scaffold fino alla FASE 6 (form e legal).

Vedi `PROGRESS.md` per lo stato dettagliato, le decisioni prese e le questioni ancora aperte con il
cliente.

## Deploy

Netlify, configurazione in `netlify.toml`. **Nessun deploy viene eseguito senza conferma esplicita
del cliente** (FASE 9) — vedi `docs/tech-decisions.md` §10.
