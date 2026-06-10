import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_MESSAGE =
    'We are delighted to invite you to celebrate our wedding and share this special day with us.';

const G = 'var(--hero-gold)';

/* ─── Top divider: ·· ♥ ·· flanked by tapering rules ─── */
function HeartDotsDivider() {
    return (
        <svg className="letter-top-divider" width="200" height="20" viewBox="0 0 200 20" fill="none" aria-hidden="true">
            <g stroke={G} strokeWidth="0.8" strokeLinecap="round">
                <line x1="22" y1="10" x2="66" y2="10" opacity="0.45" />
                <line x1="134" y1="10" x2="178" y2="10" opacity="0.45" />
            </g>
            <g fill={G}>
                <circle cx="76" cy="10" r="1.3" opacity="0.7" />
                <circle cx="83" cy="10" r="1.3" opacity="0.7" />
                <circle cx="117" cy="10" r="1.3" opacity="0.7" />
                <circle cx="124" cy="10" r="1.3" opacity="0.7" />
            </g>
            <path
                d="M100 7 C98.5 4 95 4 95 7.5 C95 10.5 100 14 100 14 C100 14 105 10.5 105 7.5 C105 4 101.5 4 100 7 Z"
                stroke={G}
                strokeWidth="0.9"
                fill="none"
            />
        </svg>
    );
}

/* ─── Fleuron rule beneath the greeting ─── */
function FleuronRule() {
    return (
        <svg className="letter-fleuron" width="220" height="16" viewBox="0 0 220 16" fill="none" aria-hidden="true">
            <g stroke={G} strokeWidth="0.8" fill="none" strokeLinecap="round">
                <line x1="20" y1="8" x2="92" y2="8" opacity="0.45" />
                <line x1="128" y1="8" x2="200" y2="8" opacity="0.45" />
                <path d="M104 8 C108 4 110 6 110 8 C110 10 112 12 116 8" opacity="0.7" />
                <path d="M104 8 C108 12 110 10 110 8" opacity="0.7" />
            </g>
            <path d="M110 3 L114 8 L110 13 L106 8 Z" stroke={G} strokeWidth="0.8" fill="none" />
            <circle cx="110" cy="8" r="1.2" fill={G} />
        </svg>
    );
}

/* ─── Small heart rule beneath the names ─── */
function NamesHeartRule() {
    return (
        <svg className="letter-names-heart" width="150" height="16" viewBox="0 0 150 16" fill="none" aria-hidden="true">
            <g stroke={G} strokeWidth="0.7" strokeLinecap="round">
                <line x1="24" y1="8" x2="64" y2="8" opacity="0.4" />
                <line x1="86" y1="8" x2="126" y2="8" opacity="0.4" />
            </g>
            <path
                d="M75 6 C73.5 3 70 3 70 6.5 C70 9.5 75 13 75 13 C75 13 80 9.5 80 6.5 C80 3 76.5 3 75 6 Z"
                stroke={G}
                strokeWidth="0.9"
                fill="none"
            />
        </svg>
    );
}

/* ─── Wax-seal coin with a gold heart ─── */
function WaxSealCoin({ className }) {
    return (
        <svg className={className} width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden="true">
            <circle cx="42" cy="42" r="33" fill="#f3e2d4" />
            <circle cx="42" cy="42" r="33" stroke={G} strokeWidth="1.4" />
            <circle cx="42" cy="42" r="28" stroke={G} strokeWidth="0.8" strokeDasharray="1.5 3" opacity="0.7" />
            <path
                d="M42 34 C39 28 31 29 31 36 C31 43 42 50 42 50 C42 50 53 43 53 36 C53 29 45 28 42 34 Z"
                fill={G}
            />
        </svg>
    );
}

export default function InvitationLetter({ guestName, brideName, groomName, message }) {
    const sceneRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sceneRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.fromTo('.letter-top-divider', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 0)
                .fromTo('.letter-greeting', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, 0.25)
                .fromTo('.letter-fleuron', { opacity: 0, scaleX: 0.7 }, { opacity: 1, scaleX: 1, duration: 0.8 }, 0.5)
                .fromTo('.letter-body', { opacity: 0, y: 18, filter: 'blur(3px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2 }, 0.7)
                .fromTo('.letter-names', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.3 }, 1.0)
                .fromTo('.letter-names-heart', { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.4)
                .fromTo('.letter-seal', { opacity: 0, scale: 0, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' }, 1.7);
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene letter-scene velvet-section">
            <div className="letter-content">
                <HeartDotsDivider />

                <p className="letter-greeting">
                    Dear <strong>{guestName}</strong>,
                </p>

                <FleuronRule />

                <p className="letter-body">{message || DEFAULT_MESSAGE}</p>

                <p className="letter-names">
                    {brideName} &amp; {groomName}
                </p>

                <NamesHeartRule />

                <WaxSealCoin className="letter-seal" />
            </div>
        </section>
    );
}
