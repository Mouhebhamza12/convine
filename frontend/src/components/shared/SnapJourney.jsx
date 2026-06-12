import { useEffect, useRef, useState } from 'react';
import '../../css/snap.css';

const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * SnapJourney — turns a template's existing `<main className="invitation-story">`
 * into a cinematic one-section-per-gesture journey WITHOUT breaking the
 * scroll-driven animations the templates already use.
 *
 * It keeps the real document scroll (so GSAP ScrollTrigger keeps firing) but
 * intercepts wheel / trackpad / touch / keyboard input and performs a single
 * eased scroll to the next or previous `<section>`, locking input for the
 * duration so momentum can never skip a slide. Decorative dividers and
 * backgrounds (non-`<section>` children) are passed over, never rested on.
 *
 * Honours prefers-reduced-motion (instant jumps).
 */
export default function SnapJourney({
    children,
    className = '',
    enabled = true,
    duration = 850,
    accent,
    extraClass = '',
    rsvpIndex,
    rsvpLabel = 'RSVP',
}) {
    const ref = useRef(null);
    const goToRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!enabled) return undefined;
        const main = ref.current;
        if (!main) return undefined;
        const reduce = prefersReduced();
        const html = document.documentElement;
        html.classList.add('snap-active');

        const sectionsOf = () => Array.from(main.querySelectorAll(':scope > section'));
        const topOf = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);

        let locked = false;
        let raf = null;

        const nearestIndex = () => {
            const secs = sectionsOf();
            const y = window.scrollY;
            let best = 0;
            let bestD = Infinity;
            secs.forEach((s, i) => {
                const d = Math.abs(topOf(s) - y);
                if (d < bestD) {
                    bestD = d;
                    best = i;
                }
            });
            return best;
        };

        const animateTo = (targetY) =>
            new Promise((resolve) => {
                const startY = window.scrollY;
                const dist = targetY - startY;
                if (reduce || Math.abs(dist) < 2) {
                    window.scrollTo(0, targetY);
                    resolve();
                    return;
                }
                const t0 = performance.now();
                // easeInOutCubic — settled, intentional, never bouncy
                const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
                const step = (now) => {
                    const t = Math.min(1, (now - t0) / duration);
                    window.scrollTo(0, Math.round(startY + dist * ease(t)));
                    if (t < 1) raf = requestAnimationFrame(step);
                    else resolve();
                };
                raf = requestAnimationFrame(step);
            });

        const goTo = async (target) => {
            if (locked) return;
            const secs = sectionsOf();
            const next = Math.max(0, Math.min(secs.length - 1, target));
            const current = nearestIndex();
            if (next === current && Math.abs(topOf(secs[next]) - window.scrollY) < 4) return;
            locked = true;
            setIndex(next);
            await animateTo(topOf(secs[next]));
            window.setTimeout(() => {
                locked = false;
            }, reduce ? 40 : 110);
        };

        const step = (dir) => {
            if (locked) return;
            goTo(nearestIndex() + dir);
        };

        const onWheel = (e) => {
            if (Math.abs(e.deltaY) < 6) return;
            e.preventDefault();
            if (!locked) step(e.deltaY > 0 ? 1 : -1);
        };

        const onKey = (e) => {
            const t = e.target;
            const tag = t && t.tagName;
            const typing = t && (t.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');
            const spaceOnControl = (e.key === ' ' || e.key === 'Spacebar') && (tag === 'BUTTON' || tag === 'A');
            if (typing || spaceOnControl) return;
            if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) {
                e.preventDefault();
                step(1);
            } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
                e.preventDefault();
                step(-1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                goTo(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                goTo(sectionsOf().length - 1);
            }
        };

        let sy = 0;
        let sx = 0;
        let tracking = false;
        const onTouchStart = (e) => {
            const tch = e.touches[0];
            sy = tch.clientY;
            sx = tch.clientX;
            tracking = true;
        };
        const onTouchMove = (e) => {
            if (tracking) e.preventDefault();
        };
        const onTouchEnd = (e) => {
            if (!tracking) return;
            tracking = false;
            const tch = e.changedTouches[0];
            const dy = sy - tch.clientY;
            const dx = sx - tch.clientX;
            if (Math.abs(dy) > 46 && Math.abs(dy) > Math.abs(dx)) step(dy > 0 ? 1 : -1);
        };

        const onResize = () => {
            const secs = sectionsOf();
            if (secs[index]) window.scrollTo(0, topOf(secs[index]));
        };

        goToRef.current = goTo;
        setCount(sectionsOf().length);
        window.scrollTo(0, 0);
        setIndex(0);

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKey);
        main.addEventListener('touchstart', onTouchStart, { passive: true });
        main.addEventListener('touchmove', onTouchMove, { passive: false });
        main.addEventListener('touchend', onTouchEnd);
        window.addEventListener('resize', onResize);

        return () => {
            html.classList.remove('snap-active');
            goToRef.current = null;
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKey);
            main.removeEventListener('touchstart', onTouchStart);
            main.removeEventListener('touchmove', onTouchMove);
            main.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('resize', onResize);
            if (raf) cancelAnimationFrame(raf);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, duration]);

    const jump = (i) => {
        if (goToRef.current) goToRef.current(i);
    };

    const accentStyle = accent ? { '--snap-accent': accent } : undefined;
    const showRsvp = enabled && typeof rsvpIndex === 'number' && rsvpIndex >= 0 && rsvpIndex < count && index !== rsvpIndex;

    return (
        <>
            <main ref={ref} className={`invitation-story snap-journey ${extraClass} ${className}`.trim()}>
                {children}
            </main>

            {enabled && count > 1 && (
                <nav className="snap-dots" aria-label="Navigation" style={accentStyle}>
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            type="button"
                            className={`snap-dot${i === index ? ' is-on' : ''}`}
                            aria-label={`Section ${i + 1}`}
                            aria-current={i === index ? 'true' : undefined}
                            onClick={() => jump(i)}
                        />
                    ))}
                </nav>
            )}

            {showRsvp && (
                <button type="button" className="snap-rsvp" style={accentStyle} onClick={() => jump(rsvpIndex)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 21c-.3 0-.5-.1-.7-.3C6.9 16.8 4 14.1 4 10.8 4 8.2 6 6.2 8.5 6.2c1.4 0 2.7.65 3.5 1.7.8-1.05 2.1-1.7 3.5-1.7C18 6.2 20 8.2 20 10.8c0 3.3-2.9 6-7.3 9.9-.2.2-.4.3-.7.3z" />
                    </svg>
                    <span>{rsvpLabel}</span>
                </button>
            )}
        </>
    );
}
