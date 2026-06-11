import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { drawPath, prefersReducedMotion } from './useThreadDraw';

const G = 'var(--fil-gold)';

/**
 * The Threshold. A single thread descends from the dark, stitches an oval
 * cartouche around the couple's monogram and ties off in a small knot.
 * One tap "cinches" the thread and dissolves the cover into the story.
 */
export default function FiligreeOpening({ bride, groom, onComplete }) {
    const rootRef = useRef(null);
    const threadRef = useRef(null);
    const ovalRef = useRef(null);
    const ovalInnerRef = useRef(null);
    const knotRef = useRef(null);
    const monogramRef = useRef(null);
    const initialsRef = useRef(null);
    const eyebrowRef = useRef(null);
    const hintRef = useRef(null);
    const sweepRef = useRef(null);
    const [opening, setOpening] = useState(false);

    const brideInitial = (bride || 'A').trim().charAt(0).toUpperCase();
    const groomInitial = (groom || 'Y').trim().charAt(0).toUpperCase();

    // Intro: stitch the cartouche together.
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (prefersReducedMotion()) {
                gsap.set([threadRef.current, ovalRef.current, ovalInnerRef.current, knotRef.current],
                    { strokeDashoffset: 0 });
                gsap.set([eyebrowRef.current, initialsRef.current, hintRef.current], { opacity: 1, y: 0 });
                return;
            }

            gsap.set([eyebrowRef.current, hintRef.current], { opacity: 0, y: 12 });
            gsap.set(initialsRef.current, { opacity: 0, scale: 0.82, y: 6 });

            const tl = gsap.timeline({ delay: 0.35 });
            tl.add(drawPath(threadRef.current, { duration: 0.95, ease: 'power2.in' }))
                .to(eyebrowRef.current, { opacity: 0.85, y: 0, duration: 0.9, ease: 'power2.out' }, 0.2)
                .add(drawPath(ovalRef.current, { duration: 1.5, ease: 'power1.inOut' }), '-=0.35')
                .add(drawPath(ovalInnerRef.current, { duration: 1.3, ease: 'power1.inOut' }), '-=1.15')
                .add(drawPath(knotRef.current, { duration: 0.7, ease: 'power2.out' }), '-=0.4')
                .to(initialsRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'back.out(1.5)' }, '-=0.7')
                .to(hintRef.current, { opacity: 0.7, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5');

            // Breathing glow on the cartouche.
            gsap.to(monogramRef.current, {
                filter: 'drop-shadow(0 0 26px rgba(216,178,110,0.45))',
                duration: 2.6,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    function open() {
        if (opening) return;
        setOpening(true);

        if (prefersReducedMotion()) {
            onComplete?.();
            return;
        }

        const tl = gsap.timeline({ onComplete });
        // A breath inward — the knot cinches.
        tl.to(monogramRef.current, { scale: 0.97, duration: 0.5, ease: 'power2.in' })
            // The light sweep travels through the thread.
            .fromTo(sweepRef.current,
                { opacity: 0, scaleY: 0.2, transformOrigin: '50% 50%' },
                { opacity: 1, scaleY: 1, duration: 0.55, ease: 'power2.out' }, '-=0.2')
            // The whole cover lifts, brightens and dissolves upward.
            .to([eyebrowRef.current, hintRef.current], { opacity: 0, y: -16, duration: 0.5 }, '-=0.4')
            .to(monogramRef.current, { scale: 1.14, y: -26, opacity: 0, duration: 1.0, ease: 'power3.in' }, '-=0.25')
            .to(sweepRef.current, { opacity: 0, duration: 0.5 }, '-=0.3')
            .to(rootRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.5');
    }

    return (
        <div
            ref={rootRef}
            className="filigree-open"
            role="button"
            tabIndex={0}
            aria-label="Tap to open the invitation"
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(); }}
        >
            <div className="filigree-open__halo" aria-hidden="true" />

            <p ref={eyebrowRef} className="filigree-open__eyebrow">You are cordially invited</p>

            <div ref={monogramRef} className="filigree-open__monogram">
                <svg viewBox="0 0 240 300" fill="none" aria-hidden="true" className="filigree-open__svg">
                    {/* thread descending from the dark */}
                    <path
                        ref={threadRef}
                        d="M120 0 C118 30 122 58 120 86"
                        stroke={G}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    />
                    {/* outer cartouche */}
                    <path
                        ref={ovalRef}
                        d="M120 86 C160.9 86 194 124.5 194 172 C194 219.5 160.9 258 120 258 C79.1 258 46 219.5 46 172 C46 124.5 79.1 86 120 86 Z"
                        stroke={G}
                        strokeWidth="1.4"
                    />
                    {/* inner rule */}
                    <path
                        ref={ovalInnerRef}
                        d="M120 92 C157.6 92 188 127.8 188 172 C188 216.2 157.6 252 120 252 C82.4 252 52 216.2 52 172 C52 127.8 82.4 92 120 92 Z"
                        stroke={G}
                        strokeWidth="0.7"
                        opacity="0.55"
                    />
                    {/* the tie-off knot */}
                    <path
                        ref={knotRef}
                        d="M108 258 C100 249 102 268 120 263 C138 268 140 249 132 258"
                        stroke={G}
                        strokeWidth="1.3"
                        strokeLinecap="round"
                    />
                </svg>

                <div ref={initialsRef} className="filigree-open__initials">
                    <span>{brideInitial}</span>
                    <em>&amp;</em>
                    <span>{groomInitial}</span>
                </div>
            </div>

            <p ref={hintRef} className="filigree-open__hint">
                <span className="filigree-open__hint-rule" />
                Tap to open
                <span className="filigree-open__hint-rule" />
            </p>

            <div ref={sweepRef} className="filigree-open__sweep" aria-hidden="true" />
        </div>
    );
}
