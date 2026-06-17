export const VELVET_TEMPLATE = {
    slug: 'velvet',
    name: 'Velvet',
    tagline: 'Cinematic red drape reveal',
    demoPath: '/invite/demo',
    preview: 'velvet',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Red drape opening', 'Scratch date reveal', 'Guest letter', 'RSVP'],
};

export const SAGE_TEMPLATE = {
    slug: 'sage',
    name: 'Sage',
    tagline: 'Botanical sage & ivory elegance',
    demoPath: '/invite/demo-sage',
    preview: 'sage',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Sage green cover', 'Botanical line art', 'Guest letter', 'RSVP'],
};

export const AZURE_TEMPLATE = {
    slug: 'azure',
    name: 'Azure',
    tagline: 'Blue & cream illustrated charm',
    demoPath: '/invite/demo-azure',
    preview: 'azure',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Illustrated couple', 'Hand-drawn accents', 'Guest letter', 'RSVP'],
};


export const ROSERAIE_TEMPLATE = {
    slug: 'roseraie',
    name: 'Roseraie',
    tagline: 'Blush, burgundy & ivory-a sealed botanical keepsake',
    demoPath: '/invite/demo-roseraie',
    preview: 'roseraie',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Wax-seal reveal', 'Watercolour roses', 'Baroque damask', 'Editorial RSVP'],
};

export const IVOIRE_TEMPLATE = {
    slug: 'ivoire',
    name: 'Ivoire',
    tagline: 'Embossed ivory florals & a gilded blush cameo',
    demoPath: '/invite/demo-ivoire',
    preview: 'ivoire',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Plaster-relief florals', 'Porcelain cameo seal', 'Foiled monogram', 'Latin & Arabic'],
};

export const WEDDING_TEMPLATES = [IVOIRE_TEMPLATE, ROSERAIE_TEMPLATE, VELVET_TEMPLATE, SAGE_TEMPLATE, AZURE_TEMPLATE];

export const TEMPLATE_BY_SLUG = Object.fromEntries(WEDDING_TEMPLATES.map((t) => [t.slug, t]));
