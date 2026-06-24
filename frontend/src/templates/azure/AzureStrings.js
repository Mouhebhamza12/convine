/* Azure: playful travel-stationery copy (boarding pass, departures board,
   postcard, passport). Blue & cream. One design, three languages (en/fr/ar).
   Date/time read natively per language via the shared Intl helpers. */

import { intlFor, formatTime } from '../../lib/locales';

const COPY = {
    en: {
        overture: { eyebrow: 'You are invited to the wedding of', tap: 'Tap to Open' },
        hero: {
            invite: ['You’re invited to', 'share in the joy of our wedding day'],
            together: 'Together with Love and Joy',
            startAt: 'Start at', venueDefault: 'The Venue', rsvpBefore: 'Kindly RSVP before',
        },
        time: {
            nowBoarding: 'Now boarding', firstClass: 'First class · Ceremony',
            from: 'From', to: 'To', fromVal: ['This', 'Moment'], toVal: ['Forever', 'After'],
            departure: 'Departure', gate: 'Gate', seat: 'Seat', gateVal: 'Love', seatVal: 'Beside us',
            note: 'We would be honored by your presence on board',
        },
        countdown: { departures: 'Departures', onTime: 'On time', dest: 'Destination: Happily ever after', units: ['Days', 'Hours', 'Min', 'Sec'] },
        letter: { greeting: 'Dear', defaultMsg: 'We are delighted to invite you to celebrate our wedding and share this special day with us.' },
        photos: { eyebrow: 'From our travel album', caption: 'snapshot no.' },
        location: { greet: 'Greetings from', venueDefault: 'The Venue', addrFallback: 'Address to follow', btn: 'Visit · open in maps' },
        rsvp: {
            cta: 'RSVP',
            official: 'Official reply', visa: 'Visa de mariage', bearer: 'Bearer:', note: 'Stamp your decision below',
            accept: ['Joyfully', 'accept'], decline: ['Regretfully', 'decline'],
            approved: 'APPROVED', regrets: 'REGRETS', approvedSub: 'ADMIT TO FOREVER', regretsSub: 'MISSED WITH LOVE',
            confirmYes: (name) => `Your presence means the world to us, ${name}. See you at the gate.`,
            confirmNo: (name) => `We understand, ${name}, you will be in our hearts on the day.`,
        },
    },

    fr: {
        overture: { eyebrow: 'Vous êtes invités au mariage de', tap: 'Touchez pour ouvrir' },
        hero: {
            invite: ['Vous êtes invités à', 'partager la joie de notre mariage'],
            together: 'Avec amour et bonheur',
            startAt: 'Début à', venueDefault: 'Le Lieu', rsvpBefore: 'Merci de répondre avant le',
        },
        time: {
            nowBoarding: 'Embarquement', firstClass: 'Première classe · Cérémonie',
            from: 'De', to: 'À', fromVal: ['Cet', 'instant'], toVal: ['Pour', 'toujours'],
            departure: 'Départ', gate: 'Porte', seat: 'Siège', gateVal: 'Amour', seatVal: 'À nos côtés',
            note: 'Votre présence à bord serait un honneur',
        },
        countdown: { departures: 'Départs', onTime: 'À l’heure', dest: 'Destination : le bonheur éternel', units: ['Jours', 'Heures', 'Min', 'Sec'] },
        letter: { greeting: 'Cher·e', defaultMsg: 'Nous avons la joie de vous inviter à célébrer notre mariage et à partager ce jour si particulier avec nous.' },
        photos: { eyebrow: 'De notre album de voyage', caption: 'cliché n°' },
        location: { greet: 'Un bonjour de', venueDefault: 'Le Lieu', addrFallback: 'Adresse à venir', btn: 'Voir · ouvrir le plan' },
        rsvp: {
            cta: 'RSVP',
            official: 'Réponse officielle', visa: 'Visa de mariage', bearer: 'Au nom de :', note: 'Tamponnez votre réponse ci-dessous',
            accept: ['Accepte', 'avec joie'], decline: ['Décline', 'à regret'],
            approved: 'ACCORDÉ', regrets: 'REGRETS', approvedSub: 'ADMIS POUR TOUJOURS', regretsSub: 'REGRETTÉ AVEC AMOUR',
            confirmYes: (name) => `Votre présence compte énormément pour nous, ${name}. À très vite, porte d’embarquement.`,
            confirmNo: (name) => `Nous comprenons, ${name}, vous serez dans nos cœurs ce jour-là.`,
        },
    },

    ar: {
        overture: { eyebrow: 'يسعدنا دعوتكم إلى حفل زفاف', tap: 'اضغط للفتح' },
        hero: {
            invite: ['تشرّفونا بمشاركتنا', 'فرحة يوم زفافنا'],
            together: 'بكلّ حبّ وفرح',
            startAt: 'يبدأ في', venueDefault: 'المكان', rsvpBefore: 'نرجو تأكيد الحضور قبل',
        },
        time: {
            nowBoarding: 'بدء الصعود', firstClass: 'الدرجة الأولى · المراسم',
            from: 'من', to: 'إلى', fromVal: ['هذه', 'اللحظة'], toVal: ['إلى', 'الأبد'],
            departure: 'المغادرة', gate: 'البوابة', seat: 'المقعد', gateVal: 'الحبّ', seatVal: 'بجانبنا',
            note: 'يشرّفنا حضوركم على متن رحلتنا',
        },
        countdown: { departures: 'المغادرات', onTime: 'في موعدها', dest: 'الوجهة: السعادة الأبدية', units: ['أيام', 'ساعات', 'دقائق', 'ثوانٍ'] },
        letter: { greeting: 'عزيزَنا', defaultMsg: 'يسعدنا أن ندعوكم للاحتفال بزفافنا ومشاركتنا هذا اليوم المميّز.' },
        photos: { eyebrow: 'من ألبوم رحلتنا', caption: 'لقطة رقم' },
        location: { greet: 'تحيّاتنا من', venueDefault: 'المكان', addrFallback: 'العنوان لاحقاً', btn: 'افتح في الخرائط' },
        rsvp: {
            cta: 'تأكيد الحضور',
            official: 'ردّ رسمي', visa: 'تأشيرة زواج', bearer: 'باسم:', note: 'اختم قرارك أدناه',
            accept: ['أقبل', 'بكلّ فرح'], decline: ['أعتذر', 'بكلّ أسف'],
            approved: 'مقبول', regrets: 'اعتذار', approvedSub: 'تذكرة إلى الأبد', regretsSub: 'فقدٌ بكلّ حبّ',
            confirmYes: (name) => `حضوركم يعني لنا الكثير يا ${name}. نراكم عند البوابة.`,
            confirmNo: (name) => `نتفهّم ذلك يا ${name}، وستبقون في قلوبنا يوم الفرح.`,
        },
    },
};

const RTL = new Set(['ar']);

export function azureStrings(locale) {
    const code = COPY[locale] ? locale : 'en';
    return { code, dir: RTL.has(code) ? 'rtl' : 'ltr', ...COPY[code] };
}

function toDate(value, deltaDays = 0) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return deltaDays ? new Date(d.getTime() - deltaDays * 86400000) : d;
}

const EN_ORD = (n) => {
    if (n % 10 === 1 && n !== 11) return 'st';
    if (n % 10 === 2 && n !== 12) return 'nd';
    if (n % 10 === 3 && n !== 13) return 'rd';
    return 'th';
};

/** Hero meta date parts. English keeps its ordinal ("12th AUG"); other
 *  languages drop the ordinal and read a native short month + numerals. */
export function azDateParts(eventDate, code = 'en', deltaDays = 0) {
    const d = toDate(eventDate, deltaDays);
    if (!d) return null;
    if (code === 'en') {
        return { day: String(d.getDate()), ord: EN_ORD(d.getDate()), mon: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(), year: String(d.getFullYear()) };
    }
    const intl = intlFor(code);
    return {
        day: new Intl.DateTimeFormat(intl, { day: 'numeric' }).format(d),
        ord: '',
        mon: new Intl.DateTimeFormat(intl, { month: 'short' }).format(d),
        year: new Intl.DateTimeFormat(intl, { year: 'numeric' }).format(d),
    };
}

/** Cover date "12 · AUGUST · 2026", localised. */
export function azCoverDate(eventDate, code = 'en') {
    const d = toDate(eventDate);
    if (!d) return null;
    const intl = intlFor(code);
    const day = new Intl.DateTimeFormat(intl, { day: 'numeric' }).format(d);
    const mon = new Intl.DateTimeFormat(intl, { month: 'long' }).format(d);
    const year = new Intl.DateTimeFormat(intl, { year: 'numeric' }).format(d);
    return `${day} · ${code === 'ar' ? mon : mon.toUpperCase()} · ${year}`;
}

/** Ticket date "12 AUG 2026", localised. */
export function azTicketDate(eventDate, code = 'en') {
    const d = toDate(eventDate);
    if (!d) return '';
    const s = new Intl.DateTimeFormat(intlFor(code), { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    return code === 'ar' ? s : s.toUpperCase();
}

/** Localised clock for the boarding-pass times. */
export function azTime(t, code = 'en') {
    return formatTime(t || '19:00', code);
}
