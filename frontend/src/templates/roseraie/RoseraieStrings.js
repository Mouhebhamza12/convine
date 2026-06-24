/* Roseraie: couture editorial copy. Sage / ivory / antique gold.
 *
 * One design, three languages. The copy dictionary gains a locale axis; the
 * template picks `roseraieStrings(locale)` and renders it-no switcher, no
 * duplicate template. Date/time formatting lives in lib/locales (Intl-based),
 * so each language reads natively. Arabic flips to RTL via the returned `dir`. */

const COPY = {
    en: {
        nav: ['Invitation', 'The Letter', 'The Date', 'The Hour', 'Countdown', 'The Place', 'Our Story', 'RSVP'],
        cover: { eyebrow: 'Together with their families', addressed: 'Reserved for', hint: 'Break the seal' },
        hero: { eyebrow: 'The Wedding Of', and: '&', invite: 'are to be married' },
        letter: {
            label: 'A Letter',
            greeting: (name) => `Dear ${name},`,
            defaultMsg:
                'With hearts full of joy, we invite you to share in the celebration of our marriage, an evening of love, light, and the people who mean the most to us. Your presence would make our happiness complete.',
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
            confirmYes: (name) => `Thank you, ${name}. Your seal is set, and we cannot wait to celebrate this day with you.`,
            confirmNo: (name) => `We will miss you dearly, ${name}. Thank you for letting us know. You will be in our hearts.`,
        },
    },

    fr: {
        nav: ['Invitation', 'La Lettre', 'La Date', "L'Heure", 'Compte à rebours', 'Le Lieu', 'Notre Histoire', 'RSVP'],
        cover: { eyebrow: 'Avec leurs familles', addressed: 'Réservé à', hint: 'Briser le sceau' },
        hero: { eyebrow: 'Le Mariage De', and: '&', invite: 'vont se marier' },
        letter: {
            label: 'Un Mot',
            greeting: (name) => `Cher·e ${name},`,
            defaultMsg:
                "Le cœur comblé de joie, nous vous invitons à partager la célébration de notre mariage : une soirée d'amour, de lumière et des êtres qui nous sont les plus chers. Votre présence rendrait notre bonheur complet.",
            sign: 'Avec tout notre amour,',
            signNames: (bride, groom) => `${bride} & ${groom}`,
        },
        date: { label: 'Réservez la Date', note: 'Une soirée inoubliable' },
        time: { label: 'Le Début des Festivités', from: 'Cérémonie à', note: 'et la fête se poursuit dans la nuit' },
        countdown: { label: 'Le compte à rebours', units: ['Jours', 'Heures', 'Minutes', 'Secondes'] },
        venue: { label: 'Le Lieu', intro: 'Nous nous réunirons pour célébrer au', btn: "Voir l'itinéraire" },
        photos: { label: 'Notre Histoire', captions: ['le début', 'la promesse', "aujourd'hui"] },
        rsvp: {
            cta: 'RSVP',
            label: 'Merci de Répondre',
            ask: (name) => `${name}, serez-vous des nôtres ?`,
            hint: 'Scellez votre réponse',
            accept: 'Accepte avec joie',
            acceptSub: 'Je serai présent·e',
            decline: 'Décline à regret',
            declineSub: 'avec tout mon cœur, de loin',
            confirmYes: (name) => `Merci, ${name}. Votre sceau est apposé, et nous avons hâte de célébrer ce jour avec vous.`,
            confirmNo: (name) => `Vous nous manquerez, ${name}. Merci de nous avoir prévenus. Vous resterez dans nos cœurs.`,
        },
    },

    ar: {
        nav: ['الدعوة', 'الرسالة', 'الموعد', 'الساعة', 'العدّ التنازلي', 'المكان', 'قصّتنا', 'تأكيد الحضور'],
        cover: { eyebrow: 'مع عائلتَيهما', addressed: 'دعوة خاصة إلى', hint: 'افتح الخاتم' },
        hero: { eyebrow: 'حفل زفاف', and: 'و', invite: 'على وشك الزواج' },
        letter: {
            label: 'رسالة',
            greeting: (name) => `عزيزَنا ${name}،`,
            defaultMsg:
                'بقلوبٍ مفعمةٍ بالفرح، ندعوكم لمشاركتنا الاحتفال بزواجنا؛ أمسيةٌ من الحبّ والنور وأقرب الناس إلى قلبينا. حضوركم يُتمّ فرحتنا.',
            sign: 'بكلّ حبّنا،',
            signNames: (bride, groom) => `${bride} و ${groom}`,
        },
        date: { label: 'احفظوا الموعد', note: 'أمسيةٌ لا تُنسى' },
        time: { label: 'يبدأ الاحتفال', from: 'تُقام المراسم في', note: 'ويمتدّ السهر حتى الليل' },
        countdown: { label: 'نعدّ الأيام', units: ['أيام', 'ساعات', 'دقائق', 'ثوانٍ'] },
        venue: { label: 'المكان', intro: 'سنجتمع للاحتفال في', btn: 'عرض الاتجاهات' },
        photos: { label: 'قصّتنا', captions: ['البداية', 'الوعد', 'اليوم'] },
        rsvp: {
            cta: 'تأكيد الحضور',
            label: 'نرجو تأكيد الحضور',
            ask: (name) => `${name}، هل ستكون معنا؟`,
            hint: 'اختم ردّك',
            accept: 'يسعدني الحضور',
            acceptSub: 'سأكون حاضراً',
            decline: 'أعتذر بكلّ مودّة',
            declineSub: 'بحبّي من بعيد',
            confirmYes: (name) => `شكراً لك يا ${name}. خُتِم ردّك، ولا نطيق صبراً للاحتفال بهذا اليوم معك.`,
            confirmNo: (name) => `سنفتقدك كثيراً يا ${name}. شكراً لإعلامنا، وستبقى في قلوبنا دائماً.`,
        },
    },
};

const RTL = new Set(['ar']);

/**
 * The copy bundle for `locale`, plus `code` (so scenes can localise dates) and
 * `dir`. Falls back to English for anything unsupported.
 */
export function roseraieStrings(locale) {
    const code = COPY[locale] ? locale : 'en';
    return { code, dir: RTL.has(code) ? 'rtl' : 'ltr', ...COPY[code] };
}
