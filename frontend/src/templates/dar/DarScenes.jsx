import { JasmineSprig, Khamsa, KhatemStar, DiamondRule, PhotoNiche } from './DarArt';
import { RingMotif, GoldFlourish } from './AndalusArt';
import { formatDateParts, formatDots, formatTime12 } from './DarStrings';

/* Entrance is driven by FullPageScroller: any `.fp-reveal` inside the active
   section fades + lifts in, staggered in DOM order; `--slow` pieces parallax. */

/* ─── THE CARD: the engraved vintage Nikkah invitation ─── */
export function DarHero({ bride, groom, eventDate, eventTime, venue, venueAddress, strings }) {
    const place = venueAddress || venue;
    return (
        <section className="dar-scene andalus-card-scene">
            <div className="andalus-card">
                <div className="andalus-card__content">
                    <p className="fp-reveal andalus-card__bismillah" lang="ar" dir="rtl">{strings.hero.blessing}</p>
                    <h1 className="fp-reveal andalus-card__names">
                        <span>{bride}</span>
                        <em>{strings.hero.and}</em>
                        <span>{groom}</span>
                    </h1>
                    <p className="fp-reveal andalus-card__nikkah">{strings.hero.nikkahLine}</p>
                    <p className="fp-reveal andalus-card__inshaa">{strings.hero.inshaa}</p>
                    <p className="fp-reveal andalus-card__date">{formatDots(eventDate)}</p>
                    <p className="fp-reveal andalus-card__time">{formatTime12(eventTime)}</p>
                    <GoldFlourish className="fp-reveal andalus-card__flourish" />
                    {place && <p className="fp-reveal andalus-card__addr">{place}</p>}
                    <p className="fp-reveal andalus-card__dua">{strings.hero.duaLine}</p>
                </div>
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
