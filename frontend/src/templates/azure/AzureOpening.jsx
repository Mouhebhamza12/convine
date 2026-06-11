import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { OrnateFrame, CoupleIllustration, Doodle, PhoneBadge } from './AzureArt';

function ordinal(d) {
    if (d % 10 === 1 && d !== 11) return 'st';
    if (d % 10 === 2 && d !== 12) return 'nd';
    if (d % 10 === 3 && d !== 13) return 'rd';
    return 'th';
}

function longDate(dateStr) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return { day: d.getDate(), ord: ordinal(d.getDate()), mon: d.toLocaleString('en-US', { month: 'short' }), year: d.getFullYear() };
}

function ampm(t) {
    if (!t) return '';
    const [h, m] = String(t).split(':').map(Number);
    const ap = h < 12 ? 'am' : 'pm';
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${String(m || 0).padStart(2, '0')}${ap}`;
}

export default function AzureOpening({ onComplete, bride, groom, eventDate, eventTime, venue, rsvpPhone }) {
    const rootRef = useRef(null);
    const innerRef = useRef(null);
    const dt = longDate(eventDate);

    useEffect(() => {
        gsap.fromTo(
            innerRef.current?.children || [],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.15 },
        );
    }, []);

    function open() {
        gsap.timeline({ onComplete }).to(rootRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' });
    }

    return (
        <div
            ref={rootRef}
            className="azure-cover"
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && open()}
            aria-label="Open invitation"
        >
            <div ref={innerRef} className="azure-cover__inner">
                <p className="azure-cover__invite">You&apos;re invited to share in the joy of our wedding day</p>

                <h1 className="azure-cover__names">
                    <span>{bride}</span>
                    <span>&amp; {groom}</span>
                </h1>

                <p className="azure-cover__together">Together with Love and Joy</p>

                <div className="azure-cover__art">
                    <Doodle type="sparkle" className="azure-doodle azure-doodle--1" />
                    <Doodle type="swirl" className="azure-doodle azure-doodle--2" />
                    <Doodle type="curl" className="azure-doodle azure-doodle--3" />
                    <Doodle type="spiral" className="azure-doodle azure-doodle--4" />
                    <Doodle type="sparkle" className="azure-doodle azure-doodle--5" />
                    <OrnateFrame className="azure-frame">
                        <CoupleIllustration className="azure-couple" />
                    </OrnateFrame>
                </div>

                <div className="azure-cover__meta">
                    <span>Start at {ampm(eventTime) || '9:00am'}</span>
                    {dt && (
                        <span className="azure-cover__date">
                            {dt.day}<sup>{dt.ord}</sup> {dt.mon}, {dt.year}
                        </span>
                    )}
                    <span>{venue || 'The Venue'}</span>
                </div>

                <p className="azure-cover__rsvp">
                    Kindly RSVP on
                    <PhoneBadge className="azure-phone" />
                    {rsvpPhone || '+123-456-7890'}
                </p>
            </div>
        </div>
    );
}
