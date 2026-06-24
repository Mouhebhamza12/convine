/* `supportedLocales` is the set of languages a template can render *well*-its
 * copy dictionary is translated and its typography/layout carry that script.
 * `defaultLocale` is what the gallery demo shows and what a new invitation gets
 * before the couple chooses. A template only ever offers languages it can carry,
 * so e.g. Ivoire (whose identity *is* its Arabic calligraphy) stays Arabic-only
 * rather than being forced into a broken French layout. */

export const VELVET_TEMPLATE = {
    slug: 'velvet',
    name: 'Velvet',
    tagline: 'Cinematic red drape reveal',
    demoPath: '/invite/demo',
    preview: 'velvet',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Red drape opening', 'Scratch date reveal', 'Guest letter', 'RSVP'],
    supportedLocales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
};

export const SAGE_TEMPLATE = {
    slug: 'sage',
    name: 'Sage',
    tagline: 'Botanical sage & ivory elegance',
    demoPath: '/invite/demo-sage',
    preview: 'sage',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Sage green cover', 'Botanical line art', 'Guest letter', 'RSVP'],
    supportedLocales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
};

export const AZURE_TEMPLATE = {
    slug: 'azure',
    name: 'Azure',
    tagline: 'Blue & cream illustrated charm',
    demoPath: '/invite/demo-azure',
    preview: 'azure',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Illustrated couple', 'Hand-drawn accents', 'Guest letter', 'RSVP'],
    supportedLocales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
};


export const ROSERAIE_TEMPLATE = {
    slug: 'roseraie',
    name: 'Roseraie',
    tagline: 'Blush, burgundy & ivory-a sealed botanical keepsake',
    demoPath: '/invite/demo-roseraie',
    preview: 'roseraie',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Wax-seal reveal', 'Watercolour roses', 'Baroque damask', 'Editorial RSVP'],
    supportedLocales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
};

export const IVOIRE_TEMPLATE = {
    slug: 'ivoire',
    name: 'Ivoire',
    tagline: 'Embossed ivory florals & a gilded blush cameo',
    demoPath: '/invite/demo-ivoire',
    preview: 'ivoire',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Plaster-relief florals', 'Porcelain cameo seal', 'Foiled monogram', 'Latin & Arabic'],
    supportedLocales: ['ar'],
    defaultLocale: 'ar',
};

export const WEDDING_TEMPLATES = [IVOIRE_TEMPLATE, ROSERAIE_TEMPLATE, VELVET_TEMPLATE, SAGE_TEMPLATE, AZURE_TEMPLATE];

export const TEMPLATE_BY_SLUG = Object.fromEntries(WEDDING_TEMPLATES.map((t) => [t.slug, t]));

/** Languages a template can render well; defaults to English-only if unknown. */
export function supportedLocalesFor(slug) {
    return TEMPLATE_BY_SLUG[slug]?.supportedLocales ?? ['en'];
}

/** The locale a template falls back to (gallery demo + freshly-created invites). */
export function defaultLocaleFor(slug) {
    const t = TEMPLATE_BY_SLUG[slug];
    return t?.defaultLocale ?? t?.supportedLocales?.[0] ?? 'en';
}
