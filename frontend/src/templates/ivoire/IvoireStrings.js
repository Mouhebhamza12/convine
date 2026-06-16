/* Ivoire — embossed ivory florals & a gilded blush cameo. Soft greige, pearl
   white relief, rose-gold foil, dusty-mauve type. Pure data + helpers (no
   components) so it Fast-Refreshes cleanly. */

const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

export function isArabicName(str = '') {
    return ARABIC.test(str);
}

/* first meaningful glyph of a name — uppercased for Latin, left intact for
   scripts without case (Arabic) */
export function initialOf(name = '') {
    const ch = Array.from(name.trim())[0] || '';
    return ARABIC.test(ch) ? ch : ch.toUpperCase();
}

/* Arabic display forms for the romanised demo couple, so the Arabic scenes read
   naturally in the demo. */
const AR_DEMO_NAMES = { Amina: 'أمينة', Yacine: 'ياسين', Mohamed: 'محمد' };

/* the name to show in the Arabic calligraphy: an Arabic name as-is, otherwise
   the demo's Arabic form, otherwise the name unchanged */
export function arabicDisplayName(name = '') {
    if (isArabicName(name)) return name;
    return AR_DEMO_NAMES[name] || name;
}

export const IVOIRE_STRINGS = {
    nav: ['الدعوة', 'الرسالة', 'التفاصيل'],
    cover: {
        and: '&',
        andAr: 'و',
    },
    /* the first interior scene: the عقد قِران announcement, set into the
       plaster relief between the doves above and the florals below */
    hero: {
        and: '&',
        announce: [
            'بِرضا اللهِ وطاعتِه، وعلى سُنّةِ نبيّهِ المُصطفى ﷺ',
            'نَزفّ إليكم بُشرى عقدِ قِران',
        ],
        dua: [
            'نسألُ اللهَ أن يجعلَه عقداً تنعقدُ بهِ السعادة',
            'وتنفتحُ لهُ أبوابُ الخيرِ والمودّة',
        ],
    },
    /* the second interior scene: a heartfelt letter, hand-set on the embossed
       cream panel */
    letter: {
        and: '&',
        kicker: 'رسالةٌ من القلب',
        greeting: (name) => `عزيزَنا ${name}،`,
        defaultMsg:
            'يسعدُنا ويشرّفُنا أن نشارككم فرحةَ العُمر، وأن تكونوا بقربنا في يومٍ طالما حلمنا به. حضوركم أغلى هديةٍ نتمنّاها، وببهجتكم تكتملُ فرحتُنا، فكونوا معنا لنصنعَ سوياً ذكرى لا تُنسى.',
        sign: 'بكلِّ حبٍّ ومودّة،',
    },
    /* the third interior scene: the day's details, engraved on the framed cream
       panel */
    details: {
        kicker: 'يَسعدُنا أن نلتقيَ بكم في',
        at: 'في تمامِ الساعةِ',
        venueLead: 'يُقامُ الحفلُ في',
    },
};

/* the names line under the cameo: tracked inscription caps for Latin, set
   close for Arabic */
export function joinNames(bride, groom) {
    const arabic = isArabicName(bride) || isArabicName(groom);
    return {
        arabic,
        bride,
        groom,
        and: arabic ? IVOIRE_STRINGS.cover.andAr : IVOIRE_STRINGS.cover.and,
    };
}

/* the cameo mark. The seal carries the couple's initials in Arabic calligraphy.
   Real Arabic names yield their own initials; the demo couple (shown romanised
   on the names line, as in classic bilingual stationery) is paired with a
   matching Arabic monogram. A purely-Latin couple falls back to Latin initials. */
export function monogramLetters(bride, groom, { demo = false } = {}) {
    if (isArabicName(bride) || isArabicName(groom)) {
        return { letters: [initialOf(bride), initialOf(groom)], arabic: true };
    }
    if (demo) {
        // آمنة (Amina) · ياسين (Yacine)
        return { letters: ['آ', 'ي'], arabic: true };
    }
    return { letters: [initialOf(bride), initialOf(groom)], arabic: false };
}

const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const AR_WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/** { weekday, day, month, year } in Arabic for the details scene. */
export function arabicDateParts(eventDate) {
    const d = new Date(`${eventDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) return { weekday: '', day: '', month: '', year: '' };
    return {
        weekday: AR_WEEKDAYS[d.getDay()],
        day: String(d.getDate()),
        month: AR_MONTHS[d.getMonth()],
        year: String(d.getFullYear()),
    };
}

/** "7:00 مساءً" — 12-hour Arabic time with صباحاً / مساءً. */
export function arabicTime(eventTime) {
    const [h, m] = String(eventTime || '19:00').split(':').map(Number);
    const period = h < 12 ? 'صباحاً' : 'مساءً';
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${String(m || 0).padStart(2, '0')} ${period}`;
}

/** "20 . 08 . 26" — engraved date, two-digit year, as on the reference card. */
export function formatDots(eventDate) {
    const d = new Date(`${eventDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd} . ${mm} . ${yy}`;
}
