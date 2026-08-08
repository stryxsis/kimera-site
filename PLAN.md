# PLAN — Sito Kimere International Academy & Consulting

> Piano d'azione completo. **Modificabile solo con ok esplicito del cliente.**
> Stato di avanzamento in `PROGRESS.md`. Fondamenta strategiche in `docs/`.
>
> Legenda: `[ ]` da fare · `[x]` fatto · ★ critico · ⚠️ dipende da input cliente

---

## Obiettivo

Un sito che porti uno studente internazionale qualificato a prenotare una call di 15 minuti,
costruendo abbastanza fiducia da fargli affidare a Kimere la propria pratica di visto —
senza prezzi pubblici, senza foto, senza prova sociale.

**Il criterio di successo di ogni singola pagina:** risponde alla domanda *"posso fidarmi di questa
gente con la mia pratica?"* e spinge verso la call.

---

## Dipendenze critiche

```
FASE 1 ✓ ──→ FASE 2 ──→ FASE 3 ──→ FASE 4 ──→ FASE 5 ──→ FASE 6 ──→ FASE 7 ──→ FASE 8 ──→ FASE 9
                                      ↑                      ↑                            ↑
                                 logo SVG              dati societari              account Netlify
                                 (ok, JPG c'è)         ⚠️ BLOCCANTE                ⚠️ conferma
```

**Il vero cammino critico non è tecnico, è informativo.** Tre input del cliente possono fermare il
progetto e vanno sollecitati ora, non quando servono:

| Input | Serve entro | Se non arriva |
| :--- | :--- | :--- |
| ⚠️ Perimetro dei 3 pacchetti | FASE 3 | Uso la proposta Admission/Arrival/Settled, da rifare dopo |
| ⚠️ Dati societari (titolare del trattamento) | FASE 6 | **Blocca il lancio**: nessuna privacy policy valida |
| ⚠️ Conferma account Netlify e dominio | FASE 9 | Nessun deploy |

---

## FASE 0 — Ricognizione ✅ COMPLETATA

- [x] Lettura integrale dell'analisi strategica
- [x] Ricognizione progetto e toolchain (Node 24.11.1, npm 11.3.0, git 2.47.1)
- [x] Verifica presenza web pubblica del brand — nessun risultato indicizzato
- [x] Analisi del logo: naming confermato, payoff scoperto, palette estratta, contrasti verificati
- [x] `PROGRESS.md` con decisioni D-01→D-06 e questioni aperte

---

## FASE 1 — Fondamenta strategiche ✅ COMPLETATA · OPUS

- [x] `docs/brand-brief.md` — posizionamento, USP, archetipo, tono di voce, naming dei servizi
- [x] `docs/personas.md` — Aarav (extra-UE), Sofia (Erasmus UE), Rania (agenzia B2B)
- [x] `docs/sitemap-ia.md` — 13 route per lingua, funnel B2C e B2B separati
- [x] `docs/content-map.md` — sezioni per pagina, campi del form, inventario illustrazioni
- [x] `docs/tech-decisions.md` — Astro 7.2, Tailwind 4.3, i18n, contenuti, form, performance
- [x] `PLAN.md`

**Criterio di accettazione:** i 6 file esistono, sono coerenti, e le 5 decisioni chiave sono state
presentate al cliente. ✅

---

## FASE 2 — Scaffolding tecnico · SONNET

**Skill:** `astro`, `web-design-guidelines`
**Nessun lavoro estetico.** Solo HTML semantico non stilizzato.

- [ ] `git init` + `.gitignore` (il progetto non è ancora un repository)
- [ ] `npm create astro` — Astro 7.2, TypeScript strict, output `static`
- [ ] Tailwind 4.3 via `@tailwindcss/vite`
- [ ] `astro.config.ts`: `i18n` con `prefixDefaultLocale: true`, `site`, integrazione sitemap
- [ ] ★ **Test `compressHTML`**: paragrafo con link ed enfasi inline, verifica che non mangi gli spazi. Se degrada → `compressHTML: true`
- [ ] `src/i18n/routes.ts` — mappa slug EN/IT
- [ ] `src/i18n/ui/en.ts` e `it.ts` + helper `t()` tipizzato
- [ ] `src/content.config.ts` — collection tipizzate con Zod 4, incluso il campo `officialSource`
- [ ] Struttura cartelle come da `tech-decisions.md` §5
- [ ] `BaseLayout` con `<html lang>`, meta, skip link, landmark
- [ ] Header, Footer, Nav, LanguageSwitcher scheletrici — **HTML semantico, zero stile**
- [ ] Tutte le 13 route × 2 lingue generate da `getStaticPaths()`, anche vuote
- [ ] `/` → redirect a `/en/`
- [ ] Prettier + plugin astro e tailwind
- [ ] Script npm: `dev`, `build`, `preview`, `check`, `format`, `lint:content`
- [ ] `lint:content` — verifica parità di chiavi EN/IT
- [ ] `README.md` con istruzioni di setup
- [ ] `netlify.toml` base (build, publish, redirect root)

**Criteri di accettazione**
- `npm run build` passa pulito, `npm run check` senza errori
- Le 26 route rispondono, il sito è navigabile in entrambe le lingue
- Il language switcher porta alla pagina equivalente, non alla home
- Nessun testo hardcodato nei componenti

`git commit -m "feat(phase-2): scaffold Astro project with i18n routing and content collections"`

---

## FASE 3 — Copywriting e contenuti · SONNET

**Skill:** `landing-page-copywriter` (con gli **override** del brand brief §5), `brand-guidelines`

- [ ] ★ **Scrivere `/process/` per prima** — è la pagina cardine, detta il tono a tutto il resto
- [ ] Home, Services ⚠️, Housing, Costs, About ⚠️, FAQ ⚠️, Partners ⚠️
- [ ] Micro-copy: label, hint, placeholder con `…`, errori con indicazione di rimedio, bottoni verbo+risultato
- [ ] `docs/glossary.md` — termini burocratici italiani spiegati in inglese
- [ ] Disclaimer con rinvio alle fonti ufficiali su Process, Costs, FAQ
- [ ] Versione italiana — **adattamento, non traduzione letterale**
- [ ] Payoff IT: "Il tuo futuro, semplificato" da confermare
- [ ] Passata finale di editing su tutto in un colpo solo

**Vincoli invarianti**
- Zero prezzi · zero prova sociale · zero garanzie di esito
- Ogni cifra tracciabile all'analisi, datata, con fonte
- Frasi sotto le 20 parole, inglese per non madrelingua
- Nessun testo hardcodato: tutto in content collection

**Criteri di accettazione**
- Zero placeholder nel sito
- Ogni affermazione di competenza poggia su un dettaglio concreto verificabile
- `lint:content` verde: parità EN/IT
- Nessuna parola della lista vietata (brand brief §5)

`git commit -m "feat(phase-3): write all site copy in English and Italian"`

---

## FASE 4 — Direzione visiva e design system · OPUS ★

**Skill:** `frontend-design`, `canvas-design`, `brand-guidelines`, `web-design-guidelines`, `accessibility`
**La fase in cui la qualità estetica fa la differenza.**

### 4.1 — Tre direzioni visive ✅
- [x] `design/direction-a.html`, `-b.html`, `-c.html` — mockup statici completi di home above-the-fold + sezione pacchetti
- [x] Per ciascuna: concept, palette, coppia tipografica, trattamento illustrazioni, mood → `design/README.md`
- [x] Tutte e tre partono dalla palette del logo (D-06) ma la interpretano diversamente
- [x] Extra: toggle EN/IT con copy reale in ogni mockup (verifica della tenuta bilingue)
- [x] Extra: 31 coppie di colore verificate per contrasto WCAG, 0 fallite

**Vincoli creativi:** deve sembrare un'istituzione affidabile, non una startup.
Niente gradienti viola/blu da template SaaS, niente card identiche con icona tonda, niente hero con
dashboard fluttuante. Deve reggere senza fotografie e in due lingue di lunghezza diversa.

### 4.2 — Gate: il cliente sceglie ✅
- [x] **Scelta: direzione B «Rotta»**, con una modifica — via la barra di copertura dalle tre card
      dei livelli, sostituita da elenchi con voci spuntate. Applicata. Registrata come D-13.

### 4.3 — Design system ✅
- [x] Token in `@theme`: colore (contrasti verificati), scala tipografica fluida, spaziature, radius, motion
- [x] **Sistema a due superfici**: l'accento cambia da solo in base alla superficie (D-15)
- [x] Componenti: Button (tutte le varianti e stati), Input, Field, Card, Badge, Accordion, Section, Nav, Footer
- [x] Griglia e breakpoint — contenitore `.wrap` unico, griglie `auto-fit` protette a 320px
- [x] Font self-hosted, zero richieste a domini terzi (D-14)
- [x] `docs/design-system.md` + pagina `/en/styleguide/` navigabile
- [x] Extra: `npm run check:contrast` e `npm run check:output` come controlli permanenti

### 4.4 — Illustrazioni ✅
- [x] ★ `ILL-01` mappa del percorso studente — in HTML+CSS, non SVG: contiene testo vero
- [x] `ILL-02` diagramma degli enti coinvolti · `ILL-03` icone dei tre livelli
- [x] `ILL-04` modello B2B · `ILL-05` icone dei passi · `ILL-06` filigrana · `ILL-07` 404
- [x] ★ **Ridisegno del logo in SVG**: lockup completo + versione ridotta + favicon. Wordmark come testo vero, non tracciato
- [x] Accessibilità: `aria-hidden` di default, `role="img"` + titolo solo se informative

### 4.5 — Home page completa ✅
- [x] Implementazione end-to-end in EN e IT, un solo file per pagina (differisce di una riga)
- [x] Animazione d'ingresso unica e sobria, disattivata da `prefers-reduced-motion`
- [x] 404 rifatta con `ILL-07`

**Criteri di accettazione**
- [x] Griglie protette fino a 320px (corretti due sfondamenti reali nella styleguide).
      ⚠️ Verifica visiva in browser non eseguita: Playwright non installato
- [x] Styleguide pubblicata, design system documentato
- [x] Contrasti verificati su ogni coppia usata — 24 coppie, 0 sotto soglia, con controllo automatico
- [x] La home è il riferimento di qualità per tutte le altre pagine

`git commit -m "feat(phase-4): establish design system and implement home page"`

---

## FASE 5 — Pagine restanti · SONNET ✅ COMPLETATA

**Skill:** `astro`, `frontend-design`, `web-design-guidelines`

- [x] Process ★ · Services · Housing · Costs · About · Partners · FAQ · Thank you
- [x] Tutte in EN e IT (stesso file, una riga di locale diversa — pattern delle FASE 3/4)
- [x] Riuso rigoroso di componenti e token della FASE 4 — nessun componente UI nuovo
- [x] Pattern nuovi ma generici (non invenzioni una tantum) promossi a `global.css`:
      `.block-heading`/`.block-lead`, `.kv-list`, `.callout`(+`--warning`),
      `.checklist--negative`, `.steps-numbered`, `.closing-cta` — usati da più pagine,
      e la home è stata rifattorizzata per usarli anch'essa (zero duplicazione)
- [x] `book`, `privacy`, `cookies` restano scaffold: senza content collection propria,
      il loro contenuto reale (form multi-step, dati legali) arriva in FASE 6 — non uno
      scarto di scope, una lettura del confine tra le fasi del master prompt
- [x] `Badge` (esistente, non ancora usato su pagine reali) applicato a Costs per le cifre
- [x] `HandoverDiagram` (ILL-04, esistente) collegato a Partners

**Criteri di accettazione**
- [x] Nessun valore hardcodato fuori dai token
- [x] Nessuna invenzione stilistica nuova — solo composizione dei pattern esistenti
- [x] Coerenza visiva verificata pagina per pagina rispetto alla home (ispezione dell'HTML
      generato: h1 unico, struttura heading coerente, nessun asterisco vagante)
- [x] `npm run verify` verde: lint:content, 27 coppie di contrasto (0 sotto soglia),
      check tipi, build (28 pagine), check:output

**Bug trovato durante la fase:** il colore del callout di avviso (truffe sull'alloggio)
falliva il contrasto — 2.84 invece di 4.5. Non era nel controllo automatico perché nato
in questa fase, dopo l'ultimo giro di `check:contrast`. Corretto rendendolo dipendente
dalla superficie (`--surface-warning`, come `--surface-accent`) e aggiunto alle 3 nuove
coppie verificate automaticamente — lo stesso schema del bug trovato in FASE 4.

`git commit -m "feat(phase-5): implement remaining pages in both languages"`

---

## FASE 6 — Form, integrazioni, legal · SONNET

**Skill:** `astro`, `netlify-deploy`, `accessibility`

- [ ] ★ **Dichiarazione statica nascosta** con tutti i campi di tutti gli step — senza, Netlify non rileva il form e i lead si perdono in silenzio
- [ ] Form multi-step `student-enquiry` con progressive disclosure e indicatore di avanzamento
- [ ] Biforcazione UE / extra-UE sulla cittadinanza
- [ ] Form `partner-enquiry` separato, campi B2B
- [ ] Validazione client con messaggi non colpevolizzanti + validazione server
- [ ] Honeypot `data-netlify-honeypot`, nascosto con `clip` **non** con `display:none`
- [ ] Degradazione senza JS: form unico con submit nativo
- [ ] Pagina di ringraziamento con SLA di risposta ⚠️
- [ ] ⚠️ Privacy policy — **Netlify come responsabile, trasferimento extra-UE dichiarato**
- [ ] Cookie policy — in v1 solo cookie tecnici, nessun banner necessario
- [ ] Informativa nel form, consenso non pre-spuntato, marketing separato
- [ ] Link social: LinkedIn nel percorso B2B, Instagram nel B2C ⚠️ URL da verificare
- [ ] Slot architetturale per un futuro tool di booking (D-04)

**Criteri di accettazione**
- ★ Invio testato end-to-end: **la mail arriva davvero**
- Form completamente navigabile da tastiera e con screen reader
- Errori annunciati con `aria-live`, focus sul primo errore
- Nessun cookie non essenziale prima del consenso (in v1: nessuno del tutto)

`git commit -m "feat(phase-6): add qualification forms, legal pages and GDPR compliance"`

---

## FASE 7 — Accessibilità, SEO, performance · SONNET

**Skill:** `accessibility`, `web-design-guidelines`, `astro`

- [ ] Audit WCAG 2.2 AA: heading, landmark, focus, contrasti, alt, label, `prefers-reduced-motion`, tastiera
- [ ] `docs/a11y-report.md` con cosa è stato verificato e come
- [ ] SEO: meta e OG per pagina, `hreflang` reciproci + `x-default`, sitemap.xml, robots.txt
- [ ] Dati strutturati `Organization` ⚠️ (**solo campi verificabili, niente indirizzi inventati**), `Service`, `FAQPage`
- [ ] Performance: font self-hosted subsettati e preloaded, JS al minimo, CLS a zero
- [ ] Report Lighthouse in `docs/`

**Criteri di accettazione**
- Lighthouse ≥ 95 in tutte e quattro le categorie, su mobile
- Zero issue a11y bloccanti
- `hreflang` validi in entrambe le direzioni

`git commit -m "feat(phase-7): accessibility, SEO and performance optimisation"`

---

## FASE 8 — Testing · SONNET

**Skill:** `webapp-testing`, `accessibility`

- [ ] Percorso critico: home → process → services → book → conferma
- [ ] Percorso B2B: partners → form B2B
- [ ] Switch di lingua su ogni pagina (deve portare all'equivalente)
- [ ] Form con input validi e non validi, entrambi i rami UE/extra-UE
- [ ] Navigazione mobile, responsive sui breakpoint reali
- [ ] Link rotti
- [ ] Navigazione da sola tastiera
- [ ] `docs/test-report.md` con evidenze e bug aperti

**Criteri di accettazione:** test critici verdi, bug non bloccanti tracciati.

`git commit -m "test(phase-8): end-to-end testing of critical paths"`

---

## FASE 9 — Deploy e handoff · SONNET

**Skill:** `netlify-deploy`

- [ ] ⚠️ **Chiedere conferma esplicita prima di lanciare il deploy**
- [ ] Deploy Netlify, configurazione build, variabili d'ambiente
- [ ] Redirect e header di sicurezza (CSP, HSTS, Referrer-Policy, Permissions-Policy)
- [ ] Deploy preview per branch
- [ ] ⚠️ Dominio custom se disponibile — **nessuna modifica DNS senza autorizzazione**
- [ ] Verifica che le submission arrivino sulla mailbox di produzione
- [ ] `docs/handoff.md`: come modificare i testi, aggiungere una lingua, cambiare i pacchetti, dove arrivano i lead, **avvertenza sul banner cookie se si aggiungono script**, lista v2

**Criteri di accettazione:** sito online e funzionante, documentazione di consegna completa.

`git commit -m "feat(phase-9): production deploy and handoff documentation"`

---

## Fuori scope v1 — registrato per la v2

| Elemento | Perché non ora |
| :--- | :--- |
| Fotografia proprietaria | L'azienda non ne ha. Da rifare quando ci saranno scatti reali |
| Blog SEO sulle procedure burocratiche | Alto valore, ma richiede un impegno editoriale continuativo |
| Tool di booking integrato | Nessuno scelto dal cliente (D-04). Slot architetturale predisposto |
| CMS headless | Struttura contenuti già predisposta: si innesta senza rifattorizzare |
| Area studente con tracking pratica | È il vantaggio dei competitor EdTech. Progetto a sé |
| Terza lingua | Architettura pronta: si aggiunge una colonna alla mappa di route |
| Analytics | Se serve: Plausible o Umami, non GA4. **Comporta il banner cookie** |
| Pagine città e schede borse di studio | Espansione SEO naturale dopo il lancio |

---

## Rischi di progetto

| Rischio | Impatto | Mitigazione |
| :--- | :--- | :--- |
| ⚠️ Dati societari mancanti al lancio | **Bloccante legale** | Sollecitati dalla FASE 1 |
| ⚠️ Perimetro dei pacchetti non confermato | Rilavorazione di Services, Home e form | Proposta pronta nel brand brief; conferma richiesta prima della FASE 3 |
| Netlify non rileva il form multi-step | **Lead persi in silenzio** | Dichiarazione statica + test end-to-end reale |
| Il sito sembra "un'agenzia fantasma" | Fallimento dell'obiettivo | La FASE 4 è dove si vince o si perde. Massima cura |
| Copy che promette esiti | **Rischio legale e reputazionale** | Lista di parole vietate + revisione dedicata in FASE 3 |
| Divergenza EN/IT | Pagine monche in produzione | `lint:content` come gate di build |
| Astro 7 recente, spigoli su integrazioni | Ritardi | Poche dipendenze, tutte di prima parte |
