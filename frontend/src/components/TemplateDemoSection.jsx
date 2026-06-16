import { Link } from 'react-router-dom';
import { Heart, Pen, Mail, ArrowRight, Sparkles, Flower2, FileText, ShieldCheck } from 'lucide-react';
import { WEDDING_TEMPLATES } from '../lib/templates';
import { IvoireCameo } from '../templates/ivoire/IvoireArt';
import { initialOf, isArabicName } from '../templates/ivoire/IvoireStrings';
import redBg from '../../assets/red.png';
import ivoireBg from '../../assets/ivoire/bg.jpg';
import ivoireSeal from '../../assets/ivoire/seal.png';

const BG_MAP = {
    velvet: redBg,
};

const ACCENT_MAP = {
    ivoire: { primary: '#b1894e', hover: '#9a7340', text: '#fff' },
    roseraie: { primary: '#691a2e', hover: '#9c2740', text: '#fff' },
    velvet: { primary: '#6b0f1a', hover: '#8b1a2b', text: '#fff' },
    sage: { primary: '#6f7d50', hover: '#8c9a6c', text: '#fff' },
    azure: { primary: '#2e5e9e', hover: '#244c82', text: '#fff' },
    'andalus-fr': { primary: '#7a2236', hover: '#5a162a', text: '#fff' },
};

const DESC_MAP = {
    ivoire: 'A plaster-relief floral field cradles a porcelain blush cameo, the couple’s initials struck in gilded foil. Soft ivory, rose-gold and dusty mauve-a hushed, modern-luxury keepsake in Latin or Arabic.',
    roseraie: 'A wax-sealed botanical keepsake parts to reveal an editorial spread on ivory and cream. Real watercolour roses, blush and burgundy florals and baroque damask-couture luxury, not an envelope.',
    velvet: 'A dramatic opening with rich textures and timeless elegance. Perfect for the classic romantic.',
    sage: 'Botanical line art on sage and ivory for understated, garden elegance. Perfect for the refined couple.',
    azure: 'Bold blue type and a hand-drawn couple on warm cream. Perfect for the playful, characterful couple.',
    'andalus-fr': "Un rideau de velours royal s'écarte sur une carte Nikkah gravée à l'or, fleurs et Bismillah. L'élégance algérienne et andalouse, en français.",
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
    if (template.preview === 'andalus-fr') {
        return (
            <div
                className="td2-phone-screen"
                style={{ background: 'linear-gradient(160deg, #f3e8cf 0%, #e7d6b0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textAlign: 'center', padding: '1rem 0.9rem' }}
            >
                <p style={{ fontFamily: "'Amiri', serif", fontSize: '0.62rem', color: '#9c7b34', margin: 0 }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p style={{ fontFamily: "'Pinyon Script', cursive", fontWeight: 400, fontSize: '1.55rem', lineHeight: 1, color: '#7a2236', margin: '0.1rem 0' }}>
                    {template.couple.bride} <span style={{ color: '#5e6b3a' }}>&</span> {template.couple.groom}
                </p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5b4423', margin: 0 }}>
                    Nikkah celebration
                </p>
            </div>
        );
    }

    if (template.preview === 'ivoire') {
        const initA = initialOf(template.couple.bride);
        const initB = initialOf(template.couple.groom);
        const monoArabic = isArabicName(initA) || isArabicName(initB);
        return (
            <div
                className="td2-phone-screen"
                style={{ position: 'relative', overflow: 'hidden', backgroundImage: `url(${ivoireBg})`, backgroundSize: 'cover', backgroundPosition: 'center', textAlign: 'center' }}
            >
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '68%', aspectRatio: '1 / 1', filter: 'drop-shadow(0 8px 14px rgba(120,96,86,0.18))' }}>
                    <img src={ivoireSeal} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                    <div style={{ position: 'absolute', left: '50%', top: '47.5%', transform: 'translate(-50%, -50%)', width: '54%' }}>
                        <IvoireCameo a={initA} b={initB} arabic={monoArabic} className="td2-ivoire-mono" />
                    </div>
                </div>
                <p style={{ position: 'absolute', left: '50%', top: '74%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5em', fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: '0.46rem', letterSpacing: '0.22em', textIndent: '0.22em', textTransform: 'uppercase', color: '#9c8478', textShadow: '0 1px 0 rgba(255,252,247,0.85), 0 -1px 1px rgba(120,96,74,0.4)', margin: 0, whiteSpace: 'nowrap' }}>
                    <span>{template.couple.bride}</span>
                    <span style={{ letterSpacing: 0, color: '#b6a294' }}>&amp;</span>
                    <span>{template.couple.groom}</span>
                </p>
            </div>
        );
    }

    if (template.preview === 'roseraie') {
        return (
            <div
                className="td2-phone-screen"
                style={{ position: 'relative', overflow: 'hidden', background: '#f6ece2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textAlign: 'center', padding: '1rem' }}
            >
                <p style={{ position: 'relative', fontFamily: "'Jost', sans-serif", fontSize: '0.46rem', letterSpacing: '0.34em', textTransform: 'uppercase', color: '#9c2740', margin: 0 }}>
                    The Wedding Of
                </p>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', lineHeight: 0.92 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '1.5rem', color: '#691a2e' }}>{template.couple.bride}</span>
                    <em style={{ fontFamily: "'Pinyon Script', cursive", fontStyle: 'normal', fontSize: '1.1rem', color: '#c9577e' }}>&amp;</em>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '1.5rem', color: '#691a2e' }}>{template.couple.groom}</span>
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
                <h2 className="td2-title">Six Distinct Experiences</h2>
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
