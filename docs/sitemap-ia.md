# Sitemap e Architettura dell'Informazione

> Deriva da `brand-brief.md` (posizionamento) e `personas.md` (bisogni).
> Vincola FASE 2 (routing), FASE 5 (implementazione) e FASE 7 (SEO/hreflang).

---

## 1. Principio ordinatore

Il sito ha **un solo obiettivo**: portare un visitatore qualificato a prenotare la call di 15 minuti.
Tutto il resto è strumentale.

Ma il pubblico non converte per persuasione: converte per **riduzione dell'incertezza**.
Ne segue l'ordine dell'architettura:

> **Prima si dimostra di conoscere il problema. Poi si dice cosa si fa. Poi si chiede il contatto.**

Questo capovolge la sequenza standard di una landing commerciale (offerta → benefici → prova →
contatto). Qui la **prova viene per prima**, perché è l'unica cosa che Kimere ha in abbondanza:
la conoscenza puntuale della procedura.

---

## 2. Sitemap

13 route per lingua. EN e IT complete al lancio (D-03).

```
/                                  → redirect a /en/
│
├── /en/                           Home
├── /en/process/                   Come funziona — il percorso completo   ★ pagina cardine
├── /en/services/                  I tre livelli di supporto
├── /en/housing/                   Alloggio
├── /en/costs/                     Costi e finanziamento
├── /en/about/                     Chi siamo
├── /en/faq/                       Domande frequenti
├── /en/partners/                  Per le agenzie e gli atenei            ◆ percorso B2B
├── /en/book/                      Prenota la call — form di qualificazione
├── /en/thank-you/                 Conferma invio                          [noindex]
├── /en/privacy/                   Informativa privacy
├── /en/cookies/                   Cookie policy
├── /en/styleguide/                Design system navigabile   [noindex]   (FASE 4)
│
└── /it/  …stessa struttura, slug localizzati
```

### Mappa degli slug localizzati

| Chiave di route | EN | IT |
| :--- | :--- | :--- |
| `home` | `/en/` | `/it/` |
| `process` | `/en/process/` | `/it/percorso/` |
| `services` | `/en/services/` | `/it/servizi/` |
| `housing` | `/en/housing/` | `/it/alloggio/` |
| `costs` | `/en/costs/` | `/it/costi/` |
| `about` | `/en/about/` | `/it/chi-siamo/` |
| `faq` | `/en/faq/` | `/it/domande-frequenti/` |
| `partners` | `/en/partners/` | `/it/partner/` |
| `book` | `/en/book/` | `/it/prenota/` |
| `thankYou` | `/en/thank-you/` | `/it/grazie/` |
| `privacy` | `/en/privacy/` | `/it/privacy/` |
| `cookies` | `/en/cookies/` | `/it/cookie/` |
| `styleguide` | `/en/styleguide/` | `/it/styleguide/` |

> Gli slug localizzati richiedono una mappa centrale (`src/i18n/routes.ts`) usata sia dal router che
> dal language switcher. Dettagli in `tech-decisions.md`. Motivazione: il canale B2B verso agenzie e
> atenei italiani è servito da ricerche in italiano, e uno slug inglese su pagina italiana lo penalizza.

### Route non incluse in v1 (registrate per la v2)

`/blog/`, `/en/scholarships/` (pagina dedicata borse di studio), `/en/cities/` (schede città),
area studente riservata. Rationale in `PLAN.md` §Fuori scope.

---

## 3. Gerarchia di navigazione

### Header

```
[Logo Kimere]   How it works   Services   Housing   Costs   About      [EN|IT]  [Book your call]
                                                                        ↑ CTA primaria, sempre visibile
  ┌ riga di utility, de-enfatizzata ────────────────────────────────┐
  │ For agencies & universities →                                    │
  └──────────────────────────────────────────────────────────────────┘
```

Scelte e motivazioni:

- **5 voci di navigazione, non 6.** FAQ non entra nel menu: si raggiunge dal contesto (in fondo a Process, Services, Housing, Costs) e dal footer. È una destinazione di risposta, non di esplorazione.
- **"How it works" invece di "Process"** come etichetta: nomina la domanda dell'utente, non il nostro processo interno. L'URL resta `/process/` (più conciso e stabile per SEO).
- **"Costs" invece di "Study in Italy"** come etichetta: nomina l'ansia vera. Il titolo di pagina e il `<title>` portano comunque la formulazione cercata dagli utenti.
- **Il link B2B è separato e de-enfatizzato**: deve essere trovabile da chi lo cerca senza contendere attenzione al percorso studente. Mai nel menu principale.
- **La CTA è un bottone, non un link**, e resta visibile allo scroll su desktop e mobile.

### Mobile

Menu a pannello full-screen. La CTA **"Book your call" resta visibile fuori dal menu**, nell'header
compresso: è l'unica azione che non deve mai costare un tap in più.

### Footer

Quattro colonne, con lo scopo di raccogliere tutto ciò che non sta nell'header:

| Kimere | Per gli studenti | Per i partner | Legale |
| :--- | :--- | :--- | :--- |
| Chi siamo | Come funziona | Per le agenzie | Privacy |
| Contatti | Servizi | Per gli atenei | Cookie |
| Instagram · LinkedIn · Facebook | Alloggio · Costi · FAQ | LinkedIn | Disclaimer fonti ufficiali |

Il footer porta anche: payoff *"Your future, simplified"*, ragione sociale completa,
selettore di lingua secondario e il disclaimer generale che rimanda alle fonti istituzionali.

---

## 4. Le pagine, una per una

Per ciascuna: **obiettivo unico**, **above the fold**, **CTA**.

---

### `/en/` — Home
- **Obiettivo unico:** far capire in 8 secondi che Kimere copre *la parte difficile*, e instradare verso Process o Book.
- **Above the fold:** headline che nomina il problema reale (non uno slogan) + sottotitolo che dichiara il perimetro del servizio + CTA primaria + CTA secondaria verso Process. Nessuna immagine decorativa richiesta: regge la tipografia.
- **CTA:** primaria `Book your 15-minute call` · secondaria `See the full process`
- **Persona servita:** tutte, come smistamento.

---

### `/en/process/` — How it works ★
**La pagina più importante del sito.** È l'unico asset di credibilità che Kimere possiede oggi.

- **Obiettivo unico:** dimostrare padronanza della procedura reale, con nomi, tempi e sequenze veri, fino a rendere ovvio che affrontarla da soli è un rischio.
- **Above the fold:** una frase che inquadra la reale dimensione del problema (numero di passaggi, enti coinvolti, finestre temporali) + indice ancorato alle due fasi.
- **Struttura:** due macro-fasi, ciascuna con i passi dell'analisi strategica §5:
  - **Prima di partire** — pre-iscrizione Universitaly · Dichiarazione di Valore / attestato CIMEA · fascicolo consolare · visto tipo D (o tipo C sotto i 90 giorni) · prova di alloggio
  - **Dopo l'atterraggio** — permesso di soggiorno entro **8 giorni lavorativi** (Kit Giallo, Sportello Amico, ~116 €) · convocazione in Questura · codice fiscale · residenza anagrafica al Comune · iscrizione SSN
  - Per ogni passo: cosa succede · chi lo gestisce · quanto tempo richiede · **cosa fa Kimere**
- **CTA:** a fine pagina e a metà `Book your 15-minute call` — è qui che Aarav è pronto.
- **Obbligatorio:** disclaimer con rinvio alle fonti ufficiali (MUR, MAECI, Universitaly, Polizia di Stato). Le procedure cambiano con le circolari annuali.
- **Persona servita:** Aarav (primaria).

---

### `/en/services/` — I tre livelli
- **Obiettivo unico:** far riconoscere all'utente quale livello di supporto gli serve, senza parlare di prezzo.
- **Above the fold:** il criterio di scelta ("quanto lontano vuoi che veniamo con te"), non un listino.
- **Struttura:** tre livelli cumulativi — **Admission ⊂ Arrival ⊂ Settled** — per beneficio ed esito, mai per elenco di feature. Sezione finale che spiega **perché non ci sono prezzi**.
- **CTA:** `Book your 15-minute call` da ciascun livello, con il livello preselezionato nel form.
- **Persona servita:** Aarav, Sofia.

---

### `/en/housing/` — Alloggio
- **Obiettivo unico:** affrontare la barriera più temuta dicendo la verità su cosa Kimere può e non può fare.
- **Above the fold:** riconoscimento diretto del problema (mercato in tensione, garanzie richieste, contratti brevi rifiutati), non una promessa.
- **Sezioni:** perché è difficile · come funziona la truffa e come si riconosce · **cosa fa Kimere** (audit del contratto, registrazione, *dichiarazione di ospitalità*, assistenza linguistica) · **cosa Kimere non fa** (non è un'agenzia immobiliare) · **sezione dedicata Erasmus/UE**.
- **CTA:** `Book your 15-minute call`
- **Persona servita:** Sofia (primaria), Aarav.

---

### `/en/costs/` — Costi e finanziamento
- **Obiettivo unico:** rispondere a "posso permettermelo?" e qualificare economicamente prima della call.
- **Above the fold:** l'intervallo reale di spesa mensile, senza edulcorare.
- **Sezioni:** tasse universitarie pubbliche e private · costo della vita per città · il requisito dei **~7.000 €** per il visto e perché esiste · borse di studio regionali · **lavoro part-time 20 h/settimana (max 1.040 ore su 52 settimane)** · SSN 700 €/anno.
- **CTA:** `Book your 15-minute call`
- **Obbligatorio:** tutte le cifre datate e accompagnate da rinvio alla fonte ufficiale. Sono valori che cambiano.
- **Persona servita:** Aarav, Sofia.

---

### `/en/about/` — Chi siamo
- **Obiettivo unico:** trasformare "siete nuovi" da obiezione in prova di trasparenza.
- **Above the fold:** dichiarazione diretta di chi è Kimere e da quando esiste.
- **Sezioni:** perché esistiamo · come lavoriamo (metodo, non storia) · **cosa non facciamo** · dove siamo · come ci si contatta.
- **CTA:** `Book your 15-minute call`
- **Persona servita:** Aarav, Rania.

---

### `/en/faq/` — Domande frequenti
- **Obiettivo unico:** neutralizzare le obiezioni che bloccano la conversione.
- **Struttura:** raggruppate per tema — Prima di partire · Denaro · Alloggio · Dopo l'arrivo · Lavorare e restare · **Su Kimere** (inclusa "perché pagare se le informazioni sono gratis" e "cosa succede se il visto viene rifiutato").
- **CTA:** `Book your 15-minute call`
- **SEO:** dati strutturati `FAQPage`.
- **Persona servita:** tutte.

---

### `/en/partners/` — Per le agenzie e gli atenei ◆
- **Obiettivo unico:** far arrivare un referente di agenzia estera a un contatto diretto, con aspettative corrette sullo stato societario.
- **Above the fold:** proposta operativa in una riga ("voi reclutate nel vostro paese, noi gestiamo l'Italia"), registro completamente diverso dal B2C.
- **Sezioni:** il modello di collaborazione e dove passa il confine · cosa fa Kimere sul territorio · come si avvia una partnership · copertura geografica · ⚠️ nota sullo stato societario (**input cliente**).
- **CTA:** form B2B dedicato, in fondo alla pagina — campi diversi da quelli studente.
- **Nota:** deve funzionare come documento inoltrabile a un decisore, leggibile fuori contesto.
- **Persona servita:** Rania.

---

### `/en/book/` — Prenota la call
- **Obiettivo unico:** completare il form di qualificazione. Nient'altro in pagina che possa distrarre.
- **Above the fold:** cosa succede dopo l'invio, quanto dura la call, che è gratuita e senza impegno, e quali dati servono.
- **Struttura:** form multi-step (FASE 6). **Nessuna navigazione secondaria**, footer ridotto.
- **Biforcazione:** la domanda sulla cittadinanza deve arrivare **presto** e cambiare il resto del percorso (UE → nessuna domanda su visto).
- **Persona servita:** tutte, con rami distinti.

---

### `/en/thank-you/` — Conferma
- **Obiettivo unico:** ridurre l'ansia post-invio dicendo cosa succede e in quanto tempo.
- **Contenuto:** conferma di ricezione · tempi di risposta dichiarati · cosa preparare per la call · link ai social · link a Process per chi vuole continuare a leggere.
- **`noindex`.**

---

### Pagine legali e di sistema
`/privacy/`, `/cookies/` — obbligatorie, redatte in FASE 6.
`/styleguide/` — prodotta in FASE 4, `noindex`.
**404** — non è una pagina morta: riporta a Home, Process e Book.

---

## 5. Funnel di conversione

### Percorso B2C — principale

```
INGRESSO                    CONVINCIMENTO                 QUALIFICA          ESITO
─────────                   ─────────────                 ─────────          ─────
Ricerca organica ─┐
Instagram ────────┼──→ Home ──→ Process ★ ──→ Services ──→ Book ──→ Thank you ──→ Email da Kimere
Passaparola ──────┘      │         │                        ↑                        ↓
                         │         └────────────────────────┤                   Call 15 min
                         └──→ Costs ──→ FAQ ────────────────┤
                         └──→ Housing ────────────────────── ┘
```

**Il punto di conversione reale è la fine di Process**, non la home. La home smista, Process convince.
Ne segue che ogni pagina di contenuto deve chiudere con la CTA, e che Process va linkata dalla home
con la stessa evidenza della CTA primaria.

### Percorso B2B — secondario

```
LinkedIn ─────────┐
Ricerca ("student ─┼──→ Partners ──→ Form B2B ──→ Email diretta a Kimere
recruitment Italy")│         │
Inoltro interno ───┘         └──→ (inoltro a un decisore) ──→ ritorno diretto sulla pagina
```

I due percorsi **non si incrociano mai** se non attraverso il link di utility nell'header e il footer.
Un'agenzia non deve leggere copy pensato per uno studente diciannovenne, e viceversa.

---

## 6. Regole di collegamento interno

1. **Ogni pagina di contenuto chiude con la CTA primaria.** Nessuna eccezione salvo le pagine legali.
2. **Process è linkata da ogni pagina** — è il motore di credibilità.
3. **FAQ è linkata dal fondo** di Process, Services, Housing, Costs.
4. Le sezioni di Process che toccano il denaro linkano a Costs; quelle che toccano l'alloggio linkano a Housing.
5. **Nessun link esterno a piattaforme partner** (Universitaly, Camplus, ecc.) presentato come collaborazione. I rinvii alle fonti ufficiali sono citazioni informative, esplicitamente marcate come tali.
6. Il selettore di lingua porta **alla pagina equivalente**, mai alla home. Se manca la traduzione, si va all'equivalente più vicino, mai in 404.

---

## 7. Selettore di lingua

- Coppia esplicita `EN | IT`, mai bandiere (una bandiera indica un paese, non una lingua: l'inglese qui non è "del Regno Unito").
- Usa la mappa di route: `/en/process/` ⇄ `/it/percorso/`.
- Attributo `hreflang` su ogni link e nei `<link rel="alternate">`, con `x-default` → `/en/`.
- Nessun redirect automatico basato su IP o `Accept-Language`: cambia l'URL sotto i piedi all'utente e rompe la condivisione dei link. La preferenza si offre, non si impone.

---

## 8. Requisiti trasversali di accessibilità e struttura

Derivati dalle Web Interface Guidelines e da WCAG 2.2 AA; verificati in FASE 7.

- Un solo `<h1>` per pagina; gerarchia `h1→h6` senza salti.
- Landmark: `<header>`, `<nav>`, `<main>`, `<footer>`; **skip link** verso `<main>` come primo elemento focusabile.
- `scroll-margin-top` sulle ancore (l'indice di Process e le FAQ ne dipendono).
- Focus visibile su ogni elemento interattivo; mai `outline: none` senza sostituto.
- Navigazione completa da tastiera, incluso il menu mobile e l'accordion delle FAQ.
- Lo stato è nell'URL: l'accordion FAQ aperto e lo step del form devono essere linkabili.
- `<button>` per le azioni, `<a>` per la navigazione. Mai `<div>` cliccabili.

---

## 9. Riepilogo — obiettivi e CTA

| Pagina | Obiettivo unico | CTA |
| :--- | :--- | :--- |
| Home | Smistare, far capire il perimetro | Book · See the process |
| Process ★ | Dimostrare competenza | Book |
| Services | Far scegliere il livello | Book (livello preselezionato) |
| Housing | Dire la verità sul problema più temuto | Book |
| Costs | Rispondere a "posso permettermelo" | Book |
| About | Trasformare la novità in trasparenza | Book |
| FAQ | Neutralizzare le obiezioni | Book |
| Partners ◆ | Aprire un contatto B2B | Form B2B |
| Book | Completare la qualifica | Invio |
| Thank you | Ridurre l'ansia post-invio | — |
