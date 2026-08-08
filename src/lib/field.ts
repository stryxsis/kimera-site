/**
 * Convenzione degli id per collegare un controllo al suo suggerimento e al suo
 * errore. Sta qui e non sparsa nei template perché è l'unico punto in cui un
 * refuso rompe l'accessibilità in silenzio: `aria-describedby` che punta a un
 * id inesistente non produce nessun errore, semplicemente non annuncia nulla.
 *
 * Usato da Field.astro (che genera gli id) e dai controlli dentro lo slot
 * (che li dichiarano) — gli slot di Astro non passano proprietà.
 */
export function describedBy(
  id: string,
  parts: { hint?: boolean; error?: boolean } = {},
): string | undefined {
  const ids = [parts.hint && `${id}-hint`, parts.error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}
