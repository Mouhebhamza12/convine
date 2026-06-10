import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import buildingImg from '../../../assets/buildingsvg.png';

gsap.registerPlugin(ScrollTrigger);

const G = 'var(--hero-gold)';

/* ─── Fleuron rule (line · diamond · line) ─── */
function FleuronRule() {
    return (
        <svg className="location-fleuron" width="160" height="14" viewBox="0 0 160 14" fill="none" aria-hidden="true">
            <g stroke={G} strokeWidth="0.8" fill="none" strokeLinecap="round">
                <line x1="20" y1="7" x2="68" y2="7" opacity="0.45" />
                <line x1="92" y1="7" x2="140" y2="7" opacity="0.45" />
                <path d="M80 2.5 L84 7 L80 11.5 L76 7 Z" />
            </g>
            <circle cx="80" cy="7" r="1.1" fill={G} />
        </svg>
    );
}

export default function Location({ venue, venueAddress, googleMapsUrl }) {
    const sceneRef = useRef(null);

    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    // Split the address into up to two lines on the first comma.
    let addrLine1 = venueAddress || '';
    let addrLine2 = '';
    if (venueAddress) {
        const i = venueAddress.indexOf(',');
        if (i !== -1) {
            addrLine1 = venueAddress.slice(0, i).trim();
            addrLine2 = venueAddress.slice(i + 1).trim();
        }
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sceneRef.current,
                    start: 'top 72%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.fromTo('.location-pin', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 0)
                .fromTo('.location-title', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 0.2)
                .fromTo('.location-venue', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1 }, 0.4)
                .fromTo('.location-building', { opacity: 0, y: 26, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.3 }, 0.6)
                .fromTo('.location-address', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 1.0)
                .fromTo('.location-map-btn', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 1.2);
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene location-scene velvet-section">
            <div className="location-content">
                <div className="location-pin" aria-hidden="true">
                    <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
                        <path
                            d="M24 4C16.268 4 10 10.268 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.268 31.732 4 24 4Z"
                            stroke={G}
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle cx="24" cy="18" r="5" fill={G} />
                    </svg>
                </div>

                <p className="location-title">Where We Celebrate</p>

                <FleuronRule />

                <h2 className="location-venue">{venue || 'Venue TBA'}</h2>

                <div className="location-building">
                    <img className="location-building-img" src={buildingImg} alt={venue || 'Venue'} />
                </div>

                {venueAddress && (
                    <p className="location-address">
                        {addrLine1}
                        {addrLine2 && (
                            <>
                                <br />
                                {addrLine2}
                            </>
                        )}
                    </p>
                )}

                <FleuronRule />

                {mapsQuery && (
                    <a className="location-map-btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                        <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
                            <path
                                d="M24 4C16.268 4 10 10.268 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.268 31.732 4 24 4Z"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                            />
                            <circle cx="24" cy="18" r="6" fill="currentColor" />
                        </svg>
                        Open in Google Maps
                    </a>
                )}
            </div>
        </section>
    );
}
