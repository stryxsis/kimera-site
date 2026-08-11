# Immagini e video del sito

I file vanno qui. Finché un file manca, il sito mostra al suo posto un
segnaposto dichiarato che descrive cosa dovrà rappresentare: il layout è già
quello definitivo e non cambia di una riga quando il file arriva.

## Che cosa c'è già

| File                        | Dove       | Note                                                     |
| :-------------------------- | :--------- | :------------------------------------------------------- |
| `hero-earth.mp4`            | Home, hero | 6,2 s · 1280×720 · 557 KB · senza audio · faststart       |
| `hero-earth-portrait.mp4`   | Home, hero | lo stesso video ritagliato 9:16 · 406×720 · 231 KB        |
| `hero-earth-poster.webp`    | Home, hero | primo fotogramma · 31 KB · si dipinge subito              |

Il video della home è **decorativo** (`aria-hidden`), va sempre **muto** e non è
in loop: si ferma sull'ultimo fotogramma, che è la composizione voluta. Non
serve un file di sottotitoli perché non veicola informazione — quella sta tutta
nel testo accanto.

### Perché tre file e non uno

L'originale era un unico 1280×720 da 1,71 MB con dentro una traccia audio mai
riprodotta, caricato con `preload="auto"`: su rete mobile competeva per la banda
con CSS e font, e spesso arrivava dopo che il testo era già entrato — quindi si
pagava tutto quel peso senza vedere niente.

- **Il ritaglio verticale non perde nulla.** La hero usa `object-fit: cover` su
  un'area alta e stretta: su un telefono in portrait il browser scarta già da sé
  tutta la larghezza fuori dalla fascia centrale. Codificare solo quella fascia
  mostra esattamente la stessa immagine a un terzo dei byte. La variante la
  sceglie lo script con `matchMedia`, non l'attributo `media` su `<source>`, che
  non viene rivalutato ed è meno affidabile.
- **Il poster copre l'attesa.** Sono 31 KB che si dipingono subito, ed è anche
  l'unica cosa che vede chi non ha JavaScript.
- **Su rete lenta o con il risparmio dati attivo il video non si scarica
  affatto**: restano poster e testo, che sono già la composizione.

Risultato misurato: telefono da 1,71 MB a **253 KB**, e a **31 KB** su
connessione lenta. Desktop a 589 KB.

⚠️ Se lo sostituisci servono **tutti e tre** i file. Si rigenerano con ffmpeg —
`-an` toglie l'audio, `+faststart` porta l'indice in testa (senza, il browser
deve scaricare fino in fondo prima di poter cominciare):

```sh
ffmpeg -i sorgente.mp4 -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -preset veryslow -crf 30 -movflags +faststart -an hero-earth.mp4
ffmpeg -i sorgente.mp4 -vf "crop=406:720:(iw-406)/2:0" -c:v libx264 \
  -profile:v main -pix_fmt yuv420p -preset veryslow -crf 30 \
  -movflags +faststart -an hero-earth-portrait.mp4
ffmpeg -i sorgente.mp4 -frames:v 1 -q:v 72 hero-earth-poster.webp
```

⚠️ Tieni la Terra **centrata orizzontalmente**: il ritaglio verticale prende la
fascia centrale, e un soggetto decentrato sparisce. La regia si adatta da sé a
una durata diversa (legge `video.duration`), quindi non c'è nessun tempo scritto
a mano da aggiornare.

## Che cosa manca oggi

| Dove                            | Cosa serve                                                                     | Proporzioni | Campo da valorizzare                             |
| :------------------------------ | :----------------------------------------------------------------------------- | :---------- | :----------------------------------------------- |
| Perché l'Italia — hero          | Cortile o aula di un ateneo storico italiano, luce naturale calda, studenti veri | 4:5         | `hero.image` in `src/content/studyInItalyPage/`   |
| Chi siamo — ritratti del team   | Un ritratto per persona: luce naturale, sfondo neutro, sguardo in camera         | 4:5         | `ecosystem.team.members[].photo`                 |
| Chi siamo — video di presentazione | Una persona del team che spiega cosa fa Kimere, con sottotitoli                | 16:9        | `ecosystem.team.intro.video`                     |

Finché un ritratto o il video non sono presenti, la pagina Chi siamo mostra al
loro posto il riquadro segnaposto con la descrizione della scena da scattare.

## Come aggiungere una foto

1. Metti il file in questa cartella (es. `team-01.jpg`).
2. Nel JSON del contenuto (`src/content/aboutPage/en.json` **e** `it.json`)
   valorizza i campi della persona:

   ```json
   {
     "name": "Nome Cognome",
     "role": "Coordinamento e primo contatto",
     "photo": "/media/team-01.jpg",
     "photoAlt": "Ritratto di Nome Cognome"
   }
   ```

`photoAlt` è obbligatorio quando c'è `photo`: descrive la scena a chi usa uno
screen reader. Non scrivere "foto di" — si sa già che è un'immagine.

⚠️ **`name` va compilato solo con il consenso scritto della persona.** Nome e
volto di un professionista sono dati personali, e questo sito sul GDPR ha già
preso posizione. Senza `name` la scheda parte dal ruolo, che è pubblicabile
subito e resta vero.

## Come aggiungere il video

```json
"intro": {
  "video": "/media/intro.mp4",
  "poster": "/media/intro-poster.jpg",
  "captions": "/media/intro.it.vtt"
}
```

- `poster` è il fotogramma mostrato prima del play. Senza, il riquadro resta nero.
- ⚠️ **`captions` non è opzionale se il video ha parlato.** Un video di
  presentazione senza sottotitoli esclude chi non sente e chi guarda senza
  audio — che sul telefono è la maggioranza. Il formato è WebVTT (`.vtt`).
- Il video non parte mai da solo: si avvia solo se lo decide chi guarda.
- Serve un file per lingua dei sottotitoli (`intro.it.vtt`, `intro.en.vtt`),
  ciascuno indicato nel rispettivo JSON.

## Licenze

⚠️ Usa solo immagini per cui hai una licenza commerciale (Unsplash+, Getty,
Adobe Stock, o scatti tuoi). Le immagini prese dai motori di ricerca non sono
libere: su un sito che vende servizi è un rischio legale concreto.

⚠️ **Per i ritratti del team non esiste alternativa agli scatti veri.** Niente
foto d'archivio di persone che non lavorano in Kimere: chi verifica le
riconosce, ed è esattamente il lettore che il sito deve convincere.

Tieni traccia qui sotto della provenienza di ogni file, serve in caso di
contestazione.

| File | Provenienza | Licenza | Data |
| :--- | :---------- | :------ | :--- |
|      |             |         |      |

## Formato consigliato

- Immagini: 1600 px sul lato lungo, qualità 80 — oltre non si vede la differenza
  e la pagina rallenta. `.jpg` per le fotografie, `.webp` se il tuo strumento lo
  esporta.
- Video: 1080p, `.mp4` (H.264), sotto i 20 MB. Più lungo di 60–90 secondi non
  lo guarda nessuno.
