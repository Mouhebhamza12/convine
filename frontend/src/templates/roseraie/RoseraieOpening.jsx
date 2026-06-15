import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import topLayer from '../../../assets/Layer_0.png';
import bottomLayer from '../../../assets/Layer_0_copy.png';

/**
 * RoseraieOpening — the couture reveal, image-only.
 *
 * The two provided botanical panels meet at a wax-sealed seam. On tap the
 * upper panel lifts away, the lower panel sinks, and the field dissolves to
 * present the invitation already mounted behind. No text, no drawn effects.
 * Fires `onComplete` once the cover has finished and can unmount.
 */
export default function RoseraieOpening({ onComplete }) {
    const rootRef = useRef(null);
    const topRef = useRef(null);
    const bottomRef = useRef(null);
    const openedRef = useRef(false);

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return undefined;
        const tw = gsap.from([topRef.current, bottomRef.current], { opacity: 0, duration: 1.1, ease: 'power2.out' });
        return () => tw.kill();
    }, []);

    function open() {
        if (openedRef.current) return;
        openedRef.current = true;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            gsap.to(rootRef.current, { opacity: 0, duration: 0.4, onComplete });
            return;
        }
        const tl = gsap.timeline({ onComplete });
        tl.to(topRef.current, { yPercent: -118, duration: 1.55, ease: 'expo.inOut' }, 0)
            .to(bottomRef.current, { yPercent: 118, duration: 1.55, ease: 'expo.inOut' }, 0.05)
            .to(rootRef.current, { opacity: 0, duration: 0.85, ease: 'power2.inOut' }, 0.9)
            .set(rootRef.current, { pointerEvents: 'none' });
    }

    return (
        <div
            ref={rootRef}
            className="ro-cover"
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && open()}
            aria-label="Open invitation"
        >
            <div className="ro-cover__case">
                <img ref={topRef} src={topLayer} alt="" className="ro-cover__panel ro-cover__panel--top" />
                <img ref={bottomRef} src={bottomLayer} alt="" className="ro-cover__panel ro-cover__panel--bottom" />
            </div>
        </div>
    );
}
