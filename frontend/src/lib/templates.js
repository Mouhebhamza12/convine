export const VELVET_TEMPLATE = {
    slug: 'velvet',
    name: 'Velvet',
    tagline: 'Cinematic red drape reveal',
    demoPath: '/invite/demo',
    preview: 'velvet',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Red drape opening', 'Scratch date reveal', 'Guest letter', 'RSVP'],
};

export const BLOOM_TEMPLATE = {
    slug: 'bloom',
    name: 'Bloom',
    tagline: 'Blush botanical watercolor romance',
    demoPath: '/invite/demo-bloom',
    preview: 'bloom',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Petal bloom opening', 'Scratch date reveal', 'Deckled letter', 'RSVP'],
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

export const WEDDING_TEMPLATES = [VELVET_TEMPLATE, BLOOM_TEMPLATE, SAGE_TEMPLATE, AZURE_TEMPLATE];

export const TEMPLATE_BY_SLUG = Object.fromEntries(WEDDING_TEMPLATES.map((t) => [t.slug, t]));
