/**
 * Elenco dei codici paese usati nel form di qualificazione (content-map.md, campo
 * "Cittadinanza"). Solo codice ed esito UE/extra-UE qui: **non è testo tradotto**,
 * quindi non è una content collection — i nomi localizzati vivono in
 * `src/content/countries/{en,it}.json`, con parità di chiavi verificata da
 * `lint:content` come ogni altra collection "di pagina".
 *
 * La biforcazione UE/extra-UE nel form (content-map.md, Step 4) dipende da questo
 * campo `eu`: determina se lo studente vede le domande sul requisito economico
 * consolare e sul visto, o quelle sulla finestra Erasmus.
 *
 * L'elenco non è l'intero ISO 3166-1: copre i 27 Stati membri UE (necessari per la
 * biforcazione) e le nazionalità più comuni per uno studente diretto in Italia
 * (personas.md: Aarav — India, Egitto, MENA, LatAm, Cina — e Sofia, UE). "OTHER" è un
 * codice di comodo, non ISO, per chi non si trova nell'elenco: non esclude nessuno
 * dal form. Estendere l'elenco è un'aggiunta di riga qui + una riga in ciascuno dei
 * due JSON di nomi, senza toccare la logica del form.
 */
export interface CountryCode {
  code: string;
  eu: boolean;
}

export const OTHER_COUNTRY_CODE = 'OTHER';

export const COUNTRIES: CountryCode[] = [
  // ── Stati membri UE (27) — determinano il ramo "Erasmus / UE" del form ──────
  { code: 'AT', eu: true },
  { code: 'BE', eu: true },
  { code: 'BG', eu: true },
  { code: 'HR', eu: true },
  { code: 'CY', eu: true },
  { code: 'CZ', eu: true },
  { code: 'DK', eu: true },
  { code: 'EE', eu: true },
  { code: 'FI', eu: true },
  { code: 'FR', eu: true },
  { code: 'DE', eu: true },
  { code: 'GR', eu: true },
  { code: 'HU', eu: true },
  { code: 'IE', eu: true },
  { code: 'IT', eu: true },
  { code: 'LV', eu: true },
  { code: 'LT', eu: true },
  { code: 'LU', eu: true },
  { code: 'MT', eu: true },
  { code: 'NL', eu: true },
  { code: 'PL', eu: true },
  { code: 'PT', eu: true },
  { code: 'RO', eu: true },
  { code: 'SK', eu: true },
  { code: 'SI', eu: true },
  { code: 'ES', eu: true },
  { code: 'SE', eu: true },

  // ── Extra-UE — nazionalità più comuni per uno studente diretto in Italia ────
  { code: 'IN', eu: false }, // India
  { code: 'PK', eu: false }, // Pakistan
  { code: 'BD', eu: false }, // Bangladesh
  { code: 'LK', eu: false }, // Sri Lanka
  { code: 'NP', eu: false }, // Nepal
  { code: 'CN', eu: false }, // Cina
  { code: 'VN', eu: false }, // Vietnam
  { code: 'ID', eu: false }, // Indonesia
  { code: 'PH', eu: false }, // Filippine
  { code: 'IR', eu: false }, // Iran
  { code: 'TR', eu: false }, // Turchia
  { code: 'EG', eu: false }, // Egitto
  { code: 'MA', eu: false }, // Marocco
  { code: 'TN', eu: false }, // Tunisia
  { code: 'DZ', eu: false }, // Algeria
  { code: 'NG', eu: false }, // Nigeria
  { code: 'GH', eu: false }, // Ghana
  { code: 'KE', eu: false }, // Kenya
  { code: 'ET', eu: false }, // Etiopia
  { code: 'ZA', eu: false }, // Sudafrica
  { code: 'CM', eu: false }, // Camerun
  { code: 'SN', eu: false }, // Senegal
  { code: 'CI', eu: false }, // Costa d'Avorio
  { code: 'CD', eu: false }, // Rep. Dem. del Congo
  { code: 'TZ', eu: false }, // Tanzania
  { code: 'UG', eu: false }, // Uganda
  { code: 'ZW', eu: false }, // Zimbabwe
  { code: 'BR', eu: false }, // Brasile
  { code: 'MX', eu: false }, // Messico
  { code: 'CO', eu: false }, // Colombia
  { code: 'AR', eu: false }, // Argentina
  { code: 'PE', eu: false }, // Perù
  { code: 'CL', eu: false }, // Cile
  { code: 'EC', eu: false }, // Ecuador
  { code: 'VE', eu: false }, // Venezuela
  { code: 'CU', eu: false }, // Cuba
  { code: 'DO', eu: false }, // Rep. Dominicana
  { code: 'US', eu: false }, // Stati Uniti
  { code: 'CA', eu: false }, // Canada
  { code: 'GB', eu: false }, // Regno Unito
  { code: 'CH', eu: false }, // Svizzera
  { code: 'NO', eu: false }, // Norvegia
  { code: 'IS', eu: false }, // Islanda
  { code: 'RU', eu: false }, // Russia
  { code: 'UA', eu: false }, // Ucraina
  { code: 'BY', eu: false }, // Bielorussia
  { code: 'RS', eu: false }, // Serbia
  { code: 'AL', eu: false }, // Albania
  { code: 'MK', eu: false }, // Macedonia del Nord
  { code: 'BA', eu: false }, // Bosnia ed Erzegovina
  { code: 'ME', eu: false }, // Montenegro
  { code: 'XK', eu: false }, // Kosovo
  { code: 'MD', eu: false }, // Moldavia
  { code: 'GE', eu: false }, // Georgia
  { code: 'AM', eu: false }, // Armenia
  { code: 'AZ', eu: false }, // Azerbaigian
  { code: 'KZ', eu: false }, // Kazakistan
  { code: 'UZ', eu: false }, // Uzbekistan
  { code: 'SA', eu: false }, // Arabia Saudita
  { code: 'AE', eu: false }, // Emirati Arabi Uniti
  { code: 'JO', eu: false }, // Giordania
  { code: 'LB', eu: false }, // Libano
  { code: 'IQ', eu: false }, // Iraq
  { code: 'IL', eu: false }, // Israele
  { code: 'SY', eu: false }, // Siria
  { code: 'YE', eu: false }, // Yemen
  { code: 'KR', eu: false }, // Corea del Sud
  { code: 'JP', eu: false }, // Giappone
  { code: 'TH', eu: false }, // Thailandia
  { code: 'MY', eu: false }, // Malesia
  { code: 'AU', eu: false }, // Australia
  { code: 'NZ', eu: false }, // Nuova Zelanda

  // ── Non elencato ─────────────────────────────────────────────────────────
  { code: OTHER_COUNTRY_CODE, eu: false },
];

export const isEuCountry = (code: string): boolean =>
  COUNTRIES.find((c) => c.code === code)?.eu ?? false;
