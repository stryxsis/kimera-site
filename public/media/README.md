# Immagini e video del sito

I file vanno qui. Finché un file manca, il sito mostra al suo posto un
segnaposto dichiarato che descrive cosa dovrà rappresentare: il layout è già
quello definitivo e non cambia di una riga quando il file arriva.

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
