/* Velvet: cinematic, classic-romantic copy. Deep red & gold. One design, three
   languages (en/fr/ar). The template threads `strings` into its (Velvet-only)
   shared scene components; Arabic flips to RTL via the returned `dir`. */

import { intlFor } from '../../lib/locales';

const COPY = {
    en: {
        hero: { eyebrow: 'The Wedding of', tagline: 'Two hearts, one promise,\na lifetime together' },
        date: { title: 'Our Wedding Date', hintScratch: 'Swipe your finger to brush away the coating', hintDone: 'Save the date in your heart' },
        time: { label: 'The Ceremony Begins', thanks: 'We would be honored by your presence' },
        letter: { greeting: 'Dear', defaultMsg: 'We are delighted to invite you to celebrate our wedding and share this special day with us.' },
        photos: { title: 'Moments That Define Us' },
        countdown: { title: 'Until We Say I Do', units: ['Days', 'Hours', 'Minutes', 'Seconds'] },
        location: { title: 'Where We Celebrate', venueDefault: 'Venue TBA', mapBtn: 'Open in Google Maps' },
        calendar: { title: 'Save the Date', subtitle: 'Add our special day to your calendar so you never forget', google: 'Add to Google Calendar', ics: 'Download .ics File' },
        rsvp: {
            cta: 'RSVP',
            title: 'Kindly Respond', subtitle: 'Your response is a gift to us', accept: 'Joyfully Accept', decline: 'Respectfully Decline',
            yesTitle: 'We cannot wait!', noTitle: 'Thank you, dear friend',
            confirmYes: (name) => `Your presence means the world to us, ${name}. We look forward to celebrating together.`,
            confirmNo: (name) => `We understand, ${name}. Thank you for letting us know, you will be in our hearts on our special day.`,
        },
        footer: { thanks: 'Thank you for being part of our story' },
    },

    fr: {
        hero: { eyebrow: 'Le Mariage de', tagline: 'Deux cœurs, une promesse,\nune vie entière ensemble' },
        date: { title: 'La Date de Notre Mariage', hintScratch: 'Passez le doigt pour gratter le revêtement', hintDone: 'Gardez la date dans votre cœur' },
        time: { label: 'La Cérémonie Commence', thanks: 'Votre présence serait un honneur' },
        letter: { greeting: 'Cher·e', defaultMsg: 'Nous avons la joie de vous inviter à célébrer notre mariage et à partager ce jour si particulier avec nous.' },
        photos: { title: 'Les Instants Qui Nous Définissent' },
        countdown: { title: 'Jusqu’à notre oui', units: ['Jours', 'Heures', 'Minutes', 'Secondes'] },
        location: { title: 'Où Nous Célébrons', venueDefault: 'Lieu à confirmer', mapBtn: 'Ouvrir dans Google Maps' },
        calendar: { title: 'Réservez la Date', subtitle: 'Ajoutez notre grand jour à votre agenda pour ne jamais l’oublier', google: 'Ajouter à Google Agenda', ics: 'Télécharger le fichier .ics' },
        rsvp: {
            cta: 'RSVP',
            title: 'Merci de Répondre', subtitle: 'Votre réponse est un cadeau pour nous', accept: 'Accepter avec joie', decline: 'Décliner respectueusement',
            yesTitle: 'Nous avons hâte !', noTitle: 'Merci, cher·e ami·e',
            confirmYes: (name) => `Votre présence compte énormément pour nous, ${name}. Nous avons hâte de célébrer ensemble.`,
            confirmNo: (name) => `Nous comprenons, ${name}. Merci de nous avoir prévenus, vous serez dans nos cœurs ce jour-là.`,
        },
        footer: { thanks: 'Merci de faire partie de notre histoire' },
    },

    ar: {
        hero: { eyebrow: 'حفل زفاف', tagline: 'قلبان، وعدٌ واحد،\nوعمرٌ معاً' },
        date: { title: 'تاريخ زفافنا', hintScratch: 'مرّر إصبعك لإزالة الطبقة', hintDone: 'احفظ الموعد في قلبك' },
        time: { label: 'تبدأ المراسم', thanks: 'يشرّفنا حضوركم' },
        letter: { greeting: 'عزيزَنا', defaultMsg: 'يسعدنا أن ندعوكم للاحتفال بزفافنا ومشاركتنا هذا اليوم المميّز.' },
        photos: { title: 'لحظاتٌ تروي قصّتنا' },
        countdown: { title: 'حتى نقول نعم', units: ['أيام', 'ساعات', 'دقائق', 'ثوانٍ'] },
        location: { title: 'مكان الاحتفال', venueDefault: 'المكان يُعلن لاحقاً', mapBtn: 'افتح في خرائط Google' },
        calendar: { title: 'احفظوا الموعد', subtitle: 'أضِف يومنا المميّز إلى تقويمك حتى لا تنساه', google: 'أضِف إلى تقويم Google', ics: 'تنزيل ملف ‎.ics' },
        rsvp: {
            cta: 'تأكيد الحضور',
            title: 'نرجو تأكيد الحضور', subtitle: 'ردّكم هديةٌ لنا', accept: 'أقبل بكلّ فرح', decline: 'أعتذر بكلّ احترام',
            yesTitle: 'لا نطيق صبراً!', noTitle: 'شكراً يا صديقنا العزيز',
            confirmYes: (name) => `حضوركم يعني لنا الكثير يا ${name}. نتطلّع للاحتفال معاً.`,
            confirmNo: (name) => `نتفهّم ذلك يا ${name}. شكراً لإعلامنا، وستبقون في قلوبنا يوم فرحنا.`,
        },
        footer: { thanks: 'شكراً لكونكم جزءاً من قصّتنا' },
    },
};

const RTL = new Set(['ar']);

export function velvetStrings(locale) {
    const code = COPY[locale] ? locale : 'en';
    return { code, dir: RTL.has(code) ? 'rtl' : 'ltr', ...COPY[code] };
}

/** Localised { day, month, year } for the scratch-reveal cards. */
export function velvetDateParts(eventDate, code = 'en') {
    const d = eventDate ? new Date(`${eventDate}T12:00:00`) : null;
    if (!d || Number.isNaN(d.getTime())) {
        return code === 'en' ? { day: '20', month: 'August', year: '2026' } : velvetDateParts('2026-08-20', code);
    }
    const intl = intlFor(code);
    return {
        day: new Intl.DateTimeFormat(intl, { day: 'numeric' }).format(d),
        month: new Intl.DateTimeFormat(intl, { month: 'long' }).format(d),
        year: new Intl.DateTimeFormat(intl, { year: 'numeric' }).format(d),
    };
}
