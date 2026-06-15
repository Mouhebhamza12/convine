import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRsvp } from '../../components/shared/useRsvp';
import { useCountdown } from '../../components/shared/useCountdown';
import { formatTime12 } from './RoseraieStrings';
import bouquet from '../../assets/roseraie/bouquet.svg';
import roses from '../../assets/roseraie/roses.svg';
import damask from '../../assets/roseraie/damask.svg';

/* ─── THE HOUR ─── */
export function RoseraieTime({ eventTime, strings }) {
    return (
        <section className="ro-scene ro-time">
            <img src={bouquet} alt="" className="fp-reveal fp-reveal--slow ro-time__floral" />
            <p className="fp-reveal ro-eyebrow">{strings.time.label}</p>
            <p className="fp-reveal ro-time__from">{strings.time.from}</p>
            <p className="fp-reveal ro-time__value">{formatTime12(eventTime)}</p>
            <p className="fp-reveal ro-time__note">{strings.time.note}</p>
        </section>
    );
}

/* ─── COUNTDOWN ─── */
export function RoseraieCountdown({ eventDate, eventTime, strings }) {
    const { days, hours, minutes, seconds } = useCountdown(eventDate, eventTime);
    const values = [days, hours, minutes, seconds];
    return (
        <section className="ro-scene ro-count">
            <img src={damask} alt="" className="ro-count__damask" />
            <p className="fp-reveal ro-eyebrow">{strings.countdown.label}</p>
            <div className="fp-reveal ro-count__row">
                {strings.countdown.units.map((unit, i) => (
                    <div key={unit} className="ro-count__cell">
                        <span className="ro-count__num">{String(values[i]).padStart(2, '0')}</span>
                        <span className="ro-count__unit">{unit}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─── THE PLACE ─── */
export function RoseraieVenue({ venue, venueAddress, googleMapsUrl, strings }) {
    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    return (
        <section className="ro-scene ro-venue">
            <img src={roses} alt="" className="fp-reveal fp-reveal--slow ro-venue__floral ro-venue__floral--tl" />
            <img src={roses} alt="" className="fp-reveal fp-reveal--slow ro-venue__floral ro-venue__floral--br" />
            <p className="fp-reveal ro-eyebrow">{strings.venue.label}</p>
            <p className="fp-reveal ro-venue__intro">{strings.venue.intro}</p>
            <strong className="fp-reveal ro-venue__name">{venue || ''}</strong>
            {venueAddress && <span className="fp-reveal ro-venue__addr">{venueAddress}</span>}
            <a className="fp-reveal ro-venue__btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">{strings.venue.btn}</a>
        </section>
    );
}

/* ─── RSVP ─── */
export function RoseraieRsvp({ guestName, initialStatus, onSubmit, isDemo, strings }) {
    const { status, submitting, respond } = useRsvp(initialStatus, onSubmit, isDemo);
    const doneRef = useRef(null);
    const attending = status === 'attending';

    useEffect(() => {
        if (status && doneRef.current) {
            gsap.fromTo(doneRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        }
    }, [status]);

    return (
        <section className="ro-scene ro-rsvp">
            <img src={bouquet} alt="" className="fp-reveal fp-reveal--slow ro-rsvp__floral ro-rsvp__floral--l" />
            <img src={bouquet} alt="" className="fp-reveal fp-reveal--slow ro-rsvp__floral ro-rsvp__floral--r" />

            <p className="fp-reveal ro-eyebrow">{strings.rsvp.label}</p>
            <p className="fp-reveal ro-rsvp__ask">{strings.rsvp.ask(guestName)}</p>

            {!status ? (
                <>
                    <p className="fp-reveal ro-rsvp__hint">{strings.rsvp.hint}</p>
                    <div className="fp-reveal ro-rsvp__choices">
                        <button type="button" disabled={submitting} onClick={() => respond('attending')} className="ro-choice">
                            <strong>{strings.rsvp.accept}</strong>
                            <em>{strings.rsvp.acceptSub}</em>
                        </button>
                        <button type="button" disabled={submitting} onClick={() => respond('declined')} className="ro-choice ro-choice--decline">
                            <strong>{strings.rsvp.decline}</strong>
                            <em>{strings.rsvp.declineSub}</em>
                        </button>
                    </div>
                </>
            ) : (
                <div ref={doneRef} className="ro-rsvp__done">
                    <img src={roses} alt="" className="ro-rsvp__donefloral" />
                    <p className="ro-rsvp__msg">{attending ? strings.rsvp.confirmYes(guestName) : strings.rsvp.confirmNo(guestName)}</p>
                </div>
            )}
        </section>
    );
}
