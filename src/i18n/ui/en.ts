/**
 * Micro-copy di interfaccia (nav, bottoni, aria-label, messaggi di sistema).
 * Separato dai contenuti di pagina (content collections) per tech-decisions.md §3:
 * questo file lo tocca chi sviluppa, i contenuti li tocca il cliente.
 *
 * FASE 2: solo le stringhe strutturali necessarie per header/footer/skip-link.
 * Il resto (FAQ, form, thank-you…) arriva in FASE 3/6 con lo stesso pattern.
 */

// Tipi a `string` esplicito (non `as const`): en.ts e it.ts devono condividere la stessa
// forma con valori diversi — un letterale stretto qui impedirebbe a it.ts di tipizzare.
export interface UiDictionary {
  skipToContent: string;
  nav: {
    primaryLabel: string;
    home: string;
    process: string;
    services: string;
    housing: string;
    costs: string;
    about: string;
    faq: string;
    partners: string;
  };
  cta: {
    bookCall: string;
  };
  process: {
    whoDecides: string;
    timing: string;
    whatCanGoWrong: string;
    whatKimereDoes: string;
    officialSource: string;
  };
  faqGroups: {
    beforeDeparture: string;
    money: string;
    housing: string;
    afterArrival: string;
    workAndStay: string;
    aboutKimere: string;
  };
  languageSwitcher: {
    label: string;
  };
  footer: {
    navLabel: string;
    columnKimere: string;
    columnStudents: string;
    columnPartners: string;
    columnLegal: string;
    contact: string;
    privacy: string;
    cookies: string;
    disclaimer: string;
    payoff: string;
    rightsReserved: string;
  };
  notFound: {
    title: string;
    body: string;
    backHome: string;
  };
  scaffold: {
    placeholder: string;
  };
}

export const ui: UiDictionary = {
  skipToContent: 'Skip to content',
  nav: {
    primaryLabel: 'Main navigation',
    home: 'Home',
    process: 'How it works',
    services: 'Services',
    housing: 'Housing',
    costs: 'Costs',
    about: 'About',
    faq: 'FAQ',
    partners: 'For agencies & universities',
  },
  cta: {
    bookCall: 'Book your 15-minute call',
  },
  process: {
    whoDecides: 'Who decides',
    timing: 'Timing',
    whatCanGoWrong: 'What can go wrong',
    whatKimereDoes: 'What Kimere does',
    officialSource: 'Official source',
  },
  faqGroups: {
    beforeDeparture: 'Before you leave',
    money: 'Money',
    housing: 'Housing',
    afterArrival: 'After you land',
    workAndStay: 'Working and staying',
    aboutKimere: 'About Kimere',
  },
  languageSwitcher: {
    label: 'Language',
  },
  footer: {
    navLabel: 'Footer',
    columnKimere: 'Kimere',
    columnStudents: 'For students',
    columnPartners: 'For partners',
    columnLegal: 'Legal',
    contact: 'Contact',
    privacy: 'Privacy',
    cookies: 'Cookies',
    disclaimer: 'Information only — not legal advice. Always check official sources.',
    payoff: 'Your future, simplified',
    rightsReserved: 'All rights reserved.',
  },
  notFound: {
    title: 'Page not found',
    body: "The page you're looking for doesn't exist. Here's where you probably want to go.",
    backHome: 'Back to home',
  },
  scaffold: {
    // FASE 2 — sostituito da contenuto reale (content collections) in FASE 3.
    placeholder: 'Page content — added in Phase 3.',
  },
};
