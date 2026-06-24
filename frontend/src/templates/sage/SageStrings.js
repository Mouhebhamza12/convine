/* Sage: botanical, naturalist's-herbarium copy. Sage green & ivory.
 *
 * One design, three languages (en/fr/ar). The template picks sageStrings(locale)
 * and renders it; Arabic flips to RTL via the returned `dir`. Date/time use the
 * shared Intl helpers so each language reads natively. */

import { intlFor, formatTime } from '../../lib/locales';

const COPY = {
    en: {
        cover: { eyebrow: 'The Wedding Of', addressed: 'Addressed To', apology: 'We apologize for any misspelling on your name or title' },
        details: { eyebrow: 'the wedding of', rsvp: 'Kindly RSVP below' },
        letter: {
            greeting: 'Dear',
            defaultMsg: 'We are delighted to invite you to celebrate our wedding and share this special day with us.',
        },
        photos: { eyebrow: 'Herbarium of moments', figures: ['fig. i: how we met', 'fig. ii: the proposal', 'fig. iii: us, lately'] },
        time: { eyebrow: 'When the watch reads', at: 'at', note: 'the ceremony begins, we would be honored by your presence' },
        countdown: {
            head: 'Field notes', sub: 'counting the days',
            rows: ['Days remaining', 'Hours', 'Minutes', 'Seconds'],
            obs: 'obs: the garden will be in full bloom by then',
        },
        location: {
            plate: 'Plate № I: the grounds', defaultVenue: 'The Estate',
            labels: ['the spires', 'grand hall', 'ceremony lawn'],
            caption: 'surveyed at:', btn: 'Chart your way there',
        },
        rsvp: {
            cta: 'RSVP',
            head: 'The favour of a reply is requested', guest: 'prepared for',
            accept: 'accepts with pleasure', decline: 'declines with regret',
            confirmYes: (name) => `Noted with joy, we cannot wait to celebrate with you, ${name}.`,
            confirmNo: (name) => `Noted with love, you will be missed dearly, ${name}.`,
        },
    },

    fr: {
        cover: { eyebrow: 'Le Mariage De', addressed: 'Adressée à', apology: 'Veuillez nous excuser pour toute erreur dans votre nom ou votre titre' },
        details: { eyebrow: 'le mariage de', rsvp: 'Merci de répondre ci-dessous' },
        letter: {
            greeting: 'Cher·e',
            defaultMsg: 'Nous avons la joie de vous inviter à célébrer notre mariage et à partager ce jour si particulier avec nous.',
        },
        photos: { eyebrow: 'Herbier de nos instants', figures: ['fig. i : la rencontre', 'fig. ii : la demande', 'fig. iii : nous, récemment'] },
        time: { eyebrow: 'Quand la montre indique', at: 'à', note: 'la cérémonie commence, votre présence serait un honneur' },
        countdown: {
            head: 'Notes de terrain', sub: 'le compte à rebours',
            rows: ['Jours restants', 'Heures', 'Minutes', 'Secondes'],
            obs: 'obs. : le jardin sera alors en pleine floraison',
        },
        location: {
            plate: 'Planche № I : le domaine', defaultVenue: 'Le Domaine',
            labels: ['les tourelles', 'grande salle', 'pelouse de cérémonie'],
            caption: 'relevé à :', btn: 'Tracez votre chemin',
        },
        rsvp: {
            cta: 'RSVP',
            head: 'La faveur d’une réponse est demandée', guest: 'préparée pour',
            accept: 'accepte avec plaisir', decline: 'décline avec regret',
            confirmYes: (name) => `Noté avec joie, nous avons hâte de célébrer avec vous, ${name}.`,
            confirmNo: (name) => `Noté avec tendresse, vous nous manquerez beaucoup, ${name}.`,
        },
    },

    ar: {
        cover: { eyebrow: 'حفل زفاف', addressed: 'موجّهة إلى', apology: 'نعتذر عن أي خطأ في كتابة اسمك أو لقبك' },
        details: { eyebrow: 'حفل زفاف', rsvp: 'نرجو تأكيد الحضور أدناه' },
        letter: {
            greeting: 'عزيزَنا',
            defaultMsg: 'يسعدنا أن ندعوكم للاحتفال بزفافنا ومشاركتنا هذا اليوم المميّز.',
        },
        photos: { eyebrow: 'معشبة لحظاتنا', figures: ['الأولى: كيف التقينا', 'الثانية: الخِطبة', 'الثالثة: نحن، مؤخّراً'] },
        time: { eyebrow: 'حين تشير الساعة', at: 'في', note: 'تبدأ المراسم، ويشرّفنا حضوركم' },
        countdown: {
            head: 'مذكّرات ميدانية', sub: 'نعدّ الأيام',
            rows: ['الأيام المتبقية', 'ساعات', 'دقائق', 'ثوانٍ'],
            obs: 'ملاحظة: سيكون البستان حينها في كامل إزهاره',
        },
        location: {
            plate: 'اللوحة № 1: المكان', defaultVenue: 'القصر',
            labels: ['الأبراج', 'القاعة الكبرى', 'باحة المراسم'],
            caption: 'مساحته:', btn: 'ارسم طريقك إلى هناك',
        },
        rsvp: {
            cta: 'تأكيد الحضور',
            head: 'نرجو منكم شرف الردّ', guest: 'أُعدّت لـ',
            accept: 'يقبل بكلّ سرور', decline: 'يعتذر بكلّ أسف',
            confirmYes: (name) => `سُجّل بكلّ فرح، لا نطيق صبراً للاحتفال معك يا ${name}.`,
            confirmNo: (name) => `سُجّل بكلّ محبّة، سنفتقدك كثيراً يا ${name}.`,
        },
    },
};

const RTL = new Set(['ar']);

export function sageStrings(locale) {
    const code = COPY[locale] ? locale : 'en';
    return { code, dir: RTL.has(code) ? 'rtl' : 'ltr', ...COPY[code] };
}

/** Dotted date "20 • 08 • 2026", localised (Arabic-Indic numerals for ar). */
export function formatDots(eventDate, code = 'en') {
    if (!eventDate) return '';
    const d = new Date(`${eventDate}T00:00:00`);
    if (Number.isNaN(d.getTime())) return String(eventDate);
    const intl = intlFor(code);
    const part = (opts) => new Intl.DateTimeFormat(intl, opts).format(d);
    return `${part({ day: '2-digit' })} • ${part({ month: '2-digit' })} • ${part({ year: 'numeric' })}`;
}

const EN_HOURS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];

/** The hour set in words for English; other languages read the native clock. */
export function timeInWords(t, code = 'en') {
    const [h, m] = String(t || '19:00').split(':').map(Number);
    if (code !== 'en') return formatTime(t, code);
    const hour = EN_HOURS[h % 12];
    const part = h < 12 ? 'in the morning' : h < 18 ? 'in the afternoon' : 'in the evening';
    if (!m) return `${hour} o’clock ${part}`;
    if (m === 30) return `half past ${hour} ${part}`;
    return `${hour}:${String(m).padStart(2, '0')} ${part}`;
}
