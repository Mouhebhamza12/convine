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

export const LILYROSE_TEMPLATE = {
    slug: 'lilyrose',
    name: 'Lily & Rose',
    tagline: 'A luxury love story told through flowers',
    demoPath: '/invite/demo-lilyrose',
    preview: 'lilyrose',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Morning-garden bloom opening', 'Hand-painted lilies & roses', 'Names emerge from the bouquet', 'RSVP'],
};

export const DAR_FR_TEMPLATE = {
    slug: 'andalus-fr',
    name: 'Andalus',
    tagline: 'Velours, or et fleurs — une invitation Nikkah royale',
    demoPath: '/invite/demo-andalus',
    preview: 'andalus-fr',
    couple: { bride: 'Maryam', groom: 'Mustafa' },
    features: ['Rideau de velours royal', 'Cadre gravé doré', 'Bismillah & Nikkah', 'RSVP élégant'],
};

export const DAR_AR_TEMPLATE = {
    slug: 'andalus-ar',
    name: 'الأندلس',
    tagline: 'مخمل وذهب وزهور — دعوة عقد قران أصيلة',
    demoPath: '/invite/demo-andalus-ar',
    preview: 'andalus-ar',
    couple: { bride: 'مريم', groom: 'مصطفى' },
    features: ['ستار مخملي ملكي', 'إطار ذهبي محفور', 'بسم الله وعقد القران', 'تأكيد الحضور'],
};

export const ROSERAIE_TEMPLATE = {
    slug: 'roseraie',
    name: 'Roseraie',
    tagline: 'Sage, ivory & gold — a sealed couture keepsake',
    demoPath: '/invite/demo-roseraie',
    preview: 'roseraie',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Wax-seal reveal', 'Garden-rose editorial', 'Baroque damask frames', 'Sealed RSVP'],
};

export const WEDDING_TEMPLATES = [ROSERAIE_TEMPLATE, DAR_FR_TEMPLATE, DAR_AR_TEMPLATE, LILYROSE_TEMPLATE, VELVET_TEMPLATE, SAGE_TEMPLATE, AZURE_TEMPLATE];

export const TEMPLATE_BY_SLUG = Object.fromEntries(WEDDING_TEMPLATES.map((t) => [t.slug, t]));
