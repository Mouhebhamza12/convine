import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { parseEventDate } from '../../lib/formatWeddingDate';

gsap.registerPlugin(ScrollTrigger);

/**
 * Generates a Google Calendar URL from event details.
 */
function buildGoogleCalendarUrl({ title, date, time, venue, address }) {
    const { day, month, year } = parseEventDate(date);
    // Build date string: YYYYMMDD
    const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
    const dateStr = `${year}${String(monthNum).padStart(2, '0')}${String(day).padStart(2, '0')}`;

    let startStr = dateStr;
    let endStr = dateStr;

    if (time) {
        const [h, m] = time.split(':').map(Number);
        startStr = `${dateStr}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
        // Default 4 hour event
        const endH = h + 4;
        endStr = `${dateStr}T${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    }

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title || 'Wedding Celebration',
        dates: `${startStr}/${endStr}`,
        details: `You are invited to celebrate with us!`,
        location: [venue, address].filter(Boolean).join(', '),
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an .ics file content string.
 */
function buildIcsContent({ title, date, time, venue, address }) {
    const { day, month, year } = parseEventDate(date);
    const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
    const dateStr = `${year}${String(monthNum).padStart(2, '0')}${String(day).padStart(2, '0')}`;

    let dtStart = dateStr;
    let dtEnd = dateStr;

    if (time) {
        const [h, m] = time.split(':').map(Number);
        dtStart = `${dateStr}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
        const endH = h + 4;
        dtEnd = `${dateStr}T${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    }

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Convine//Wedding//EN',
        'BEGIN:VEVENT',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${title || 'Wedding Celebration'}`,
        `LOCATION:${[venue, address].filter(Boolean).join(', ')}`,
        'DESCRIPTION:You are invited to celebrate with us!',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
}

const G = 'var(--hero-gold)';

/* ─── Oval medallion with a leaf sprig ─── */
function OvalMedallion() {
    return (
        <svg className="cal-medallion" width="72" height="96" viewBox="0 0 72 96" fill="none" aria-hidden="true">
            <ellipse cx="36" cy="48" rx="26" ry="34" stroke={G} strokeWidth="0.9" fill="none" />
            <ellipse cx="36" cy="48" rx="23" ry="31" stroke={G} strokeWidth="0.5" fill="none" opacity="0.4" />
            <g stroke={G} strokeWidth="0.9" fill="none" strokeLinecap="round">
                <path d="M36 64 C36 56 36 46 36 36" />
                <path d="M36 44 C31 42 28 39 26 34" />
                <path d="M36 44 C41 42 44 39 46 34" />
                <path d="M36 52 C32 50 29 48 27 43" />
                <path d="M36 52 C40 50 43 48 45 43" />
            </g>
            <circle cx="36" cy="34" r="1.4" fill={G} />
            <path d="M36 3 L39 7 L36 11 L33 7 Z" fill={G} />
            <path d="M36 85 L39 89 L36 93 L33 89 Z" fill={G} />
        </svg>
    );
}

/* ─── Fleuron rule (line · ornament · line) ─── */
function FleuronRule({ className = '' }) {
    return (
        <svg className={`cal-fleuron ${className}`.trim()} width="180" height="16" viewBox="0 0 180 16" fill="none" aria-hidden="true">
            <g stroke={G} strokeWidth="0.8" fill="none" strokeLinecap="round">
                <line x1="20" y1="8" x2="74" y2="8" opacity="0.45" />
                <line x1="106" y1="8" x2="160" y2="8" opacity="0.45" />
                <path d="M80 8 C84 4 86 6 86 8 C86 10 88 12 92 8" opacity="0.7" />
                <path d="M100 8 C96 4 94 6 94 8 C94 10 92 12 88 8" opacity="0.7" />
            </g>
            <path d="M90 3 L94 8 L90 13 L86 8 Z" stroke={G} strokeWidth="0.8" fill="none" />
            <circle cx="90" cy="8" r="1.1" fill={G} />
        </svg>
    );
}

export default function AddToCalendar({ eventDate, eventTime, venue, venueAddress, brideName, groomName }) {
    const sceneRef = useRef(null);
    const contentRef = useRef(null);

    const title = `${brideName || 'Bride'} & ${groomName || 'Groom'}'s Wedding`;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 30, scale: 0.96 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 80%' },
                },
            );
        }, sceneRef);
        return () => ctx.revert();
    }, []);

    const handleGoogle = useCallback(() => {
        const url = buildGoogleCalendarUrl({
            title, date: eventDate, time: eventTime, venue, address: venueAddress,
        });
        window.open(url, '_blank', 'noopener,noreferrer');
    }, [title, eventDate, eventTime, venue, venueAddress]);

    const handleIcs = useCallback(() => {
        const ics = buildIcsContent({
            title, date: eventDate, time: eventTime, venue, address: venueAddress,
        });
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wedding-invitation.ics';
        a.click();
        URL.revokeObjectURL(url);
    }, [title, eventDate, eventTime, venue, venueAddress]);

    return (
        <section ref={sceneRef} className="invite-scene calendar-scene velvet-section">
            <div ref={contentRef} className="calendar-card">
                <OvalMedallion />

                <p className="calendar-title">Save the Date</p>

                <FleuronRule />

                <p className="calendar-subtitle">Add our special day to your calendar so you never forget</p>

                <div className="calendar-buttons">
                    <button type="button" className="calendar-btn calendar-btn--google" onClick={handleGoogle}>
                        <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1" />
                            <path d="M1 7H15" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                            <path d="M5 1V5M11 1V5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                        Add to Google Calendar
                    </button>
                    <button type="button" className="calendar-btn calendar-btn--ics" onClick={handleIcs}>
                        <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                            <path d="M4 1H10L14 5V14C14 14.6 13.6 15 13 15H4C3.4 15 3 14.6 3 14V2C3 1.4 3.4 1 4 1Z" stroke="currentColor" strokeWidth="1" />
                            <path d="M10 1V5H14" stroke="currentColor" strokeWidth="0.8" />
                            <path d="M6 9H11M6 11.5H9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
                        </svg>
                        Download .ics File
                    </button>
                </div>

                <FleuronRule className="cal-fleuron--bottom" />
            </div>
        </section>
    );
}
