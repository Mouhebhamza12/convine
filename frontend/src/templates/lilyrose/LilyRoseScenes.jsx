import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { parseEventDate, formatEventTime, getCountdownTarget } from '../../lib/formatWeddingDate';
import { useGrowOnScroll, drawPath, prefersReducedMotion } from './useBloom';
import { Lily, Rose, Bud, Leaf, Sprig, GoldFlourish, FloralCorner } from './Botanicals';

gsap.registerPlugin(ScrollTrigger);

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

function weekdayOf(dateString) {
    if (!dateString) return 'Saturday';
    return WEEKDAYS[new Date(`${dateString}T12:00:00`).getDay()];
}

/** A soft fall of petals — used at the emotional peaks. */
function petalFall(originY = 0.45, power = 1) {
    if (prefersReducedMotion()) return;
    const colors = ['#f3d3cb', '#e3b1a8', '#fbf3e8', '#ecdcc2', '#cd8a82'];
    confetti({
        particleCount: Math.round(26 * power),
        spread: 90,
        startVelocity: 22,
        gravity: 0.55,
        scalar: 0.85,
        ticks: 260,
        origin: { x: 0.5, y: originY },
        colors,
        flat: true,
        disableForReducedMotion: true,
    });
    confetti({
        particleCount: Math.round(14 * power),
        spread: 130,
        startVelocity: 12,
        gravity: 0.4,
        scalar: 0.6,
        ticks: 300,
        origin: { x: 0.5, y: originY },
        colors,
        disableForReducedMotion: true,
    });
}

/* ════════════════════════════════════════════════════════════════════
   1 · The Names — emerging from the floral composition
   ════════════════════════════════════════════════════════════════════ */
export function LilyRoseNames({ bride, groom, visible }) {
    const sceneRef = useRef(null);
    const flourishWrapRef = useRef(null);
    const flourishRef = useRef(null);

    useGrowOnScroll(flourishRef, { triggerRef: flourishWrapRef, start: 'top 88%', end: 'bottom 72%', scrub: 0.9 });

    useEffect(() => {
        if (!visible) return undefined;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
            tl.fromTo('.lr-names__garland', { opacity: 0, scale: 0.88, y: 8 }, { opacity: 1, scale: 1, y: 0, duration: 1.3 }, 0)
                .fromTo('.lr-names__garland .lr-petal', { opacity: 0 }, { opacity: 1, duration: 1.0, stagger: { each: 0.016, from: 'center' } }, 0.1)
                .fromTo('.lr-names__eyebrow', { opacity: 0, y: 14 }, { opacity: 0.9, y: 0, duration: 0.9 }, 0.3)
                .fromTo('.lr-names__bride', { opacity: 0, y: 32, filter: 'blur(9px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }, 0.5)
                .fromTo('.lr-names__amp', { opacity: 0, scale: 0.5, rotate: -8 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.5)' }, 0.8)
                .fromTo('.lr-names__groom', { opacity: 0, y: 32, filter: 'blur(9px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }, 0.7);
        }, sceneRef);
        return () => ctx.revert();
    }, [visible]);

    return (
        <section ref={sceneRef} className="lr-scene lr-names">
            <div className="lr-names__garland" aria-hidden="true">
                <Leaf size={50} rotate={-52} className="lr-g lr-g--l1" />
                <Leaf size={42} rotate={52} className="lr-g lr-g--r1" />
                <Bud size={34} variant="blush" className="lr-g lr-g--bud" />
                <Rose size={56} variant="rose" className="lr-g lr-g--rose-l" />
                <Lily size={92} className="lr-g lr-g--lily" />
                <Rose size={48} variant="cream" className="lr-g lr-g--rose-r" />
            </div>

            <p className="lr-names__eyebrow">Two hearts · one garden</p>
            <h1 className="lr-names__title">
                <span className="lr-names__bride">{bride}</span>
                <span className="lr-names__amp">&amp;</span>
                <span className="lr-names__groom">{groom}</span>
            </h1>

            <div ref={flourishWrapRef} className="lr-names__flourish" aria-hidden="true">
                <svg viewBox="0 0 260 24" width="260" fill="none">
                    <path ref={flourishRef} d="M12 13 C70 4 100 4 130 12 C160 20 190 20 248 11" stroke="url(#lr-foil)" strokeWidth="1.1" strokeLinecap="round" />
                    <path d="M130 12 l-5 -5 l5 -5 l5 5 z" fill="url(#lr-foil)" />
                </svg>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   2 · The Intention — the symbolism of lily & rose
   ════════════════════════════════════════════════════════════════════ */
export function LilyRoseIntention({ bride, groom }) {
    const sceneRef = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.lr-intent__row', { opacity: 0, y: 34 },
                { opacity: 1, y: 0, duration: 1.3, stagger: 0.28, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 72%' } });
            gsap.fromTo('.lr-intent .lr-petal', { opacity: 0 },
                { opacity: 1, duration: 1.4, stagger: { each: 0.02, from: 'random' }, ease: 'power2.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 72%' } });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="lr-scene lr-intent">
            <div className="lr-intent__row lr-intent__pair">
                <figure className="lr-intent__flower">
                    <Lily size={108} />
                    <figcaption>
                        <span className="lr-intent__name">{bride}</span>
                        <span className="lr-intent__meaning">the lily: grace, purity, new beginnings</span>
                    </figcaption>
                </figure>
                <figure className="lr-intent__flower">
                    <Rose size={104} variant="rose" />
                    <figcaption>
                        <span className="lr-intent__name">{groom}</span>
                        <span className="lr-intent__meaning">the rose: passion, devotion, enduring love</span>
                    </figcaption>
                </figure>
            </div>
            <p className="lr-intent__row lr-intent__line">Two flowers, one garden, beginning to bloom as one.</p>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   3 · The Date — celebrated, framed in gold, ringed with blooms
   ════════════════════════════════════════════════════════════════════ */
export function LilyRoseDate({ eventDate }) {
    const sceneRef = useRef(null);
    const frameRef = useRef(null);
    const { day, month, year } = parseEventDate(eventDate);
    const weekday = weekdayOf(eventDate);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sceneRef.current,
                start: 'top 72%',
                once: true,
                onEnter: () => {
                    if (frameRef.current) drawPath(frameRef.current, { duration: 1.8, ease: 'power2.inOut' });
                    gsap.fromTo('.lr-date__reveal', { opacity: 0, y: 24 },
                        { opacity: 1, y: 0, duration: 1.2, stagger: 0.16, ease: 'power3.out', delay: 0.3 });
                    gsap.fromTo('.lr-date .lr-petal', { opacity: 0 },
                        { opacity: 1, duration: 1.4, stagger: { each: 0.025, from: 'center' }, ease: 'power2.out', delay: 0.4 });
                },
            });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="lr-scene lr-date">
            <p className="lr-date__label lr-date__reveal">Save the date</p>

            <div className="lr-date__card">
                <svg className="lr-date__frame" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none" aria-hidden="true">
                    <rect ref={frameRef} x="6" y="6" width="288" height="188" rx="3" stroke="url(#lr-foil)" strokeWidth="1.2" />
                </svg>

                <Lily size={64} className="lr-date__bloom lr-date__bloom--tl" />
                <Rose size={52} variant="rose" className="lr-date__bloom lr-date__bloom--br" />
                <Leaf size={30} rotate={-40} className="lr-date__bloom lr-date__bloom--leaf" />

                <p className="lr-date__weekday lr-date__reveal">{weekday}</p>
                <div className="lr-date__main lr-date__reveal">
                    <span className="lr-date__month">{month}</span>
                    <span className="lr-date__day">{day}</span>
                    <span className="lr-date__year">{year}</span>
                </div>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   4 · The Love Story — a cinematic floral gallery
   ════════════════════════════════════════════════════════════════════ */
export function LilyRosePhotos({ photos }) {
    const sceneRef = useRef(null);
    const list = (photos || []).slice(0, 5);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.lr-photo').forEach((card, i) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 64, scale: 0.95, rotateZ: i % 2 === 0 ? -1.6 : 1.6 },
                    { opacity: 1, y: 0, scale: 1, rotateZ: i % 2 === 0 ? -0.8 : 0.8, duration: 1.4, ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 86%' } });
                const img = card.querySelector('.lr-photo__img');
                if (img) {
                    gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'power2.out',
                        scrollTrigger: { trigger: card, start: 'top 88%' } });
                }
                gsap.fromTo(card.querySelectorAll('.lr-petal'), { opacity: 0 },
                    { opacity: 1, duration: 1.2, stagger: 0.03, ease: 'power2.out',
                        scrollTrigger: { trigger: card, start: 'top 82%' } });
            });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    if (!list.length) return null;

    return (
        <section ref={sceneRef} className="lr-scene lr-photos">
            <p className="lr-photos__label">Our story, in bloom</p>
            <div className="lr-photos__column">
                {list.map((src, i) => (
                    <figure key={src} className={`lr-photo lr-photo--${i % 2 === 0 ? 'l' : 'r'}`}>
                        <span className="lr-photo__num">{ROMAN[i + 1] || i + 1}</span>
                        <div className="lr-photo__frame">
                            <div className="lr-photo__imgwrap">
                                <img className="lr-photo__img" src={src} alt="" loading="lazy" />
                            </div>
                        </div>
                        {i % 2 === 0
                            ? <Sprig size={92} className="lr-photo__sprig lr-photo__sprig--tr" />
                            : <Sprig size={92} flip className="lr-photo__sprig lr-photo__sprig--tl" />}
                    </figure>
                ))}
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   5 · The Letter — handcrafted on floral stationery
   ════════════════════════════════════════════════════════════════════ */
export function LilyRoseLetter({ guestName, message, bride, groom }) {
    const sceneRef = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.lr-letter__card', { opacity: 0, y: 40, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 76%' } });
            gsap.fromTo('.lr-letter__reveal', { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 1.1, stagger: 0.16, ease: 'power3.out', delay: 0.25,
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 76%' } });
            gsap.fromTo('.lr-letter .lr-petal', { opacity: 0 },
                { opacity: 1, duration: 1.4, stagger: { each: 0.02, from: 'random' }, ease: 'power2.out', delay: 0.3,
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 76%' } });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="lr-scene lr-letter">
            <div className="lr-letter__card">
                <FloralCorner placement="tl" className="lr-letter__corner" />
                <FloralCorner placement="br" className="lr-letter__corner" />

                <p className="lr-letter__label lr-letter__reveal">An invitation</p>
                <p className="lr-letter__greeting lr-letter__reveal">Dear {guestName},</p>
                <p className="lr-letter__body lr-letter__reveal">
                    {message || 'It would mean the world to us to have you beside us as we begin this new chapter. Come share the day our two lives bloom into one.'}
                </p>
                <p className="lr-letter__sign lr-letter__reveal">With love, {bride} &amp; {groom}</p>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   6 · Countdown — quietly counting the days
   ════════════════════════════════════════════════════════════════════ */
function remainingOf(target) {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export function LilyRoseCountdown({ eventDate, eventTime }) {
    const sceneRef = useRef(null);
    const target = getCountdownTarget(eventDate, eventTime);
    const [t, setT] = useState(() => remainingOf(target));

    useEffect(() => {
        const id = setInterval(() => setT(remainingOf(target)), 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventDate, eventTime]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.lr-count__unit', { opacity: 0, y: 34 },
                { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 78%' } });
            gsap.fromTo('.lr-count .lr-petal', { opacity: 0 },
                { opacity: 1, duration: 1.3, stagger: 0.03, ease: 'power2.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 78%' } });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    const units = [
        { v: t.days, l: 'Days' },
        { v: t.hours, l: 'Hours' },
        { v: t.minutes, l: 'Minutes' },
        { v: t.seconds, l: 'Seconds' },
    ];

    return (
        <section ref={sceneRef} className="lr-scene lr-count">
            <Sprig size={120} className="lr-count__sprig" />
            <p className="lr-count__label">Until we say “I do”</p>
            <div className="lr-count__grid">
                {units.map((u, i) => (
                    <div key={u.l} className="lr-count__cell">
                        <div className="lr-count__unit">
                            <span className="lr-count__num">{String(u.v).padStart(2, '0')}</span>
                            <span className="lr-count__ul">{u.l}</span>
                        </div>
                        {i < units.length - 1 && <span className="lr-count__sep" aria-hidden="true">•</span>}
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   7 · Location — the garden gate
   ════════════════════════════════════════════════════════════════════ */
export function LilyRoseLocation({ venue, venueAddress, googleMapsUrl, eventTime }) {
    const sceneRef = useRef(null);
    const time = formatEventTime(eventTime);
    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.lr-loc__reveal', { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.2, stagger: 0.16, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 74%' } });
            gsap.fromTo('.lr-loc .lr-petal', { opacity: 0 },
                { opacity: 1, duration: 1.3, stagger: { each: 0.02, from: 'center' }, ease: 'power2.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 74%' } });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="lr-scene lr-loc">
            <p className="lr-loc__label lr-loc__reveal">Where we’ll celebrate</p>
            <div className="lr-loc__bloom" aria-hidden="true">
                <Leaf size={36} rotate={-40} className="lr-loc__leaf" />
                <Rose size={50} variant="blush" />
                <Leaf size={36} rotate={40} className="lr-loc__leaf lr-loc__leaf--r" />
            </div>
            <h2 className="lr-loc__venue lr-loc__reveal">{venue || 'A garden to be announced'}</h2>
            {venueAddress && <p className="lr-loc__address lr-loc__reveal">{venueAddress}</p>}
            <p className="lr-loc__time lr-loc__reveal">Ceremony at {time}</p>
            {mapsQuery && (
                <a className="lr-btn lr-btn--ghost lr-loc__reveal" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <svg width="13" height="13" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                        <path d="M24 4C16.27 4 10 10.27 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.27 31.73 4 24 4Z" stroke="currentColor" strokeWidth="3" />
                        <circle cx="24" cy="18" r="6" fill="currentColor" />
                    </svg>
                    View the garden
                </a>
            )}
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   8 · RSVP — the emotional conclusion
   ════════════════════════════════════════════════════════════════════ */
export function LilyRoseRSVP({ guestName, initialStatus, onSubmit, isDemo }) {
    const sceneRef = useRef(null);
    const [status, setStatus] = useState(initialStatus);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.lr-rsvp__reveal', { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 78%' } });
            gsap.fromTo('.lr-rsvp .lr-petal', { opacity: 0 },
                { opacity: 1, duration: 1.3, stagger: { each: 0.02, from: 'center' }, ease: 'power2.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 78%' } });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    async function respond(next) {
        if (submitting) return;
        setSubmitting(true);
        try {
            if (isDemo) await new Promise((r) => setTimeout(r, 600));
            else await onSubmit(next);
            setStatus(next);
            if (next === 'attending') petalFall(0.5, 1.4);
        } finally {
            setSubmitting(false);
        }
    }

    if (status) {
        const attending = status === 'attending';
        return (
            <section ref={sceneRef} className="lr-scene lr-rsvp">
                <div className="lr-rsvp__done">
                    <div className="lr-rsvp__crest" aria-hidden="true"><Rose size={70} variant="rose" /></div>
                    <h2 className="lr-rsvp__done-title">{attending ? 'Our garden grows brighter' : 'Thank you, dear friend'}</h2>
                    <p className="lr-rsvp__done-text">
                        {attending
                            ? `We are overjoyed, ${guestName}. We cannot wait to share the day our two lives bloom into one, with you beside us.`
                            : `We understand, ${guestName}. You will be in our hearts as we say our vows, and a petal of this day belongs to you.`}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section ref={sceneRef} className="lr-scene lr-rsvp">
            <div className="lr-rsvp__bloom" aria-hidden="true">
                <Leaf size={34} rotate={-46} className="lr-rsvp__leaf" />
                <Lily size={74} />
                <Leaf size={34} rotate={46} className="lr-rsvp__leaf lr-rsvp__leaf--r" />
            </div>
            <p className="lr-rsvp__label lr-rsvp__reveal">An invitation to {guestName}</p>
            <h2 className="lr-rsvp__title lr-rsvp__reveal">Will you join our garden?</h2>
            <p className="lr-rsvp__sub lr-rsvp__reveal">Your reply is the last bloom of the day.</p>
            <div className="lr-rsvp__actions lr-rsvp__reveal">
                <button type="button" className="lr-btn lr-btn--solid" disabled={submitting} onClick={() => respond('attending')}>
                    Joyfully, yes
                </button>
                <button type="button" className="lr-btn lr-btn--ghost" disabled={submitting} onClick={() => respond('declined')}>
                    With love, I cannot
                </button>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   9 · Closing — a warm farewell
   ════════════════════════════════════════════════════════════════════ */
export function LilyRoseClosing({ bride, groom, eventDate }) {
    const sceneRef = useRef(null);
    const { day, month, year } = parseEventDate(eventDate);
    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sceneRef.current, start: 'top 74%', once: true,
                onEnter: () => {
                    gsap.fromTo('.lr-closing__reveal', { opacity: 0, y: 22 },
                        { opacity: 1, y: 0, duration: 1.2, stagger: 0.18, ease: 'power3.out' });
                    gsap.fromTo('.lr-closing .lr-petal', { opacity: 0 },
                        { opacity: 1, duration: 1.5, stagger: { each: 0.02, from: 'center' }, ease: 'power2.out' });
                },
            });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="lr-scene lr-closing">
            <div className="lr-closing__bouquet lr-closing__reveal" aria-hidden="true">
                <Leaf size={48} rotate={-50} className="lr-cb lr-cb--l" />
                <Rose size={58} variant="rose" className="lr-cb lr-cb--rose" />
                <Lily size={86} className="lr-cb lr-cb--lily" />
                <Rose size={46} variant="cream" className="lr-cb lr-cb--rose2" />
                <Leaf size={42} rotate={50} className="lr-cb lr-cb--r" />
            </div>
            <p className="lr-closing__with lr-closing__reveal">With love &amp; anticipation</p>
            <p className="lr-closing__names lr-closing__reveal">{bride} &amp; {groom}</p>
            <p className="lr-closing__date lr-closing__reveal">{month} {day}, {year}</p>
            <GoldFlourish className="lr-closing__flourish lr-closing__reveal" width={180} />
        </section>
    );
}
