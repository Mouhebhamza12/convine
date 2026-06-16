import { IVOIRE_STRINGS, arabicDisplayName, initialOf, isArabicName, formatDots, arabicDateParts, arabicTime } from './IvoireStrings';
import { IvoireDivider } from './IvoireArt';
import hero from '../../../assets/ivoire/hero.jpg';
import letter from '../../../assets/ivoire/letter.jpg';
import details from '../../../assets/ivoire/details.jpg';

/**
 * Ivoire interior scenes. Each is a full-bleed plaster-relief image (provided)
 * with engraved type inscribed into its open field. Lines carry `.fp-reveal`
 * so the shared FullPageScroller lifts them in, staggered, when their section
 * becomes active.
 */

/**
 * IvoireHero — the عقد قِران announcement, set into the dusty-rose relief: the
 * cameo cipher, the engraved date, the announcement, the names in Arabic
 * calligraphy and the duʿāʾ.
 */
export function IvoireHero({ bride = 'Amina', groom = 'Yacine', eventDate, isDemo = false }) {
    const S = IVOIRE_STRINGS.hero;
    const initA = initialOf(bride);
    const initB = initialOf(groom);
    const initialsArabic = isArabicName(initA) || isArabicName(initB);
    const brideAr = isDemo || isArabicName(bride) ? arabicDisplayName(bride) : bride;
    const groomAr = isDemo || isArabicName(groom) ? arabicDisplayName(groom) : groom;
    const dots = formatDots(eventDate);

    return (
        <section className="iv-hero" style={{ backgroundImage: `url(${hero})` }} dir="rtl">
            <div className={`iv-hero__mono fp-reveal${initialsArabic ? ' iv-hero__mono--ar' : ''}`}>
                <span className="iv-hero__mono-a">{initA}</span>
                <span className="iv-hero__mono-amp">{S.and}</span>
                <span className="iv-hero__mono-b">{initB}</span>
            </div>

            {dots && <p className="iv-hero__date fp-reveal">{dots}</p>}

            <div className="iv-hero__body">
                <p className="iv-hero__announce fp-reveal">
                    {S.announce.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </p>

                <p className="iv-hero__names fp-reveal">
                    <span className="iv-hero__names-name">{brideAr}</span>
                    <span className="iv-hero__names-amp">{S.and}</span>
                    <span className="iv-hero__names-name">{groomAr}</span>
                </p>

                <p className="iv-hero__dua fp-reveal">
                    {S.dua.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </p>
            </div>
        </section>
    );
}

/**
 * IvoireLetter — a heartfelt note hand-set on the embossed cream panel. The
 * opening flourish and the signing names are Nastaʿlīq (Gulzar); the body is a
 * fresh Naskh (Markazi Text).
 */
export function IvoireLetter({ guestName = 'Mohamed', bride = 'Amina', groom = 'Yacine', message, isDemo = false }) {
    const S = IVOIRE_STRINGS.letter;
    const guest = isDemo || isArabicName(guestName) ? arabicDisplayName(guestName) : guestName;
    const brideAr = isDemo || isArabicName(bride) ? arabicDisplayName(bride) : bride;
    const groomAr = isDemo || isArabicName(groom) ? arabicDisplayName(groom) : groom;
    const body = message && message.trim() ? message : S.defaultMsg;

    return (
        <section className="iv-letter" style={{ backgroundImage: `url(${letter})` }} dir="rtl">
            <div className="iv-letter__panel">
                <p className="iv-letter__kicker fp-reveal">{S.kicker}</p>
                <IvoireDivider className="iv-letter__rule fp-reveal" />

                <p className="iv-letter__greeting fp-reveal">{S.greeting(guest)}</p>
                <p className="iv-letter__body fp-reveal">{body}</p>

                <p className="iv-letter__sign fp-reveal">{S.sign}</p>
                <p className="iv-letter__names fp-reveal">
                    <span>{brideAr}</span>
                    <span className="iv-letter__amp">{S.and}</span>
                    <span>{groomAr}</span>
                </p>
            </div>
        </section>
    );
}

/**
 * IvoireDetails — the day's details (date · time · place) inscribed on the
 * framed cream panel. The weekday is the Nastaʿlīq flourish (Gulzar); the rest
 * is the Naskh body (Markazi Text).
 */
export function IvoireDetails({ eventDate, eventTime, venue, venueAddress }) {
    const S = IVOIRE_STRINGS.details;
    const d = arabicDateParts(eventDate);
    const time = arabicTime(eventTime);

    return (
        <section className="iv-details" style={{ backgroundImage: `url(${details})` }} dir="rtl">
            <div className="iv-details__panel">
                <p className="iv-details__kicker fp-reveal">{S.kicker}</p>

                <p className="iv-details__weekday fp-reveal">{d.weekday}</p>
                <p className="iv-details__date fp-reveal">{`${d.day} ${d.month} ${d.year}`}</p>
                <p className="iv-details__time fp-reveal">{`${S.at} ${time}`}</p>

                <IvoireDivider className="iv-details__rule fp-reveal" />

                {venue && <p className="iv-details__lead fp-reveal">{S.venueLead}</p>}
                {venue && <p className="iv-details__venue fp-reveal">{venue}</p>}
                {venueAddress && <p className="iv-details__address fp-reveal">{venueAddress}</p>}
            </div>
        </section>
    );
}
