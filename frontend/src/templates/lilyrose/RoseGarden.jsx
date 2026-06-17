import { useEffect, useRef } from 'react';
import { Rose, Leaf } from './Botanicals';
import { prefersReducedMotion } from './useBloom';

/**
 * A soft garden of roses set deep behind the story — large blooms peeking in
 * from the margins at low opacity. They drift and turn gently as the guest
 * scrolls (bounded parallax, so a bloom is always present and never sails off
 * screen), with a barely-there idle sway so the page never feels static.
 */
const ITEMS = [
    { k: 'rose', v: 'rose', size: 240, css: { top: '-6%', left: '-9%' }, range: 70, spin: 10, phase: 0.0 },
    { k: 'leaf', size: 152, css: { top: '7%', right: '-7%' }, range: -94, spin: -16, phase: 1.1 },
    { k: 'rose', v: 'cream', size: 206, css: { top: '28%', right: '-9%' }, range: 112, spin: 12, phase: 2.2 },
    { k: 'rose', v: 'blush', size: 186, css: { top: '45%', left: '-8%' }, range: -82, spin: -10, phase: 3.0 },
    { k: 'leaf', size: 132, css: { top: '63%', left: '-6%' }, range: 96, spin: 14, phase: 0.6 },
    { k: 'rose', v: 'rose', size: 214, css: { top: '70%', right: '-10%' }, range: -104, spin: -11, phase: 4.1 },
    { k: 'rose', v: 'cream', size: 178, css: { bottom: '-7%', left: '-7%' }, range: 80, spin: 9, phase: 5.0 },
];

export default function RoseGarden({ enabled = true }) {
    const itemRefs = useRef([]);

    useEffect(() => {
        if (!enabled) return undefined;
        const reduced = prefersReducedMotion();

        const apply = (cur, t) => {
            for (let i = 0; i < ITEMS.length; i += 1) {
                const el = itemRefs.current[i];
                if (!el) continue;
                const it = ITEMS[i];
                const idle = reduced ? 0 : Math.sin(t * 0.0004 + it.phase);
                const y = (cur - 0.5) * it.range + idle * 5;
                const rot = (cur - 0.5) * it.spin + idle * 1.3;
                el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
            }
        };

        if (reduced) { apply(0.5, 0); return undefined; }

        let raf = 0;
        let cur = 0.5;
        const loop = (now) => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0.5;
            cur += (target - cur) * 0.08; // ease toward the scroll position
            apply(cur, now);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [enabled]);

    return (
        <div className="lr-rosebg" aria-hidden="true">
            {ITEMS.map((it, i) => (
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    className="lr-rosebg__item"
                    style={it.css}
                >
                    {it.k === 'rose' ? <Rose size={it.size} variant={it.v} /> : <Leaf size={it.size} />}
                </div>
            ))}
        </div>
    );
}
