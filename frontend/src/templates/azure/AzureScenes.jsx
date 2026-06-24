import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    OrnateFrame, CoupleIllustration, StarsCluster, Star, Flourish, HeartDivider, ClockIcon, PinIcon,
} from './AzureArt';
import { azDateParts, azTime } from './AzureStrings';

gsap.registerPlugin(ScrollTrigger);

/* Eased jump to a journey section by index (mirrors SnapJourney's glide) */
function jumpToSection(index) {
    if (typeof document === 'undefined') return;
    const el = document.querySelectorAll('.snap-journey > section')[index];
    if (!el) return;
    const startY = window.scrollY;
    const targetY = Math.round(el.getBoundingClientRect().top + startY);
    const dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, targetY);
        return;
    }
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const stepFn = (now) => {
        const t = Math.min(1, (now - t0) / 850);
        window.scrollTo(0, Math.round(startY + dist * ease(t)));
        if (t < 1) requestAnimationFrame(stepFn);
    };
    requestAnimationFrame(stepFn);
}

/* ─── HERO: the signature blue invitation screen ─── */
export function AzureHero({ bride, groom, eventDate, eventTime, venue, rsvpPhone, strings }) {
    const ref = useRef(null);
    const code = strings.code;
    const dt = azDateParts(eventDate, code);
    const deadline = azDateParts(eventDate, code, 13);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.azure-hero__fade', { opacity: 0, y: 22 }, {
                opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 75%' },
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="azure-scene azure-hero">
            <p className="azure-hero__fade azure-hero__invite">{strings.hero.invite[0]}<br />{strings.hero.invite[1]}</p>

            <h1 className="azure-hero__fade azure-hero__names">
                <span>{bride}</span>
                <span>&amp; {groom}</span>
            </h1>

            <HeartDivider className="azure-hero__fade azure-hero__hdiv" />

            <p className="azure-hero__fade azure-hero__together">{strings.hero.together}</p>

            <div className="azure-hero__fade azure-hero__art">
                <StarsCluster className="azure-acc azure-acc--stars" />
                <Flourish variant="a" className="azure-acc azure-acc--f1" />
                <Flourish variant="b" className="azure-acc azure-acc--f2" />
                <Star className="azure-acc azure-acc--s1" />
                <Star className="azure-acc azure-acc--s2" />
                <OrnateFrame className="azure-frame">
                    <CoupleIllustration className="azure-couple" />
                </OrnateFrame>
            </div>

            <div className="azure-hero__fade azure-hero__meta">
                <button type="button" className="azure-meta__col azure-meta__btn" onClick={() => jumpToSection(1)} aria-label="View ceremony time">
                    <ClockIcon className="azure-meta__icon" />
                    <span>{strings.hero.startAt}<br />{azTime(eventTime, code)}</span>
                </button>
                <span className="azure-meta__sep" />
                {dt && (
                    <button type="button" className="azure-meta__col azure-meta__date azure-meta__btn" onClick={() => jumpToSection(3)} aria-label="View countdown to the date">
                        <strong>{dt.day}<sup>{dt.ord}</sup> {dt.mon},</strong>
                        <strong className="azure-meta__year">{dt.year}</strong>
                    </button>
                )}
                <span className="azure-meta__sep" />
                <button type="button" className="azure-meta__col azure-meta__btn" onClick={() => jumpToSection(4)} aria-label="View the venue location">
                    <PinIcon className="azure-meta__icon" />
                    <span>{venue || strings.hero.venueDefault}</span>
                </button>
            </div>

            {deadline && (
                <p className="azure-hero__fade azure-hero__rsvp">
                    {strings.hero.rsvpBefore} {deadline.day}{deadline.ord} {deadline.mon}, {deadline.year}
                </p>
            )}

            <HeartDivider className="azure-hero__fade azure-hero__hdiv" />
        </section>
    );
}

/* ─── Guest letter ─── */
export function AzureLetter({ guestName, bride, groom, message, strings }) {
    const ref = useRef(null);
    const defaultMsg = strings.letter.defaultMsg;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 80%' },
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section className="azure-scene">
            <div ref={ref} className="azure-letter">
                <Star className="azure-acc azure-letter__star--tl" />
                <Star className="azure-acc azure-letter__star--br" />
                <p className="azure-letter__greeting">{strings.letter.greeting} <strong>{guestName}</strong>,</p>
                <p className="azure-letter__body">{message || defaultMsg}</p>
                <HeartDivider className="azure-letter__div" />
                <p className="azure-letter__sign">{bride} &amp; {groom}</p>
            </div>
        </section>
    );
}

/* ─── Photos ─── */
export function AzurePhotos({ photos = [], strings }) {
    const stageRef = useRef(null);
    const items = (photos || []).filter((p) => typeof p === 'string' && p.trim()).slice(0, 4);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.azure-photo', { opacity: 0, y: 40, scale: 0.92 }, {
                opacity: 1, y: 0, scale: 1, rotation: (i) => (i === 0 ? -3 : i === 1 ? 3 : -2),
                duration: 1.1, stagger: 0.16, ease: 'power3.out',
                scrollTrigger: { trigger: stageRef.current, start: 'top 80%' },
            });
        }, stageRef);
        return () => ctx.revert();
    }, []);

    if (!items.length) return null;

    return (
        <section className="azure-scene">
            <p className="azure-eyebrow">{strings.photos.eyebrow}</p>
            <div ref={stageRef} className="azure-photo-stage">
                {items.map((src, i) => (
                    <div key={i} className={`azure-photo azure-photo--${i + 1} az-scrap`}>
                        {/* washi-tape strip holding the photo to the page */}
                        <svg className="az-scrap__tape" viewBox="0 0 70 22" aria-hidden="true">
                            <path d="M4 4 L66 1 L64 18 L2 21 Z" fill="currentColor" opacity="0.25" />
                            <path d="M4 4 L66 1 M64 18 L2 21" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                        </svg>
                        <img src={src} alt="" loading="lazy" />
                    </div>
                ))}
            </div>
        </section>
    );
}
