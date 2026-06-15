/* Roseraie — couture editorial copy (English). Sage / ivory / antique gold. */

export const ROSERAIE_STRINGS = {
    nav: ['Invitation', 'The Letter', 'The Date', 'The Hour', 'Countdown', 'The Place', 'Our Story', 'RSVP'],
    cover: {
        eyebrow: 'Together with their families',
        addressed: 'Reserved for',
        hint: 'Break the seal',
    },
    hero: {
        eyebrow: 'The Wedding Of',
        and: '&',
        invite: 'are to be married',
    },
    letter: {
        label: 'A Letter',
        greeting: (name) => `Dear ${name},`,
        defaultMsg:
            'With hearts full of joy, we invite you to share in the celebration of our marriage — an evening of love, light, and the people who mean the most to us. Your presence would make our happiness complete.',
        sign: 'With all our love,',
        signNames: (bride, groom) => `${bride} & ${groom}`,
    },
    date: { label: 'Save the Date', note: 'An evening to remember' },
    time: { label: 'The Celebration Begins', from: 'Ceremony at', note: 'and continues into the night' },
    countdown: { label: 'Counting the days', units: ['Days', 'Hours', 'Minutes', 'Seconds'] },
    venue: { label: 'The Place', intro: 'We will gather to celebrate at', btn: 'View directions' },
    photos: { label: 'Our Story', captions: ['the beginning', 'the promise', 'today'] },
    rsvp: {
        cta: 'RSVP',
        label: 'Kindly Respond',
        ask: (name) => `${name}, will you join us?`,
        hint: 'Seal your reply',
        accept: 'Joyfully accepts',
        acceptSub: 'I will be there',
        decline: 'Regretfully declines',
        declineSub: 'with love from afar',
        confirmYes: (name) =>
            `Thank you, ${name}. Your seal is set — we cannot wait to celebrate this day with you.`,
        confirmNo: (name) =>
            `We will miss you dearly, ${name}. Thank you for letting us know — you will be in our hearts.`,
    },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseDate(date) {
    if (!date) return null;
    const d = new Date(`${date}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateParts(date) {
    const d = parseDate(date);
    if (!d) return { weekday: '', day: '', month: '', monthShort: '', year: '' };
    return {
        weekday: WEEKDAYS[d.getDay()],
        day: String(d.getDate()).padStart(2, '0'),
        month: MONTHS[d.getMonth()],
        monthShort: MONTHS[d.getMonth()].slice(0, 3),
        year: String(d.getFullYear()),
    };
}

export function formatLongDate(date) {
    const { weekday, month, day, year } = formatDateParts(date);
    if (!weekday) return '';
    return `${weekday}, ${month} ${parseInt(day, 10)}, ${year}`;
}

export function formatTime12(time) {
    if (!time || !/^\d{1,2}:\d{2}/.test(time)) return time || '';
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${String(m).padStart(2, '0')} ${period}`;
}
