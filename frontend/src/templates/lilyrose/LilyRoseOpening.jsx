import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Lily, Rose, Bud, Leaf } from './Botanicals';
import { prefersReducedMotion } from './useBloom';

/**
 * The Threshold — a garden at first light. A closed composition of lily and
 * roses blooms open and the couple's names rise from within. One tap parts
 * the bouquet and carries the guest into the story.
 */
export default function LilyRoseOpening({ bride, groom, onComplete }) {
    const rootRef = useRef(null);
    const [opening, setOpening] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (prefersReducedMotion()) {
                gsap.set(['.lr-open__bouquet', '.lr-open__glow', '.lr-open__eyebrow', '.lr-open__names', '.lr-open__hint'],
                    { opacity: 1, scale: 1, y: 0 });
                gsap.set('.lr-open__bouquet .lr-petal', { opacity: 1 });
                return;
            }

            const tl = gsap.timeline({ delay: 0.3 });
            tl.fromTo('.lr-open__glow', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
                .fromTo('.lr-open__bouquet', { opacity: 0, scale: 0.82, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 1.9, ease: 'power3.out' }, 0.1)
                .fromTo('.lr-open__bouquet .lr-petal', { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power2.out', stagger: { each: 0.022, from: 'center' } }, 0.35)
                .fromTo('.lr-open__eyebrow', { opacity: 0, y: 16 }, { opacity: 0.9, y: 0, duration: 1.0, ease: 'power2.out' }, '-=1.0')
                .fromTo('.lr-open__names', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.7')
                .fromTo('.lr-open__hint', { opacity: 0, y: 10 }, { opacity: 0.75, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5');

            // The garden breathes.
            gsap.to('.lr-open__bouquet', { rotation: 1.1, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 80%' });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    function open() {
        if (opening) return;
        setOpening(true);

        if (prefersReducedMotion()) { onComplete?.(); return; }

        const tl = gsap.timeline({ onComplete });
        tl.to('.lr-open__hint', { opacity: 0, y: -8, duration: 0.4 })
            .to('.lr-open__bouquet', { y: -34, scale: 1.1, opacity: 0, duration: 1.15, ease: 'power2.in' }, '<')
            .to(['.lr-open__eyebrow', '.lr-open__names'], { y: -16, opacity: 0, duration: 0.7, ease: 'power2.in' }, '<0.08')
            .to('.lr-open__glow', { opacity: 0, scale: 1.35, duration: 0.95, ease: 'power2.out' }, '<')
            .to(rootRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.35');
    }

    return (
        <div
            ref={rootRef}
            className="lr-open"
            role="button"
            tabIndex={0}
            aria-label="Tap to enter the garden"
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(); }}
        >
            <div className="lr-open__glow" aria-hidden="true" />

            <div className="lr-open__bouquet" aria-hidden="true">
                <Leaf size={68} rotate={-44} className="lr-open__el" style={{ left: '2%', top: '30%' }} />
                <Leaf size={58} rotate={40} className="lr-open__el" style={{ right: '3%', top: '34%' }} />
                <Leaf size={48} rotate={8} className="lr-open__el" style={{ left: '20%', top: '6%' }} />
                <Bud size={42} variant="blush" className="lr-open__el" style={{ left: '6%', top: '8%' }} />
                <Bud size={40} variant="rose" className="lr-open__el" style={{ right: '8%', top: '5%' }} />
                <Lily size={150} className="lr-open__el lr-open__lily" style={{ left: '50%', top: '20%', transform: 'translateX(-50%)' }} />
                <Rose size={84} variant="rose" className="lr-open__el" style={{ left: '12%', top: '52%' }} />
                <Rose size={72} variant="cream" className="lr-open__el" style={{ right: '12%', top: '56%' }} />
                <Rose size={54} variant="blush" className="lr-open__el" style={{ left: '50%', top: '64%', transform: 'translateX(-50%)' }} />
            </div>

            <p className="lr-open__eyebrow">The Wedding Of</p>
            <h1 className="lr-open__names">{bride} <span className="lr-open__amp">&amp;</span> {groom}</h1>
            <p className="lr-open__hint">
                <span className="lr-open__hint-rule" />
                Tap to enter the garden
                <span className="lr-open__hint-rule" />
            </p>
        </div>
    );
}
