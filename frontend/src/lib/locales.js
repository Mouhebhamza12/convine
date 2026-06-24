/* Locale system-shared across every template.
 *
 * Language is a property of the *invitation*, chosen once by the couple at
 * creation time and baked into the link. A guest never sees a switcher: they
 * open their URL and the invitation is simply theirs-right language, right
 * reading direction, right date/number forms. Templates stay single designs;
 * only their copy dictionary gains a locale axis.
 *
 * Date / time / number formatting is delegated to the platform's Intl engine,
 * so French gets 24-hour time and "20 août 2026", Arabic gets Arabic month
 * names and Eastern Arabic-Indic numerals, all for free-no per-language tables.
 */

export const LOCALES = {
    en: { code: 'en', label: 'English', endonym: 'English', short: 'EN', dir: 'ltr', intl: 'en-US' },
    fr: { code: 'fr', label: 'French', endonym: 'Français', short: 'FR', dir: 'ltr', intl: 'fr-FR' },
    // Algerian/Maghrebi conventions: Western digits (1, 2, 3) and French-derived
    // month names (أوت, جانفي...), not the Mashriqi forms (أغسطس, يناير) or
    // Eastern Arabic-Indic numerals. `ar-DZ` gives both out of the box.
    ar: { code: 'ar', label: 'Arabic', endonym: 'العربية', short: 'ع', dir: 'rtl', intl: 'ar-DZ' },
};

export const LOCALE_CODES = Object.keys(LOCALES);

export function dirFor(code) {
    return LOCALES[code]?.dir ?? 'ltr';
}

export function intlFor(code) {
    return LOCALES[code]?.intl ?? 'en-US';
}

/**
 * Pick the locale to render. Honours the requested value only when the template
 * actually supports it; otherwise falls back to the template's default (or the
 * first supported locale, or English). This is what keeps "Ivoire in French"
 * from ever happening-a template only renders languages it can carry.
 */
export function resolveLocale(value, supported, fallback) {
    if (value && LOCALES[value] && (!supported || supported.includes(value))) {
        return value;
    }
    if (fallback && LOCALES[fallback]) return fallback;
    if (supported && supported.length) return supported[0];
    return 'en';
}

function parseDate(date) {
    if (!date) return null;
    const d = new Date(`${date}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * { weekday, day, month, monthShort, year } localised for `code`. `day`/`year`
 * come back as locale-shaped strings (Algerian Arabic uses Western digits, e.g.
 * 20 / 2026), so editorial templates can render the big numerals natively. Latin
 * callers that want an integer can still `parseInt(day, 10)`.
 */
export function formatDateParts(date, code) {
    const d = parseDate(date);
    if (!d) return { weekday: '', day: '', month: '', monthShort: '', year: '' };
    const intl = intlFor(code);
    const part = (opts) => new Intl.DateTimeFormat(intl, opts).format(d);
    return {
        weekday: part({ weekday: 'long' }),
        day: part({ day: '2-digit' }),
        month: part({ month: 'long' }),
        monthShort: part({ month: 'short' }),
        year: part({ year: 'numeric' }),
    };
}

/** Full localised date, e.g. "Thursday, August 20, 2026" / "jeudi 20 août 2026". */
export function formatLongDate(date, code) {
    const d = parseDate(date);
    if (!d) return '';
    return new Intl.DateTimeFormat(intlFor(code), {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(d);
}

/**
 * Localised time of day from a "HH:MM" string. The 12-/24-hour convention is
 * left to the locale (en → "7:00 PM", fr → "19:00", ar → "7:00 م").
 */
export function formatTime(time, code) {
    if (!time || !/^\d{1,2}:\d{2}/.test(time)) return time || '';
    const [h, m] = time.split(':').map(Number);
    const d = new Date(2000, 0, 1, h, m || 0);
    return new Intl.DateTimeFormat(intlFor(code), { hour: 'numeric', minute: '2-digit' }).format(d);
}

/**
 * The languages a wedding actually offers its guests. Falls back to the single
 * primary locale, then to the template's supported set, so an older record with
 * no `locales` still resolves sensibly.
 */
export function offeredLocales(wedding, templateSupported) {
    const list = Array.isArray(wedding?.locales) ? wedding.locales.filter((c) => LOCALES[c]) : [];
    if (list.length) return list;
    if (wedding?.locale && LOCALES[wedding.locale]) return [wedding.locale];
    return templateSupported && templateSupported.length ? templateSupported : ['en'];
}

/** Pick a per-locale value from a `{ en, fr, ar }` map, with a flat fallback. */
export function pickLocalized(map, locale, fallback = '') {
    if (map && typeof map === 'object' && typeof map[locale] === 'string' && map[locale].trim()) {
        return map[locale];
    }
    return fallback;
}

/** Locale-shaped integer (Arabic-Indic numerals for `ar`), with optional padding. */
export function formatNumber(value, code, { minDigits = 0 } = {}) {
    return new Intl.NumberFormat(intlFor(code), {
        minimumIntegerDigits: Math.max(1, minDigits),
        useGrouping: false,
    }).format(Number(value) || 0);
}
