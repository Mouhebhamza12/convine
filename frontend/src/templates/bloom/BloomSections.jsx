import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRsvp } from '../../components/shared/useRsvp';
import { useCountdown } from '../../components/shared/useCountdown';
import { LeafDivider } from './BloomBotanicals';
import buildingImg from '../../../assets/buildingsvg.png';

gsap.registerPlugin(ScrollTrigger);

const ROSE = 'var(--bloom-rose)';
const SAGE = 'var(--bloom-sage-deep, #6f8a6f)';

function useReveal(ref, selector) {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(selector, { opacity: 0, y: 26 }, {
                opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 78%' },
            });
        }, ref);
        return () => ctx.revert();
    }, [ref, selector]);
}

/* ─── CEREMONY TIME → ribbon-hung keepsake locket ─── */
function RibbonLocket({ className, children }) {
    return (
        <div className={className}>
            <svg className="bl-locket__svg" viewBox="0 0 200 260" fill="none" stroke={ROSE} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {/* ribbon tails from above */}
                <path d="M100 0 C96 18 96 34 100 48" strokeWidth="1.6" />
                {/* bow */}
                <path d="M100 52 C88 40 70 42 68 54 C66 66 84 70 100 58 C116 70 134 66 132 54 C130 42 112 40 100 52 Z" strokeWidth="1.6" />
                <path d="M92 62 C88 74 86 84 88 94 M108 62 C112 74 114 84 112 94" strokeWidth="1.3" opacity="0.8" />
                {/* bail + chain to locket */}
                <circle cx="100" cy="74" r="4" strokeWidth="1.3" />
                <path d="M100 78 L100 92" strokeWidth="1.3" />
                {/* locket oval, double ring */}
                <ellipse cx="100" cy="166" rx="72" ry="74" strokeWidth="2" />
                <ellipse cx="100" cy="166" rx="63" ry="65" strokeWidth="0.9" opacity="0.7" />
                {/* hinge detail */}
                <circle cx="100" cy="92" r="3" strokeWidth="1.2" />
                {/* tiny heart charm at the base */}
                <path d="M100 246 C94 240 91 235 94 231 C96 228 100 230 100 233 C100 230 104 228 106 231 C109 235 106 240 100 246 Z" strokeWidth="1.3" />
            </svg>
            <div className="bl-locket__inside">{children}</div>
        </div>
    );
}

export function BloomTime({ eventTime }) {
    const ref = useRef(null);
    useReveal(ref, '.bl-tm-fade');
    const [h, m] = String(eventTime || '19:00').split(':').map(Number);
    const display = `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')}`;
    const part = h < 12 ? 'in the morning' : h < 18 ? 'in the afternoon' : 'in the evening';

    return (
        <section ref={ref} className="bloom-scene">
            <p className="bl-tm-fade bloom-eyebrow">A keepsake of the hour</p>
            <RibbonLocket className="bl-tm-fade bl-locket">
                <strong>{display}</strong>
                <em>{part}</em>
            </RibbonLocket>
            <p className="bl-tm-fade bl-locket__note">the moment our ceremony begins, kept close to the heart</p>
        </section>
    );
}

/* ─── COUNTDOWN → storybook page with illuminated drop cap ─── */
function DropCapOrnament({ className }) {
    return (
        <svg className={className} viewBox="0 0 90 90" fill="none" stroke={ROSE} strokeLinecap="round" aria-hidden="true">
            <rect x="4" y="4" width="82" height="82" strokeWidth="1.4" />
            <rect x="9" y="9" width="72" height="72" strokeWidth="0.7" opacity="0.6" />
            {/* corner buds */}
            <circle cx="9" cy="9" r="2.4" fill={ROSE} stroke="none" opacity="0.8" />
            <circle cx="81" cy="9" r="2.4" fill={ROSE} stroke="none" opacity="0.8" />
            <circle cx="9" cy="81" r="2.4" fill={ROSE} stroke="none" opacity="0.8" />
            <circle cx="81" cy="81" r="2.4" fill={ROSE} stroke="none" opacity="0.8" />
            {/* vine inside, behind the letter */}
            <path d="M14 76 C30 60 36 40 30 16 M60 74 C72 58 76 40 72 18" stroke={SAGE} strokeWidth="0.8" opacity="0.5" />
        </svg>
    );
}

export function BloomCountdown({ eventDate, eventTime }) {
    const ref = useRef(null);
    useReveal(ref, '.bl-sb-fade');
    const { days, hours, minutes } = useCountdown(eventDate, eventTime);

    return (
        <section ref={ref} className="bloom-scene">
            <div className="bl-sb-fade bl-story">
                <p className="bl-story__chapter">the final chapter</p>
                <div className="bl-story__prose">
                    <span className="bl-story__cap">
                        <DropCapOrnament className="bl-story__capframe" />
                        <i>I</i>
                    </span>
                    <p>
                        n just <strong>{days}</strong> {days === 1 ? 'day' : 'days'},{' '}
                        <strong>{hours}</strong> {hours === 1 ? 'hour' : 'hours'} and{' '}
                        <strong>{minutes}</strong> {minutes === 1 ? 'minute' : 'minutes'}, our story
                        turns its happiest page, and you are written into it.
                    </p>
                </div>
                <LeafDivider className="bl-story__divider" />
                <p className="bl-story__tbc">to be continued, together…</p>
            </div>
        </section>
    );
}

/* ─── VENUE → gallery wall: framed artwork + museum placard ─── */
function GalleryFrame({ className, children }) {
    return (
        <div className={className}>
            <svg className="bl-frame__svg" viewBox="0 0 300 270" fill="none" stroke={ROSE} strokeLinecap="round" aria-hidden="true">
                {/* hanging wire + nail */}
                <circle cx="150" cy="8" r="3.4" strokeWidth="1.4" />
                <path d="M48 56 L150 10 L252 56" strokeWidth="1" opacity="0.7" />
                {/* frame, double moulding */}
                <rect x="22" y="54" width="256" height="206" strokeWidth="2.4" />
                <rect x="34" y="66" width="232" height="182" strokeWidth="1" opacity="0.7" />
                {/* corner rosettes */}
                {[[22, 54], [278, 54], [22, 260], [278, 260]].map(([x, y]) => (
                    <g key={`${x}-${y}`}>
                        <circle cx={x} cy={y} r="6.5" strokeWidth="1.3" fill="var(--bloom-bg, #fbf6f2)" />
                        <circle cx={x} cy={y} r="2.2" fill={ROSE} stroke="none" />
                    </g>
                ))}
            </svg>
            <div className="bl-frame__art">{children}</div>
        </div>
    );
}

export function BloomLocation({ venue, venueAddress, googleMapsUrl }) {
    const ref = useRef(null);
    useReveal(ref, '.bl-gl-fade');
    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    return (
        <section ref={ref} className="bloom-scene">
            <p className="bl-gl-fade bloom-eyebrow">From our gallery of places</p>

            <GalleryFrame className="bl-gl-fade bl-frame">
                <img src={buildingImg} alt={venue || 'Venue'} />
            </GalleryFrame>

            <div className="bl-gl-fade bl-placard">
                <h3>{venue || 'The Venue'}</h3>
                <em>watercolour &amp; stone where we say “I do”</em>
                {venueAddress && <p>{venueAddress}</p>}
                {mapsQuery && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                        private viewing, open in maps
                    </a>
                )}
            </div>
        </section>
    );
}

/* ─── RSVP → handwritten response card with quill ─── */
function Quill({ className }) {
    return (
        <svg className={className} viewBox="0 0 80 80" fill="none" stroke={ROSE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M64 8 C46 14 32 28 24 48 L20 62 L34 58 C54 50 66 34 70 14 C68 10 66 8 64 8 Z" />
            <path d="M24 48 C38 36 50 26 62 16" strokeWidth="0.9" opacity="0.7" />
            <path d="M20 62 L12 70" strokeWidth="1.6" />
            <path d="M34 34 C40 32 46 28 50 24 M30 42 C36 40 42 36 47 32" strokeWidth="0.7" opacity="0.6" />
        </svg>
    );
}

function InkLine({ className }) {
    return (
        <svg className={className} viewBox="0 0 220 10" preserveAspectRatio="none" fill="none" stroke={ROSE} strokeLinecap="round" aria-hidden="true">
            <path d="M4 6 C60 3.5 150 3.5 216 6" strokeWidth="1.1" opacity="0.7" />
        </svg>
    );
}

export function BloomRsvp({ guestName, initialStatus, onSubmit, isDemo }) {
    const ref = useRef(null);
    useReveal(ref, '.bl-rc-fade');
    const { status, submitting, respond } = useRsvp(initialStatus, onSubmit, isDemo);
    const scriptRef = useRef(null);
    const attending = status === 'attending';

    useEffect(() => {
        if (status && scriptRef.current) {
            gsap.fromTo(scriptRef.current, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' });
        }
    }, [status]);

    return (
        <section ref={ref} className="bloom-scene">
            <div className="bl-rc-fade bl-card">
                <Quill className="bl-card__quill" />
                <p className="bl-card__rsvp">R.s.v.p.</p>
                <p className="bl-card__ask">Kindly reply by hand, dear <strong>{guestName}</strong></p>

                {!status ? (
                    <div className="bl-card__lines">
                        <button type="button" disabled={submitting} onClick={() => respond('attending')} className="bl-card__line">
                            <span className="bl-card__hint">sign here to accept</span>
                            <InkLine className="bl-card__ink" />
                        </button>
                        <button type="button" disabled={submitting} onClick={() => respond('declined')} className="bl-card__line">
                            <span className="bl-card__hint">sign here to decline</span>
                            <InkLine className="bl-card__ink" />
                        </button>
                    </div>
                ) : (
                    <div className="bl-card__signed">
                        <p ref={scriptRef} className="bl-card__script">{attending ? 'With pleasure!' : 'With regret…'}</p>
                        <InkLine className="bl-card__ink" />
                        <p className="bl-card__msg">
                            {attending
                                ? `Your reply is pressed between these pages, ${guestName}, we cannot wait.`
                                : `Your note is kept with love, ${guestName}, you will be missed.`}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
