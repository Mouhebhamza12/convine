import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Doodle } from './AzureArt';

gsap.registerPlugin(ScrollTrigger);

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
                <Doodle type="sparkle" className="azure-doodle azure-letter__doodle--tl" />
                <Doodle type="spiral" className="azure-doodle azure-letter__doodle--br" />
                <p className="azure-letter__greeting">Dear <strong>{guestName}</strong>,</p>
                <p className="azure-letter__body">{message || defaultMsg}</p>
                <p className="azure-letter__sign">{bride} &amp; {groom}</p>
            </div>
        </section>
    );
}

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

    return (
        <section className="azure-scene">
            <p className="azure-eyebrow">Our Moments</p>
            <div ref={stageRef} className="azure-photo-stage">
                {items.slice(0, 3).map((src, i) => (
                    <div key={i} className={`azure-photo azure-photo--${i + 1}`}>
                        {src ? <img src={src} alt="" loading="lazy" /> : <div className="azure-photo__fill" style={{ background: fills[i] }} />}
                    </div>
                ))}
            </div>
        </section>
    );
}
