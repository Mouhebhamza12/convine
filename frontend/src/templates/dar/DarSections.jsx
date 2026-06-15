import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRsvp } from '../../components/shared/useRsvp';
import { useCountdown } from '../../components/shared/useCountdown';
import { WindowScene, ArcadeArch, CeramicPlaque, DiamondRule, JasmineSprig, BrassMedallionFloral } from './DarArt';
import { formatTime } from './DarStrings';
import houseImg from '../../../assets/house-cut.png';

/* Entrance handled by FullPageScroller (`.fp-reveal`). */

/* ─── THE HOUR: an open window onto the evening ─── */
export function DarTime({ eventTime, strings, lang }) {
    return (
        <section className="dar-scene">
            <p className="fp-reveal dar-label">{strings.time.label}</p>
            <WindowScene className="fp-reveal fp-reveal--slow dar-window">
                <span className="dar-window__from">{strings.time.from}</span>
                <strong className="dar-window__time">{formatTime(eventTime, lang)}</strong>
            </WindowScene>
            <p className="fp-reveal dar-window__note">{strings.time.note}</p>
        </section>
    );
}

/* ─── COUNTDOWN: the courtyard arcade, one arch per measure ─── */
export function DarCountdown({ eventDate, eventTime, strings }) {
    const { days, hours, minutes, seconds } = useCountdown(eventDate, eventTime);
    const values = [days, hours, minutes, seconds];

    return (
        <section className="dar-scene">
            <p className="fp-reveal dar-label">{strings.countdown.label}</p>
            <div className="dar-arcade">
                {strings.countdown.units.map((unit, i) => (
                    <div key={unit} className="fp-reveal dar-arcade__bay">
                        <ArcadeArch className="dar-arcade__arch">
                            <strong className="dar-arcade__num">{String(values[i]).padStart(2, '0')}</strong>
                        </ArcadeArch>
                        <span className="dar-arcade__unit">{unit}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─── THE WAY TO THE DAR: Casbah alley + ceramic address plaque ─── */
export function DarVenue({ venue, venueAddress, googleMapsUrl, strings }) {
    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    return (
        <section className="dar-scene">
            <p className="fp-reveal dar-label">{strings.venue.label}</p>
            <p className="fp-reveal dar-venue__intro">{strings.venue.intro}</p>
            <img src={houseImg} alt="" className="fp-reveal fp-reveal--slow dar-house" />
            <CeramicPlaque className="fp-reveal dar-plaque">
                <strong className="dar-plaque__venue">{venue || ''}</strong>
                {venueAddress && <span className="dar-plaque__addr">{venueAddress}</span>}
            </CeramicPlaque>
            {mapsQuery && (
                <a className="fp-reveal dar-venue__btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s7-7.6 7-13a7 7 0 1 0-14 0c0 5.4 7 13 7 13z" />
                        <circle cx="12" cy="9" r="2.6" />
                    </svg>
                    {strings.venue.btn}
                </a>
            )}
        </section>
    );
}

/* ─── RSVP: accept or decline; your answer joins the family ─── */
export function DarRsvp({ guestName, initialStatus, onSubmit, isDemo, strings }) {
    const { status, submitting, respond } = useRsvp(initialStatus, onSubmit, isDemo);
    const sealRef = useRef(null);
    const attending = status === 'attending';

    useEffect(() => {
        if (status && sealRef.current) {
            gsap.fromTo(sealRef.current, { scale: 1.5, opacity: 0, rotation: 8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'power3.out' });
        }
    }, [status]);

    return (
        <section className="dar-scene dar-rsvp-scene">
            <BrassMedallionFloral className="fp-reveal fp-reveal--slow dar-rsvp__medallion dar-rsvp__medallion--a" />
            <BrassMedallionFloral className="fp-reveal fp-reveal--slow dar-rsvp__medallion dar-rsvp__medallion--b" />
            <p className="fp-reveal dar-label">{strings.rsvp.label}</p>
            <p className="fp-reveal dar-rsvp__ask">{strings.rsvp.ask(guestName)}</p>

            {!status ? (
                <>
                    <p className="fp-reveal dar-rsvp__hint">{strings.rsvp.hint}</p>
                    <div className="fp-reveal dar-rsvp__tiles">
                        <button type="button" disabled={submitting} onClick={() => respond('attending')} className="dar-tilebtn">
                            <strong>{strings.rsvp.accept}</strong>
                            <em>{strings.rsvp.acceptSub}</em>
                        </button>
                        <button type="button" disabled={submitting} onClick={() => respond('declined')} className="dar-tilebtn dar-tilebtn--decline">
                            <strong>{strings.rsvp.decline}</strong>
                            <em>{strings.rsvp.declineSub}</em>
                        </button>
                    </div>
                </>
            ) : (
                <div className="dar-rsvp__done" ref={sealRef}>
                    <DiamondRule className="dar-rsvp__rule" />
                    <p className="dar-rsvp__msg">{attending ? strings.rsvp.confirmYes(guestName) : strings.rsvp.confirmNo(guestName)}</p>
                    <JasmineSprig className="dar-rsvp__jasmine" />
                </div>
            )}
        </section>
    );
}
