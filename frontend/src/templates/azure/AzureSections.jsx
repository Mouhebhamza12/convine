import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRsvp } from '../../components/shared/useRsvp';
import { useCountdown } from '../../components/shared/useCountdown';
import { HeartDivider, Star, PinIcon } from './AzureArt';
import { azTime, azTicketDate } from './AzureStrings';
import { formatNumber } from '../../lib/locales';
import buildingImg from '../../../assets/azurehouse.png';

gsap.registerPlugin(ScrollTrigger);

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

/* ── SVG assets for the travel world ── */
function Barcode({ className }) {
    const widths = [3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3];
    let x = 0;
    return (
        <svg className={className} viewBox="0 0 90 30" aria-hidden="true">
            {widths.map((w, i) => {
                const r = <rect key={i} x={x} y="0" width={w} height="30" fill="currentColor" />;
                x += w + 1.6;
                return r;
            })}
        </svg>
    );
}

function Perforation({ className }) {
    return (
        <svg className={className} viewBox="0 0 6 200" preserveAspectRatio="none" aria-hidden="true">
            <line x1="3" y1="0" x2="3" y2="200" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" opacity="0.55" />
        </svg>
    );
}

function PlaneGlyph({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12 L21 4 L14 12 L21 20 L3 12 Z" />
            <path d="M14 12 L3 12" />
        </svg>
    );
}

function PostageStamp({ className }) {
    // scalloped postage-stamp frame with a heart
    const bumps = [];
    for (let i = 0; i < 7; i++) bumps.push(<circle key={`t${i}`} cx={8 + i * 9} cy="2" r="2.6" fill="var(--azure-cream)" />);
    for (let i = 0; i < 7; i++) bumps.push(<circle key={`b${i}`} cx={8 + i * 9} cy="78" r="2.6" fill="var(--azure-cream)" />);
    for (let i = 0; i < 7; i++) bumps.push(<circle key={`l${i}`} cx="2" cy={8 + i * 9} r="2.6" fill="var(--azure-cream)" />);
    for (let i = 0; i < 7; i++) bumps.push(<circle key={`r${i}`} cx="68" cy={8 + i * 9} r="2.6" fill="var(--azure-cream)" />);
    return (
        <svg className={className} viewBox="0 0 70 80" aria-hidden="true">
            <rect x="2" y="2" width="66" height="76" fill="rgba(46,94,158,0.12)" />
            {bumps}
            <rect x="9" y="9" width="52" height="62" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M35 50 C28 42 24 36 28 30 C31 26 35 28 35 32 C35 28 39 26 42 30 C46 36 42 42 35 50 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <text x="35" y="64" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="6" letterSpacing="1.5" fill="currentColor">FOREVER</text>
        </svg>
    );
}

function Postmark({ className }) {
    return (
        <svg className={className} viewBox="0 0 90 60" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="30" cy="30" r="22" strokeWidth="1.2" opacity="0.8" />
            <circle cx="30" cy="30" r="16" strokeWidth="0.8" opacity="0.6" />
            <text x="30" y="27" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="6.5" letterSpacing="1" fill="currentColor" stroke="none" opacity="0.85">WITH</text>
            <text x="30" y="37" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="6.5" letterSpacing="1" fill="currentColor" stroke="none" opacity="0.85">LOVE</text>
            <path d="M58 18 C66 22 74 22 84 18 M58 30 C66 34 74 34 84 30 M58 42 C66 46 74 46 84 42" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </svg>
    );
}

function CornerBrackets({ className }) {
    return (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M2 14 L2 2 L14 2 M86 2 L98 2 L98 14 M98 86 L98 98 L86 98 M14 98 L2 98 L2 86" vectorEffect="non-scaling-stroke" />
        </svg>
    );
}

/* ─── CEREMONY TIME → first-class boarding pass ─── */
export function AzureTime({ eventTime, eventDate, bride, groom, strings }) {
    const ref = useRef(null);
    useReveal(ref, '.az-tk-fade');
    const S = strings.time;
    const dateStr = azTicketDate(eventDate, strings.code);

    return (
        <section ref={ref} className="azure-scene">
            <p className="az-tk-fade azure-eyebrow-sans">{S.nowBoarding}</p>
            <div className="az-tk-fade az-ticket">
                <div className="az-ticket__main">
                    <header className="az-ticket__head">
                        <span>{S.firstClass}</span>
                        <PlaneGlyph className="az-ticket__plane" />
                        <span>{dateStr}</span>
                    </header>
                    <div className="az-ticket__route">
                        <div>
                            <small>{S.from}</small>
                            <strong>{S.fromVal[0]}<br />{S.fromVal[1]}</strong>
                        </div>
                        <svg className="az-ticket__dots" viewBox="0 0 120 12" fill="none" stroke="currentColor" aria-hidden="true">
                            <line x1="4" y1="6" x2="116" y2="6" strokeWidth="1.2" strokeDasharray="1 6" strokeLinecap="round" />
                            <path d="M52 6 L66 1 L61 6 L66 11 Z" fill="currentColor" stroke="none" />
                        </svg>
                        <div>
                            <small>{S.to}</small>
                            <strong>{S.toVal[0]}<br />{S.toVal[1]}</strong>
                        </div>
                    </div>
                    <div className="az-ticket__row">
                        <div><small>{S.departure}</small><b className="az-ticket__time">{azTime(eventTime, strings.code)}</b></div>
                        <div><small>{S.gate}</small><b>{S.gateVal}</b></div>
                        <div><small>{S.seat}</small><b>{S.seatVal}</b></div>
                    </div>
                </div>
                <Perforation className="az-ticket__perf" />
                <div className="az-ticket__stub">
                    <small>{bride} &amp; {groom}</small>
                    <b>{azTime(eventTime, strings.code)}</b>
                    <Barcode className="az-ticket__barcode" />
                </div>
            </div>
            <p className="az-tk-fade az-under-note">{S.note}</p>
        </section>
    );
}

/* ─── COUNTDOWN → airport departures board ─── */
function BoardCell({ children }) {
    return (
        <span className="az-board__cell">
            {children}
            <svg viewBox="0 0 10 10" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="5" x2="10" y2="5" stroke="rgba(246,241,227,0.35)" strokeWidth="0.6" /></svg>
        </span>
    );
}

export function AzureCountdown({ eventDate, eventTime, strings }) {
    const ref = useRef(null);
    useReveal(ref, '.az-bd-fade');
    const { days, hours, minutes, seconds } = useCountdown(eventDate, eventTime);
    const code = strings.code;
    const pad = (n, len) => formatNumber(n, code, { minDigits: len });
    const labels = strings.countdown.units;
    const units = [
        [labels[0], pad(days, 3)],
        [labels[1], pad(hours, 2)],
        [labels[2], pad(minutes, 2)],
        [labels[3], pad(seconds, 2)],
    ];

    return (
        <section ref={ref} className="azure-scene">
            <div className="az-bd-fade az-board">
                <header className="az-board__head">
                    <PlaneGlyph className="az-board__plane" />
                    <span>{strings.countdown.departures}</span>
                    <span className="az-board__status">{strings.countdown.onTime}</span>
                </header>
                <p className="az-board__dest">{strings.countdown.dest}</p>
                <div className="az-board__rows">
                    {units.map(([label, value]) => (
                        <div key={label} className="az-board__unit">
                            <div className="az-board__cells">
                                {value.split('').map((ch, i) => <BoardCell key={`${label}${i}`}>{ch}</BoardCell>)}
                            </div>
                            <small>{label}</small>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── VENUE → vintage postcard ─── */
export function AzureLocation({ venue, venueAddress, googleMapsUrl, strings }) {
    const ref = useRef(null);
    useReveal(ref, '.az-pc-fade');
    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    const addrParts = (venueAddress || '').split(',').map((s) => s.trim()).filter(Boolean);
    const S = strings.location;

    return (
        <section ref={ref} className="azure-scene">
            <div className="az-pc-fade az-postcard">
                <div className="az-postcard__left">
                    <p className="az-postcard__greet">{S.greet}</p>
                    <h3 className="az-postcard__venue">{venue || S.venueDefault}</h3>
                    <div className="az-postcard__img">
                        <img src={buildingImg} alt={venue || 'Venue'} />
                    </div>
                </div>
                <Perforation className="az-postcard__split" />
                <div className="az-postcard__right">
                    <div className="az-postcard__franking">
                        <Postmark className="az-postcard__postmark" />
                        <PostageStamp className="az-postcard__stamp" />
                    </div>
                    <div className="az-postcard__addr">
                        {(addrParts.length ? addrParts : [S.addrFallback]).slice(0, 3).map((line, i) => (
                            <p key={i}>
                                <span>{line}</span>
                                <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="1" opacity="0.4" /></svg>
                            </p>
                        ))}
                    </div>
                    {mapsQuery && (
                        <a className="az-postcard__btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                            <PinIcon className="az-postcard__pin" />
                            {S.btn}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─── RSVP → passport stamp page ─── */
export function AzureRsvp({ guestName, initialStatus, onSubmit, isDemo, strings }) {
    const ref = useRef(null);
    useReveal(ref, '.az-pp-fade');
    const { status, submitting, respond } = useRsvp(initialStatus, onSubmit, isDemo);
    const stampRef = useRef(null);
    const S = strings.rsvp;

    useEffect(() => {
        if (status && stampRef.current) {
            gsap.fromTo(stampRef.current, { scale: 1.7, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: -8, duration: 0.5, ease: 'power4.out' });
        }
    }, [status]);

    const attending = status === 'attending';

    return (
        <section ref={ref} className="azure-scene">
            <div className="az-pp-fade az-passport">
                <CornerBrackets className="az-passport__corners" />
                <header className="az-passport__head">
                    <span>{S.official}</span>
                    <Star className="az-passport__star" />
                    <span>{S.visa}</span>
                </header>
                <p className="az-passport__bearer">
                    {S.bearer} <strong>{guestName}</strong>
                </p>

                {!status ? (
                    <>
                        <p className="az-passport__note">{S.note}</p>
                        <div className="az-passport__stamps">
                            <button type="button" disabled={submitting} onClick={() => respond('attending')} className="az-stampbtn">
                                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" aria-hidden="true">
                                    <circle cx="60" cy="60" r="54" strokeWidth="3" />
                                    <circle cx="60" cy="60" r="45" strokeWidth="1.2" strokeDasharray="3 4" />
                                    <path d="M60 78 C46 64 40 54 47 45 C52 39 60 42 60 49 C60 42 68 39 73 45 C80 54 74 64 60 78 Z" strokeWidth="2.4" />
                                </svg>
                                <span>{S.accept[0]}<br />{S.accept[1]}</span>
                            </button>
                            <button type="button" disabled={submitting} onClick={() => respond('declined')} className="az-stampbtn az-stampbtn--decline">
                                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" aria-hidden="true">
                                    <rect x="8" y="22" width="104" height="76" strokeWidth="3" transform="rotate(-4 60 60)" />
                                    <rect x="16" y="30" width="88" height="60" strokeWidth="1.2" strokeDasharray="3 4" transform="rotate(-4 60 60)" />
                                    <path d="M44 50 C52 58 68 70 76 70 M76 50 C68 58 52 70 44 70" strokeWidth="2.2" strokeLinecap="round" transform="rotate(-4 60 60)" />
                                </svg>
                                <span>{S.decline[0]}<br />{S.decline[1]}</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="az-passport__verdict">
                        <svg ref={stampRef} className="az-passport__bigstamp" viewBox="0 0 240 120" fill="none" stroke="currentColor" aria-hidden="true">
                            <rect x="6" y="6" width="228" height="108" strokeWidth="4" />
                            <rect x="16" y="16" width="208" height="88" strokeWidth="1.4" strokeDasharray="4 5" />
                            <text x="120" y="58" textAnchor="middle" fontFamily={strings.code === 'ar' ? "'Reem Kufi', sans-serif" : 'Jost, sans-serif'} fontWeight="600" fontSize="26" letterSpacing={strings.code === 'ar' ? 0 : 6} fill="currentColor" stroke="none">
                                {attending ? S.approved : S.regrets}
                            </text>
                            <text x="120" y="86" textAnchor="middle" fontFamily={strings.code === 'ar' ? "'Reem Kufi', sans-serif" : 'Jost, sans-serif'} fontSize="11" letterSpacing={strings.code === 'ar' ? 0 : 3} fill="currentColor" stroke="none">
                                {attending ? S.approvedSub : S.regretsSub}
                            </text>
                        </svg>
                        <p className="az-passport__msg">
                            {attending ? S.confirmYes(guestName) : S.confirmNo(guestName)}
                        </p>
                    </div>
                )}
                <HeartDivider className="az-passport__div" />
            </div>
        </section>
    );
}
