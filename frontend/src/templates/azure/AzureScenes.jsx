import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    OrnateFrame, CoupleIllustration, StarsCluster, Star, Flourish, HeartDivider, ClockIcon, PinIcon, PhoneBadge,
} from './AzureArt';

gsap.registerPlugin(ScrollTrigger);

function ordinal(d) {
    if (d % 10 === 1 && d !== 11) return 'st';
    if (d % 10 === 2 && d !== 12) return 'nd';
    if (d % 10 === 3 && d !== 13) return 'rd';
    return 'th';
}
function parseDate(s) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
}
function ampm(t) {
    if (!t) return '9:00 AM';
    const [h, m] = String(t).split(':').map(Number);
    const ap = h < 12 ? 'AM' : 'PM';
    return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${ap}`;
}
function longDate(d, deltaDays = 0) {
    if (!d) return null;
    const x = new Date(d.getTime() - deltaDays * 86400000);
    return { day: x.getDate(), ord: ordinal(x.getDate()), mon: x.toLocaleString('en-US', { month: 'short' }).toUpperCase(), year: x.getFullYear() };
}

/* ─── HERO: the signature blue invitation screen ─── */
export function AzureHero({ bride, groom, eventDate, eventTime, venue, rsvpPhone }) {
    const ref = useRef(null);
    const d = parseDate(eventDate);
    const dt = longDate(d);
    const deadline = longDate(d, 13);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.azure-hero__fade', { opacity: 0, y: 22 }, {
                opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 75%' },
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="azure-scene azure-hero">
            <p className="azure-hero__fade azure-hero__invite">You&apos;re invited to<br />share in the joy of our wedding day</p>

            <h1 className="azure-hero__fade azure-hero__names">
                <span>{bride}</span>
                <span>&amp; {groom}</span>
            </h1>

            <HeartDivider className="azure-hero__fade azure-hero__hdiv" />

            <p className="azure-hero__fade azure-hero__together">Together with Love and Joy</p>

            <div className="azure-hero__fade azure-hero__art">
                <StarsCluster className="azure-acc azure-acc--stars" />
                <Flourish variant="a" className="azure-acc azure-acc--f1" />
                <Flourish variant="b" className="azure-acc azure-acc--f2" />
                <Star className="azure-acc azure-acc--s1" />
                <Star className="azure-acc azure-acc--s2" />
                <OrnateFrame className="azure-frame">
                    <CoupleIllustration className="azure-couple" />
                </OrnateFrame>
            </div>

            <div className="azure-hero__fade azure-hero__meta">
                <div className="azure-meta__col">
                    <ClockIcon className="azure-meta__icon" />
                    <span>Start at<br />{ampm(eventTime)}</span>
                </div>
                <span className="azure-meta__sep" />
                {dt && (
                    <div className="azure-meta__col azure-meta__date">
                        <strong>{dt.day}<sup>{dt.ord}</sup> {dt.mon},</strong>
                        <strong className="azure-meta__year">{dt.year}</strong>
                    </div>
                )}
                <span className="azure-meta__sep" />
                <div className="azure-meta__col">
                    <PinIcon className="azure-meta__icon" />
                    <span>{venue || 'The Venue'}</span>
                </div>
            </div>

            <p className="azure-hero__fade azure-hero__rsvp">
                {deadline ? `Kindly RSVP before ${deadline.day}${deadline.ord} ${deadline.mon}, ${deadline.year} on` : 'Kindly RSVP on'}
            </p>
            <p className="azure-hero__fade azure-hero__phone">
                <PhoneBadge className="azure-phone" />
                {rsvpPhone || '+123-456-7890'}
            </p>

            <HeartDivider className="azure-hero__fade azure-hero__hdiv" />
        </section>
    );
}

/* ─── Guest letter ─── */
export function AzureLetter({ guestName, bride, groom, message }) {
    const ref = useRef(null);
    const defaultMsg = 'We are delighted to invite you to celebrate our wedding and share this special day with us.';

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 80%' },
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section className="azure-scene">
            <div ref={ref} className="azure-letter">
                <Star className="azure-acc azure-letter__star--tl" />
                <Star className="azure-acc azure-letter__star--br" />
                <p className="azure-letter__greeting">Dear <strong>{guestName}</strong>,</p>
                <p className="azure-letter__body">{message || defaultMsg}</p>
                <HeartDivider className="azure-letter__div" />
                <p className="azure-letter__sign">{bride} &amp; {groom}</p>
            </div>
        </section>
    );
}

/* ─── Photos ─── */
export function AzurePhotos({ photos = [] }) {
    const stageRef = useRef(null);
    const items = [...photos];
    while (items.length < 3) items.push(null);
    const fills = ['#d8e2f0', '#e7e0cc', '#cdd9ec'];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.azure-photo', { opacity: 0, y: 40, scale: 0.92 }, {
                opacity: 1, y: 0, scale: 1, rotation: (i) => (i === 0 ? -3 : i === 1 ? 3 : -2),
                duration: 1.1, stagger: 0.16, ease: 'power3.out',
                scrollTrigger: { trigger: stageRef.current, start: 'top 80%' },
            });
        }, stageRef);
        return () => ctx.revert();
    }, []);

    const captions = ['snapshot no. 1', 'snapshot no. 2', 'snapshot no. 3'];

    return (
        <section className="azure-scene">
            <p className="azure-eyebrow">From our travel album</p>
            <div ref={stageRef} className="azure-photo-stage">
                {items.slice(0, 3).map((src, i) => (
                    <div key={i} className={`azure-photo azure-photo--${i + 1} az-scrap`}>
                        {/* washi-tape strip holding the photo to the page */}
                        <svg className="az-scrap__tape" viewBox="0 0 70 22" aria-hidden="true">
                            <path d="M4 4 L66 1 L64 18 L2 21 Z" fill="currentColor" opacity="0.25" />
                            <path d="M4 4 L66 1 M64 18 L2 21" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                        </svg>
                        {src ? <img src={src} alt="" loading="lazy" /> : <div className="azure-photo__fill" style={{ background: fills[i] }} />}
                        <p className="az-scrap__caption">{captions[i]}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
