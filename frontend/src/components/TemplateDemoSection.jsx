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
    filigree: { primary: '#caa157', hover: '#d8b26e', text: '#1c1408' },
    lilyrose: { primary: '#c98f86', hover: '#d99a96', text: '#fff' },
    'andalus-fr': { primary: '#7a2236', hover: '#5a162a', text: '#fff' },
    'andalus-ar': { primary: '#7a2236', hover: '#5a162a', text: '#fff' },
};

const DESC_MAP = {
    velvet: 'A dramatic opening with rich textures and timeless elegance. Perfect for the classic romantic.',
    bloom: 'Soft florals and watercolor details for a fresh, romantic feel. Perfect for the modern couple.',
    sage: 'Botanical line art on sage and ivory for understated, garden elegance. Perfect for the refined couple.',
    azure: 'Bold blue type and a hand-drawn couple on warm cream. Perfect for the playful, characterful couple.',
    filigree: 'A living golden thread stitches your story on midnight ink and ties the knot at the emotional peak. For the couple who want guests to gasp.',
    lilyrose: 'Hand-painted lilies and roses bloom open on ivory and champagne as your love story unfolds. Editorial, fine-art floral luxury at its most romantic.',
    'andalus-fr': "Un rideau de velours royal s'écarte sur une carte Nikkah gravée à l'or, fleurs et Bismillah. L'élégance algérienne et andalouse, en français.",
    'andalus-ar': 'ستار مخملي ملكي ينكشف عن بطاقة عقد قران محفورة بالذهب والزهور والبسملة. أناقة أندلسية أصيلة، بالعربية.',
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
    if (template.preview === 'lilyrose') {
        return (
            <div
                className="td2-phone-screen"
                style={{ background: 'radial-gradient(120% 82% at 50% 24%, #fdf9f1 0%, #f4ead8 58%, #ecdcc2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem', textAlign: 'center' }}
            >
                <svg width="76" height="68" viewBox="0 0 100 90" fill="none" aria-hidden="true">
                    {/* lily */}
                    <g>
                        {[0, 60, 120, 180, 240, 300].map((a) => (
                            <path key={a} transform={`rotate(${a} 50 40)`} d="M50 40 C45 30 43 17 47 6 C48 3 52 3 53 6 C57 17 55 30 50 40 Z" fill="#f7ecda" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.4" />
                        ))}
                        <circle cx="50" cy="40" r="4" fill="#c0b06f" />
                    </g>
                    {/* roses */}
                    {[{ x: 28, y: 58, c: '#d99a92' }, { x: 70, y: 60, c: '#ecd9bd' }, { x: 50, y: 70, c: '#e3b1a8' }].map((r) => (
                        <g key={`${r.x}-${r.y}`} transform={`translate(${r.x - 50} ${r.y - 40})`}>
                            {[0, 72, 144, 216, 288].map((a) => (
                                <path key={a} transform={`rotate(${a} 50 40)`} d="M50 42 C42 38 40 28 47 23 C49 21 51 21 53 23 C60 28 58 38 50 42 Z" fill={r.c} stroke="#fff" strokeOpacity="0.35" strokeWidth="0.3" />
                            ))}
                        </g>
                    ))}
                    {/* leaves */}
                    <path d="M14 44 C24 40 34 42 40 50 C30 54 20 52 14 44 Z" fill="#92a37b" />
                    <path d="M86 46 C76 42 66 44 60 52 C70 56 80 54 86 46 Z" fill="#92a37b" />
                </svg>
                <p style={{ fontFamily: "'Marcellus', serif", fontSize: '0.46rem', letterSpacing: '0.34em', textTransform: 'uppercase', color: '#9c7a3f', margin: 0 }}>
                    The Wedding Of
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '1.25rem', lineHeight: 1, color: '#5b4940', margin: 0 }}>
                    {template.couple.bride} <span style={{ fontFamily: "'Great Vibes', cursive", color: '#c98f86' }}>&amp;</span> {template.couple.groom}
                </p>
            </div>
        );
    }

    if (template.preview === 'filigree') {
        return (
            <div
                className="td2-phone-screen"
                style={{ background: 'radial-gradient(120% 85% at 50% 26%, #1c1530 0%, #0b0910 62%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', padding: '0.9rem', textAlign: 'center' }}
            >
                <svg width="60" height="76" viewBox="0 0 120 150" fill="none" aria-hidden="true">
                    <ellipse cx="60" cy="75" rx="44" ry="58" stroke="#d8b26e" strokeWidth="1.4" />
                    <ellipse cx="60" cy="75" rx="38" ry="52" stroke="#d8b26e" strokeWidth="0.7" opacity="0.5" />
                    <path d="M60 17 L60 0" stroke="#d8b26e" strokeWidth="1.2" />
                    <text x="60" y="86" textAnchor="middle" fontFamily="'Cinzel', serif" fontSize="29" fill="#e7c87c" letterSpacing="1">
                        {template.couple.bride.charAt(0)}&amp;{template.couple.groom.charAt(0)}
                    </text>
                </svg>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.5rem', letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(216,178,110,0.85)', margin: 0 }}>
                    Tie the knot
                </p>
            </div>
        );
    }

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

    if (template.preview === 'andalus-fr' || template.preview === 'andalus-ar') {
        const ar = template.preview === 'andalus-ar';
        return (
            <div
                className="td2-phone-screen"
                dir={ar ? 'rtl' : 'ltr'}
                style={{ background: 'linear-gradient(160deg, #f3e8cf 0%, #e7d6b0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textAlign: 'center', padding: '1rem 0.9rem' }}
            >
                <p style={{ fontFamily: "'Amiri', serif", fontSize: '0.62rem', color: '#9c7b34', margin: 0 }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p style={{ fontFamily: ar ? "'Amiri', serif" : "'Pinyon Script', cursive", fontWeight: ar ? 700 : 400, fontSize: ar ? '1.2rem' : '1.55rem', lineHeight: 1, color: '#7a2236', margin: '0.1rem 0' }}>
                    {template.couple.bride} <span style={{ color: '#5e6b3a' }}>{ar ? 'و' : '&'}</span> {template.couple.groom}
                </p>
                <p style={{ fontFamily: ar ? "'Amiri', serif" : "'EB Garamond', serif", fontSize: '0.5rem', letterSpacing: ar ? 0 : '0.18em', textTransform: ar ? 'none' : 'uppercase', color: '#5b4423', margin: 0 }}>
                    {ar ? 'حفل عقد القران' : 'Nikkah celebration'}
                </p>
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
                <h2 className="td2-title">Eight Distinct Experiences</h2>
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
