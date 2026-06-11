import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRsvp } from '../../components/shared/useRsvp';
import { useCountdown } from '../../components/shared/useCountdown';
import buildingImg from '../../../assets/buildingsvg.png';

gsap.registerPlugin(ScrollTrigger);

const INK = 'var(--sage-green-deep)';

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

/* ─── CEREMONY TIME → heirloom pocket watch, hands set to the hour ─── */
function PocketWatch({ time, className }) {
    const [h, m] = String(time || '19:00').split(':').map(Number);
    const minA = (m || 0) * 6;
    const hourA = ((h % 12) + (m || 0) / 60) * 30;
    const ticks = [];
    for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        const x1 = 70 + Math.sin(a) * 46;
        const y1 = 78 - Math.cos(a) * 46;
        const x2 = 70 + Math.sin(a) * (i % 3 === 0 ? 39 : 42);
        const y2 = 78 - Math.cos(a) * (i % 3 === 0 ? 39 : 42);
        ticks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 1.8 : 1} />);
    }
    return (
        <svg className={className} viewBox="0 0 140 150" fill="none" stroke={INK} strokeLinecap="round" aria-hidden="true">
            {/* crown + bow */}
            <circle cx="70" cy="10" r="6" strokeWidth="1.6" />
            <rect x="65" y="16" width="10" height="7" rx="2" strokeWidth="1.4" />
            {/* case */}
            <circle cx="70" cy="78" r="56" strokeWidth="2.2" />
            <circle cx="70" cy="78" r="50" strokeWidth="1" opacity="0.6" />
            {ticks}
            {/* numerals */}
            <text x="70" y="42" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fill={INK} stroke="none">XII</text>
            <text x="104" y="82" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fill={INK} stroke="none">III</text>
            <text x="70" y="122" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fill={INK} stroke="none">VI</text>
            <text x="36" y="82" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fill={INK} stroke="none">IX</text>
            {/* hands set to the actual ceremony time */}
            <line x1="70" y1="78" x2="70" y2="50" strokeWidth="2.4" transform={`rotate(${hourA} 70 78)`} />
            <line x1="70" y1="78" x2="70" y2="40" strokeWidth="1.4" transform={`rotate(${minA} 70 78)`} />
            <circle cx="70" cy="78" r="2.6" fill={INK} stroke="none" />
        </svg>
    );
}

function timeInWords(t) {
    const [h, m] = String(t || '19:00').split(':').map(Number);
    const names = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
    const hour = names[h % 12];
    const part = h < 12 ? 'in the morning' : h < 18 ? 'in the afternoon' : 'in the evening';
    if (!m) return `${hour} o’clock ${part}`;
    if (m === 30) return `half past ${hour} ${part}`;
    return `${hour}:${String(m).padStart(2, '0')} ${part}`;
}

export function SageTime({ eventTime }) {
    const ref = useRef(null);
    useReveal(ref, '.sg-tm-fade');
    return (
        <section ref={ref} className="sage-scene">
            <p className="sg-tm-fade sage-eyebrow">When the watch reads</p>
            <PocketWatch time={eventTime} className="sg-tm-fade sg-watch" />
            <p className="sg-tm-fade sg-watch__words">at {timeInWords(eventTime)}</p>
            <p className="sg-tm-fade sg-watch__note">the ceremony begins, we would be honored by your presence</p>
        </section>
    );
}

/* ─── COUNTDOWN → botanist's field-journal entry ─── */
function DottedLeader() {
    return (
        <svg className="sg-journal__leader" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="2" x2="100" y2="2" stroke={INK} strokeWidth="1.4" strokeDasharray="0.2 4" strokeLinecap="round" opacity="0.55" />
        </svg>
    );
}

export function SageCountdown({ eventDate, eventTime }) {
    const ref = useRef(null);
    useReveal(ref, '.sg-jr-fade');
    const { days, hours, minutes, seconds } = useCountdown(eventDate, eventTime);
    const rows = [
        ['Days remaining', days],
        ['Hours', hours],
        ['Minutes', minutes],
        ['Seconds', seconds],
    ];

    return (
        <section ref={ref} className="sage-scene">
            <div className="sg-jr-fade sg-journal">
                {/* ruled page lines */}
                <svg className="sg-journal__rules" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    {[18, 30, 42, 54, 66, 78, 90].map((y) => (
                        <line key={y} x1="6" y1={y} x2="94" y2={y} stroke={INK} strokeWidth="0.18" opacity="0.3" />
                    ))}
                    <line x1="14" y1="4" x2="14" y2="96" stroke="#c98f86" strokeWidth="0.25" opacity="0.5" />
                </svg>
                <header className="sg-journal__head">
                    <span>Field notes</span>
                    <em>counting the days</em>
                </header>
                <div className="sg-journal__rows">
                    {rows.map(([label, value]) => (
                        <div key={label} className="sg-journal__row">
                            <span>{label}</span>
                            <DottedLeader />
                            <strong>{value}</strong>
                        </div>
                    ))}
                </div>
                <p className="sg-journal__obs">obs: the garden will be in full bloom by then</p>
            </div>
        </section>
    );
}

/* ─── VENUE → architectural survey plate with labelled leader lines ─── */
function CompassRose({ className }) {
    return (
        <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeLinejoin="round" aria-hidden="true">
            <circle cx="20" cy="20" r="17" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="12" strokeWidth="0.6" opacity="0.5" />
            <path d="M20 5 L23 20 L20 35 L17 20 Z" strokeWidth="1" fill="currentColor" fillOpacity="0.18" />
            <path d="M5 20 L20 17 L35 20 L20 23 Z" strokeWidth="1" />
            <text x="20" y="4" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="7" fill="currentColor" stroke="none">N</text>
        </svg>
    );
}

export function SageLocation({ venue, venueAddress, googleMapsUrl }) {
    const ref = useRef(null);
    useReveal(ref, '.sg-pl-fade');
    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    return (
        <section ref={ref} className="sage-scene">
            <p className="sg-pl-fade sg-plate__no">Plate № I: the grounds</p>
            <h3 className="sg-pl-fade sg-plate__title">{venue || 'The Estate'}</h3>

            <div className="sg-pl-fade sg-plate">
                <img className="sg-plate__img" src={buildingImg} alt={venue || 'Venue'} />
                {/* survey leader lines + labels */}
                <svg className="sg-plate__leaders" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke={INK} aria-hidden="true">
                    <path d="M8 26 L30 38" strokeWidth="0.45" />
                    <circle cx="30" cy="38" r="0.9" fill={INK} stroke="none" />
                    <path d="M92 20 L68 32" strokeWidth="0.45" />
                    <circle cx="68" cy="32" r="0.9" fill={INK} stroke="none" />
                    <path d="M90 78 L66 66" strokeWidth="0.45" />
                    <circle cx="66" cy="66" r="0.9" fill={INK} stroke="none" />
                </svg>
                <span className="sg-plate__label sg-plate__label--1">the spires</span>
                <span className="sg-plate__label sg-plate__label--2">grand hall</span>
                <span className="sg-plate__label sg-plate__label--3">ceremony lawn</span>
            </div>

            {venueAddress && <p className="sg-pl-fade sg-plate__caption">surveyed at: {venueAddress}</p>}

            {mapsQuery && (
                <a className="sg-pl-fade sg-plate__btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <CompassRose className="sg-plate__compass" />
                    <span>Chart your way there</span>
                </a>
            )}
        </section>
    );
}

/* ─── RSVP → stationery reply card with hand-checked boxes ─── */
function CheckBox({ checked }) {
    return (
        <svg className="sg-reply__box" viewBox="0 0 26 26" fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3.5 4.5 C10 3 18 3 22.5 4 C23.5 11 23.5 17 22.5 22 C16 23.5 9 23.5 3.5 22.5 C2.5 16 2.5 10 3.5 4.5 Z" strokeWidth="1.5" />
            <path className={`sg-reply__tick${checked ? ' is-on' : ''}`} d="M6 14 L11 19 C13 13 17 8 21 5" strokeWidth="2.2" pathLength="1" />
        </svg>
    );
}

function WaxSeal({ className }) {
    return (
        <svg className={className} viewBox="0 0 90 90" fill="none" aria-hidden="true">
            <path d="M45 6 C62 4 80 16 83 33 C86 48 80 64 66 74 C52 84 32 84 20 73 C8 62 4 44 10 29 C16 15 30 8 45 6 Z" fill="var(--sage-green)" fillOpacity="0.92" stroke="var(--sage-green-deep)" strokeWidth="1.2" />
            <circle cx="45" cy="44" r="26" stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none" />
            <path d="M45 58 C45 50 45 40 45 32 M45 44 C40 42 37 39 36 34 M45 44 C50 42 53 39 54 34" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" fill="none" />
        </svg>
    );
}

export function SageRsvp({ guestName, initialStatus, onSubmit, isDemo }) {
    const ref = useRef(null);
    useReveal(ref, '.sg-rp-fade');
    const { status, submitting, respond } = useRsvp(initialStatus, onSubmit, isDemo);
    const attending = status === 'attending';

    return (
        <section ref={ref} className="sage-scene">
            <div className="sg-rp-fade sg-reply">
                {/* double rule top */}
                <svg className="sg-reply__rule" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="0" y1="2" x2="200" y2="2" stroke={INK} strokeWidth="1.6" />
                    <line x1="0" y1="6.5" x2="200" y2="6.5" stroke={INK} strokeWidth="0.6" />
                </svg>

                <p className="sg-reply__head">The favour of a reply is requested</p>
                <p className="sg-reply__guest">prepared for <strong>{guestName}</strong></p>

                {!status ? (
                    <div className="sg-reply__options">
                        <button type="button" disabled={submitting} onClick={() => respond('attending')} className="sg-reply__opt">
                            <CheckBox checked={false} />
                            <span>accepts with pleasure</span>
                        </button>
                        <button type="button" disabled={submitting} onClick={() => respond('declined')} className="sg-reply__opt">
                            <CheckBox checked={false} />
                            <span>declines with regret</span>
                        </button>
                    </div>
                ) : (
                    <div className="sg-reply__done">
                        <div className="sg-reply__options">
                            <div className={`sg-reply__opt is-final${attending ? '' : ' is-dim'}`}>
                                <CheckBox checked={attending} />
                                <span>accepts with pleasure</span>
                            </div>
                            <div className={`sg-reply__opt is-final${attending ? ' is-dim' : ''}`}>
                                <CheckBox checked={!attending} />
                                <span>declines with regret</span>
                            </div>
                        </div>
                        <WaxSeal className="sg-reply__seal" />
                        <p className="sg-reply__msg">
                            {attending
                                ? `Noted with joy, we cannot wait to celebrate with you, ${guestName}.`
                                : `Noted with love, you will be missed dearly, ${guestName}.`}
                        </p>
                    </div>
                )}

                <svg className="sg-reply__rule sg-reply__rule--btm" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="0" y1="1.5" x2="200" y2="1.5" stroke={INK} strokeWidth="0.6" />
                    <line x1="0" y1="6" x2="200" y2="6" stroke={INK} strokeWidth="1.6" />
                </svg>
            </div>
        </section>
    );
}
