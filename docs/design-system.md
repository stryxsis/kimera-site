# Design System — Kimere

> Direzione **«Rotta»**, scelta al gate 4.2 (D-13 in `PROGRESS.md`).
> Codice: `src/styles/global.css` (token e superfici), `src/components/ui/` (componenti),
> `src/components/brand/` (marchio), `src/components/illustrations/` (illustrazioni).
> Riferimento visivo navigabile: **`/en/styleguide/`** (`noindex`, non fa parte del sito pubblico).

---

## 1. Il principio: due superfici, un accento che cambia

Questo è l'unico concetto da capire per usare il sistema senza sbagliare.

L'oro del brand `#BDA15D` ha **2.33** di contrasto sul cream — illeggibile — e **8.59** sul navy —
AAA. Il teal fa l'opposto. Quindi **il colore d'accento non è una costante**: dipende dalla
superficie su cui si sta.

Invece di ricordarselo a mano in ogni componente, il sistema lo rende strutturale. Tre classi
ridefiniscono un piccolo set di variabili:

| Variabile | `.surface-dark` | `.surface-panel` | `.surface-light` |
| :--- | :--- | :--- | :--- |
| `--surface-bg` | `#071F3D` | `#0A2546` | `#FBF7EB` |
| `--surface-raised` | `#0A2546` | `#071F3D` | `#FBF7EB` |
| `--surface-fg` | cream | cream | navy |
| `--surface-fg-soft` | `#D5DEE7` | `#D5DEE7` | `#103E5D` |
| `--surface-fg-muted` | `#B6C4D4` | `#B6C4D4` | `#4A5A6B` |
| **`--surface-accent`** | **oro `#D6B86C`** | **oro `#D6B86C`** | **teal `#1B7087`** |
| `--surface-marker-bg` / `-fg` | oro / navy | oro / navy | navy / cream |
| `--surface-control-line` | `#6F7D8B` | `#6F7D8B` | `#7C8590` |
| `--surface-focus` | oro | oro | teal |

**Ogni componente legge `--surface-*`, mai i colori diretti.** Un bottone, un link, una spunta o un
anello di focus messi su fondo chiaro o scuro prendono da soli la variante conforme. Non si può
sbagliare per distrazione, ed è per questo che il sistema è costruito così.

### Regola di composizione

I blocchi da **leggere davvero** — testo lungo, tabelle, FAQ, pagina Costi — vanno su
`.surface-light`. Lo scuro resta per hero, navigazione, transizioni e chiusure.

Non è una preferenza: è la contromisura al rischio dichiarato della direzione «Rotta» al gate 4.1
(«tredici pagine dense di testo su fondo scuro sono più faticose di tredici pagine su chiaro»).
La home ne è il riferimento: hero scuro → dati su chiaro → perimetro scuro → livelli su pannello →
fiducia su chiaro → CTA scuro.

### Non usare mai

- Oro come **testo** su fondo chiaro (2.33). Su chiaro l'oro esiste solo come **riempimento**
  con testo navy sopra (bottone primario, badge pieno: 6.62).
- Teal chiaro `#2B9EB0` come testo su cream (2.96). Su chiaro il teal è `#1B7087`.
- Ombre per separare i piani su fondo scuro: non si vedono e lasciano un alone. **Bordi.**

---

## 2. Verifica dei contrasti — `npm run check:contrast`

```
24 coppie verificate — 0 sotto soglia.
```

Lo script (`scripts/check-contrast.mjs`) calcola il rapporto WCAG di **ogni coppia realmente usata**
e fallisce con exit code 1 se una scende sotto la soglia: 4.5 per il testo (1.4.3 AA), 3.0 per i
confini degli elementi d'interfaccia necessari a riconoscerli (1.4.11). I bordi puramente
decorativi sono elencati come informativi, senza soglia.

Serve perché con due superfici e un accento variabile è facilissimo introdurre una coppia sbagliata
mesi dopo, in una pagina qualsiasi. **Ha già trovato un bug reale in questa fase:** la pastiglia
della lingua attiva usava `--surface-accent` come fondo, e su superficie chiara sarebbe stata navy
su teal — **2.92**, sotto soglia. Da lì è nato `--surface-marker-*`.

> ⚠️ I token nello script sono una copia di quelli in `global.css`. Se cambi un colore, cambialo in
> entrambi. È il prezzo di non avere un runtime CSS in un controllo eseguito da Node.

---

## 3. Tipografia

Due famiglie. Nessuna terza.

| Ruolo | Famiglia | Perché |
| :--- | :--- | :--- |
| Titoli, cifre, perno della rotta | **EB Garamond** | Il serif delle carte antiche. Contrasto moderato: è un requisito tecnico, non un gusto — i caratteri ad altissimo contrasto sbavano nelle aste sottili quando sono chiari su scuro, e questo sito è a dominante scura. Il corsivo marca i passaggi (*You land*). |
| Testo, interfaccia, etichette, dati | **Archivo** | Grottesca solida, ampia gamma di pesi, tiene su fondo scuro e a corpi piccoli. Copre da sola testo, etichetta e dato. |

Entrambe **self-hosted** via `@fontsource-variable/*`: nessuna richiesta a `fonts.googleapis.com`.
Su un sito che raccoglie nazionalità e dati sul percorso migratorio, un `@font-face` verso un terzo
esporrebbe l'IP di ogni visitatore senza base giuridica. Verificato nel build: **zero richieste a
domini esterni**.

### Scala fluida

Nessun breakpoint tipografico: `clamp()` interpola con continuità da 320 a 1920 px. Regge anche
l'italiano, che è più lungo dell'inglese del 15–20%.

| Token | Uso |
| :--- | :--- |
| `--text-5xl` | Hero della home |
| `--text-4xl` | Titolo di pagina, cifre delle statistiche |
| `--text-3xl` | Titolo di sezione |
| `--text-2xl` | Nome del livello di servizio |
| `--text-xl` | Titolo di pilastro |
| `--text-lg` | Lead |
| `--text-base` | Testo corrente |
| `--text-sm` | Elenchi, didascalie, voci incluse |
| `--text-xs` / `--text-2xs` | Etichette, badge, note |

I controlli di modulo restano fissi a **16 px**: sotto quella soglia iOS applica lo zoom automatico
al focus e il modulo salta sotto le dita di chi sta compilando.

---

## 4. Ritmo, raggi, elevazione, movimento

- **Ritmo verticale:** `--spacing-section` (fluido 3 → 5.25 rem) e `--spacing-section-lg`.
  Il componente `Section.astro` li applica, non si scrivono a mano.
- **Contenitore:** `.wrap` — `min(100% - 2×gutter, 78rem)`. Unico, in tutto il sito.
  `--container-prose` (68ch) limita la misura del testo lungo.
- **Raggi:** 2/3/5 px. Piccoli di proposito: un raggio generoso legge come app, e questo sito deve
  leggere come studio professionale.
- **Elevazione:** **bordi, non ombre.** Esiste una sola ombra (`--shadow-overlay`) per ciò che
  galleggia davvero.
- **Movimento:** una sola animazione in tutto il sito, `.animate-rise` (opacità + 12 px), usata
  solo nell'hero della home con ritardi scalati di 60 ms. `prefers-reduced-motion: reduce` la
  annulla insieme a ogni transizione e allo scroll morbido, nel layer `base`.

---

## 5. Componenti

Tutti in `src/components/`. Gli stili sono in blocchi `<style>` con scope di Astro e leggono i
token: **nessun valore cromatico o tipografico scritto a mano nei componenti.**

| Componente | Note |
| :--- | :--- |
| `ui/Section.astro` | Sezione con superficie dichiarata. È il modo per cambiare superficie. |
| `ui/Button.astro` | `primary` (oro, testo navy — identico su ogni superficie), `secondary` (bordo), `quiet` (link sottolineato). Rende `<a>` con `href`, `<button>` senza. |
| `ui/Card.astro` | Bordo, non ombra. `raised` usa `--surface-raised`. |
| `ui/Badge.astro` | `accent`, `solid` (oro pieno — per il dato che deve fermare l'occhio), `quiet`. |
| `ui/Accordion.astro` | `<details>/<summary>` nativi, **zero JavaScript**: funziona anche se lo script è bloccato, la tastiera funziona da sola e Ctrl+F trova il testo chiuso. Su una pagina che risponde a domande su visti e rifiuti, il contenuto deve essere raggiungibile in ogni condizione. |
| `ui/Field.astro` | Etichetta sempre visibile (mai sostituita dal placeholder), suggerimento che spiega *perché* il campo esiste, errore che dice come rimediare. |
| `ui/Input.astro` | `input`/`textarea`/`select` in un componente solo, così bordo, focus e altezza non si sfasano campo per campo. |
| `brand/Logo.astro` | Lockup. `compact` (header) e `full` (footer, legali, social). |
| `brand/LogoMark.astro` | Il solo segno. `compact` (rosa) e `full` (rosa + libro), più `mono`. |

### Il collegamento di `aria-describedby`

Gli slot di Astro non passano proprietà. Il legame tra controllo, suggerimento ed errore è quindi
per **convenzione sugli id** — `${id}-hint`, `${id}-error` — tenuta in un posto solo:
`src/lib/field.ts`. È l'unico punto in cui un refuso rompe l'accessibilità **in silenzio**: un
`aria-describedby` che punta a un id inesistente non produce nessun errore, semplicemente non
annuncia nulla.

```astro
<Field id="nationality" label="Your nationality" hint="It decides everything that follows." required>
  <Input id="nationality" name="nationality" describedBy={describedBy('nationality', { hint: true })} />
</Field>
```

---

## 6. Il marchio, ridisegnato (FASE 4.4)

Il file ricevuto — `src/assets/brand/logo-kimere-source.jpg` — non è utilizzabile in produzione:
raster, senza trasparenza (porta con sé il suo rettangolo cream su qualunque fondo), con cinque
elementi sovrapposti che a 36 px collassano in una macchia, e con descrittore e payoff cotti
nell'immagine. Resta il **riferimento cromatico e concettuale**, non l'asset.

**La riduzione tiene due elementi**, scelti perché sopravvivono alla scala e perché significano
qualcosa qui: la **rosa dei venti** (che è anche il concetto della direzione scelta) e il **libro
aperto** (la parte «Academy» del nome). La punta nord è oro — è la convenzione delle bussole, ed è
l'unico modo di far comparire l'oro in un segno di 20 px senza problemi di contrasto, perché è una
forma e non del testo.

**Il wordmark non è un tracciato: è testo vero**, impaginato in EB Garamond accanto al segno.
Tre conseguenze, tutte volute:

1. resta nitido a qualsiasi dimensione e densità di schermo;
2. screen reader e motori di ricerca leggono «Kimere», non un'immagine;
3. **il lockup si ricompone**: orizzontale nell'header, in colonna nel footer — che era esattamente
   il limite del JPG.

`public/favicon.svg` è la sola versione con i colori fissi e un fondo pieno: una favicon trasparente
sparisce sulle barre schede scure.

> **Ancora da fare:** l'immagine Open Graph (FASE 7, insieme al resto dei metadati social) e,
> se il cliente lo vuole, un PNG del lockup per usi fuori dal web.

---

## 7. Illustrazioni

| ID | Componente | Note |
| :--- | :--- | :--- |
| `ILL-01` | `illustrations/RouteMap.astro` | **L'asset portante.** Costruita in HTML+CSS, non in SVG: contiene testo vero. Un `<text>` SVG non va a capo, non si traduce senza rifare il disegno, non si seleziona e i lettori di schermo lo attraversano male. La linea e i nodi sono decorazione CSS attorno a una lista ordinata semantica — che è ciò che il percorso è. Due zoom: compressa nella home, completa nella pagina Percorso. |
| `ILL-02` | `illustrations/OfficesGrid.astro` | Dice la sua cosa **per sottrazione**: nessuna linea collega le caselle, e ognuna ha un tratteggio che parte e non arriva da nessuna parte. È il problema, letteralmente. |
| `ILL-03` + `ILL-05` | `illustrations/StepIcon.astro` | Set unico. Solo linea, spessore costante 1.6. **L'oro marca un solo elemento per icona**, sempre quello che conta: il sigillo approvato, il giorno della scadenza, la porta di casa tua. Soggetti dal mondo reale della pratica, mai omini stilizzati che festeggiano. |
| `ILL-04` | `illustrations/HandoverDiagram.astro` | Due colonne e un punto di consegna. Su una pagina che parla a chi valuta il rischio di una partnership, un confine ambiguo vale meno di nessun diagramma. |
| `ILL-06` | filigrana nel `Footer` | La rosa dei venti sovradimensionata al 3.5% di opacità, **non un motivo tassellato**: una texture ripetuta su navy legge come carta da parati. |
| `ILL-07` | `illustrations/BrokenRoute.astro` | La stessa linea del sito, interrotta, con il nodo finale fuori tracciato in oro. Nessun omino smarrito. |

**Regole del set:** SVG originali, `currentColor` per il corpo, `--surface-accent` per l'oro,
`aria-hidden` per default. Il `title` si passa **solo** se l'illustrazione porta informazione che
il testo accanto non dà già — altrimenti è rumore per chi usa uno screen reader.

---

## 8. La home come riferimento di qualità

`src/pages/{en,it}/index.astro` è il metro per tutte le pagine della FASE 5. Struttura:

| # | Sezione | Superficie | Nota |
| :--- | :--- | :--- | :--- |
| H1 | Hero + rotta | scura | Metà dell'hero è il percorso: il visitatore lo **vede**, non lo legge. |
| H2 | La misura del labirinto | chiara | I dati sono sul sistema italiano, mai su Kimere. |
| H3 | Il perimetro in tre blocchi | scura | Icone legate alle tre fasi reali, non decorative. |
| H5 | I tre livelli | pannello | Card con voci spuntate (scelta del cliente al gate 4.2). |
| H6 | Perché fidarsi di un'agenzia nuova | chiara | L'obiezione disinnescata prima che si formi. |
| H7 | CTA finale | scura | Unica azione del sito: la call di 15 minuti. |

Le due lingue sono lo **stesso file con una riga diversa** (`const locale`): ogni testo visibile
viene dalle content collection o dal dizionario UI, nessuno è scritto nel template.

---

## 9. Cosa resta fuori da questa fase

- **Peso dei font nel deploy.** `@fontsource-variable` dichiara tutti i sottoinsiemi (cirillico,
  greco, vietnamita…): il browser scarica solo latino e latino esteso grazie a `unicode-range`, ma
  i file inutilizzati restano nel pacchetto (~570 KB complessivi). Da ridurre in **FASE 7**.
- **Immagine Open Graph** e metadati social — **FASE 7**.
- **Stati del modulo** oltre a errore/obbligatorio (caricamento, invio riuscito) — **FASE 6**,
  quando esiste il form vero.
- **Tabelle** e **paginazione**: non servono a nessuna pagina prevista. Se una pagina della FASE 5
  ne avesse bisogno, si compone con i pattern esistenti e si documenta qui.
