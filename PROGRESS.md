# PROGRESS — Kimere International Academy & Consulting

> Questo file è la memoria di stato del progetto. Va riletto all'inizio di ogni fase.
> Le decisioni qui registrate sono vincolanti finché non vengono esplicitamente cambiate dall'utente.

---

## Stato corrente

**Fase corrente:** FASE 6 — Form di qualificazione, integrazioni, legal → **COMPLETATA**
**In attesa di:** via libera per la FASE 7 (accessibilità, SEO, performance)
**Modello richiesto per FASE 7:** SONNET

**Deliverable FASE 6:**
- **Form studente** (`/book/`, `/prenota/`) — 6 step per il modello mentale dell'utente (7
  fieldset nel DOM: lo Step 4 è biforcato UE/extra-UE, un solo fieldset visibile alla volta
  in base alla cittadinanza scelta allo Step 1). Campi esattamente come da
  `content-map.md` "Struttura del form studente": chi sei, cosa vuoi studiare, quando, la
  situazione (biforcata), il livello di supporto (preselezionabile da Services via
  `?level=`), i consensi.
- **Form B2B** (in coda a `/partners/`) — a pagina singola, non multi-step: il content-map
  non prevede step per questo form. Stesso motore (`MultiStepForm`) usato con un solo
  fieldset: si comporta da solo come form semplice.
- **`MultiStepForm.astro`** — il componente che porta entrambi i form. Invio via `fetch()`
  con redirect JS alla pagina di ringraziamento; degradazione senza JavaScript verificata
  nel build: zero fieldset con `hidden` scritto lato server, bottoni di step nascosti di
  default, resta un unico form lungo con un solo submit nativo (l'`action` punta già alla
  pagina di ringraziamento — è così che Netlify gestisce il fallback nativo).
- **Contratto con Netlify** (tech-decisions.md §6): dichiarazione statica nascosta con tutti
  i campi di entrambi i form (`NetlifyFormDeclaration.astro`), honeypot nascosto con
  `clip-path` e non `display:none` (`HoneypotField.astro`) — sono due tecniche diverse per
  due scopi diversi, documentato nei commenti perché non sembri un'incoerenza.
- **Validazione accessibile**: messaggi non colpevolizzanti che dicono come rimediare,
  `aria-live` sullo stato del form, focus sul primo campo non valido, focus sul titolo di
  ogni step al cambio — tutto client-side, perché la spedizione reale dei dati serve solo
  al submit finale.
- **100 paesi** (`src/data/countries.ts` + `src/content/countries/{en,it}.json`) per il
  campo cittadinanza — i 27 Stati UE (determinano la biforcazione) più le nazionalità più
  comuni per uno studente diretto in Italia, più "Altro / non in elenco". Non è l'intero
  ISO 3166-1: estendibile aggiungendo una riga in tre file, senza toccare la logica.
- **Pagine legali reali** (`LegalLayout.astro` + `src/content/legal/{en,it}/{privacy,cookies}.md`):
  privacy policy GDPR con Netlify nominato come responsabile del trattamento e trasferimento
  extra-UE dichiarato, retention 24 mesi (default, questione #23), diritti dell'interessato;
  cookie policy che spiega perché non serve un banner (D-12). **I dati societari sono un
  placeholder esplicito** — la società non è ancora costituita (questione #6): la pagina
  è corretta nella struttura ma **non pubblicabile così com'è**, ed è marcata come tale sia
  nel testo pubblico stesso sia qui.
- Refactor: gli stili di `Field.astro` sono stati promossi a `global.css` — è il primo posto
  nel progetto dove la UI reagisce a JavaScript a runtime (validazione), e un elemento creato
  da `document.createElement` non porta l'attributo di scope che Astro assegna al markup
  scritto a build time: uno stile scoped semplicemente non lo vedrebbe.

**Bug trovato e non ancora corretto — cosmetico, non funzionale:** gli elementi `<input>`
e `<select>` generati da `Input.astro` hanno un attributo `class` duplicato nell'HTML
(l'iniezione automatica dello scope di Astro su una classe passata via spread produce due
attributi `class=` sullo stesso tag). Per la regola HTML "il primo attributo duplicato vince",
il browser applica comunque la classe `.control` corretta — **nessuna perdita di stile
verificata** — ma resta HTML non valido. Esiste da FASE 4, non introdotto ora. Segnalato per
la FASE 7 (l'audit di accessibilità/validità è esattamente quella fase).

**⚠️ Non verificabile in questa fase:** il criterio di accettazione del master prompt dice
"la mail arriva davvero" — verificarlo richiede un deploy reale su Netlify, che le regole
operative permanenti vietano senza tua conferma esplicita. Il contratto con Netlify (campi
statici, `data-netlify`, honeypot, `action` verso la pagina di ringraziamento) è implementato
esattamente come documentato in `tech-decisions.md`; l'unico modo per chiudere questo punto
è autorizzare un deploy di prova.

**Deliverable FASE 5:**
- 9 pagine con contenuto reale ristilizzate sul design system della FASE 4, EN + IT:
  Home (rifattorizzata sulle classi condivise), **Process** (pagina cardine — mappa del
  percorso completa a 11 tappe con `RouteMap`, ogni passo con lo schema
  cosa-succede/chi-decide/quanto-tempo/cosa-fa-Kimere, le due tappe più convincenti
  marcate con `keyMoment`), Services (livelli completi con `checklist`), Housing
  (paradosso e truffe come `callout`, confronto fare/non-fare a due colonne), Costs
  (cifre come `Badge`, prima applicazione reale del componente su una pagina di
  contenuto), About (i 4 principi come `Card`), Partners (collaborazione visualizzata
  con `HandoverDiagram`, ILL-04 collegato per la prima volta), FAQ (un `Accordion` per
  domanda, superficie alternata per gruppo), Thank-you.
- 6 nuovi pattern CSS **generici**, promossi in `global.css` invece di duplicati per
  pagina: `.block-heading`/`.block-lead`, `.kv-list`, `.callout` (+ `--warning`),
  `.checklist--negative`, `.steps-numbered`, `.closing-cta`. La home è stata
  rifattorizzata per usarli anche lei — zero duplicazione tra home e pagine interne.
- 2 aggiunte allo schema contenuti, entrambe riflettono l'analisi esistente, non
  inventano dati: `processSteps.keyMoment` (le due tappe — visto, permesso entro 8
  giorni — che il brand-brief cita come le più convincenti) e `processPage.routeMap`
  (etichette per la mappa completa). Più `partnersPage.handoverDiagram`: la stessa
  frase di `collaborationModel.body` riformulata come dati per il diagramma, non un
  fatto nuovo — necessario perché quelle etichette non possono restare stringhe
  inglesi hardcoded nel template (avrebbero violato la separazione contenuto/UI).
- `book`, `privacy`, `cookies` restano scaffold: nessuna content collection propria,
  il contenuto reale (form multi-step, dati legali) è lavoro della FASE 6 per il master
  prompt — non uno scarto di questa fase.

**Bug trovato e corretto — stesso schema del bug della FASE 4:** il colore del callout
di avviso sulle truffe d'alloggio falliva il contrasto (2.84 invece di 4.5). Non poteva
comparire nel controllo automatico perché il colore è nato in questa fase, dopo l'ultimo
giro di `check:contrast`. Risolto rendendolo dipendente dalla superficie
(`--surface-warning`, sullo stesso modello di `--surface-accent`) e aggiunte le 3 nuove
coppie al controllo automatico (27 coppie totali, 0 sotto soglia). La lezione: ogni volta
che introduco un colore nuovo, va aggiunto subito al controllo — non alla fine.

**Verifica eseguita:** `npm run verify` verde (lint:content, contrasti, tipi, build a 28
pagine, check:output) + ispezione dell'HTML generato per tutte le pagine nuove (un solo
`<h1>` ciascuna, struttura di heading coerente, conteggi di componenti come previsto,
zero asterischi vaganti) + verifica che nessuna griglia `auto-fit` sfondi a 320px.
**Non verificato:** resa in un browser reale (Playwright non installato, invarianza
dallo stesso limite della FASE 4).

**Deliverable FASE 4.3 — design system**
- `src/styles/global.css` — token in `@theme` (colore, scala tipografica fluida senza breakpoint,
  ritmo verticale, raggi, movimento) e il **sistema a due superfici**
- **Font self-hosted** (`@fontsource-variable/eb-garamond` + `archivo`): zero richieste a domini
  terzi. Su un sito che raccoglie nazionalità e dati sul percorso migratorio, un `@font-face` verso
  Google esporrebbe l'IP di ogni visitatore senza base giuridica. Verificato nel build.
- Componenti: `Section`, `Button`, `Card`, `Badge`, `Accordion`, `Field`, `Input` + i cinque di
  layout riscritti (Header con menu mobile, Nav, Footer, LanguageSwitcher, SkipLink)
- `docs/design-system.md` + pagina navigabile **`/en/styleguide/`** (`noindex`)

**Deliverable FASE 4.4 — marchio e illustrazioni**
- **Logo ridisegnato in SVG** (`brand/LogoMark.astro`, `brand/Logo.astro`, `public/favicon.svg`).
  Il wordmark **non è un tracciato: è testo vero** — resta nitido a ogni dimensione, gli screen
  reader leggono «Kimere» e il lockup si ricompone (orizzontale in header, in colonna nel footer).
  Era esattamente il limite del JPG, dove descrittore e payoff sono cotti nell'immagine.
- `ILL-01` mappa del percorso · `ILL-02` enti che non si parlano · `ILL-03`+`ILL-05` set di icone ·
  `ILL-04` modello B2B · `ILL-06` filigrana nel footer · `ILL-07` 404

**Deliverable FASE 4.5 — home**
- `src/pages/{en,it}/index.astro` implementata end-to-end, 404 rifatta con `ILL-07`
- Le due lingue sono **lo stesso file con una riga diversa** (`const locale`)

**Due strumenti di verifica nuovi, entrambi nati da bug reali di questo progetto:**
- `npm run check:contrast` — calcola il contrasto WCAG di ogni coppia in uso (24 coppie, 0 sotto
  soglia) e fallisce se una scende. **Ha già trovato un bug latente in questa fase:** la pastiglia
  della lingua attiva usava l'accento come fondo, e su superficie chiara sarebbe stata navy su teal
  — 2.92, sotto soglia. Da lì è nato `--surface-marker-*`.
- `npm run check:output` — controlla l'HTML generato: asterischi non renderizzati, `<h1>` duplicati,
  sottorisorse da domini terzi, `lang` mancante. Nasce perché il bug degli asterischi (FASE 3) è
  **ricomparso** nella home: la checklist dei pacchetti non passava da `renderEmphasis()`.
  Verificato che il controllo non passi a vuoto, iniettando i tre difetti in una pagina del build.
- `npm run verify` esegue l'intera catena: contenuti → contrasti → tipi → build → output.

**Altro bug trovato e corretto:** due griglie della styleguide avevano tracce minime da 19 e 20 rem
contro i 280 px utili a 320 px di viewport — sfondavano in orizzontale. Tutte le griglie `auto-fit`
ora usano `minmax(min(100%, …), 1fr)`.

**⚠️ Non verificato:** la resa a schermo è stata controllata sul CSS e sull'HTML generato, non in un
browser reale — Playwright non è installato e i suoi binari sono ~150 MB, che non installo senza
chiedere. Vale la pena aprire `/en/` e `/en/styleguide/` con `npm run dev`.

**Deliverable FASE 4.1:**
- `design/direction-a.html` — **«Sportello»**, la fiducia si dimostra con l'ordine. Dominante
  cream, corsia di etichette in monospaziato, livelli come righe di registro.
  Bodoni Moda · Public Sans · IBM Plex Mono.
- `design/direction-b.html` — **«Rotta»**, la fiducia si dimostra mostrando la mappa. Dominante
  navy, l'hero *è* il percorso, barre di copertura sui tre livelli.
  EB Garamond · Archivo. ← **direzione raccomandata**
- `design/direction-c.html` — **«Fascicolo»**, la fiducia si dimostra mostrando l'artefatto.
  Fogli con linguetta d'indice oro, righe di protocollo, doppio target B2C/B2B risolto nell'hero.
  Source Serif 4 · Barlow.
- `design/README.md` — le tre schede complete (concetto, dispositivo firma, palette con contrasti,
  coppia tipografica, trattamento illustrazioni, mood, **rischio dichiarato**), tabella di
  confronto e raccomandazione argomentata.

**Verifiche eseguite sui mockup:**
- **31 coppie di colore** verificate con calcolo del contrasto WCAG (script dedicato): **0 fallite**,
  la maggior parte AAA. Include le combinazioni nuove non presenti nella tabella del logo
  (testo secondario su navy, linea teal su navy, navy su cream profondo, testo su oro in hover).
- Ogni mockup ha un **toggle EN/IT funzionante** con il copy reale della FASE 3 — serve a verificare
  la tenuta del layout con l'italiano, più lungo del 15–20%. Verificato con script che nessuno dei
  173 elementi traducibili contenga figli che il toggle cancellerebbe.
- Contenuto reale in tutti e tre (copy FASE 3), nessun testo finto, nessuna foto, nessun logo di
  ateneo, nessun numero su Kimere.

**Vincolo cromatico che ha guidato le tre direzioni:** l'oro `#BDA15D` ha 2.33 sul cream e non può
mai essere inchiostro su fondo chiaro. Ogni direzione lo risolve diversamente — A lo confina alla
fascia scura, B adotta la dominante scura dove l'oro è AAA (8.59), C lo usa come **riempimento**
delle linguette con testo navy sopra (6.62, conforme). È la differenza più visibile tra le tre.

**Deliverable FASE 3:**
- 8 nuove content collection di testo di pagina in `content.config.ts` (homePage, processPage,
  servicesPage, housingPage, costsPage, aboutPage, partnersPage, thankYouPage), oltre alle 4 già
  esistenti (processSteps, packages, faq, legal)
- Contenuti EN + IT completi: 11 passi del percorso, 3 pacchetti, 26 FAQ, 8 pagine di testo —
  96 file JSON totali, `lint:content` verde (parità di chiavi EN/IT verificata)
- `docs/glossary.md` — termini burocratici e regole di uso
- 9 pagine (`home, process, services, housing, costs, about, partners, faq, thank-you`) collegate
  al contenuto reale in entrambe le lingue (18 file `.astro`), ancora **non stilizzate** (nessun
  lavoro estetico: arriva in FASE 4). `book`, `privacy`, `cookies`, `styleguide` restano scaffold
  come previsto (form/legal/design system arrivano in fasi successive)

**Due bug tecnici reali scoperti e risolti durante la stesura:**
1. **Collisione di ID nel glob loader.** Il campo `packages.slug` veniva letto da Astro come
   override dell'ID dell'entry (`generateIdDefault`, astro/dist/content/loaders/glob.js) — EN e IT
   avevano lo stesso valore (`"admission"`, `"arrival"`, `"settled"`) e una lingua sovrascriveva
   l'altra in silenzio. Verificato nel codice sorgente di Astro, non solo per sintomo. Rinominato
   il campo in `key`.
2. **Enfasi in stile Markdown non renderizzata.** Il copy EN marca i termini burocratici con
   `*termine*` (convenzione di `docs/glossary.md`), ma il rendering è testo puro: gli asterischi
   comparivano letteralmente invece di produrre corsivo. Aggiunta `renderEmphasis()` in
   `src/i18n/utils.ts` (converte `*termine*` in `<em>termine</em>`, con escape HTML) e applicata
   nei 4 template (`process`, `faq`, `services`, `housing`) dove il copy la usa. Verificato nel
   build finale: zero asterischi residui in output.

**Nuove voci nel dizionario UI** (`src/i18n/ui/{en,it}.ts`): `nav.primaryLabel`, `footer.navLabel`,
`scaffold.placeholder`, `process.*` (5 etichette strutturali dei passi), `faqGroups.*` (6 etichette
di gruppo) — tutte con parità EN/IT verificata da `lint:content`.

**Perimetro dei 3 pacchetti scritto secondo la proposta di `brand-brief.md` §6** (Admission/Arrival/
Settled) — resta la conferma del cliente più urgente in sospeso (questione #15).

**Deliverable FASE 2:** progetto Astro 7.2.0 inizializzato, Tailwind 4.3.3, i18n con routing
localizzato, content collections tipizzate (schema Zod, contenuti vuoti), layout scheletrici
(Header/Footer/Nav/LanguageSwitcher/SkipLink), 26 route generate (13 × 2 lingue) + 404 + redirect
root, tooling (Prettier, `astro check`, `lint:content`), `netlify.toml`, `README.md`.
`npm run build` e `npm run check` puliti. Repository git inizializzato.

**Rischio tecnico scoperto e risolto:** il default `compressHTML: 'jsx'` di Astro 7 mangia gli
spazi tra testo e tag inline (es. `within<a href…>` invece di `within <a href…>`) — verificato con
una build di prova. Impostato `compressHTML: true` in `astro.config.ts`. Il rischio era già
previsto in `docs/tech-decisions.md` §11 ed è stato confermato reale.

**Incidente e rimedio:** un primo `prettier --write .` senza `.prettierignore` completo ha
riformattato per errore `Kimere_Analisi_Strategica.md`, `.claude/settings.local.json` e alcuni file
delle skill installate (`.agents/skills/`, `.claude/skills/` — netlify-deploy, web-design-guidelines,
landing-page-copywriter). Diagnosticato che le differenze erano solo di terminazione riga
(CRLF↔LF), nessuna perdita di contenuto. Ripristinati tutti i file: `Kimere_Analisi_Strategica.md`
riscritto dal testo originale, `settings.local.json` corretto a mano, le skill ripristinate con
`npx skills experimental_install` (webapp-testing) e download diretto dai repository sorgente
dichiarati in `skills-lock.json` (netlify-deploy, web-design-guidelines, landing-page-copywriter).
`.prettierignore` ora esclude esplicitamente `docs/`, `design/`, `PLAN.md`, `PROGRESS.md`,
`Kimere_Analisi_Strategica.md`, `.agents/`, `.claude/`, `skills-lock.json` — non può succedere di nuovo.

**Il file logo è stato spostato** in `src/assets/brand/logo-kimere-source.jpg` (era in root come
`logo_kimera.jpg`).

**Placeholder da sostituire prima del deploy:** `site: 'https://kimere.placeholder.dev'` in
`astro.config.ts` — nessun dominio confermato dal cliente (questione #9). Marcato con `TODO(FASE 9)`.

---

## Sintesi del progetto

1. **Cliente:** Kimere, agenzia nata a giugno. Non ancora costituita in società (consorzio di P.IVA), zero track record, zero foto proprietarie, presenza social dichiarata (@kimereconsulting) ma nessun sito.
2. **Utente finale, doppio.** B2C: studente extra-UE 18–25 anni (India, Egitto, MENA, LatAm, Cina) che non parla italiano e teme la burocrazia più dell'esame di ammissione; secondariamente studente Erasmus UE. B2B: referente di agenzia di reclutamento estera che cerca un partner affidabile *sul suolo italiano*.
3. **Obiettivo unico del sito:** portare un visitatore qualificato a prenotare la call conoscitiva di 15 minuti. Non è una vetrina, è un funnel di qualificazione con la fiducia come collo di bottiglia.
4. **Il vero prodotto non è l'informazione, è l'esecuzione.** Uni-Italia e W.A.I. regalano le stesse informazioni. Kimere vende il fatto che *qualcuno le esegue al posto tuo*, senza sbagliare le scadenze.
5. **Posizionamento competitivo:** SCALA e StudyInItalie vincono sulla tecnologia (dashboard, portali); Smart Move Italy sul personal brand premium; Y-Nos sulla copertura legale; Uni-Italia sull'autorevolezza istituzionale. Kimere non può batterli su nessuno di questi assi oggi.
6. **Dove può vincere:** copertura end-to-end (ammissione → visto → permesso → codice fiscale → residenza → SSN → alloggio) unita a una **trasparenza radicale del processo**. È l'unico terreno dove l'assenza di track record non è un handicap.
7. **Rischio 1 — Credibilità.** Nessun logo affermato, nessuna foto, nessun numero, nessun accordo formale con atenei. Se l'esecuzione visiva non è impeccabile, il sito legge come "agenzia fantasma" e *distrugge* fiducia invece di costruirla. Il design non è decorazione: è l'unica prova di serietà disponibile.
8. **Rischio 2 — Legale e reputazionale.** Si parla di visti e di soldi. Ogni frase deve dire *assistenza, preparazione, supervisione*, mai *garanzia*. Servono disclaimer con rimando alle fonti ufficiali e un impianto GDPR reale su un form che raccoglie nazionalità e disponibilità economica.
9. **Rischio 3 — Vuoto di input dal cliente.** Logo, email di destinazione lead, dominio, ragione sociale per la privacy policy e contenuto dei 3 pacchetti non esistono ancora nel materiale. Senza questi, le fasi 4, 6 e 9 si bloccano.
10. **Gap di contenuto più grande:** l'analisi descrive in dettaglio **solo il pacchetto premium**. Gli altri due livelli sono citati ma mai definiti.

---

## Ricognizione del progetto (stato all'avvio)

**Stato:** cartella praticamente vuota, nessun codice.

| Elemento | Stato |
| :--- | :--- |
| `Kimere_Analisi_Strategica.md` | Presente, letto integralmente (34 KB). Encoding con mojibake (`Ã¨`, `â¬`): cosmetico, contenuto integro. |
| `skills-lock.json` + 9 skill | Installate in `.claude/skills/` e `.agents/skills/`: accessibility, astro, brand-guidelines, canvas-design, frontend-design, landing-page-copywriter, netlify-deploy, web-design-guidelines, webapp-testing. |
| Progetto Astro / package.json | Assente. Si parte da zero in FASE 2. |
| Repository git | Non inizializzato. Serve `git init` in FASE 2 per i commit atomici richiesti dal master prompt. |
| Brand assets (logo, palette, font) | **Ricevuti**: `logo_kimera.jpg` (vedi sezione dedicata sotto). Nessun font o palette formalizzati. |
| Presenza web pubblica | Ricerca pubblica su "Kimere" e "@kimereconsulting": nessun risultato indicizzato. Coerente con la fondazione a giugno. Nessun asset visivo recuperabile online. |

**Toolchain verificato:** Node v24.11.1 · npm 11.3.0 · git 2.47.1 — pronto per Astro.

---

## Asset di brand ricevuti — analisi del logo

File: `logo_kimera.jpg` (1080×1080, JPG). **Il nome del file dice "kimera" ma il wordmark dice
"KIMERE": D-01 è confermato dall'asset stesso.**

### Cosa contiene il lockup

- **Marchio figurativo:** libro aperto + rosa dei venti/bussola + freccia ascendente dorata + fiamma/torcia + forme a onda/foglia. Cinque elementi sovrapposti.
- **Wordmark:** `KIMERE` in serif ad alto contrasto, maiuscolo, tratti sottili marcati.
- **Descrittore:** `INTERNATIONAL ACADEMY & CONSULTING` in sans geometrico maiuscolo spaziato.
- **Payoff:** `YOUR FUTURE, SIMPLIFIED` — **asset nuovo, non presente nell'analisi strategica.**

### Palette estratta dal file (campionamento su 291.600 pixel)

| Ruolo | Hex | Note |
| :--- | :--- | :--- |
| Navy wordmark (primario) | `#0A2546` | Colore portante del brand |
| Navy profondo | `#071F3D` | Fondi scuri, footer |
| Blu medio | `#103E5D` | Colore di supporto |
| Teal medio | `#1B7087` | Secondario, usabile per testo |
| Teal chiaro | `#2B9EB0` | Solo decorativo/illustrazione |
| Oro | `#BDA15D` | Accento |
| Oro highlight | `#D6B86C` | Accento su fondo scuro |
| Oro profondo | `#9E8247` | Ombra dell'accento |
| Cream fondo | `#FBF7EB` | Superficie chiara |
| Grigio descrittore | `#5B5C5A` | Testo secondario |

### Verifica contrasti WCAG (già eseguita — vincola la FASE 4)

| Combinazione | Ratio | Esito |
| :--- | :--- | :--- |
| Navy `#0A2546` su cream `#FBF7EB` | 14.35 | AAA — coppia portante |
| Blu medio `#103E5D` su cream | 10.49 | AAA |
| Grigio `#5B5C5A` su cream | 6.28 | AA testo / AAA large |
| Teal medio `#1B7087` su cream | 5.28 | AA — usabile per testo |
| Bianco su teal medio | 5.65 | AA |
| Oro highlight `#D6B86C` su navy | 8.00 | AAA |
| Navy su oro `#BDA15D` | 6.16 | AA — bottone CTA valido |
| Oro `#BDA15D` su navy | 6.16 | AA |
| **Teal chiaro `#2B9EB0` su cream** | **2.96** | **FALLISCE — mai testo su cream** |
| **Oro `#BDA15D` su cream** | **2.33** | **FALLISCE — mai testo su cream** |

**Conclusione di design che ne deriva:** l'oro non regge su fondo chiaro ma brilla su navy. Il
sistema naturale del brand è quindi a due superfici — chiara (cream, testo navy) e scura (navy,
testo cream con **accento oro**) — e la CTA primaria può essere un bottone oro con testo navy
(6.16, conforme). Questo indirizza la FASE 4 senza inventare nulla.

### Problemi tecnici del file — da risolvere in FASE 4

1. **JPG senza trasparenza**, fondo cream cotto nell'immagine: non collocabile su nessun'altra superficie. Bloccante per header e footer.
2. **Raster, non vettoriale**: sfoca in retina, non ricolorabile (serve una variante monocromatica per il footer scuro), inadatto a favicon nitide.
3. **Troppo denso per le piccole dimensioni**: a 36–40 px di altezza in un header i cinque elementi del marchio collassano in una macchia illeggibile.
4. **Gradienti complessi e forme ambigue** (la fiamma e le onde non si leggono), tipiche della generazione AI.
5. **Lockup rigido**: payoff e descrittore sono cotti nell'immagine, impossibile ricomporre il lockup orizzontale per l'header e quello quadrato per i social.

**Rimedio previsto in FASE 4:** ridisegno del logo in SVG su due livelli — lockup completo
(marchio + wordmark + payoff) per footer, pagine legali e OG image; versione ridotta e semplificata
(marchio a 2 elementi o monogramma) per header e favicon. Il file JPG resta il riferimento
cromatico e concettuale, non l'asset di produzione.

### Note critiche sulle skill installate

1. **`brand-guidelines` è il brand kit di Anthropic**, non un generatore di brand generico. Applicarla alla lettera metterebbe i colori e i font di Anthropic sul sito di Kimere. Uso: modello *strutturale* di come si documenta un design system di brand; palette, tipografia e voce restano proprietarie di Kimere.
2. **`canvas-design` produce PNG/PDF**, non SVG per il web. La FASE 4.4 richiede illustrazioni SVG leggere e accessibili. Uso: filosofia compositiva della skill, esecuzione manuale in SVG ottimizzato (`currentColor`, `role`/`aria-hidden`, peso file).

---

## Registro decisioni

| # | Decisione | Valore | Motivazione | Impatto |
| :--- | :--- | :--- | :--- | :--- |
| D-01 | Naming | **Kimere**. Esteso "Kimere International Academy & Consulting" per footer/legal/meta; forma breve "Kimere" in header e copy corrente. | Confermato tre volte: documento strategico, handle `@kimereconsulting`, **e il wordmark del logo**. Il nome file `logo_kimera.jpg` è un refuso. | Tutto il copy e i metadati (FASE 3, 7) |
| D-02 | Brand assets | **Logo ricevuto** (`logo_kimera.jpg`). Palette estratta e verificata per contrasto. Tipografia da progettare. Il JPG **non è utilizzabile in produzione**: va ridisegnato in SVG in FASE 4. | Il file è raster, senza trasparenza e troppo denso per l'header. La palette invece è solida e conforme. | Sbloccato lo Step 4.1; il ridisegno SVG entra nello Step 4.4 |
| D-05 | Payoff | **"Your future, simplified"** — payoff ufficiale, presente nel logo. Versione IT da definire in FASE 3 (non traduzione letterale). | È un asset di brand esistente e centra la value proposition (semplificazione). Va usato, non sostituito. | Copy FASE 3, hero FASE 4 |
| D-06 | Sistema cromatico | Due superfici: **chiara** (cream `#FBF7EB`, testo navy `#0A2546`) e **scura** (navy, testo cream con **accento oro** `#D6B86C`). CTA primaria: oro `#BDA15D` con testo navy. | Deriva dalla verifica contrasti: l'oro fallisce su cream (2.33) ma è AAA su navy (8.00). Il vincolo tecnico detta l'uso corretto del colore. | Design system FASE 4 |
| D-07 | **Posizionamento / USP** | *"I concorrenti ti fanno ammettere. Kimere ti fa atterrare."* Lo spazio bianco è l'**esecuzione in-country**: permesso entro 8 giorni, codice fiscale, residenza, SSN, contratto d'affitto. | I competitor mappati ottimizzano il funnel di ammissione e si fermano al visto. Chi copre il post-arrivo (Smart Move, Y-Nos) parla ad altri target. | Tutto il copy, IA, FASE 3-5 |
| D-08 | **Strategia di fiducia** | **La specificità sostituisce la prova sociale.** Dettagli procedurali verificabili al posto di numeri. La novità dell'azienda si dichiara, non si nasconde. I limiti si esplicitano. | È l'unica leva disponibile senza track record — e costa zero perché è vera. | FASE 3, 4 |
| D-09 | **Struttura dei pacchetti** | Tre livelli **cumulativi**: **Admission ⊂ Arrival ⊂ Settled**. ⚠️ **Proposta, non decisione** — richiede conferma cliente. | Nominati per quanto lontano Kimere accompagna, non per fascia di prezzo. Evita Basic/Premium e Bronze/Gold. | Services, Home, form |
| D-10 | **Architettura URL / i18n** | `prefixDefaultLocale: true` → `/en/` e `/it/`, root che redirige a `/en/`. **Slug localizzati** (`/it/percorso/`) via mappa centrale `src/i18n/routes.ts`. | Simmetria tra lingue: aggiungere una terza lingua non richiede modifiche strutturali. Gli slug italiani servono il canale B2B verso atenei e agenzie italiane. | FASE 2, 5, 7 |
| D-11 | **Stack** | Astro **7.2.0** (output `static`) + Tailwind **4.3.3** + Netlify. Contenuti in **JSON** validati Zod 4, non markdown. Nessun framework UI, nessuna animation library. | Sito di contenuto: ogni KB di runtime è costo puro. Il JSON dà errori di build sui contenuti mancanti e un percorso pulito verso un CMS. | FASE 2 in poi |
| D-12 | **Nessun banner cookie in v1** | Senza analytics e senza embed di booking restano solo cookie tecnici: nessun consenso preventivo richiesto. | Postura privacy più pulita possibile, zero attrito al primo contatto, CLS zero. ⚠️ Aggiungere un solo script di terze parti lo rende obbligatorio. | FASE 6, 9 (handoff) |
| D-16 | **Un solo componente per i due form** | `MultiStepForm.astro` gestisce sia il form studente (6 step, biforcato UE/extra-UE) sia il form B2B (1 solo step): con un solo fieldset disattiva da sé la progressione. | Il content-map non prevede step per il form B2B (nessuna colonna "Step" nella sua tabella campi) — costruire un secondo motore sarebbe stato duplicare logica di validazione/invio/honeypot identica per una differenza che si riduce a "quanti fieldset ci sono". | FASE 7 (se emergessero altri form) |
| D-14 | **Font self-hosted** | `@fontsource-variable/eb-garamond` + `@fontsource-variable/archivo`, serviti dal dominio del sito. Nessun CDN. | Un `@font-face` verso Google espone l'IP di ogni visitatore a un terzo senza base giuridica — su un sito che raccoglie nazionalità e dati sul percorso migratorio è un rischio reale, non teorico. Coerente con D-12 (nessuno script di terze parti, quindi nessun banner cookie). | FASE 6 legal, FASE 7 performance |
| D-15 | **Superfici invece di colori diretti** | Ogni componente legge `--surface-*`; le classi `.surface-dark/panel/light` ridefiniscono accento, filetti e focus. Nessun colore scritto a mano nei componenti. | L'accento non può essere una costante: l'oro è 2.33 su cream e 8.59 su navy, il teal fa l'opposto. Rendere la regola strutturale impedisce di sbagliare per distrazione in una pagina qualsiasi tra sei mesi. | Tutte le fasi successive |
| D-13 | **Direzione visiva** | **B — «Rotta»** (`design/direction-b.html`). Dominante navy, l'hero è il percorso, linea di rotta come dispositivo firma, EB Garamond + Archivo. ✏️ **Modifica richiesta dal cliente al gate 4.2 e già applicata:** via la barra di copertura dalle tre card dei livelli, sostituita da elenchi con voci spuntate (come nella direzione C). | Scelta del cliente al gate 4.2. La linea di rotta resta solo dove porta informazione vera: hero, mappa del Percorso (`ILL-01`), 404. | Design system 4.3, illustrazioni 4.4, home 4.5, tutte le pagine della FASE 5 |
| D-03 | Lingue al lancio | **EN + IT complete.** EN primario/default, i18n predisposto per lingue future. | Target primario extra-UE (EN), ma canale B2B con atenei/agenzie italiane richiede IT. | Routing FASE 2, doppio copy FASE 3, `hreflang` FASE 7 |
| D-04 | Booking della call | **Nessun tool di booking in v1.** La CTA porta al form di qualificazione; il thank-you spiega che Kimere risponde via email per fissare l'orario. Slot architetturale predisposto per innestare un tool (es. Cal.com) senza rifattorizzare. | Nessun tool ancora scelto/attivo dal cliente. | IA in FASE 1, form in FASE 6 |

---

## Questioni aperte

Bloccanti solo alla fase indicata — non fermano l'avvio della FASE 1.

| # | Domanda | Default proposto (attivo finché non corretto) | Blocca da |
| :--- | :--- | :--- | :--- |
| 1 | I 3 pacchetti: l'analisi definisce in dettaglio solo il premium. Cosa contengono gli altri due? | In FASE 1 propongo una struttura a 3 livelli derivata dall'analisi (base documentale → accompagnamento → relocation completa); conferma o correzione dell'utente in FASE 3. | FASE 1 |
| 2 | Target Erasmus: solo in-bound (studenti UE che vengono in Italia)? | Sì, solo in-bound. | FASE 1 |
| 3 | ~~File del logo~~ | ✅ **RISOLTA** — `logo_kimera.jpg` ricevuto e analizzato. | — |
| 13 | **Esiste il sorgente vettoriale del logo** (AI, EPS, SVG, PDF) o solo questo JPG? | Assumo che esista solo il JPG e ridisegno il marchio in SVG da zero in FASE 4, restando fedele a forme e colori originali. Se il vettoriale esiste, risparmio tempo e guadagno fedeltà. | FASE 4 |
| 14 | **Il payoff "Your future, simplified" è definitivo** e va usato nel sito? | Sì, lo tratto come payoff ufficiale del brand (D-05). | FASE 3 |
| 15 | **Perimetro esatto dei livelli Admission e Arrival** (l'analisi dettaglia solo il premium) | Uso la ripartizione proposta in `brand-brief.md` §6. | **FASE 3 — la più urgente** |
| 16 | **Cosa succede se il visto viene rifiutato?** Esiste una politica di rimborso? | Spiego le cause tipiche di rigetto e come Kimere le previene, **senza alcun impegno economico**. | FASE 3 (FAQ) |
| 17 | **Come comunicare lo stato societario** nella pagina B2B | Ometto la sezione e lascio solo l'invito al contatto diretto. È l'unico punto del sito con conseguenze contrattuali: da scrivere insieme. | FASE 3 (Partners) |
| 18 | **Nomi e ruoli del team pubblicabili?** (serve consenso delle persone) | Descrivo i ruoli senza nominare nessuno. | FASE 3 (About) |
| 19 | **Città di operatività** di Kimere | Ometto la sezione finché non è confermato. | FASE 3 (About, Partners) |
| 20 | **Esistono già accordi con provider di alloggio** (residenze, piattaforme, agenzie)? | Nessun nome e nessun logo di provider compare nel sito. | FASE 3 (Housing) |
| 21 | **Data di fondazione esatta** | "giugno 2026", come da analisi strategica. | FASE 3 (About) |
| 22 | **SLA di risposta** dopo l'invio del form | "entro 2 giorni lavorativi". | FASE 3 (Thank you) |
| 23 | **Retention delle submission** su Netlify (ogni quanto si cancellano) | 24 mesi, dichiarati nella privacy policy. ✅ **Applicato in FASE 6.** | — |
| 4 | Budget foto licenziate | Zero foto in v1, sistema visivo 100% tipografia + illustrazione (vincolo di prodotto). Se emerge budget, si aggiungono 4–6 scatti di architettura universitaria italiana in v2. | FASE 4 |
| 5 | Email di destinazione dei lead | Non serve nel codice: Netlify smista le submission ai collaboratori del sito via dashboard (Site settings → Forms), non via un indirizzo scritto nell'HTML. Da configurare al primo deploy (FASE 9), non prima. | FASE 9 |
| 6 | Ragione sociale per la privacy policy (società non ancora costituita) | Titolare del trattamento = professionista con P.IVA, da aggiornare alla costituzione societaria. Servono nome, indirizzo, P.IVA, PEC. ⚠️ **Struttura scritta in FASE 6** (`src/content/legal/{en,it}/privacy.md`) con placeholder espliciti — bloccante per la pubblicazione, non per lo sviluppo. | **FASE 9 — bloccante per il lancio** |
| 7 | URL social esatti | Le ricerche pubbliche non trovano i profili. Si linka `@kimereconsulting` su Instagram; LinkedIn e Facebook restano da verificare con il cliente prima del lancio. | FASE 6 |
| 8 | Analytics | Nessun analytics in v1, oppure Plausible/Umami (cookieless, nessun banner necessario). GA4 escluso per il profilo di rischio privacy del sito. | FASE 6 |
| 9 | Dominio | Se non registrato, in FASE 9 si usa il sottodominio Netlify; il dominio custom si collega dopo. | FASE 9 |
| 10 | Account Netlify | Deploy solo sotto account indicato dal cliente, solo dopo conferma esplicita. Nessun tocco a DNS senza autorizzazione. | FASE 9 |
| 11 | Manutenzione post-lancio | Il cliente modifica i testi nei file markdown/JSON versionati, con istruzioni in `docs/handoff.md`. Se serve autonomia totale, CMS headless in v2. | FASE 9 |
| 12 | Deadline | Nessuna scadenza fissa dichiarata: si procede fase per fase con i gate previsti. | — |

---

## Vincoli di prodotto non negoziabili (promemoria per tutte le fasi)

- Nessun prezzo pubblico dei pacchetti — CTA unica è la call di 15 minuti.
- Nessuna foto proprietaria (azienda nata a giugno) — tipografia, illustrazione vettoriale/isometrica, colore e layout portano il peso visivo.
- Nessun social proof numerico, nessuna testimonianza, nessun loro di università/partner senza accordo confermato.
- Copy su visti e alloggi: sempre *assistenza/preparazione/supervisione*, mai *garanzia di esito*.
- Dati sensibili raccolti dal form → GDPR reale (privacy policy, cookie policy, consenso, minimizzazione dei campi).
- Doppio target B2C/B2B con percorsi e tono distinti.
- Inglese primario, italiano secondario, architettura pronta per altre lingue.
- Nessun deploy, DNS, servizio a pagamento o cambio di configurazione account senza conferma esplicita.

---

## Cronologia fasi

| Fase | Titolo | Modello | Stato |
| :--- | :--- | :--- | :--- |
| 0 | Ricognizione e domande | OPUS | ✅ Completata |
| 1 | Piano d'azione e fondamenta strategiche | OPUS | ✅ Completata |
| 2 | Scaffolding tecnico | SONNET | ✅ Completata |
| 3 | Copywriting e contenuti | SONNET | ✅ Completata |
| 4 | Direzione visiva, design system e UI | OPUS | ✅ Completata |
| 5 | Implementazione pagine restanti | SONNET | ✅ Completata |
| 6 | Form di qualificazione, integrazioni, legal | SONNET | ✅ Completata |
| 7 | Accessibilità, SEO, performance | SONNET | ⏳ Prossima |
| 8 | Testing | SONNET | Non iniziata |
| 9 | Deploy e handoff | SONNET | Non iniziata |
