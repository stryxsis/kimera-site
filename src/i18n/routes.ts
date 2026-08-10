/**
 * Mappa centrale degli slug per lingua — fonte di verità unica per routing,
 * navigazione e language switcher. Aggiungere una lingua = aggiungere una colonna qui,
 * senza toccare i componenti. Vedi docs/tech-decisions.md §3 e docs/sitemap-ia.md §2.
 */

export const locales = ['en', 'it'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Ogni CTA di prenotazione del sito porta qui, non a `/book/`. Il modulo di
 * qualificazione interno (`book.astro`/`prenota.astro`, con il suo consenso
 * GDPR e il multi-step) resta pubblicato — un lettore attento potrebbe ancora
 * trovarlo tramite `getPath('book', locale)` — ma nessuna CTA vi rimanda più.
 * Un solo modulo per entrambe le lingue: nessuna variante `it`.
 */
export const BOOKING_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe45j2D2R2OELX78j4BpGyphF28yqAkh-1DP4gbVgUoqjd9jA/viewform';

export type RouteKey =
  | 'home'
  | 'studyInItaly'
  | 'services'
  | 'about'
  | 'faq'
  | 'partners'
  | 'forStudents'
  // ⚠️ Nessun file pagina esiste ancora per questa chiave (2026-08-11): la nav
  // la richiede già, ma la pagina arriva in un passo successivo. `getPath()` non
  // verifica che la destinazione esista — il link funziona, punta dove deve, e
  // resta un 404 finché non si crea il file sotto `src/pages/{en,it}/`. Nessuno
  // script di verifica del progetto enumera RouteKey per controllare che ogni
  // chiave abbia una pagina, quindi il build resta verde in questo stato
  // intermedio. (`forStudents` era nella stessa condizione: la sua pagina esiste
  // dal 2026-08-11.)
  | 'languageCourses'
  | 'book'
  | 'thankYou'
  | 'privacy'
  | 'cookies'
  | 'styleguide';

export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { en: '', it: '' },
  // Lo slug italiano non traduce quello inglese: «study-in-italy» è la query che
  // uno studente straniero digita su Google, «perche-italia» è la domanda che si
  // fa chi legge in italiano. Sono due intenti di ricerca diversi, non due lingue
  // della stessa frase — ed è tutto il senso di avere una mappa di slug per lingua.
  studyInItaly: { en: 'study-in-italy', it: 'perche-italia' },
  services: { en: 'services', it: 'servizi' },
  about: { en: 'about', it: 'chi-siamo' },
  faq: { en: 'faq', it: 'domande-frequenti' },
  partners: { en: 'partners', it: 'partner' },
  forStudents: { en: 'for-students', it: 'per-gli-studenti' },
  languageCourses: { en: 'language-courses-and-translation', it: 'corsi-di-lingua-e-traduzioni' },
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
