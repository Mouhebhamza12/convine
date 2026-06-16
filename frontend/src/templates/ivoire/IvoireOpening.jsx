import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { IvoireMonogram } from './IvoireArt';
import { joinNames, monogramLetters } from './IvoireStrings';
import bg from '../../../assets/ivoire/bg.jpg';
import seal from '../../../assets/ivoire/seal.png';

/**
 * IvoireOpening — the cover: an embossed ivory-floral field with a gilded
 * blush cameo sitting dead-centre. The couple's initials are engraved into the
 * plate in Arabic calligraphy; their names are inscribed beneath like letters
 * cut into stone. Everything is the two provided images plus real vector
 * lettering — the page draws no ornament.
 */
export default function IvoireOpening({ bride = 'Amina', groom = 'Yacine', isDemo = false, onComplete }) {
    const rootRef = useRef(null);
    const sealRef = useRef(null);
    const namesRef = useRef(null);
    const openedRef = useRef(false);

    const names = joinNames(bride, groom);
    const mono = monogramLetters(bride, groom, { demo: isDemo });

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return undefined;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.from(rootRef.current, { opacity: 0, duration: 1.1, ease: 'power2.out' })
                .from(sealRef.current, { opacity: 0, scale: 0.86, duration: 1.3, ease: 'power3.out' }, 0.25)
                .from(namesRef.current, { opacity: 0, y: 14, duration: 1.1, ease: 'power2.out' }, '-=0.7');
        }, rootRef);

        return () => ctx.revert();
    }, []);

    function open() {
        if (openedRef.current || !onComplete) return;
        openedRef.current = true;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { onComplete(); return; }
        // Drive the reveal with the timeline, but fire onComplete from an
        // independent timer so the hand-off never depends on the tween callback.
        if (rootRef.current) rootRef.current.style.pointerEvents = 'none';
        gsap.to(sealRef.current, { scale: 1.06, duration: 0.55, ease: 'power2.out' });
        gsap.to(rootRef.current, { opacity: 0, duration: 0.85, ease: 'power2.inOut', delay: 0.12 });
        window.setTimeout(onComplete, 900);
    }

    return (
        <div
            ref={rootRef}
            className={`iv-cover${names.arabic ? ' iv-cover--ar' : ''}`}
            style={{ backgroundImage: `url(${bg})` }}
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            role={onComplete ? 'button' : undefined}
            tabIndex={onComplete ? 0 : undefined}
            onKeyDown={(e) => e.key === 'Enter' && open()}
            aria-label={onComplete ? 'Open invitation' : undefined}
        >
            {/* sized to the seal alone (names are positioned out of flow), so the
               cameo lands exactly in the centre of the screen */}
            <div className="iv-cover__center">
                <div ref={sealRef} className="iv-seal">
                    <img src={seal} alt="" className="iv-seal__plate" />
                    <div className="iv-seal__mono">
                        <IvoireMonogram letters={mono.letters} arabic={mono.arabic} className="iv-mono" />
                    </div>
                </div>

                <p ref={namesRef} className="iv-names" dir={names.arabic ? 'rtl' : 'ltr'}>
                    <span className="iv-names__name">{bride}</span>
                    <span className="iv-names__amp">{names.and}</span>
                    <span className="iv-names__name">{groom}</span>
                </p>
            </div>
        </div>
    );
}
