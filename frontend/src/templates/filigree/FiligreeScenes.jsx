import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { parseEventDate, formatEventTime, getCountdownTarget } from '../../lib/formatWeddingDate';
import { useScrollDraw, drawPath, prefersReducedMotion } from './useThreadDraw';

gsap.registerPlugin(ScrollTrigger);

const G = 'var(--fil-gold)';
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function weekdayOf(dateString) {
    if (!dateString) return 'Saturday';
    const d = new Date(`${dateString}T12:00:00`);
    return WEEKDAYS[d.getDay()];
}

/** A soft shower of gold dust — used at the emotional peaks. */
function goldBurst(originY = 0.5, power = 1) {
    if (prefersReducedMotion()) return;
    const colors = ['#f4e0ab', '#d8b26e', '#e9cd8a', '#bd923f'];
    confetti({
        particleCount: Math.round(34 * power),
        spread: 78,
        startVelocity: 26,
        gravity: 0.7,
        scalar: 0.7,
        ticks: 220,
        origin: { x: 0.5, y: originY },
        colors,
        disableForReducedMotion: true,
    });
    confetti({
        particleCount: Math.round(16 * power),
        spread: 120,
        startVelocity: 14,
        gravity: 0.5,
        scalar: 0.5,
        ticks: 260,
        origin: { x: 0.5, y: originY },
        colors,
        disableForReducedMotion: true,
    });
}

/* ════════════════════════════════════════════════════════════════════
   Divider — a short stitch with a diamond bead, drawn on scroll.
   ════════════════════════════════════════════════════════════════════ */
export function ThreadStitch() {
    const wrapRef = useRef(null);
    const pathRef = useRef(null);
    useScrollDraw(pathRef, { triggerRef: wrapRef, start: 'top 92%', end: 'bottom 70%', scrub: 0.7 });

    return (
        <div ref={wrapRef} className="filigree-stitch" aria-hidden="true">
            <svg viewBox="0 0 24 90" fill="none" preserveAspectRatio="xMidYMid meet">
                <path
                    ref={pathRef}
                    d="M12 0 L12 35 L4 45 L12 55 L20 45 L12 35 M12 55 L12 90"
                    stroke={G}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════════
   1 · The Names
   ════════════════════════════════════════════════════════════════════ */
export function FiligreeNames({ bride, groom }) {
    const sceneRef = useRef(null);
    const underlineWrapRef = useRef(null);
    const underlineRef = useRef(null);

    useScrollDraw(underlineRef, { triggerRef: underlineWrapRef, start: 'top 86%', end: 'bottom 72%', scrub: 0.8 });

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: sceneRef.current, start: 'top 74%' },
                defaults: { ease: 'power3.out' },
            });
            tl.fromTo('.filigree-names__eyebrow', { opacity: 0, y: 18, letterSpacing: '0.2em' },
                { opacity: 0.85, y: 0, letterSpacing: '0.42em', duration: 1.1 })
                .fromTo('.filigree-names__bride', { opacity: 0, y: 40, filter: 'blur(8px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3 }, '-=0.6')
                .fromTo('.filigree-names__amp', { opacity: 0, scale: 0.4, rotate: -12 },
                    { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.6)' }, '-=0.8')
                .fromTo('.filigree-names__groom', { opacity: 0, y: 40, filter: 'blur(8px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3 }, '-=0.9');
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="filigree-scene filigree-names">
            <p className="filigree-names__eyebrow">Two souls · one thread</p>
            <h1 className="filigree-names__title">
                <span className="filigree-names__bride filigree-goldtext">{bride}</span>
                <em className="filigree-names__amp">&amp;</em>
                <span className="filigree-names__groom filigree-goldtext">{groom}</span>
            </h1>
            <div ref={underlineWrapRef} className="filigree-names__flourish" aria-hidden="true">
                <svg viewBox="0 0 320 26" fill="none" preserveAspectRatio="xMidYMid meet">
                    <path
                        ref={underlineRef}
                        d="M6 14 C70 4 110 4 160 13 C210 22 250 22 314 12"
                        stroke={G}
                        strokeWidth="1.1"
                        strokeLinecap="round"
                    />
                    <path d="M160 13 l-5 -5 l5 -5 l5 5 z" fill={G} opacity="0.9" />
                </svg>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   2 · A whispered line (emotional beat)
   ════════════════════════════════════════════════════════════════════ */
export function FiligreeWords({ text }) {
    const sceneRef = useRef(null);
    const words = (text || '').split(/\s+/).filter(Boolean);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.filigree-words__w',
                { opacity: 0, y: 16, filter: 'blur(6px)' },
                {
                    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out',
                    stagger: 0.085,
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 72%' },
                });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="filigree-scene filigree-words">
            <p className="filigree-words__line">
                {words.map((w, i) => (
                    <span key={`${w}-${i}`} className="filigree-words__w">{w}&nbsp;</span>
                ))}
            </p>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   3 · The Date
   ════════════════════════════════════════════════════════════════════ */
export function FiligreeDate({ eventDate }) {
    const sceneRef = useRef(null);
    const ringWrapRef = useRef(null);
    const ringRef = useRef(null);
    const { day, month, year } = parseEventDate(eventDate);
    const weekday = weekdayOf(eventDate);

    useScrollDraw(ringRef, { triggerRef: ringWrapRef, start: 'top 80%', end: 'bottom 66%', scrub: 0.9 });

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: sceneRef.current, start: 'top 74%' }, defaults: { ease: 'power3.out' } });
            tl.fromTo('.filigree-date__label', { opacity: 0, y: 16 }, { opacity: 0.85, y: 0, duration: 1 })
                .fromTo('.filigree-date__weekday', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.55')
                .fromTo('.filigree-date__day', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.3, ease: 'back.out(1.4)' }, '-=0.5')
                .fromTo('.filigree-date__month', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 1 }, '-=0.9')
                .fromTo('.filigree-date__year', { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 1 }, '-=1.0');
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="filigree-scene filigree-date">
            <p className="filigree-date__label">Save the date</p>
            <p className="filigree-date__weekday">{weekday}</p>
            <div className="filigree-date__row">
                <span className="filigree-date__month">{month}</span>
                <div ref={ringWrapRef} className="filigree-date__day-wrap">
                    <span className="filigree-date__day filigree-goldtext">{day}</span>
                    <svg className="filigree-date__ring" viewBox="0 0 160 160" fill="none" aria-hidden="true">
                        <path
                            ref={ringRef}
                            d="M80 12 C117.6 12 148 42.4 148 80 C148 117.6 117.6 148 80 148 C42.4 148 12 117.6 12 80 C12 42.4 42.4 12 80 12 Z"
                            stroke={G}
                            strokeWidth="1"
                            opacity="0.8"
                        />
                    </svg>
                </div>
                <span className="filigree-date__year">{year}</span>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   4 · The Love Story — couture lookbook of photos
   ════════════════════════════════════════════════════════════════════ */
export function FiligreePhotos({ photos }) {
    const sceneRef = useRef(null);
    const list = (photos || []).slice(0, 6);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.filigree-photo').forEach((card, i) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 60, rotateZ: i % 2 === 0 ? -2.5 : 2.5, scale: 0.94 },
                    {
                        opacity: 1, y: 0, rotateZ: i % 2 === 0 ? -1.2 : 1.2, scale: 1,
                        duration: 1.3, ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 86%' },
                    });
                gsap.fromTo(card.querySelector('.filigree-photo__num'),
                    { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, delay: 0.2,
                        scrollTrigger: { trigger: card, start: 'top 86%' } });
            });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    if (!list.length) return null;

    return (
        <section ref={sceneRef} className="filigree-scene filigree-photos">
            <p className="filigree-photos__label">Our story, stitched in moments</p>
            <div className="filigree-photos__column">
                {list.map((src, i) => (
                    <figure key={src} className={`filigree-photo filigree-photo--${i % 2 === 0 ? 'l' : 'r'}`}>
                        <span className="filigree-photo__num">{ROMAN[i + 1] || i + 1}</span>
                        <div className="filigree-photo__frame">
                            <img src={src} alt="" loading="lazy" />
                            <span className="filigree-photo__corner filigree-photo__corner--tl" />
                            <span className="filigree-photo__corner filigree-photo__corner--br" />
                        </div>
                    </figure>
                ))}
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   4b · A personal letter to the guest
   ════════════════════════════════════════════════════════════════════ */
export function FiligreeLetter({ guestName, message, bride, groom }) {
    const sceneRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.filigree-letter__reveal',
                { opacity: 0, y: 26, filter: 'blur(5px)' },
                {
                    opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.18, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 74%' },
                });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="filigree-scene filigree-letter">
            <div className="filigree-letter__card">
                <p className="filigree-letter__label filigree-letter__reveal">A note for you</p>
                <p className="filigree-letter__greeting filigree-letter__reveal">Dear {guestName},</p>
                <p className="filigree-letter__body filigree-letter__reveal">
                    {message || 'We would be honoured to have you beside us as we tie our lives together. Your presence would make our day complete.'}
                </p>
                <p className="filigree-letter__sign filigree-letter__reveal">{bride} &amp; {groom}</p>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   5 · Countdown
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

export function FiligreeCountdown({ eventDate, eventTime }) {
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
            gsap.fromTo('.filigree-count__unit',
                { opacity: 0, y: 40, filter: 'blur(6px)' },
                {
                    opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.14, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 76%' },
                });
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
        <section ref={sceneRef} className="filigree-scene filigree-count">
            <p className="filigree-count__label">Until forever begins</p>
            <div className="filigree-count__grid">
                {units.map((u, i) => (
                    <div key={u.l} className="filigree-count__cell">
                        <div className="filigree-count__unit">
                            <span className="filigree-count__num">{String(u.v).padStart(2, '0')}</span>
                            <span className="filigree-count__unit-label">{u.l}</span>
                        </div>
                        {i < units.length - 1 && <span className="filigree-count__sep" aria-hidden="true">·</span>}
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   6 · The Ceremony — time, place, directions, calendar
   ════════════════════════════════════════════════════════════════════ */
function buildGoogleCalendarUrl({ title, date, time, venue, address }) {
    const { day, month, year } = parseEventDate(date);
    const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
    const dateStr = `${year}${String(monthNum).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    let startStr = dateStr;
    let endStr = dateStr;
    if (time) {
        const [h, m] = time.split(':').map(Number);
        startStr = `${dateStr}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
        endStr = `${dateStr}T${String(h + 4).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    }
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${startStr}/${endStr}`,
        details: 'You are invited to celebrate with us.',
        location: [venue, address].filter(Boolean).join(', '),
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function FiligreeCeremony({ eventTime, venue, venueAddress, googleMapsUrl, eventDate, brideName, groomName }) {
    const sceneRef = useRef(null);
    const time = formatEventTime(eventTime);
    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    const calUrl = buildGoogleCalendarUrl({
        title: `${brideName} & ${groomName} · Wedding`,
        date: eventDate, time: eventTime, venue, address: venueAddress,
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.filigree-cer__reveal',
                { opacity: 0, y: 34 },
                {
                    opacity: 1, y: 0, duration: 1.1, stagger: 0.16, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 74%' },
                });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="filigree-scene filigree-cer">
            <p className="filigree-cer__label filigree-cer__reveal">The celebration</p>

            <div className="filigree-cer__card">
                <div className="filigree-cer__time filigree-cer__reveal">
                    <span className="filigree-cer__time-num filigree-goldtext">{time}</span>
                    <span className="filigree-cer__time-sub">in the evening</span>
                </div>

                <div className="filigree-cer__rule filigree-cer__reveal" aria-hidden="true" />

                <div className="filigree-cer__reveal">
                    <p className="filigree-cer__venue">{venue || 'Venue to be announced'}</p>
                    {venueAddress && <p className="filigree-cer__address">{venueAddress}</p>}
                </div>

                <div className="filigree-cer__actions filigree-cer__reveal">
                    {mapsQuery && (
                        <a className="filigree-btn filigree-btn--ghost" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                                <path d="M24 4C16.27 4 10 10.27 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.27 31.73 4 24 4Z" stroke="currentColor" strokeWidth="3" />
                                <circle cx="24" cy="18" r="6" fill="currentColor" />
                            </svg>
                            Directions
                        </a>
                    )}
                    <a className="filigree-btn filigree-btn--ghost" href={calUrl} target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1" />
                            <path d="M5 1V5M11 1V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M1 7H15" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                        </svg>
                        Add to calendar
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   7 · THE CLIMAX — Tying the Knot
   ════════════════════════════════════════════════════════════════════ */
export function FiligreeKnot({ bride, groom, eventDate }) {
    const sceneRef = useRef(null);
    const strandLRef = useRef(null);
    const strandRRef = useRef(null);
    const cinchRef = useRef(null);
    const revealRef = useRef(null);
    const firedRef = useRef(false);
    const { day, month, year } = parseEventDate(eventDate);

    useEffect(() => {
        const scene = sceneRef.current;
        const left = strandLRef.current;
        const right = strandRRef.current;
        const cinch = cinchRef.current;
        if (!scene || !left || !right) return undefined;

        const lLen = left.getTotalLength();
        const rLen = right.getTotalLength();
        const cLen = cinch ? cinch.getTotalLength() : 0;
        [[left, lLen], [right, rLen], [cinch, cLen]].forEach(([el, len]) => {
            if (!el) return;
            el.style.strokeDasharray = `${len}`;
            el.style.strokeDashoffset = `${len}`;
        });

        const reveal = revealRef.current;
        gsap.set(reveal, { opacity: 0, y: 22 });

        const tieOff = () => {
            if (firedRef.current) return;
            firedRef.current = true;
            gsap.to(reveal, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' });
            const r = scene.getBoundingClientRect();
            const originY = Math.min(0.85, Math.max(0.15, (r.top + r.height * 0.42) / window.innerHeight));
            goldBurst(originY, 1.2);
        };

        if (prefersReducedMotion()) {
            [left, right, cinch].forEach((el) => { if (el) el.style.strokeDashoffset = '0'; });
            tieOff();
            return undefined;
        }

        const st = ScrollTrigger.create({
            trigger: scene,
            start: 'top 80%',
            end: 'bottom 75%',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                // Strands weave first (0 → 0.78), then the knot cinches (0.78 → 1).
                const strandP = Math.min(1, p / 0.78);
                left.style.strokeDashoffset = `${lLen * (1 - strandP)}`;
                right.style.strokeDashoffset = `${rLen * (1 - strandP)}`;
                if (cinch) {
                    const cinchP = Math.max(0, (p - 0.7) / 0.3);
                    cinch.style.strokeDashoffset = `${cLen * (1 - Math.min(1, cinchP))}`;
                }
                if (p > 0.96) tieOff();
            },
        });

        return () => st.kill();
    }, []);

    return (
        <section ref={sceneRef} className="filigree-scene filigree-knot">
            <p className="filigree-knot__label">And so, we</p>
            <h2 className="filigree-knot__title filigree-goldtext">tie the knot</h2>

            <div className="filigree-knot__art">
                <svg viewBox="0 0 360 280" fill="none" aria-hidden="true">
                    {/* left strand: loop + tail */}
                    <path
                        ref={strandLRef}
                        d="M180 120 C150 66 92 74 92 118 C92 162 150 172 180 120 M180 120 C170 162 156 200 142 244"
                        stroke={G}
                        strokeWidth="2.1"
                        strokeLinecap="round"
                    />
                    {/* right strand: loop + tail */}
                    <path
                        ref={strandRRef}
                        d="M180 120 C210 66 268 74 268 118 C268 162 210 172 180 120 M180 120 C190 162 204 200 218 244"
                        stroke={G}
                        strokeWidth="2.1"
                        strokeLinecap="round"
                    />
                    {/* the cinch at the heart of the knot */}
                    <path
                        ref={cinchRef}
                        d="M164 120 C164 104 196 104 196 120 C196 136 164 136 164 120 Z"
                        stroke="var(--fil-gold-bright)"
                        strokeWidth="1.6"
                    />
                </svg>
            </div>

            <div ref={revealRef} className="filigree-knot__reveal">
                <p className="filigree-knot__couple">{bride} &amp; {groom}</p>
                <p className="filigree-knot__date">{month} {day}, {year}</p>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   8 · RSVP
   ════════════════════════════════════════════════════════════════════ */
export function FiligreeRSVP({ guestName, initialStatus, onSubmit, isDemo }) {
    const sceneRef = useRef(null);
    const [status, setStatus] = useState(initialStatus);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.filigree-rsvp__reveal',
                { opacity: 0, y: 32 },
                {
                    opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 76%' },
                });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    async function respond(next) {
        if (submitting) return;
        setSubmitting(true);
        try {
            if (isDemo) {
                await new Promise((r) => setTimeout(r, 600));
            } else {
                await onSubmit(next);
            }
            setStatus(next);
            if (next === 'attending') goldBurst(0.55, 1.4);
        } finally {
            setSubmitting(false);
        }
    }

    if (status) {
        const attending = status === 'attending';
        return (
            <section ref={sceneRef} className="filigree-scene filigree-rsvp">
                <div className="filigree-rsvp__done">
                    <span className="filigree-rsvp__crest" aria-hidden="true">{attending ? '✦' : '✧'}</span>
                    <h2 className="filigree-rsvp__done-title filigree-goldtext">
                        {attending ? 'Your yes completes the knot' : 'Thank you, dear friend'}
                    </h2>
                    <p className="filigree-rsvp__done-text">
                        {attending
                            ? `We cannot wait to celebrate with you, ${guestName}. Until then, every stitch of this day is woven with your name in it.`
                            : `We understand, ${guestName}. You will be held close in our hearts on the day, thread and all.`}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section ref={sceneRef} className="filigree-scene filigree-rsvp">
            <p className="filigree-rsvp__label filigree-rsvp__reveal">An invitation to {guestName}</p>
            <h2 className="filigree-rsvp__title filigree-rsvp__reveal filigree-goldtext">Will you witness our knot?</h2>
            <p className="filigree-rsvp__sub filigree-rsvp__reveal">Your reply is the final thread.</p>
            <div className="filigree-rsvp__actions filigree-rsvp__reveal">
                <button type="button" className="filigree-btn filigree-btn--solid" disabled={submitting} onClick={() => respond('attending')}>
                    Joyfully, yes
                </button>
                <button type="button" className="filigree-btn filigree-btn--ghost" disabled={submitting} onClick={() => respond('declined')}>
                    With love, I cannot
                </button>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════════════
   9 · Closing sign-off
   ════════════════════════════════════════════════════════════════════ */
export function FiligreeClosing({ bride, groom }) {
    const sceneRef = useRef(null);
    const knotRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sceneRef.current,
                start: 'top 72%',
                once: true,
                onEnter: () => {
                    drawPath(knotRef.current, { duration: 1.6, ease: 'power2.inOut' });
                    gsap.fromTo('.filigree-closing__reveal', { opacity: 0, y: 22 },
                        { opacity: 1, y: 0, duration: 1.2, stagger: 0.18, ease: 'power3.out', delay: 0.3 });
                },
            });
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="filigree-scene filigree-closing">
            <svg className="filigree-closing__knot" viewBox="0 0 120 90" fill="none" aria-hidden="true">
                <path
                    ref={knotRef}
                    d="M60 30 C44 8 16 16 24 40 C30 58 54 52 60 30 C66 52 90 58 96 40 C104 16 76 8 60 30 M60 30 C56 52 50 66 44 84 M60 30 C64 52 70 66 76 84"
                    stroke={G}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />
            </svg>
            <p className="filigree-closing__with filigree-closing__reveal">With all our love,</p>
            <p className="filigree-closing__names filigree-closing__reveal">{bride} &amp; {groom}</p>
            <p className="filigree-closing__foot filigree-closing__reveal">Woven with love · Filigree</p>
        </section>
    );
}
