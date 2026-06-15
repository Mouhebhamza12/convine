import bouquet from '../../assets/roseraie/bouquet.svg';
import roses from '../../assets/roseraie/roses.svg';
import damask from '../../assets/roseraie/damask.svg';
import { formatLongDate, formatDateParts } from './RoseraieStrings';

/* Entrance driven by FullPageScroller: any `.fp-reveal` inside the active
   section fades + lifts in; `--slow` pieces drift for parallax. All decoration
   is real vector artwork (the provided assets), never drawn in code. */

/* ─── HERO: the bouquet crowns the names ─── */
export function RoseraieHero({ bride, groom, eventDate, strings }) {
    return (
        <section className="ro-scene ro-hero">
            <img src={bouquet} alt="" className="fp-reveal fp-reveal--slow ro-hero__bouquet" />
            <p className="fp-reveal ro-eyebrow">{strings.hero.eyebrow}</p>
            <h1 className="fp-reveal ro-hero__names">
                <span>{bride}</span>
                <em>{strings.hero.and}</em>
                <span>{groom}</span>
            </h1>
            <p className="fp-reveal ro-hero__date">{formatLongDate(eventDate)}</p>
        </section>
    );
}

/* ─── THE LETTER ─── */
export function RoseraieLetter({ guestName, bride, groom, message, strings }) {
    return (
        <section className="ro-scene ro-letter">
            <img src={roses} alt="" className="fp-reveal fp-reveal--slow ro-letter__floral" />
            <p className="fp-reveal ro-eyebrow">{strings.letter.label}</p>
            <p className="fp-reveal ro-letter__greeting">{strings.letter.greeting(guestName)}</p>
            <p className="fp-reveal ro-letter__body">{message || strings.letter.defaultMsg}</p>
            <p className="fp-reveal ro-letter__sign">{strings.letter.sign}</p>
            <p className="fp-reveal ro-letter__names">{strings.letter.signNames(bride, groom)}</p>
        </section>
    );
}

/* ─── THE DATE: a baroque damask backs the day ─── */
export function RoseraieDate({ eventDate, strings }) {
    const { weekday, day, month, year } = formatDateParts(eventDate);
    return (
        <section className="ro-scene ro-date">
            <img src={bouquet} alt="" className="fp-reveal fp-reveal--slow ro-date__floral ro-date__floral--l" />
            <img src={bouquet} alt="" className="fp-reveal fp-reveal--slow ro-date__floral ro-date__floral--r" />
            <p className="fp-reveal ro-eyebrow">{strings.date.label}</p>
            <div className="fp-reveal ro-date__block">
                <img src={damask} alt="" className="ro-date__damask" />
                <span className="ro-date__weekday">{weekday}</span>
                <span className="ro-date__day">{parseInt(day, 10) || day}</span>
                <span className="ro-date__monthyear">{month} {year}</span>
            </div>
            <p className="fp-reveal ro-date__note">{strings.date.note}</p>
        </section>
    );
}

/* ─── OUR STORY: three portraits in soft ovals ─── */
export function RoseraiePhotos({ photos = [], strings }) {
    const items = [...(photos || [])];
    while (items.length < 3) items.push(null);
    const fb = ['#e7d9d3', '#efe2da', '#e0d4cf'];
    return (
        <section className="ro-scene ro-photos">
            <img src={roses} alt="" className="fp-reveal fp-reveal--slow ro-photos__floral" />
            <p className="fp-reveal ro-eyebrow">{strings.photos.label}</p>
            <div className="ro-photos__row">
                {items.slice(0, 3).map((src, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <figure key={i} className="fp-reveal ro-photo">
                        <span className="ro-photo__frame">
                            {src
                                ? <img src={src} alt="" className="ro-photo__img" />
                                : <span className="ro-photo__ph" style={{ background: fb[i] }} />}
                        </span>
                        <figcaption className="ro-photo__cap">{strings.photos.captions[i]}</figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}
