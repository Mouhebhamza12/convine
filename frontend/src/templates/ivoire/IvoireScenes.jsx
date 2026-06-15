import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { IVOIRE_STRINGS, arabicDisplayName, initialOf, isArabicName, formatDots } from './IvoireStrings';
import hero from '../../../assets/ivoire/hero.jpg';

/**
 * IvoireHero — the first interior scene: the عقد قِران announcement set into
 * the dusty-rose plaster relief. The oval cameo carries the couple's cipher,
 * the date is engraved beneath the doves, and the announcement, the names in
 * Arabic calligraphy and the duʿāʾ are inscribed in the open field between the
 * relief above and the florals below. The relief is the provided image; all
 * lettering is engraved type.
 */
export function IvoireHero({ bride = 'Amina', groom = 'Yacine', eventDate, isDemo = false }) {
    const ref = useRef(null);

    const S = IVOIRE_STRINGS.hero;
    const initA = initialOf(bride);
    const initB = initialOf(groom);
    const initialsArabic = isArabicName(initA) || isArabicName(initB);
    // demo shows the couple in Arabic to match the calligraphic reference
    const brideAr = isDemo || isArabicName(bride) ? arabicDisplayName(bride) : bride;
    const groomAr = isDemo || isArabicName(groom) ? arabicDisplayName(groom) : groom;
    const dots = formatDots(eventDate);

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return undefined;
        const ctx = gsap.context(() => {
            gsap.from('[data-iv-rise]', {
                opacity: 0,
                y: 18,
                duration: 1.1,
                ease: 'power2.out',
                stagger: 0.16,
                delay: 0.15,
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={ref}
            className="iv-hero"
            style={{ backgroundImage: `url(${hero})` }}
            dir="rtl"
        >
            {/* the cameo cipher, seated in the empty oval of the relief */}
            <div className={`iv-hero__mono${initialsArabic ? ' iv-hero__mono--ar' : ''}`} data-iv-rise>
                <span className="iv-hero__mono-a">{initA}</span>
                <span className="iv-hero__mono-amp">{S.and}</span>
                <span className="iv-hero__mono-b">{initB}</span>
            </div>

            {/* the date, engraved just below the doves' ribbon */}
            {dots && <p className="iv-hero__date" data-iv-rise>{dots}</p>}

            <div className="iv-hero__body">
                <p className="iv-hero__announce" data-iv-rise>
                    {S.announce.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </p>

                <p className="iv-hero__names" data-iv-rise>
                    <span className="iv-hero__names-name">{brideAr}</span>
                    <span className="iv-hero__names-amp">{S.and}</span>
                    <span className="iv-hero__names-name">{groomAr}</span>
                </p>

                <p className="iv-hero__dua" data-iv-rise>
                    {S.dua.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </p>
            </div>
        </section>
    );
}
