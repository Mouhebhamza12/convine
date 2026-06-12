import { DarEntranceBackdrop, JasmineSprig, Khamsa, KhatemStar, DiamondRule, ZelligeBand, PhotoNiche } from './DarArt';
import { formatLongDate, formatDateParts } from './DarStrings';

/* Entrance is driven by FullPageScroller: any `.fp-reveal` inside the active
   section fades + lifts in, staggered in DOM order; `--slow` pieces parallax. */

/* ─── THE COURTYARD: names under the horseshoe arch ─── */
export function DarHero({ bride, groom, eventDate, strings, lang }) {
    return (
        <section className="dar-scene dar-hero dar-hero--entrance">
            <DarEntranceBackdrop className="dar-hero__backdrop" />
            <div className="dar-hero__overlay">
                <span className="fp-reveal dar-hero__lang">{lang.toUpperCase()}</span>
                <p className="fp-reveal dar-hero__blessing">{strings.hero.blessing}</p>
                <p className="fp-reveal dar-hero__families">{strings.hero.familyLine}</p>
                <p className="fp-reveal dar-hero__invite">{strings.hero.invite(bride, groom)}</p>
                <h1 className="fp-reveal dar-hero__names">
                    <span>{bride}</span>
                    <em>{strings.hero.and}</em>
                    <span>{groom}</span>
                </h1>
                <p className="fp-reveal dar-hero__date">{formatLongDate(eventDate, lang)}</p>
                <DiamondRule className="fp-reveal dar-hero__rule" />
                <p className="fp-reveal dar-hero__seeyou">{strings.hero.seeYou}</p>
            </div>
        </section>
    );
}

/* ─── MARHBA: the welcome, from both families ─── */
export function DarMarhba({ guestName, message, strings }) {
    return (
        <section className="dar-scene">
            <div className="dar-marhba">
                <JasmineSprig className="fp-reveal fp-reveal--slow dar-marhba__jasmine" />
                <h2 className="fp-reveal dar-marhba__title">{strings.marhba.title}</h2>
                <p className="fp-reveal dar-marhba__sub">{strings.marhba.sub}</p>
                <DiamondRule className="fp-reveal dar-marhba__rule" />
                <p className="fp-reveal dar-marhba__greeting">{strings.marhba.greeting(guestName)}</p>
                <p className="fp-reveal dar-marhba__body">{message || strings.marhba.defaultMsg}</p>
                <Khamsa className="fp-reveal dar-marhba__khamsa" />
                <p className="fp-reveal dar-marhba__sign">{strings.marhba.sign}</p>
            </div>
        </section>
    );
}

/* ─── THE DATE: held inside a khatem star ─── */
export function DarDate({ eventDate, strings, lang }) {
    const { day, month, year, weekday } = formatDateParts(eventDate, lang);

    return (
        <section className="dar-scene">
            <p className="fp-reveal dar-label">{strings.date.label}</p>
            <div className="fp-reveal fp-reveal--slow dar-date__star">
                <KhatemStar className="dar-date__starsvg" />
                <div className="dar-date__inside">
                    <span className="dar-date__weekday">{weekday}</span>
                    <span className="dar-date__day">{day}</span>
                    <span className="dar-date__month">{month}</span>
                    <span className="dar-date__year">{year}</span>
                </div>
            </div>
            <p className="fp-reveal dar-date__note">{strings.date.note}</p>
        </section>
    );
}

/* ─── PHOTOS: niches in the courtyard wall ─── */
export function DarPhotos({ photos = [], strings }) {
    const items = [...(photos || [])];
    while (items.length < 3) items.push(null);
    const fills = ['#dce6ea', '#ece2d0', '#d3e0e6'];

    return (
        <section className="dar-scene">
            <p className="fp-reveal dar-label">{strings.photos.label}</p>
            <ZelligeBand className="fp-reveal fp-reveal--slow dar-photos__band" />
            <div className="dar-photos">
                {items.slice(0, 3).map((src, i) => (
                    <figure key={i} className="fp-reveal dar-niche">
                        <PhotoNiche className="dar-niche__art" src={src} fallback={fills[i]} />
                        <figcaption className="dar-niche__caption">{strings.photos.captions[i]}</figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}
