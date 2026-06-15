import { DEMO_INVITATION } from './invitationDemo';

const DEMO_TOKENS = {
    demo: 'velvet',
    'demo-sage': 'sage',
    'demo-azure': 'azure',
    'demo-lilyrose': 'lilyrose',
    'demo-andalus': 'andalus-fr',
    'demo-andalus-fr': 'andalus-fr',
    'demo-andalus-ar': 'andalus-ar',
    'demo-dar': 'andalus-fr',
    'demo-dar-ar': 'andalus-ar',
    'demo-roseraie': 'roseraie',
};

export function resolveInvitationToken(token) {
    if (token in DEMO_TOKENS) {
        return {
            isDemo: true,
            templateSlug: DEMO_TOKENS[token],
            data: DEMO_INVITATION,
            apiToken: null,
        };
    }

    return {
        isDemo: false,
        templateSlug: null,
        data: null,
        apiToken: token,
    };
}

const LEGACY_TEMPLATE_MAP = {
    classic: 'velvet',
    minimal: 'sage',
};

export function resolveTemplateSlug(templateSlugFromApi, demoSlug) {
    const slug = templateSlugFromApi || demoSlug || 'velvet';
    return LEGACY_TEMPLATE_MAP[slug] ?? slug;
}
