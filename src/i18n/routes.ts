/**
 * Mappa centrale degli slug per lingua — fonte di verità unica per routing,
 * navigazione e language switcher. Aggiungere una lingua = aggiungere una colonna qui,
 * senza toccare i componenti. Vedi docs/tech-decisions.md §3 e docs/sitemap-ia.md §2.
 */

export const locales = ['en', 'it'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export type RouteKey =
  | 'home'
  | 'process'
  | 'services'
  | 'housing'
  | 'costs'
  | 'about'
  | 'faq'
  | 'partners'
  | 'book'
  | 'thankYou'
  | 'privacy'
  | 'cookies'
  | 'styleguide';

export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { en: '', it: '' },
  process: { en: 'process', it: 'percorso' },
  services: { en: 'services', it: 'servizi' },
  housing: { en: 'housing', it: 'alloggio' },
  costs: { en: 'costs', it: 'costi' },
  about: { en: 'about', it: 'chi-siamo' },
  faq: { en: 'faq', it: 'domande-frequenti' },
  partners: { en: 'partners', it: 'partner' },
  book: { en: 'book', it: 'prenota' },
  thankYou: { en: 'thank-you', it: 'grazie' },
  privacy: { en: 'privacy', it: 'privacy' },
  cookies: { en: 'cookies', it: 'cookie' },
  styleguide: { en: 'styleguide', it: 'styleguide' },
};

/** Costruisce il path assoluto (con slash iniziale e finale) per una route in una lingua. */
export function getPath(key: RouteKey, locale: Locale): string {
  const slug = routes[key][locale];
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}

/**
 * Data una route key e la lingua corrente, restituisce il path di ogni lingua —
 * usato dal LanguageSwitcher per portare alla pagina equivalente, mai alla home.
 */
export function getAlternatePaths(key: RouteKey): Record<Locale, string> {
  return Object.fromEntries(locales.map((locale) => [locale, getPath(key, locale)])) as Record<
    Locale,
    string
  >;
}

/** Determina la RouteKey a partire da un locale e uno slug (per hreflang/canonical). */
export function getRouteKeyFromSlug(locale: Locale, slug: string): RouteKey | undefined {
  const entry = Object.entries(routes).find(([, byLocale]) => byLocale[locale] === slug);
  return entry?.[0] as RouteKey | undefined;
}
