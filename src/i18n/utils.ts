import { defaultLocale, locales, type Locale } from './routes';
import { ui as en } from './ui/en';
import { ui as it } from './ui/it';

const dictionaries: Record<Locale, typeof en> = { en, it };

/** Restituisce il dizionario di micro-copy per il locale corrente, con fallback a EN. */
export function useTranslations(locale: string | undefined) {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safeLocale];
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Estrae il locale dal primo segmento del pathname corrente (Astro.currentLocale è l'alternativa nativa). */
export function getLocaleFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split('/');
  return isLocale(maybeLocale) ? maybeLocale : defaultLocale;
}
