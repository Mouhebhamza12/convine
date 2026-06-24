import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiligreeCorner, FloralCornerLight, FloralSprig, SageRule } from './SageBotanicals';
import { formatDots } from './SageStrings';

gsap.registerPlugin(ScrollTrigger);

/* ─── Cream details card (the signature invitation screen) ─── */
export function SageDetails({ bride, groom, eventDate, eventTime, venue, venueAddress, strings }) {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.sage-detail-fade',
                { opacity: 0, y: 22 },
                {
                    opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 78%' },
                },
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    const placeLine = [venueAddress || venue].filter(Boolean).join('');
    const timeLine = [eventTime, placeLine].filter(Boolean).join(' | ');

    return (
        <section ref={ref} className="sage-scene sage-details">
            <div className="sage-frame">
                <span className="sage-frame__dotted" aria-hidden="true" />
                <FiligreeCorner className="sage-filigree sage-filigree--tl" />
                <FiligreeCorner className="sage-filigree sage-filigree--br" />
                <FloralCornerLight className="sage-detail-floral sage-detail-floral--tr" />
                <FloralCornerLight className="sage-detail-floral sage-detail-floral--bl" />

                <div className="sage-frame__inner">
                    <p className="sage-detail-fade sage-detail__eyebrow">{strings.details.eyebrow}</p>
                    <FloralSprig className="sage-detail-fade sage-detail__sprig" />
                    <h2 className="sage-detail-fade sage-detail__names">{bride} &amp; {groom}</h2>
                    <p className="sage-detail-fade sage-detail__date">{formatDots(eventDate, strings.code)}</p>
                    {timeLine && <p className="sage-detail-fade sage-detail__meta">{timeLine}</p>}
                    <p className="sage-detail-fade sage-detail__meta">{strings.details.rsvp}</p>
                </div>
            </div>
        </section>
    );
}

/* ─── Guest letter ─── */
export function SageLetter({ guestName, bride, groom, message, strings }) {
    const ref = useRef(null);
    const defaultMsg = strings.letter.defaultMsg;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } },
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section className="sage-scene">
            <div ref={ref} className="sage-letter">
                <FiligreeCorner className="sage-filigree sage-filigree--tl" />
                <FiligreeCorner className="sage-filigree sage-filigree--br" />
                <p className="sage-letter__greeting">{strings.letter.greeting} <strong>{guestName}</strong>,</p>
                <p className="sage-letter__body">{message || defaultMsg}</p>
                <SageRule className="sage-letter__rule" />
                <p className="sage-letter__sign">{bride} &amp; {groom}</p>
            </div>
        </section>
    );
}

/* ─── Photos ─── */
export function SagePhotos({ photos = [], strings }) {
    const stageRef = useRef(null);
    const items = (photos || []).filter((p) => typeof p === 'string' && p.trim()).slice(0, 4);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.sage-photo',
                { opacity: 0, y: 40, scale: 0.92 },
                { opacity: 1, y: 0, rotation: (i) => (i === 0 ? -3 : i === 1 ? 3 : -2), scale: 1, duration: 1.2, stagger: 0.18, ease: 'power3.out', scrollTrigger: { trigger: stageRef.current, start: 'top 78%' } },
            );
        }, stageRef);
        return () => ctx.revert();
    }, []);

    if (!items.length) return null;

    return (
        <section className="sage-scene">
            <p className="sage-eyebrow">{strings.photos.eyebrow}</p>
            <SageRule className="sage-eyebrow-rule" />
            <div ref={stageRef} className="sage-photo-stage">
                {items.map((src, i) => (
                    <div key={i} className={`sage-photo sage-photo--${i + 1} sg-spec`}>
                        {/* entomology pin holding the specimen */}
                        <svg className="sg-spec__pin" viewBox="0 0 18 26" fill="none" stroke="var(--sage-green-deep)" strokeLinecap="round" aria-hidden="true">
                            <circle cx="9" cy="5" r="3.4" strokeWidth="1.4" fill="var(--sage-green)" fillOpacity="0.5" />
                            <line x1="9" y1="8.5" x2="9" y2="24" strokeWidth="1.4" />
                        </svg>
                        <img src={src} alt="" loading="lazy" />
                    </div>
                ))}
            </div>
        </section>
    );
}
