import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatEventTime } from '../../lib/formatWeddingDate';

gsap.registerPlugin(ScrollTrigger);

/* ─── Elegant clock face outline SVG ─── */
function ClockIcon() {
    return (
        <svg className="time-clock" width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12.5" stroke="var(--hero-gold)" strokeWidth="1" opacity="0.85" />
            <circle cx="14" cy="14" r="10.5" stroke="var(--hero-gold)" strokeWidth="0.5" opacity="0.3" />
            <line x1="14" y1="14" x2="14" y2="7" stroke="var(--hero-gold)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="14" y1="14" x2="20" y2="14" stroke="var(--hero-gold)" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="14" cy="14" r="1.2" fill="var(--hero-gold)" />
            <line x1="14" y1="3" x2="14" y2="5" stroke="var(--hero-gold)" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="25" y1="14" x2="23" y2="14" stroke="var(--hero-gold)" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="14" y1="25" x2="14" y2="23" stroke="var(--hero-gold)" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="3" y1="14" x2="5" y2="14" stroke="var(--hero-gold)" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
    );
}

/* ─── Top fleuron with a tapering rule + diamond ─── */
function TopFleuron() {
    return (
        <svg className="time-fleuron" width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden="true">
            <g stroke="var(--hero-gold)" strokeWidth="0.9" fill="none" strokeLinecap="round">
                <path d="M17 3 C13 7 13 11 17 15 C21 11 21 7 17 3 Z" />
                <line x1="6" y1="19" x2="28" y2="19" opacity="0.6" />
            </g>
            <circle cx="17" cy="9.5" r="1.4" fill="var(--hero-gold)" />
        </svg>
    );
}

/* ─── Tiny heart rule ─── */
function HeartRule() {
    return (
        <svg className="time-heart" width="120" height="18" viewBox="0 0 120 18" fill="none" aria-hidden="true">
            <path
                d="M60 6 C58.5 3 54 3 54 7 C54 10 60 13 60 13 C60 13 66 10 66 7 C66 3 61.5 3 60 6 Z"
                stroke="var(--hero-gold)"
                strokeWidth="0.9"
                fill="none"
            />
            <line x1="14" y1="9" x2="50" y2="9" stroke="var(--hero-gold)" strokeWidth="0.7" opacity="0.45" strokeLinecap="round" />
            <line x1="70" y1="9" x2="106" y2="9" stroke="var(--hero-gold)" strokeWidth="0.7" opacity="0.45" strokeLinecap="round" />
        </svg>
    );
}

/* ─── Bottom flourish ─── */
function BottomFlourish() {
    return (
        <svg className="time-flourish" width="150" height="22" viewBox="0 0 150 22" fill="none" aria-hidden="true">
            <g stroke="var(--hero-gold)" strokeWidth="1" fill="none" strokeLinecap="round">
                <path d="M75 11 C60 4 45 4 40 11 C36 16 44 18 48 13" opacity="0.7" />
                <path d="M75 11 C90 4 105 4 110 11 C114 16 106 18 102 13" opacity="0.7" />
                <path d="M68 11 L75 5 L82 11 L75 17 Z" opacity="0.85" />
            </g>
            <circle cx="75" cy="11" r="1.4" fill="var(--hero-gold)" />
        </svg>
    );
}

export default function WeddingTime({ eventTime, thanks = 'We would be honored by your presence' }) {
    const sceneRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sceneRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.fromTo('.time-fleuron', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 0)
                .fromTo('.time-label', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1 }, 0.2)
                .fromTo('.time-display', { opacity: 0, y: 26, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.1 }, 0.5)
                .fromTo('.time-clock', { opacity: 0, rotation: -90 }, { opacity: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.4)' }, 0.7)
                .fromTo('.time-heart', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.1)
                .fromTo('.time-thanks', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 1.3)
                .fromTo('.time-flourish', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.6)
                .call(() => sceneRef.current?.querySelector('.time-display')?.classList.add('time-glow'), null, 1.9);
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene time-scene velvet-section">
            <TopFleuron />

            <p className="time-label">The Ceremony Begins</p>

            <div className="time-display">
                <span className="time-icon">
                    <ClockIcon />
                </span>
                <p className="time-value">{formatEventTime(eventTime)}</p>
            </div>

            <HeartRule />

            {thanks && <p className="time-thanks">{thanks}</p>}

            <BottomFlourish />
        </section>
    );
}
