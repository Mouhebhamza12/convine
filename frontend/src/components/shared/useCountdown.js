import { useEffect, useMemo, useState } from 'react';

/**
 * Live countdown to the wedding moment. Returns days/hours/minutes/seconds
 * so each template can present them in its own medium.
 */
export function useCountdown(eventDate, eventTime) {
    const target = useMemo(() => {
        if (!eventDate) return null;
        const t = /^\d{1,2}:\d{2}$/.test(eventTime || '') ? `${eventTime}:00` : eventTime || '00:00:00';
        const d = new Date(`${eventDate}T${t}`);
        return Number.isNaN(d.getTime()) ? null : d;
    }, [eventDate, eventTime]);

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const diff = target ? Math.max(0, target.getTime() - now) : 0;

    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
        reached: target ? diff === 0 : false,
    };
}
