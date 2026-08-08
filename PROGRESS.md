# PROGRESS — Kimere International Academy & Consulting

> Questo file è la memoria di stato del progetto. Va riletto all'inizio di ogni fase.
> Le decisioni qui registrate sono vincolanti finché non vengono esplicitamente cambiate dall'utente.

---

## Stato corrente

**Fase corrente:** FASE 2 — Scaffolding tecnico → **COMPLETATA**
**In attesa di:** via libera per la FASE 3 (Copywriting e contenuti)
**Modello richiesto per FASE 3:** SONNET (già impostato)

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
| 23 | **Retention delle submission** su Netlify (ogni quanto si cancellano) | 24 mesi, dichiarati nella privacy policy. | FASE 6 |
| 4 | Budget foto licenziate | Zero foto in v1, sistema visivo 100% tipografia + illustrazione (vincolo di prodotto). Se emerge budget, si aggiungono 4–6 scatti di architettura universitaria italiana in v2. | FASE 4 |
| 5 | Email di destinazione dei lead | `info@<dominio>` come da analisi — serve l'indirizzo reale dal cliente. | FASE 6 |
| 6 | Ragione sociale per la privacy policy (società non ancora costituita) | Titolare del trattamento = professionista con P.IVA, da aggiornare alla costituzione societaria. Servono nome, indirizzo, P.IVA, PEC. | FASE 6 |
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
| 3 | Copywriting e contenuti | SONNET | ⏳ Prossima |
| 4 | Direzione visiva, design system e UI | OPUS | Non iniziata |
| 5 | Implementazione pagine restanti | SONNET | Non iniziata |
| 6 | Form di qualificazione, integrazioni, legal | SONNET | Non iniziata |
| 7 | Accessibilità, SEO, performance | SONNET | Non iniziata |
| 8 | Testing | SONNET | Non iniziata |
| 9 | Deploy e handoff | SONNET | Non iniziata |
