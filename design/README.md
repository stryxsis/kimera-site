# FASE 4.1 — Tre direzioni visive

> Mockup statici, non codice di produzione. Servono a scegliere **una** direzione.
> Dopo la scelta (gate 4.2) si costruisce il design system vero in Astro + Tailwind.

## ✅ Esito del gate 4.2 — direzione scelta: **B «Rotta»**

Con una modifica richiesta dal cliente, già applicata a `direction-b.html`:

> **Via la barra di copertura dalle tre card dei livelli**, sostituita da un elenco con le voci
> spuntate, come nella direzione C.

Le tre card ora hanno: nome del livello → tagline → etichetta `INCLUSO — …` → elenco con caselle
spuntate in oro → CTA. La linea di rotta resta il dispositivo firma della direzione, ma vive solo
dove porta informazione vera: nell'hero, nella mappa completa della pagina *Percorso* (`ILL-01`) e
nella `404`.

`direction-a.html` e `direction-c.html` restano nel repository come traccia dell'esplorazione: non
sono più candidati e non vanno aggiornati.

---

## Come guardarli

Apri i tre file nel browser (doppio clic basta, non serve il server):

- `design/direction-a.html` — **Sportello**
- `design/direction-b.html` — **Rotta**
- `design/direction-c.html` — **Fascicolo**

Tre cose da fare in ciascuno:

1. **Premi IT** in alto a destra. Il testo passa all'italiano vero, non a un segnaposto — è il
   modo per verificare che il layout regga il 15–20% di lunghezza in più dell'italiano, che è un
   requisito reale del progetto e la prima cosa che rompe i mockup fatti male.
2. **Restringi la finestra** fino a ~360 px. Tutte e tre sono responsive.
3. Guardali **uno dopo l'altro a schermo intero**, non affiancati: la scelta è sull'impressione
   nei primi tre secondi, che è tutto quello che avrà uno studente in ansia.

## Cosa hanno in comune (e perché)

Tutte e tre partono **dalla stessa palette del logo** e rispettano lo stesso vincolo tecnico:
l'oro `#BDA15D` ha contrasto 2.33 sul cream — **non può mai essere inchiostro su fondo chiaro**.
Ognuna risolve questo vincolo in modo diverso, ed è una delle differenze più visibili tra le tre.

Il contenuto è **identico e reale** in tutte e tre: è il copy della FASE 3, non testo finto.
Stesso hero, stessi tre dati, stessi tre livelli di servizio. Così l'unica variabile è il design.

Nessuna delle tre usa fotografie, loghi di atenei, numeri su Kimere o testimonianze — i vincoli
di prodotto valgono anche nei mockup.

**31 coppie di colore verificate** con calcolo del contrasto WCAG: zero fallimenti, la maggior
parte in AAA. Nessuna delle tre direzioni contiene una combinazione da correggere dopo.

---

# Direzione A — «Sportello»

> **La fiducia si dimostra con l'ordine.**

## Concetto

Il linguaggio visivo di uno sportello pubblico, ridisegnato da qualcuno a cui importa davvero.
Tutto ha un'etichetta, tutto sta nel suo scomparto. La pagina si legge come un modulo
amministrativo progettato bene — che è esattamente la promessa del servizio: *sappiamo a quale
sportello si va*.

## Il dispositivo firma: la corsia delle etichette

Una colonna stretta a sinistra porta etichette in monospaziato maiuscolo (`01 — COSA TI ASPETTA`,
`LIVELLO 02`) accanto a ogni blocco di contenuto. Non è decorazione: è la **struttura del copy resa
visibile**. Ogni passo del percorso, nella FASE 3, è già scritto secondo lo stesso schema — *cosa
succede · chi decide · quanto tempo · cosa può andare storto · cosa fa Kimere*. La corsia mostra
quello schema invece di nasconderlo, e la ripetizione della struttura diventa essa stessa una prova
di metodo.

I tre livelli di servizio **non sono card**: sono righe di registro separate da filetti, con
l'elenco delle voci numerato. Le card affiancate obbligano a confronti che qui non si vogliono
(sembrerebbero fasce di prezzo); le righe si leggono in sequenza, che è come funzionano davvero
i livelli cumulativi.

## Palette

| Ruolo | Hex | Contrasto verificato |
| :--- | :--- | :--- |
| Fondo dominante | `#FBF7EB` cream | — |
| Inchiostro | `#0A2546` navy | 14.35 · AAA |
| Testo di appoggio | `#103E5D` blu | 10.49 · AAA |
| Etichette | `#5B5C5A` grigio | 6.28 · AA |
| Link e accenti | `#1B7087` teal | 5.28 · AA |
| Fascia dati | `#071F3D` navy profondo | — |
| Cifre sulla fascia | `#D6B86C` oro chiaro | 8.59 · AAA |
| CTA | fondo oro `#BDA15D`, testo navy | 6.62 · AA |

Una sola superficie scura in tutta la pagina, usata per la fascia dei dati. È la sola volta in cui
l'oro compare come colore di testo, e quindi il momento di massima intensità visiva coincide con
il fatto più importante del sito (gli 8 giorni).

## Tipografia

- **Bodoni Moda** (display) — didone ad alto contrasto, la famiglia più vicina al wordmark KIMERE
  del logo. Il titolo della home ne è la vera immagine: senza fotografie, il carattere è l'hero.
- **Public Sans** (testo) — è la famiglia del design system del governo federale statunitense.
  Non è una scelta neutra per caso: è progettata per moduli e comunicazioni pubbliche, ha ottima
  leggibilità a corpo piccolo ed è pensata per lettori non madrelingua.
- **IBM Plex Mono** (etichette, numeri, scadenze) — il monospaziato fa leggere i dati *come dati*.

## Illustrazioni

Disegno tecnico: solo linea, tratto navy sottile, su griglia visibile. L'oro marca **un solo punto
per diagramma** — quello critico. `ILL-01` (mappa del percorso) diventa un diagramma quotato, con
le scadenze annotate come misure su un disegno d'officina.

## Mood

Preciso, calmo, istituzionale. Un ministero progettato da uno studio svizzero.

## Il rischio

È la più **sicura** delle tre, e questo è anche il suo limite: cream + serif ad alto contrasto +
etichette in monospaziato è il registro che oggi tende a somigliare a molti altri siti curati.
Funziona sempre, sorprende poco. Se la scegli, la personalità dovrà arrivare tutta dalle
illustrazioni della FASE 4.4.

---

# Direzione B — «Rotta»

> **La fiducia si dimostra mostrando la mappa.**

## Concetto

La rosa dei venti del logo presa sul serio. Il sito è un **atlante del percorso** dalla lettera di
ammissione al permesso di soggiorno. Il fondo scuro è il campo della mappa; cream e oro sono i segni
tracciati sopra.

L'hero non è uno slogan sopra uno sfondo: **l'hero è la rotta**. Metà dello schermo iniziale è
occupata dal percorso reale — otto tappe, il punto in cui atterri marcato in bianco, la scadenza
degli 8 giorni marcata in oro. È l'unica direzione in cui il visitatore *vede* la promessa nei primi
tre secondi invece di leggerla.

## Il dispositivo firma: la linea di rotta

Una linea continua percorre la pagina raccogliendo nodi. È lo stesso oggetto a zoom diversi: qui è
compressa a otto tappe, nella pagina *Percorso* diventa la mappa completa a undici passi (`ILL-01`),
nella `404` è la stessa linea interrotta.

**I tre livelli di servizio non usano la linea** (scelta del cliente al gate 4.2, vedi in cima):
sono card con un elenco di voci spuntate. La logica cumulativa — Admission ⊂ Arrival ⊂ Settled —
resta leggibile perché è già nel testo: l'etichetta dice fin dove arriva il livello
(`INCLUSO — FINO AL VISTO`, `— FINO ALLE PRIME SETTIMANE`, `— L'INTERA ROTTA`) e la prima voce
spuntata di ogni livello è *«Tutto ciò che è incluso nel livello precedente»*. Le spunte in oro sono
l'unico accento cromatico delle card, e sono anche il segnale giusto: una casella spuntata dice
*fatto*, che è la cosa che il lettore vuole sapere.

## Palette

| Ruolo | Hex | Contrasto verificato |
| :--- | :--- | :--- |
| Fondo dominante | `#071F3D` navy profondo | — |
| Rilievo / pannelli | `#0A2546` navy | — |
| Testo | `#FBF7EB` cream | 15.41 · AAA |
| Testo secondario | `#B6C4D4` | 9.30 · AAA |
| Accento, nodi chiave | `#D6B86C` oro chiaro | 8.59 · AAA |
| Linea di rotta | `#2B9EB0` teal | 4.85 · ampiamente sopra la soglia grafica |
| Fascia di sollievo | `#FBF7EB` cream, testo navy | 14.35 · AAA |
| CTA | fondo oro `#BDA15D`, testo navy | 6.62 · AA |

Questa è **l'unica direzione in cui l'oro del brand è davvero vivo**: su cream ha 2.33 ed è
inutilizzabile, su navy ha 8.59 ed è AAA. Un sito a dominante scura è l'unico posto in cui il
colore d'accento del logo può fare il suo lavoro.

Il ritmo alterna: mappa scura → legenda chiara → mappa scura. La fascia cream dei dati non è una
variazione decorativa, è il modo in cui le pagine dense (Costi, FAQ, Percorso) resteranno leggibili.

## Tipografia

- **EB Garamond** (display) — il serif delle carte geografiche antiche. Contrasto moderato, che su
  fondo scuro è un requisito tecnico: i didoni ad alto contrasto sbavano nelle aste sottili quando
  sono chiari su scuro. Il corsivo marca i momenti di passaggio (*Atterri*).
- **Archivo** (testo e interfaccia) — grottesca solida, ampia gamma di pesi, ottima tenuta su fondo
  scuro e su corpi piccoli. Copre da sola i ruoli di testo, etichetta e dato.

Due famiglie soltanto. La disciplina tipografica è parte del carattere di questa direzione.

## Illustrazioni

Cartografiche: rotte, nodi, legende, indicatori di direzione. La rosa dei venti del logo esce dal
JPG e diventa un ornamento riusabile (`ILL-06` come pattern delle superfici scure, e il marchio
ridotto per header e favicon). `ILL-02` — «gli enti coinvolti che non si parlano» — diventa una
mappa di nodi scollegati, che è letteralmente ciò che il diagramma deve dire.

## Mood

Serio, notturno, orientato. Un atlante o una carta nautica. Il contrario esatto di un sito SaaS.

## Il rischio

Il fondo scuro. Su un pubblico già in ansia può leggersi come severo invece che come autorevole, e
tredici pagine dense di testo su scuro sono più faticose di tredici pagine su chiaro. Il mockup
mostra già la contromisura — le sezioni da leggere davvero vanno sulla fascia cream, lo scuro resta
per hero, navigazione e transizioni — ma è una disciplina da mantenere in tutta la FASE 5.

---

# Direzione C — «Fascicolo»

> **La fiducia si dimostra mostrando l'artefatto.**

## Concetto

Quello che Kimere produce davvero è un **fascicolo**: un file completo, assemblato correttamente,
che regge davanti a un consolato. Il sito ha la struttura di quel fascicolo — fogli, linguette
d'indice, righe di protocollo, spunte.

Nessuna texture di carta, nessuna ombra finta, nessun effetto: si prende la **struttura** di un
dossier, non il suo aspetto. È la differenza tra citare un linguaggio e imitarlo.

## Il dispositivo firma: la linguetta d'indice

Un rettangolo oro con testo navy condensato, appoggiato sul bordo superiore di ogni foglio.

Nasce da un vincolo, non da un gusto: l'oro non può essere inchiostro su chiaro (2.33), ma **come
riempimento con testo navy sopra è 6.62 e conforme**. La linguetta è quindi l'unico modo legittimo
di portare l'oro del brand su una pagina chiara — e per fortuna è anche l'oggetto giusto, perché è
la linguetta colorata di un raccoglitore, ed è lo stesso giallo del *Kit Giallo* che lo studente
ritirerà davvero all'ufficio postale.

Sopra ogni foglio corre una **riga di protocollo** in condensato maiuscolo con i metadati veri della
sezione (`11 PASSI · 2 FASI`, `CUMULATIVI — OGNI LIVELLO CONTIENE IL PRECEDENTE`). Le voci degli
elenchi hanno caselle spuntate: il fascicolo è completo.

L'hero è il **foglio di copertina**, con due linguette in cima — `Studenti` e `Agenzie e atenei`.
È l'unica delle tre direzioni che risolve visivamente il doppio target B2C/B2B già above the fold,
senza aggiungere una voce di menu.

## Palette

| Ruolo | Hex | Contrasto verificato |
| :--- | :--- | :--- |
| Piano di fondo | `#EFE8D4` cream profondo | — |
| Foglio | `#FBF7EB` cream del brand | — |
| Inchiostro | `#0A2546` navy | 14.35 su foglio · 12.57 sul piano · AAA |
| Testo di appoggio | `#5B5C5A` grigio | 6.28 · AA |
| Numerazione, spunte | `#1B7087` teal | 5.28 · AA |
| **Linguetta** | fondo oro `#BDA15D`, testo navy | 6.62 · AA |
| Fascia riepilogo | `#071F3D` navy, cifre oro | 8.59 · AAA |

Due tonalità di cream invece di una: il piano è leggermente più profondo del foglio, così i fogli
si staccano senza bisogno di ombre. È l'unica aggiunta alla palette del logo, ed è una gradazione
dello stesso colore, non un colore nuovo.

## Tipografia

- **Source Serif 4** (display) — serif progettato per la lettura di documenti, contrasto contenuto,
  volutamente sobrio. Qui la scelta è al contrario di A: il serif della pagina è quieto, così
  l'unico serif ad alto contrasto che si vede resta **il wordmark del logo**, che diventa la firma.
- **Barlow** (testo) e **Barlow Semi Condensed** (linguette, protocolli, navigazione) — una sola
  superfamiglia in due larghezze. Il condensato è il carattere della modulistica; averlo come
  variante della stessa famiglia tiene insieme il sistema invece di frammentarlo.

## Illustrazioni

Derivate dai documenti: moduli, timbri, cartelle, caselle, buste. Piatte, linea più campitura, navy
e teal, con l'oro a marcare lo stato «fatto». `ILL-05` (icone dei passi) diventa un set di documenti
riconoscibili — la busta gialla del Kit, il modulo F24, la ricevuta con la data di convocazione.

## Mood

Tattile, denso, caldo. Inconfondibilmente amministrativo italiano, ma calmo e ordinato.

## Il rischio

Si appoggia all'iconografia burocratica, cioè **esattamente ciò che il pubblico teme**. La scommessa
è che la paura nasca dall'opacità delle pratiche, non dalle pratiche in sé, e che vederle già
ordinate e spuntate sia rassicurante. Se la scommessa non regge, il sito somiglia al problema invece
che alla soluzione. È anche la direzione con più peso visivo per pagina: fogli dentro fogli vanno
tenuti a bada nelle pagine lunghe.

---

# Confronto

| | **A — Sportello** | **B — Rotta** | **C — Fascicolo** |
| :--- | :--- | :--- | :--- |
| Tesi di fiducia | L'ordine | La mappa | L'artefatto |
| Superficie dominante | Cream | Navy | Cream profondo, a fogli |
| L'hero mostra | Il titolo, in grande | Il percorso | Il fascicolo di copertina |
| Dove vive l'oro | Solo sulla fascia scura | Ovunque | Nelle linguette |
| Struttura dei livelli | Righe di registro | Card con voci spuntate | Fogli con linguetta |
| Doppio target B2C/B2B | Da risolvere altrove | Da risolvere altrove | Già risolto nell'hero |
| Tipografia | Bodoni Moda · Public Sans · IBM Plex Mono | EB Garamond · Archivo | Source Serif 4 · Barlow |
| Densità | Alta | Media | Molto alta |
| Rischio principale | Poco memorabile | Fondo scuro su lettori ansiosi | Somigliare al problema |

## La mia raccomandazione: **B — Rotta**

Per tre motivi, in ordine di peso:

1. **È l'unica in cui l'hero fa un'affermazione invece di enunciarla.** Il posizionamento del brand è
   «i concorrenti ti fanno ammettere, Kimere ti fa atterrare». In B quella frase non va scritta:
   si vede, perché metà dell'hero è il percorso e il punto centrale è l'atterraggio. In A e in C
   la stessa cosa va detta a parole e va creduta sulla fiducia — che è precisamente ciò che un'azienda
   senza track record non può chiedere.
2. **Rende leggibile la differenza tra i livelli senza prezzi in pagina.** Il visitatore deve capire
   da solo cosa cambia tra Admission, Arrival e Settled. «Quanto lontano arriviamo con te» è il
   criterio dichiarato nel brand brief, e l'etichetta di copertura sopra ogni elenco lo dice in
   quattro parole.
3. **È l'unica che usa il brand per intero.** Su fondo chiaro l'oro del logo resta inutilizzabile per
   quasi tutto. B è l'unica direzione in cui il colore d'accento del marchio esiste davvero.

**La riserva, dichiarata:** il fondo scuro va gestito con disciplina nelle pagine lunghe. Il mockup
mostra già il pattern giusto (fascia cream per i blocchi da leggere), ma è un impegno per tutta la
FASE 5, non una scelta indolore.

**Se preferisci un sito a dominante chiara**, la base migliore è **A**, e la linea di rotta di B è
trapiantabile su A senza conflitti: è un dispositivo strutturale, non cromatico. Dimmelo e nel
gate 4.2 la combino.
