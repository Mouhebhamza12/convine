import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { DoveMonogram, FloralCornerLight } from './SageBotanicals';

export default function SageOpening({ onComplete, bride, groom, guestName }) {
    const rootRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            innerRef.current?.children || [],
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out', delay: 0.2 },
        );
    }, []);

    function open() {
        gsap.timeline({ onComplete }).to(rootRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
    }

    return (
        <div
            ref={rootRef}
            className="sage-cover"
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && open()}
            aria-label="Open invitation"
        >
            <FloralCornerLight className="sage-cover__floral sage-cover__floral--tr" />
            <FloralCornerLight className="sage-cover__floral sage-cover__floral--bl" />

            <div ref={innerRef} className="sage-cover__inner">
                <DoveMonogram className="sage-cover__doves" />
                <p className="sage-cover__eyebrow">The Wedding Of</p>
                <div className="sage-cover__names">
                    <span className="sage-cover__name sage-cover__name--1">{bride}</span>
                    <span className="sage-cover__amp">&amp;</span>
                    <span className="sage-cover__name sage-cover__name--2">{groom}</span>
                </div>

                <p className="sage-cover__addressed">Addressed To</p>
                <div className="sage-cover__guest">{guestName || ''}</div>
                <p className="sage-cover__apology">We apologize for any misspelling on your name or title</p>
            </div>
        </div>
    );
}
