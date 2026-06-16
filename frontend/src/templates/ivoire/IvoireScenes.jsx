import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { IVOIRE_STRINGS, arabicDisplayName, initialOf, isArabicName, formatDots, arabicDateParts, arabicTime, monogramLetters } from './IvoireStrings';
import { IvoireDivider, IvoirePin, IvoireMonogram } from './IvoireArt';
import { useRsvp } from '../../components/shared/useRsvp';
import hero from '../../../assets/ivoire/hero.jpg';
import letter from '../../../assets/ivoire/letter.jpg';
import details from '../../../assets/ivoire/details.jpg';
import location from '../../../assets/ivoire/location.jpg';
import rsvp from '../../../assets/ivoire/rsvp.jpg';

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
export function IvoireDetails({ eventDate, eventTime }) {
    const S = IVOIRE_STRINGS.details;
    const d = arabicDateParts(eventDate);
    const time = arabicTime(eventTime);

    return (
        <section className="iv-details" style={{ backgroundImage: `url(${details})` }} dir="rtl">
            <div className="iv-details__panel">
                <p className="iv-details__kicker fp-reveal">{S.kicker}</p>

                <p className="iv-details__weekday fp-reveal">{d.weekday}</p>
                <p className="iv-details__date fp-reveal">{`${d.day} ${d.month} ${d.year}`}</p>

                <IvoireDivider className="iv-details__rule fp-reveal" />

                <p className="iv-details__time fp-reveal">{`${S.at} ${time}`}</p>
            </div>
        </section>
    );
}

/**
 * IvoireLocation — the fourth interior scene: the place, inscribed in the open
 * field above the rose-draped garden rotunda (provided relief). Venue name and
 * address are engraved; a slim engraved button opens directions.
 */
export function IvoireLocation({ venue, venueAddress, googleMapsUrl }) {
    const S = IVOIRE_STRINGS.location;

    return (
        <section className="iv-location" style={{ backgroundImage: `url(${location})` }} dir="rtl">
            <div className="iv-location__panel">
                <p className="iv-location__heading fp-reveal">{S.heading}</p>
                <IvoireDivider className="iv-location__rule fp-reveal" />

                {venue && <p className="iv-location__lead fp-reveal">{S.lead}</p>}
                {venue && <p className="iv-location__venue fp-reveal">{venue}</p>}
                {venueAddress && <p className="iv-location__address fp-reveal">{venueAddress}</p>}

                {googleMapsUrl && (
                    <a className="iv-location__btn fp-reveal" href={googleMapsUrl} target="_blank" rel="noreferrer">
                        <IvoirePin className="iv-location__pin" />
                        <span>{S.directions}</span>
                    </a>
                )}
            </div>
        </section>
    );
}

const SEAL_R = 98;
const SEAL_C = 2 * Math.PI * SEAL_R;
const HOLD_MS = 1150;

/**
 * IvoireRsvp — the finale, and the cover's mirror. There are no accept/decline
 * buttons: the guest *seals their own presence*. Press and hold the wax cameo
 * and a gilded ring fills while the couple's monogram is struck gold into the
 * wax — the same gilded seal the invitation opened on. A single quiet engraved
 * line offers regrets. Backed by the shared RSVP state machine.
 */
export function IvoireRsvp({ guestName = 'Mohamed', bride = 'Amina', groom = 'Yacine', initialStatus, onSubmit, isDemo = false }) {
    const S = IVOIRE_STRINGS.rsvp;
    const { status, submitting, respond } = useRsvp(initialStatus, onSubmit, isDemo);
    const guest = isDemo || isArabicName(guestName) ? arabicDisplayName(guestName) : guestName;
    const mono = monogramLetters(bride, groom, { demo: isDemo });

    const sealRef = useRef(null);
    const ringRef = useRef(null);
    const monoRef = useRef(null);
    const doneRef = useRef(null);
    const raf = useRef(0);
    const startT = useRef(0);
    const settled = useRef(false);

    const paint = (p) => {
        if (ringRef.current) ringRef.current.style.strokeDashoffset = String(SEAL_C * (1 - p));
        if (monoRef.current) monoRef.current.style.opacity = String(0.3 + 0.7 * p);
        if (sealRef.current) sealRef.current.style.transform = `scale(${1 - 0.045 * p})`;
    };

    const finish = () => {
        if (settled.current) return;
        settled.current = true;
        cancelAnimationFrame(raf.current);
        paint(1);
        gsap.timeline()
            .to(sealRef.current, { scale: 1.07, duration: 0.16, ease: 'power2.out' })
            .to(sealRef.current, { scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
        respond('attending');
    };

    const frame = (t) => {
        const p = Math.min(1, (t - startT.current) / HOLD_MS);
        paint(p);
        if (p >= 1) finish();
        else raf.current = requestAnimationFrame(frame);
    };

    const startHold = (e) => {
        if (status || submitting || settled.current) return;
        if (e.cancelable) e.preventDefault();
        startT.current = performance.now();
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(frame);
    };

    const cancelHold = () => {
        if (settled.current || status) return;
        cancelAnimationFrame(raf.current);
        const cur = ringRef.current ? 1 - parseFloat(ringRef.current.style.strokeDashoffset || SEAL_C) / SEAL_C : 0;
        const o = { p: cur };
        gsap.to(o, { p: 0, duration: 0.4, ease: 'power2.inOut', onUpdate: () => paint(o.p) });
    };

    useEffect(() => {
        if (status && doneRef.current) {
            gsap.fromTo(doneRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
    }, [status]);

    const attending = status === 'attending';

    return (
        <section className="iv-rsvp" style={{ backgroundImage: `url(${rsvp})` }} dir="rtl">
            <div className="iv-rsvp__panel">
                {!status ? (
                    <>
                        <p className="iv-rsvp__heading fp-reveal">{S.heading}</p>
                        <p className="iv-rsvp__ask fp-reveal">{S.ask(guest)}</p>

                        <div
                            ref={sealRef}
                            className="iv-rsvp__seal fp-reveal"
                            onPointerDown={startHold}
                            onPointerUp={cancelHold}
                            onPointerLeave={cancelHold}
                            onPointerCancel={cancelHold}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); } }}
                            role="button"
                            tabIndex={0}
                            aria-label={S.hold}
                        >
                            <svg viewBox="0 0 220 220" className="iv-rsvp__sealsvg" aria-hidden="true">
                                <defs>
                                    <linearGradient id="iv-seal-gold" x1="0" y1="0" x2="0.15" y2="1">
                                        <stop offset="0" stopColor="#e7c89a" />
                                        <stop offset="0.5" stopColor="#c1924f" />
                                        <stop offset="1" stopColor="#e3c794" />
                                    </linearGradient>
                                </defs>
                                <circle cx="110" cy="110" r="91" className="iv-rsvp__wax" />
                                <circle cx="110" cy="110" r="91" className="iv-rsvp__waxrim" />
                                <circle
                                    ref={ringRef}
                                    cx="110"
                                    cy="110"
                                    r={SEAL_R}
                                    className="iv-rsvp__ring"
                                    fill="none"
                                    stroke="url(#iv-seal-gold)"
                                    strokeWidth="4.5"
                                    strokeLinecap="round"
                                    strokeDasharray={SEAL_C}
                                    strokeDashoffset={SEAL_C}
                                    transform="rotate(-90 110 110)"
                                />
                            </svg>
                            <div ref={monoRef} className="iv-rsvp__mono">
                                <IvoireMonogram letters={mono.letters} arabic={mono.arabic} className="iv-mono" />
                            </div>
                        </div>

                        <p className="iv-rsvp__hint fp-reveal">{submitting ? S.sealing : S.hold}</p>
                        <button type="button" className="iv-rsvp__regret fp-reveal" onClick={() => respond('declined')} disabled={submitting}>
                            {S.regret}
                        </button>
                    </>
                ) : (
                    <div ref={doneRef} className={`iv-rsvp__done${attending ? '' : ' is-declined'}`}>
                        <div className="iv-rsvp__seal iv-rsvp__seal--set">
                            <svg viewBox="0 0 220 220" className="iv-rsvp__sealsvg" aria-hidden="true">
                                <defs>
                                    <linearGradient id="iv-seal-gold-set" x1="0" y1="0" x2="0.15" y2="1">
                                        <stop offset="0" stopColor="#e7c89a" />
                                        <stop offset="0.5" stopColor="#c1924f" />
                                        <stop offset="1" stopColor="#e3c794" />
                                    </linearGradient>
                                </defs>
                                <circle cx="110" cy="110" r="91" className="iv-rsvp__wax" />
                                <circle cx="110" cy="110" r="91" className="iv-rsvp__waxrim" />
                                <circle cx="110" cy="110" r={SEAL_R} fill="none" stroke="url(#iv-seal-gold-set)" strokeWidth="4.5" />
                            </svg>
                            <div className="iv-rsvp__mono" style={{ opacity: attending ? 1 : 0.4 }}>
                                <IvoireMonogram letters={mono.letters} arabic={mono.arabic} className="iv-mono" />
                            </div>
                        </div>
                        <p className="iv-rsvp__msg">{attending ? S.confirmYes(guest) : S.confirmNo(guest)}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
