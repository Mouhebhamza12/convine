import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WEDDING_TEMPLATES } from '../lib/templates';
import { LOCALE_CODES, LOCALES, resolveLocale } from '../lib/locales';
import { IvoireCameo } from '../templates/ivoire/IvoireArt';
import { initialOf, isArabicName } from '../templates/ivoire/IvoireStrings';
import ivoireBg from '../../assets/ivoire/bg.jpg';
import ivoireSeal from '../../assets/ivoire/seal.png';

/* The cover line each card previews, per language. A template only carries the
   languages it's translated into; everything else falls back to English, so the
   gallery never shows a half-translated card. (Ivoire previews its names + cameo,
   so it needs no eyebrow here.) */
const PREVIEW_COVER = {
    velvet: {
        en: { eyebrow: 'The Wedding of', and: '&' },
        fr: { eyebrow: 'Le Mariage de', and: '&' },
        ar: { eyebrow: 'حفل زفاف', and: 'و' },
    },
    roseraie: {
        en: { eyebrow: 'The Wedding Of', and: '&' },
        fr: { eyebrow: 'Le Mariage De', and: '&' },
        ar: { eyebrow: 'حفل زفاف', and: 'و' },
    },
    sage: {
        en: { eyebrow: 'the wedding of', and: '&' },
        fr: { eyebrow: 'le mariage de', and: '&' },
        ar: { eyebrow: 'حفل زفاف', and: 'و' },
    },
    azure: {
        en: { eyebrow: "you're invited", and: '&' },
        fr: { eyebrow: 'vous êtes invités', and: '&' },
        ar: { eyebrow: 'أنتم مدعوّون', and: 'و' },
    },
};

function cover(preview, locale) {
    const m = PREVIEW_COVER[preview] || {};
    return m[locale] || m.en || { eyebrow: '', and: '&' };
}

/* The demo link that opens a template in a given language. `?lang=` is a
   preview-only hint honoured by the demo route; real invitations always take
   their language from the couple's saved choice, never the URL. */
function demoHref(template, locale) {
    return `${template.demoPath}?lang=${locale}`;
}

/* per-world ambient palette, the whole section bleeds to the focused card */
const THEME = {
    velvet: { accent: '#6b0f1a', soft: '#f1e2dd' },
    ivoire: { accent: '#a8793f', soft: '#f3ebdf' },
    roseraie: { accent: '#9c2740', soft: '#f5e6e5' },
    sage: { accent: '#67753f', soft: '#ecefe2' },
    azure: { accent: '#2e5e9e', soft: '#e6edf6' },
};

const DESC_MAP = {
    velvet: 'A dramatic red drape parts to a cinematic story, with scratch to reveal dates and a sealed RSVP. For the classic romantic.',
    roseraie: 'A wax sealed botanical keepsake opens to an editorial spread on ivory. Real watercolour roses and baroque damask.',
    ivoire: 'A plaster relief floral field cradles a porcelain blush cameo, the initials struck in gilded foil. Soft ivory and rose gold.',
    sage: 'Botanical line art on sage and ivory for understated, garden elegance. For the refined, quietly modern couple.',
    azure: 'Bold blue type and a hand drawn couple on warm cream. For the playful couple who break the mould.',
};

function TemplatePreview({ template, locale = 'en' }) {
    const { bride, groom } = template.couple;
    const c = cover(template.preview, locale);
    const ar = locale === 'ar';

    if (template.preview === 'velvet') {
        return (
            <div className="lx-screen" dir={ar ? 'rtl' : 'ltr'} style={{ background: 'radial-gradient(120% 100% at 50% 0%, #7c1320 0%, #4c0a11 72%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontFamily: ar ? "'Reem Kufi', sans-serif" : "'Cormorant Garamond', serif", fontSize: '0.52rem', letterSpacing: ar ? '0' : '0.34em', textTransform: ar ? 'none' : 'uppercase', color: '#e7c489', margin: 0 }}>{c.eyebrow}</p>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
                    <span style={{ fontFamily: "'Prata', serif", fontSize: '1.7rem', color: '#f6ddab' }}>{bride}</span>
                    <em style={{ fontFamily: "'Pinyon Script', cursive", fontStyle: 'normal', fontSize: '1.3rem', color: '#caa15e' }}>{c.and}</em>
                    <span style={{ fontFamily: "'Prata', serif", fontSize: '1.7rem', color: '#f6ddab' }}>{groom}</span>
                </div>
            </div>
        );
    }


    if (template.preview === 'ivoire') {
        const initA = initialOf(bride);
        const initB = initialOf(groom);
        const monoArabic = isArabicName(initA) || isArabicName(initB);
        return (
            <div className="lx-screen" style={{ position: 'relative', overflow: 'hidden', backgroundImage: `url(${ivoireBg})`, backgroundSize: 'cover', backgroundPosition: 'center', textAlign: 'center' }}>
                <div style={{ position: 'absolute', left: '50%', top: '48%', transform: 'translate(-50%, -50%)', width: '70%', aspectRatio: '1 / 1', filter: 'drop-shadow(0 8px 14px rgba(120,96,86,0.18))' }}>
                    <img src={ivoireSeal} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                    <div style={{ position: 'absolute', left: '50%', top: '47.5%', transform: 'translate(-50%, -50%)', width: '54%' }}>
                        <IvoireCameo a={initA} b={initB} arabic={monoArabic} className="td2-ivoire-mono" />
                    </div>
                </div>
                <p style={{ position: 'absolute', left: '50%', top: '74%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5em', fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: '0.5rem', letterSpacing: '0.22em', textIndent: '0.22em', textTransform: 'uppercase', color: '#9c8478', textShadow: '0 1px 0 rgba(255,252,247,0.85), 0 -1px 1px rgba(120,96,74,0.4)', margin: 0, whiteSpace: 'nowrap' }}>
                    <span>{bride}</span>
                    <span style={{ letterSpacing: 0, color: '#b6a294' }}>&amp;</span>
                    <span>{groom}</span>
                </p>
            </div>
        );
    }

    if (template.preview === 'roseraie') {
        return (
            <div className="lx-screen" dir={ar ? 'rtl' : 'ltr'} style={{ background: '#f6ece2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontFamily: ar ? "'Reem Kufi', sans-serif" : "'Jost', sans-serif", fontSize: '0.5rem', letterSpacing: ar ? '0' : '0.34em', textTransform: ar ? 'none' : 'uppercase', color: '#9c2740', margin: 0 }}>{c.eyebrow}</p>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.92 }}>
                    <span style={{ fontFamily: "'Prata', serif", fontSize: '1.6rem', color: '#691a2e' }}>{bride}</span>
                    <em style={{ fontFamily: ar ? "'Aref Ruqaa', serif" : "'Pinyon Script', cursive", fontStyle: 'normal', fontSize: '1.25rem', color: '#c9577e' }}>{c.and}</em>
                    <span style={{ fontFamily: "'Prata', serif", fontSize: '1.6rem', color: '#691a2e' }}>{groom}</span>
                </div>
            </div>
        );
    }

    if (template.preview === 'sage') {
        return (
            <div className="lx-screen" dir={ar ? 'rtl' : 'ltr'} style={{ background: '#8c9a6c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontFamily: ar ? "'Reem Kufi', sans-serif" : "'Cormorant Garamond', serif", fontSize: '0.64rem', letterSpacing: ar ? '0' : '0.28em', textTransform: ar ? 'none' : 'uppercase', color: '#fbf9f3', margin: 0 }}>{c.eyebrow}</p>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.82 }}>
                    <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600, fontSize: '2.2rem', color: '#fbf9f3' }}>{bride}</span>
                    <em style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#e8e3d2' }}>{c.and}</em>
                    <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600, fontSize: '2.2rem', color: '#fbf9f3' }}>{groom}</span>
                </div>
            </div>
        );
    }

    // azure
    return (
        <div className="lx-screen" dir={ar ? 'rtl' : 'ltr'} style={{ background: '#f6f1e3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', textAlign: 'center', padding: '1rem' }}>
            <p style={{ fontFamily: ar ? "'Reem Kufi', sans-serif" : "'Playfair Display', serif", fontSize: '0.6rem', color: '#2e5e9e', margin: 0 }}>{c.eyebrow}</p>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.9rem', color: '#2e5e9e' }}>{bride}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.9rem', color: '#2e5e9e' }}>{c.and} {groom}</span>
            </div>
        </div>
    );
}

export default function TemplateDemoSection() {
    const trackRef = useRef(null);
    const sectionRef = useRef(null);
    const [active, setActive] = useState(0);
    // One language preference for the whole showcase-a page-level preview choice,
    // never a control inside an invitation. Each card honours it when it can and
    // gracefully shows its own language when it can't.
    const [galleryLocale, setGalleryLocale] = useState('en');

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const center = track.scrollLeft + track.clientWidth / 2;
                const slides = track.querySelectorAll('.lx-slide');
                let best = 0;
                let bestD = Infinity;
                slides.forEach((s, i) => {
                    const c = s.offsetLeft + s.offsetWidth / 2;
                    const d = Math.abs(c - center);
                    if (d < bestD) { bestD = d; best = i; }
                });
                setActive(best);
            });
        };
        track.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => { track.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
    }, []);

    // reveal-on-scroll
    useEffect(() => {
        const els = sectionRef.current?.querySelectorAll('.lx-reveal');
        if (!els?.length) return undefined;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
        }, { threshold: 0.2 });
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    const activeT = WEDDING_TEMPLATES[active] || WEDDING_TEMPLATES[0];
    const theme = THEME[activeT.preview] || THEME.velvet;
    const activeLocale = resolveLocale(galleryLocale, activeT.supportedLocales, activeT.defaultLocale);

    const scrollTo = (i) => {
        const slide = trackRef.current?.querySelectorAll('.lx-slide')[i];
        slide?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    };

    return (
        <section
            id="demo"
            ref={sectionRef}
            className="lx lx-showcase"
            style={{ '--lx-accent': theme.accent, '--lx-soft': theme.soft }}
        >
            <div className="lx-ambient" aria-hidden="true" />

            <div className="lx-head lx-reveal">
                <span className="lx-pill">Six living invitations</span>
                <h1 className="lx-head-title">Find the world your<br />love story <b>lives in.</b></h1>
                <p className="lx-head-sub">Swipe through six real invitations. Each one opens for keeps, right here, no account needed.</p>

                <div className="lx-lang" role="group" aria-label="Preview language">
                    {LOCALE_CODES.map((code) => (
                        <button
                            key={code}
                            type="button"
                            lang={code}
                            className={code === galleryLocale ? 'is-on' : ''}
                            aria-pressed={code === galleryLocale}
                            onClick={() => setGalleryLocale(code)}
                        >
                            {LOCALES[code].endonym}
                        </button>
                    ))}
                </div>
            </div>

            <div className="lx-track" ref={trackRef}>
                {WEDDING_TEMPLATES.map((template, i) => {
                    const cardLocale = resolveLocale(galleryLocale, template.supportedLocales, template.defaultLocale);
                    return (
                        <Link
                            key={template.slug}
                            to={demoHref(template, cardLocale)}
                            className={`lx-slide${i === active ? ' is-active' : ''}`}
                            aria-label={`Open ${template.name} guest demo`}
                            tabIndex={i === active ? 0 : -1}
                        >
                            <div className="lx-device">
                                <TemplatePreview template={template} locale={cardLocale} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="lx-prog" role="tablist" aria-label="Choose a template">
                {WEDDING_TEMPLATES.map((t, i) => (
                    <button
                        key={t.slug}
                        type="button"
                        className={i === active ? 'is-on' : ''}
                        aria-label={t.name}
                        aria-selected={i === active}
                        onClick={() => scrollTo(i)}
                    />
                ))}
            </div>

            <div className="lx-stage" key={activeT.slug}>
                <h2 className="lx-stage-name">{activeT.name}</h2>
                <p className="lx-stage-desc">{DESC_MAP[activeT.preview]}</p>
                <ul className="lx-tags">
                    {activeT.features.slice(0, 4).map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Link to={demoHref(activeT, activeLocale)} className="lx-btn">
                    Open this invitation
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </Link>
                {activeLocale !== galleryLocale && (
                    <p className="lx-langnote">
                        {activeT.name} is crafted in {LOCALES[activeLocale].label}, shown here in its own language.
                    </p>
                )}
            </div>

            <p className="lx-note">Every demo opens as <b>Mohamed</b>. No account, no sign in, nothing to download.</p>
        </section>
    );
}
