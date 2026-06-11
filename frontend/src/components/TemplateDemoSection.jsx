import { Link } from 'react-router-dom';
import { Heart, Pen, Mail, ArrowRight, Sparkles, Flower2, FileText, ShieldCheck } from 'lucide-react';
import { WEDDING_TEMPLATES } from '../lib/templates';
import redBg from '../../assets/red.png';
import pinkBg from '../../assets/pink.png';

const BG_MAP = {
    velvet: redBg,
    bloom: pinkBg,
};

const ACCENT_MAP = {
    velvet: { primary: '#6b0f1a', hover: '#8b1a2b', text: '#fff' },
    bloom: { primary: '#c47b84', hover: '#d4929a', text: '#fff' },
    sage: { primary: '#6f7d50', hover: '#8c9a6c', text: '#fff' },
    azure: { primary: '#2e5e9e', hover: '#244c82', text: '#fff' },
};

const DESC_MAP = {
    velvet: 'A dramatic opening with rich textures and timeless elegance. Perfect for the classic romantic.',
    bloom: 'Soft florals and watercolor details for a fresh, romantic feel. Perfect for the modern couple.',
    sage: 'Botanical line art on sage and ivory for understated, garden elegance. Perfect for the refined couple.',
    azure: 'Bold blue type and a hand-drawn couple on warm cream. Perfect for the playful, characterful couple.',
};

// Custom elegant drape/curtain icon SVG
const DrapeIcon = ({ size = 14, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 3h18M3 3v18h3c1-6 3-8 6-8s5 2 6 8h3V3M12 3v10" />
    </svg>
);

const getFeatureIcon = (featureName) => {
    const name = featureName.toLowerCase();
    if (name.includes('drape') || name.includes('curtain')) return DrapeIcon;
    if (name.includes('bloom') || name.includes('petal') || name.includes('flower')) return Flower2;
    if (name.includes('gold line') || name.includes('foil') || name.includes('sparkle')) return Sparkles;
    if (name.includes('date')) return Pen;
    if (name.includes('letter')) {
        if (name.includes('guest')) return Heart;
        return FileText;
    }
    if (name.includes('rsvp') || name.includes('mail')) return Mail;
    return Heart;
};

function TemplatePreview({ template }) {
    if (template.preview === 'bloom') {
        return (
            <div className="td2-phone-screen td2-phone-screen--bloom">
                <div className="template-preview-bloom__blob template-preview-bloom__blob--1" />
                <div className="template-preview-bloom__blob template-preview-bloom__blob--2" />
                <div className="template-preview-bloom__seal">A&amp;Y</div>
                <div className="template-preview-bloom__names">
                    <span>{template.couple.bride}</span>
                    <em>&amp;</em>
                    <span>{template.couple.groom}</span>
                </div>
            </div>
        );
    }

    if (template.preview === 'sage') {
        return (
            <div
                className="td2-phone-screen"
                style={{ background: '#8c9a6c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', textAlign: 'center', padding: '1rem' }}
            >
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#fbf9f3', margin: 0 }}>
                    The Wedding Of
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.82 }}>
                    <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600, fontSize: '2rem', color: '#fbf9f3' }}>{template.couple.bride}</span>
                    <em style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.95rem', color: '#e8e3d2' }}>&amp;</em>
                    <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600, fontSize: '2rem', color: '#fbf9f3' }}>{template.couple.groom}</span>
                </div>
            </div>
        );
    }

    if (template.preview === 'azure') {
        return (
            <div
                className="td2-phone-screen"
                style={{ background: '#f6f1e3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', textAlign: 'center', padding: '1rem' }}
            >
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.55rem', color: '#2e5e9e', margin: 0 }}>
                    you&apos;re invited
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.7rem', color: '#2e5e9e' }}>{template.couple.bride}</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.7rem', color: '#2e5e9e' }}>&amp; {template.couple.groom}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="td2-phone-screen">
            <div className="template-demo-drape">
                <div className="template-demo-drape-panel template-demo-drape-panel--left" />
                <div className="template-demo-drape-panel template-demo-drape-panel--right" />
                <span className="template-demo-drape-label">Touch to Open</span>
            </div>
            <div className="template-demo-names">
                <span>{template.couple.bride}</span>
                <em>&amp;</em>
                <span>{template.couple.groom}</span>
            </div>
        </div>
    );
}

export default function TemplateDemoSection() {
    return (
        <section id="demo" className="td2-section">
            <div className="td2-header">
                <div className="td2-divider-header">
                    <div className="td2-line-left" />
                    <Heart size={18} strokeWidth={1.5} className="td2-heart-gold" />
                    <div className="td2-line-right" />
                </div>
                <span className="td2-eyebrow">CHOOSE YOUR EXPERIENCE</span>
                <h2 className="td2-title">Four Distinct Experiences</h2>
                <p className="td2-subtitle">
                    Each demo showcases a unique style of luxury wedding stationery.
                </p>
            </div>

            <div className="td2-grid">
                {WEDDING_TEMPLATES.map((template) => {
                    const bg = BG_MAP[template.preview];
                    const accent = ACCENT_MAP[template.preview];

                    return (
                        <article key={template.slug} className={`td2-card td2-card--${template.preview}`}>
                            <div
                                className="td2-card-visual"
                                style={!bg ? { background: 'linear-gradient(160deg, #9aa87a, #76845a)' } : undefined}
                            >
                                {bg && (
                                    <img
                                        className="td2-card-bg"
                                        src={bg}
                                        alt=""
                                        aria-hidden="true"
                                        loading="lazy"
                                    />
                                )}
                                <Link to={template.demoPath} className="td2-phone-link" aria-label={`Open ${template.name} guest demo`}>
                                    <div className="td2-phone">
                                        <div className="td2-phone-notch" />
                                        <TemplatePreview template={template} />
                                    </div>
                                </Link>
                            </div>

                            <div className="td2-card-body">
                                <h3 className="td2-card-name">{template.name}</h3>
                                <p className="td2-card-tagline">{template.tagline}</p>
                                <p className="td2-card-desc">{DESC_MAP[template.preview]}</p>

                                <ul className="td2-features">
                                    {template.features.map((feature) => {
                                        const Icon = getFeatureIcon(feature);
                                        return (
                                            <li key={feature} className="td2-feature">
                                                <Icon size={14} strokeWidth={1.5} />
                                                <span>{feature}</span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <Link
                                    to={template.demoPath}
                                    className="td2-cta"
                                    style={{
                                        '--cta-bg': accent.primary,
                                        '--cta-bg-hover': accent.hover,
                                        '--cta-text': accent.text,
                                    }}
                                >
                                    OPEN AS GUEST
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>

            <p className="td2-footnote">
                <ShieldCheck size={16} className="td2-footnote-icon" />
                <span>Each demo opens as <strong>Mohamed</strong>, no account required.</span>
            </p>
        </section>
    );
}
