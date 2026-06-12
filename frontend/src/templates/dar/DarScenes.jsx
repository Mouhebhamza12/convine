import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArchFrame, JasmineSprig, Khamsa, KhatemStar, DiamondRule, ZelligeBand, PhotoNiche } from './DarArt';
import { formatLongDate, formatDateParts } from './DarStrings';

gsap.registerPlugin(ScrollTrigger);

function useReveal(ref, selector) {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(selector, { opacity: 0, y: 26 }, {
                opacity: 1, y: 0, duration: 1, stagger: 0.13, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 78%' },
            });
        }, ref);
        return () => ctx.revert();
    }, [ref, selector]);
}

/* ─── THE COURTYARD: names under the horseshoe arch ─── */
export function DarHero({ bride, groom, eventDate, strings, lang }) {
    const ref = useRef(null);
    useReveal(ref, '.dar-hero__fade');

    return (
        <section ref={ref} className="dar-scene dar-hero">
            <p className="dar-hero__fade dar-hero__invite">{strings.hero.invite(bride, groom)}</p>
            <ArchFrame className="dar-hero__fade dar-arch">
                <span className="dar-arch__name">{bride}</span>
                <span className="dar-arch__amp">{strings.hero.and}</span>
                <span className="dar-arch__name">{groom}</span>
                <DiamondRule className="dar-arch__rule" />
                <span className="dar-arch__date">{formatLongDate(eventDate, lang)}</span>
            </ArchFrame>
            <p className="dar-hero__fade dar-hero__seeyou">{strings.hero.seeYou}</p>
        </section>
    );
}

/* ─── MARHBA: the welcome, from both families ─── */
export function DarMarhba({ guestName, message, strings }) {
    const ref = useRef(null);
    useReveal(ref, '.dar-mar__fade');

    return (
        <section ref={ref} className="dar-scene">
            <div className="dar-mar__fade dar-marhba">
                <JasmineSprig className="dar-marhba__jasmine" />
                <h2 className="dar-marhba__title">{strings.marhba.title}</h2>
                <p className="dar-marhba__sub">{strings.marhba.sub}</p>
                <DiamondRule className="dar-marhba__rule" />
                <p className="dar-marhba__greeting">{strings.marhba.greeting(guestName)}</p>
                <p className="dar-marhba__body">{message || strings.marhba.defaultMsg}</p>
                <Khamsa className="dar-marhba__khamsa" />
                <p className="dar-marhba__sign">{strings.marhba.sign}</p>
            </div>
        </section>
    );
}

/* ─── THE DATE: held inside a khatem star ─── */
export function DarDate({ eventDate, strings, lang }) {
    const ref = useRef(null);
    useReveal(ref, '.dar-date__fade');
    const { day, month, year, weekday } = formatDateParts(eventDate, lang);

    return (
        <section ref={ref} className="dar-scene">
            <p className="dar-date__fade dar-label">{strings.date.label}</p>
            <div className="dar-date__fade dar-date__star">
                <KhatemStar className="dar-date__starsvg" />
                <div className="dar-date__inside">
                    <span className="dar-date__weekday">{weekday}</span>
                    <span className="dar-date__day">{day}</span>
                    <span className="dar-date__month">{month}</span>
                    <span className="dar-date__year">{year}</span>
                </div>
            </div>
            <p className="dar-date__fade dar-date__note">{strings.date.note}</p>
        </section>
    );
}

/* ─── PHOTOS: niches in the courtyard wall ─── */
export function DarPhotos({ photos = [], strings }) {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.dar-niche', { opacity: 0, y: 36 }, {
                opacity: 1, y: 0, duration: 1.1, stagger: 0.16, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 78%' },
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    const items = [...(photos || [])];
    while (items.length < 3) items.push(null);
    const fills = ['#dce6ea', '#ece2d0', '#d3e0e6'];

    return (
        <section ref={ref} className="dar-scene">
            <p className="dar-label">{strings.photos.label}</p>
            <ZelligeBand className="dar-photos__band" />
            <div className="dar-photos">
                {items.slice(0, 3).map((src, i) => (
                    <figure key={i} className="dar-niche">
                        <PhotoNiche className="dar-niche__art" src={src} fallback={fills[i]} />
                        <figcaption className="dar-niche__caption">{strings.photos.captions[i]}</figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}
