import { Children, useCallback, useEffect, useRef, useState } from 'react';
import '../../css/fullpage.css';

const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * FullPageScroller — a cinematic one-section-per-gesture pager.
 *
 * Each child becomes a 100svh slide. A single wheel notch, trackpad gesture,
 * touch swipe, arrow / PageUp-Down / Space / Home / End press advances exactly
 * one section. Input is locked for the duration of each transition so momentum
 * scrolling can never skip a slide. Honours prefers-reduced-motion.
 *
 * Sections reveal their content on activation: any descendant carrying the
 * `.fp-reveal` class fades + lifts in, staggered in DOM order. Decorative
 * pieces marked `.fp-reveal--slow` drift a touch further/slower for parallax.
 */
export default function FullPageScroller({
    children,
    className = '',
    duration = 900,
    labels = [],
    rtl = false,
    onIndexChange,
    rsvpIndex,
    rsvpLabel = 'RSVP',
}) {
    const slides = Children.toArray(children);
    const count = slides.length;
    const [index, setIndex] = useState(0);
    const [reduceMotion] = useState(prefersReduced);
    const indexRef = useRef(0);
    const lockRef = useRef(false);
    const rootRef = useRef(null);

    const go = useCallback(
        (target) => {
            const next = Math.max(0, Math.min(count - 1, target));
            if (next === indexRef.current || lockRef.current) return;
            lockRef.current = true;
            indexRef.current = next;
            setIndex(next);
            if (onIndexChange) onIndexChange(next);
            window.setTimeout(
                () => {
                    lockRef.current = false;
                },
                reduceMotion ? 80 : duration + 160,
            );
        },
        [count, duration, reduceMotion, onIndexChange],
    );

    // Assign staggered reveal delays once, in DOM order, per section.
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        root.querySelectorAll('.fp-section').forEach((sec) => {
            sec.querySelectorAll('.fp-reveal').forEach((el, i) => {
                el.style.setProperty('--fp-d', `${i * 85}ms`);
            });
        });
    }, [count]);

    // Input handling: wheel, keyboard, touch.
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const onWheel = (e) => {
            if (Math.abs(e.deltaY) < 6) return;
            e.preventDefault();
            if (lockRef.current) return;
            go(indexRef.current + (e.deltaY > 0 ? 1 : -1));
        };

        const onKey = (e) => {
            const t = e.target;
            const tag = t && t.tagName;
            const typing = t && (t.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');
            const spaceOnControl = (e.key === ' ' || e.key === 'Spacebar') && (tag === 'BUTTON' || tag === 'A');
            if (typing || spaceOnControl) return;
            if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) {
                e.preventDefault();
                go(indexRef.current + 1);
            } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
                e.preventDefault();
                go(indexRef.current - 1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                go(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                go(count - 1);
            }
        };

        let startY = 0;
        let startX = 0;
        let tracking = false;
        const onTouchStart = (e) => {
            const tch = e.touches[0];
            startY = tch.clientY;
            startX = tch.clientX;
            tracking = true;
        };
        const onTouchMove = (e) => {
            if (tracking) e.preventDefault();
        };
        const onTouchEnd = (e) => {
            if (!tracking) return;
            tracking = false;
            const tch = e.changedTouches[0];
            const dy = startY - tch.clientY;
            const dx = startX - tch.clientX;
            if (Math.abs(dy) > 46 && Math.abs(dy) > Math.abs(dx)) {
                go(indexRef.current + (dy > 0 ? 1 : -1));
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKey);
        root.addEventListener('touchstart', onTouchStart, { passive: true });
        root.addEventListener('touchmove', onTouchMove, { passive: false });
        root.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKey);
            root.removeEventListener('touchstart', onTouchStart);
            root.removeEventListener('touchmove', onTouchMove);
            root.removeEventListener('touchend', onTouchEnd);
        };
    }, [go, count]);

    return (
        <div ref={rootRef} className={`fp-root ${className}`.trim()}>
            <div
                className="fp-track"
                style={{ '--fp-i': index, transitionDuration: reduceMotion ? '0ms' : `${duration}ms` }}
            >
                {slides.map((child, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className={`fp-section${i === index ? ' is-active' : ''}`} aria-hidden={i === index ? undefined : true}>
                        {child}
                    </div>
                ))}
            </div>

            <nav className={`fp-dots${rtl ? ' fp-dots--rtl' : ''}`} aria-label="Navigation">
                {slides.map((_, i) => (
                    <button
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        type="button"
                        className={`fp-dot${i === index ? ' is-on' : ''}`}
                        aria-label={labels[i] || `Section ${i + 1}`}
                        aria-current={i === index ? 'true' : undefined}
                        onClick={() => go(i)}
                    />
                ))}
            </nav>

            {typeof rsvpIndex === 'number' && rsvpIndex >= 0 && rsvpIndex < count && index !== rsvpIndex && (
                <button type="button" className={`fp-rsvp${rtl ? ' fp-rsvp--rtl' : ''}`} onClick={() => go(rsvpIndex)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 21c-.3 0-.5-.1-.7-.3C6.9 16.8 4 14.1 4 10.8 4 8.2 6 6.2 8.5 6.2c1.4 0 2.7.65 3.5 1.7.8-1.05 2.1-1.7 3.5-1.7C18 6.2 20 8.2 20 10.8c0 3.3-2.9 6-7.3 9.9-.2.2-.4.3-.7.3z" />
                    </svg>
                    <span>{rsvpLabel}</span>
                </button>
            )}
        </div>
    );
}
