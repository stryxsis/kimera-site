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

## Struttura del progetto

```
src/
├── i18n/            routes.ts (mappa slug EN/IT) · ui/en.ts, ui/it.ts (micro-copy) · utils.ts
├── content.config.ts   schema delle content collection (processSteps, packages, faq, legal)
├── content/         contenuti JSON/Markdown per lingua — popolati in FASE 3
├── layouts/          BaseLayout (shell HTML, meta, hreflang) · PageLayout (header/main/footer)
├── components/
│   ├── layout/        Header, Footer, Nav, LanguageSwitcher, SkipLink
│   ├── sections/       sezioni di pagina — popolate in FASE 4/5
│   ├── ui/             componenti base (Button, Card, …) — FASE 4
│   └── illustrations/  SVG — FASE 4.4
├── styles/global.css   import Tailwind — token di design system arrivano in FASE 4
├── assets/brand/        asset del logo (sorgente JPG ricevuto dal cliente)
└── pages/en/, pages/it/  una route per lingua, generata secondo src/i18n/routes.ts
```

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

FASE 2 (scaffolding tecnico) — routing, layout scheletrici, content collection e tooling.
**Nessun lavoro estetico**: il design system arriva in FASE 4. Nessun testo di marketing definitivo:
il copy arriva in FASE 3. Vedi `PROGRESS.md` per lo stato dettagliato e le questioni aperte.

## Deploy

Netlify, configurazione in `netlify.toml`. **Nessun deploy viene eseguito senza conferma esplicita
del cliente** (FASE 9) — vedi `docs/tech-decisions.md` §10.
