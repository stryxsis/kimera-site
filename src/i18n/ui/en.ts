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
    menu: string;
    home: string;
    studyInItaly: string;
    services: string;
    about: string;
    faq: string;
    partners: string;
  };
  cta: {
    bookCall: string;
    freeNoObligation: string;
  };
  /** Microcopy condivisa dalla mappa del percorso (ILL-01) e dalle fonti citate in FAQ/home. */
  process: {
    officialSource: string;
    phaseBefore: string;
    phaseAfter: string;
  };
  packages: {
    included: string;
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
  legal: {
    lastUpdated: string;
  };
  /** Microcopy condivisa da entrambi i form (FASE 6) — non specifica di un campo. */
  form: {
    continue: string;
    back: string;
    sending: string;
    optional: string;
    stepOf: string; // template con {current} e {total}, sostituiti via JS
    errorRequired: string;
    errorEmail: string;
    errorChoice: string;
    errorBanner: string;
    submitError: string;
    honeypotLabel: string;
    privacyConsentPrefix: string;
    privacyConsentLink: string;
    marketingConsent: string;
  };
  /** Form di qualificazione studente — /book/, content-map.md "Struttura del form studente". */
  bookForm: {
    intro: string;
    steps: {
      who: {
        title: string;
        name: string;
        email: string;
        citizenship: string;
        citizenshipHint: string;
        citizenshipPlaceholder: string;
      };
      study: {
        title: string;
        level: string;
        levelOptions: {
          bachelor: string;
          master: string;
          phd: string;
          languageCourse: string;
          erasmus: string;
        };
        area: string;
        areaPlaceholder: string;
        universityCity: string;
        universityCityPlaceholder: string;
      };
      when: {
        title: string;
        startYear: string;
        stage: string;
        stageOptions: { exploring: string; applying: string; admitted: string };
      };
      situationNonEu: {
        title: string;
        visaAwareness: string;
        visaAwarenessHint: string;
        visaAwarenessOptions: { yes: string; no: string; wantToTalk: string };
        housingHelp: string;
        housingHelpOptions: { yes: string; no: string; notSure: string };
      };
      situationEu: {
        title: string;
        stayDuration: string;
        stayDurationOptions: { oneSemester: string; fullYear: string; notSure: string };
        housingWindow: string;
        housingWindowOptions: {
          alreadyLooking: string;
          coupleMonthsBefore: string;
          lessThanMonth: string;
          notSure: string;
        };
      };
      support: {
        title: string;
        level: string;
        levelOptions: { admission: string; arrival: string; settled: string; notSure: string };
        notes: string;
        notesPlaceholder: string;
      };
      consent: {
        title: string;
      };
    };
    submitLabel: string;
  };
  /** Form di partnership B2B — in coda a /partners/, content-map.md "Struttura del form B2B". */
  partnerForm: {
    intro: string;
    contactName: string;
    role: string;
    agency: string;
    country: string;
    website: string;
    websitePlaceholder: string;
    workEmail: string;
    volumeBracket: string;
    volumeBracketOptions: {
      under10: string;
      from10to50: string;
      from50to200: string;
      over200: string;
    };
    destinationsServed: string;
    destinationsServedPlaceholder: string;
    interest: string;
    interestOptions: {
      freeSeminar: string;
      studentsToItaly: string;
      structuredPartnership: string;
      other: string;
    };
    notes: string;
    notesPlaceholder: string;
  };
  scaffold: {
    placeholder: string;
  };
}

export const ui: UiDictionary = {
  skipToContent: 'Skip to content',
  nav: {
    primaryLabel: 'Main navigation',
    menu: 'Menu',
    home: 'Home',
    studyInItaly: 'Study in Italy',
    services: 'Services',
    about: 'About',
    faq: 'FAQ',
    partners: 'For agencies & universities',
  },
  cta: {
    bookCall: 'Book your 15-minute call',
    freeNoObligation: '15 minutes · no cost · no obligation',
  },
  process: {
    officialSource: 'Official source',
    phaseBefore: 'Before you leave',
    phaseAfter: 'After you land',
  },
  packages: {
    included: 'Included',
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
  legal: {
    lastUpdated: 'Last updated',
  },
  form: {
    continue: 'Continue',
    back: 'Back',
    sending: 'Sending…',
    optional: '(optional)',
    stepOf: 'Step {current} of {total}',
    errorRequired: 'This is required — add a few words so we can help you properly.',
    errorEmail: 'Add a valid email so we can write back to you.',
    errorChoice: 'Choose one so we know how to help.',
    errorBanner: 'A few fields need your attention before you can continue.',
    submitError: 'Something went wrong sending your details. Check your connection and try again.',
    honeypotLabel: 'Leave this field empty',
    privacyConsentPrefix: 'I agree to the',
    privacyConsentLink: 'privacy policy',
    marketingConsent:
      "I'd also like occasional emails about Kimere's services. Optional — this won't affect your call.",
  },
  bookForm: {
    intro:
      'Tell us where you are in the process, and we’ll tell you exactly what happens next. About three minutes.',
    steps: {
      who: {
        title: 'Who you are',
        name: 'Your name',
        email: 'Email',
        citizenship: 'Citizenship',
        citizenshipHint: 'This decides everything that follows — visa, deadlines, paperwork.',
        citizenshipPlaceholder: 'Select your citizenship…',
      },
      study: {
        title: 'What you want to study',
        level: 'Level',
        levelOptions: {
          bachelor: "Bachelor's degree",
          master: "Master's degree",
          phd: 'PhD',
          languageCourse: 'Language course',
          erasmus: 'Erasmus exchange',
        },
        area: 'Field of study',
        areaPlaceholder: 'e.g. Computer science, Architecture…',
        universityCity: 'University or city of interest',
        universityCityPlaceholder: 'Optional — even a city is useful',
      },
      when: {
        title: 'When',
        startYear: 'Academic year you want to start',
        stage: 'Where you are right now',
        stageOptions: {
          exploring: 'Still exploring options',
          applying: 'Applying now',
          admitted: 'Already admitted',
        },
      },
      situationNonEu: {
        title: 'Your situation',
        visaAwareness: 'Your consulate will ask for proof of about €7,000 for the year',
        visaAwarenessHint:
          "This is a heads-up, not a judgement — we're figuring out where you stand.",
        visaAwarenessOptions: {
          yes: "Yes, I'm aware of it",
          no: 'No, this is new to me',
          wantToTalk: "I'd like to talk it through",
        },
        housingHelp: 'Do you want help with housing?',
        housingHelpOptions: { yes: 'Yes', no: 'No', notSure: 'Not sure yet' },
      },
      situationEu: {
        title: 'Your Erasmus stay',
        stayDuration: 'How long will you stay?',
        stayDurationOptions: {
          oneSemester: 'One semester',
          fullYear: 'Full academic year',
          notSure: 'Not sure yet',
        },
        housingWindow: 'When are you looking to arrange housing?',
        housingWindowOptions: {
          alreadyLooking: "I'm already looking",
          coupleMonthsBefore: 'A couple of months before I arrive',
          lessThanMonth: 'Less than a month before',
          notSure: 'Not sure yet',
        },
      },
      support: {
        title: 'Level of support',
        level: 'Which level interests you?',
        levelOptions: {
          admission: 'Admission',
          arrival: 'Arrival',
          settled: 'Settled',
          notSure: "Not sure yet — let's talk about it",
        },
        notes: 'Anything else that would help us prepare',
        notesPlaceholder: 'Optional',
      },
      consent: {
        title: 'Before you send this',
      },
    },
    submitLabel: 'Send my details',
  },
  partnerForm: {
    intro:
      'A first conversation about your volumes and destinations — no commitment, just a look at whether the model fits.',
    contactName: 'Your name',
    role: 'Your role',
    agency: 'Agency name',
    country: 'Country',
    website: 'Company website',
    websitePlaceholder: 'https://',
    workEmail: 'Work email',
    volumeBracket: 'Students sent abroad each year',
    volumeBracketOptions: {
      under10: 'Under 10',
      from10to50: '10–50',
      from50to200: '50–200',
      over200: '200+',
    },
    destinationsServed: 'Destinations you currently serve',
    destinationsServedPlaceholder: 'Optional — e.g. UK, Germany, Poland…',
    interest: 'What are you looking for?',
    interestOptions: {
      // Primo nell'elenco perché è il lead magnet B2B della home: chi arriva dal
      // box «lavoro per un'università» trova la propria opzione già in cima.
      freeSeminar: 'The free online seminar',
      studentsToItaly: 'Sending students to Italy',
      structuredPartnership: 'A structured partnership',
      other: 'Something else',
    },
    notes: 'Anything else worth knowing',
    notesPlaceholder: 'Optional',
  },
  scaffold: {
    // FASE 2 — sostituito da contenuto reale (content collections) in FASE 3.
    placeholder: 'Page content — added in Phase 3.',
  },
};
