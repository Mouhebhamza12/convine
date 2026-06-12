import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Portal, PortalGlow, DoorLeaf, ZelligeBand, JasmineSprig } from './DarArt';

/**
 * DarOpening: a whitewashed wall, a voussoir arch, a studded Casbah door.
 * The guest knocks; the leaves swing inward onto lantern light.
 */
export default function DarOpening({ onComplete, strings }) {
    const rootRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const [opening, setOpening] = useState(false);

    useEffect(() => {
        gsap.fromTo(
            '.dar-open__fade',
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.2 },
        );
    }, []);

    function knock() {
        if (opening) return;
        setOpening(true);
        const tl = gsap.timeline({ onComplete });
        // a small knock shudder, then the leaves swing inward
        tl.to([leftRef.current, rightRef.current], { x: '+=2', yoyo: true, repeat: 3, duration: 0.05, ease: 'none' })
            .to(leftRef.current, { rotateY: -98, duration: 1.5, ease: 'power3.inOut' }, 0.3)
            .to(rightRef.current, { rotateY: 98, duration: 1.5, ease: 'power3.inOut' }, 0.3)
            .to('.dar-open__light', { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.55)
            .to(rootRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 1.5);
    }

    return (
        <div
            ref={rootRef}
            className="dar-open"
            onClick={knock}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && knock()}
            aria-label={strings.opening.hint}
        >
            <ZelligeBand className="dar-open__fade dar-open__band" />
            <p className="dar-open__fade dar-open__eyebrow">{strings.opening.eyebrow}</p>
            <h1 className="dar-open__fade dar-open__title">{strings.opening.title}</h1>

            <div className="dar-open__fade dar-open__scene">
                <JasmineSprig className="dar-open__jasmine dar-open__jasmine--l" flip />
                <JasmineSprig className="dar-open__jasmine dar-open__jasmine--r" />
                <Portal className="dar-open__portal" />
                {/* lantern light behind the leaves */}
                <div className="dar-open__light" aria-hidden="true">
                    <PortalGlow />
                </div>
                {/* the two leaves */}
                <div className="dar-open__doors" aria-hidden="true">
                    <div ref={leftRef} className="dar-open__leaf dar-open__leaf--l">
                        <DoorLeaf side="left" className="dar-open__leafsvg" />
                    </div>
                    <div ref={rightRef} className="dar-open__leaf dar-open__leaf--r">
                        <DoorLeaf side="right" className="dar-open__leafsvg" />
                    </div>
                </div>
            </div>

            <p className="dar-open__fade dar-open__hint">{strings.opening.hint}</p>
        </div>
    );
}
