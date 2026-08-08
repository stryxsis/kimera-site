import { OTHER_COUNTRY_CODE } from '../data/countries';
import type { Locale } from '../i18n/routes';

/**
 * Ordina i nomi localizzati dei paesi (src/content/countries) alfabeticamente per la
 * lingua corrente, con "Altro / non in elenco" sempre in fondo — è un'uscita di
 * sicurezza per chi non si trova nell'elenco, non un paese, e mescolarlo in ordine
 * alfabetico lo renderebbe invisibile a metà lista.
 */
export function sortedCountryOptions(
  names: Record<string, string>,
  locale: Locale,
): Array<[code: string, name: string]> {
  const collator = new Intl.Collator(locale);
  const rest = Object.entries(names)
    .filter(([code]) => code !== OTHER_COUNTRY_CODE)
    .sort((a, b) => collator.compare(a[1], b[1]));

  const other = names[OTHER_COUNTRY_CODE];
  return other ? [...rest, [OTHER_COUNTRY_CODE, other]] : rest;
}
