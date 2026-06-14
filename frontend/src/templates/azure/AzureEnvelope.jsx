import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import leftHalf from '../../../assets/envelope2.png';
import rightHalf from '../../../assets/ebvelope.png';

const reduceMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * AzureEnvelope — small-screen opening cover. Two envelope halves sit flush
 * in the centre; one tap splits them (left flies left, right flies right) and
 * the invitation begins.
 */
export default function AzureEnvelope({ onStart, onComplete }) {
    const rootRef = useRef(null);
    const [opening, setOpening] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (reduceMotion()) {
                gsap.set(['.azure-env__half', '.azure-env__hint'], { opacity: 1, x: 0 });
                return;
            }
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });
            tl.fromTo('.azure-env__half--left', { xPercent: -18, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1 }, 0)
                .fromTo('.azure-env__half--right', { xPercent: 18, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1 }, 0)
                .fromTo('.azure-env__hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6);

            gsap.to('.azure-env__stage', { y: -6, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    function open() {
        if (opening) return;
        setOpening(true);
        onStart?.();
        if (reduceMotion()) { onComplete?.(); return; }

        const tl = gsap.timeline({ onComplete });
        tl.to('.azure-env__hint', { opacity: 0, y: -8, duration: 0.3 })
            .to('.azure-env__half--left', { xPercent: -150, rotation: -10, opacity: 0, duration: 1, ease: 'power3.inOut' }, 0)
            .to('.azure-env__half--right', { xPercent: 150, rotation: 10, opacity: 0, duration: 1, ease: 'power3.inOut' }, 0)
            .to(rootRef.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.35');
    }

    return (
        <div
            ref={rootRef}
            className="azure-env"
            role="button"
            tabIndex={0}
            aria-label="Tap to open the invitation"
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(); }}
        >
            <div className="azure-env__stage">
                <img className="azure-env__half azure-env__half--left" src={leftHalf} alt="" aria-hidden="true" />
                <img className="azure-env__half azure-env__half--right" src={rightHalf} alt="" aria-hidden="true" />
            </div>
            <p className="azure-env__hint">Tap to open</p>
        </div>
    );
}
