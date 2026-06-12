/**
 * DarStrings — all rendered copy for the Dar template, in two separate
 * voices: French (elegant, premium) and Arabic (warm, family, Algerian).
 * Algerian Arabic month names (جانفي، فيفري…) are used on purpose: they are
 * specific to Algeria and signal authenticity instantly.
 */

const AR_MONTHS = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const AR_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const FR_MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const FR_DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function parseDate(eventDate) {
    const d = new Date(`${eventDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

export function formatLongDate(eventDate, lang) {
    const d = parseDate(eventDate);
    if (!d) return '';
    if (lang === 'ar') {
        return `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }
    const fr = `${FR_DAYS[d.getDay()]} ${d.getDate()} ${FR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    return fr.charAt(0).toUpperCase() + fr.slice(1);
}

export function formatDateParts(eventDate, lang) {
    const d = parseDate(eventDate);
    if (!d) return { day: '', month: '', year: '', weekday: '' };
    return {
        day: String(d.getDate()),
        month: lang === 'ar' ? AR_MONTHS[d.getMonth()] : FR_MONTHS[d.getMonth()],
        year: String(d.getFullYear()),
        weekday: lang === 'ar' ? AR_DAYS[d.getDay()] : FR_DAYS[d.getDay()],
    };
}

export function formatTime(eventTime, lang) {
    const [h, m] = String(eventTime || '19:00').split(':').map(Number);
    const mm = String(m || 0).padStart(2, '0');
    if (lang === 'ar') return `${h}:${mm}`;
    return `${h}h${mm}`;
}

export const DAR_STRINGS = {
    fr: {
        dir: 'ltr',
        nav: ['Accueil', 'Bienvenue', 'La date', "L'heure", 'Compte à rebours', 'La dar', 'Souvenirs', 'RSVP'],
        opening: {
            eyebrow: 'Bienvenue chez nous',
            title: 'La famille vous ouvre ses portes',
            hint: 'Toquez pour entrer',
        },
        hero: {
            blessing: "Avec la bénédiction d'Allah",
            familyLine: 'Les familles',
            invite: (bride, groom) =>
                `Les familles de ${bride} et de ${groom} ont l'honneur de vous convier au mariage de leurs enfants`,
            and: '&',
            seeYou: 'Sous le ciel de la dar, entourés des nôtres',
        },
        marhba: {
            title: 'Marhba bikom',
            sub: 'Notre maison est la vôtre',
            greeting: (name) => `À ${name}, notre invité de cœur,`,
            defaultMsg:
                "C'est avec une immense joie que nos deux familles vous convient à partager ce moment béni. Votre présence illuminera notre dar comme le jasmin parfume nos soirs d'été.",
            sign: 'Les deux familles',
        },
        date: {
            label: 'Retenez la date',
            note: 'Une soirée à inscrire dans la mémoire de la famille',
        },
        time: {
            label: 'La fête commence',
            from: 'à partir de',
            note: "et se poursuivra jusqu'au bout de la nuit",
        },
        countdown: {
            label: 'En attendant le grand soir',
            units: ['Jours', 'Heures', 'Minutes', 'Secondes'],
        },
        venue: {
            label: 'Le chemin de la dar',
            intro: 'Suivez les ruelles blanches, la fête vous guidera',
            btn: 'Itinéraire',
        },
        photos: {
            label: 'Souvenirs de famille',
            captions: ['la rencontre', 'la promesse', 'aujourd’hui'],
        },
        rsvp: {
            cta: 'Répondre',
            label: 'Votre place est déjà prête',
            ask: (name) => `${name}, nous ferez-vous l'honneur de votre présence ?`,
            hint: 'Choisissez votre zellige',
            accept: 'Nous serons présents',
            acceptSub: 'avec grande joie',
            decline: 'Avec tout notre regret',
            declineSub: 'nos cœurs seront avec vous',
            confirmYes: (name) => `Quelle joie, ${name} ! Votre zellige est posé, la famille vous attend. Marhba !`,
            confirmNo: (name) => `Vous serez dans nos pensées, ${name}. La porte de la dar vous restera toujours ouverte.`,
        },
    },

    ar: {
        dir: 'rtl',
        nav: ['الواجهة', 'الترحيب', 'التاريخ', 'الساعة', 'العدّ التنازلي', 'الدار', 'الذكريات', 'الحضور'],
        opening: {
            eyebrow: 'مرحبا بكم',
            title: 'الدار داركم والفرح فرحكم',
            hint: 'اطرقوا الباب للدخول',
        },
        hero: {
            blessing: 'بسم الله الرحمن الرحيم',
            familyLine: 'تتشرف عائلتا',
            invite: (bride, groom) =>
                `عائلتا ${bride} و${groom} تتشرفان بدعوتكم لحضور حفل زفاف ابنيهما`,
            and: 'و',
            seeYou: 'تحت سماء الدار، وبين أهلنا وأحبابنا',
        },
        marhba: {
            title: 'مرحبا بيكم',
            sub: 'دارنا داركم',
            greeting: (name) => `إلى ${name}، ضيفنا الغالي،`,
            defaultMsg:
                'بكل فرح ومحبة، تدعوكم عائلتانا لمشاركتنا هذه الليلة المباركة. حضوركم يضيء دارنا كما يعطر الياسمين ليالي الصيف.',
            sign: 'العائلتان',
        },
        date: {
            label: 'احفظوا التاريخ',
            note: 'ليلة ستبقى في ذاكرة العائلة',
        },
        time: {
            label: 'يبدأ الفرح',
            from: 'ابتداءً من الساعة',
            note: 'ويستمر إلى آخر الليل',
        },
        countdown: {
            label: 'في انتظار الليلة الكبيرة',
            units: ['أيام', 'ساعات', 'دقائق', 'ثوانٍ'],
        },
        venue: {
            label: 'الطريق إلى الدار',
            intro: 'اتبعوا الأزقة البيضاء، والفرح يدلكم',
            btn: 'الاتجاهات',
        },
        photos: {
            label: 'ذكريات العائلة',
            captions: ['اللقاء', 'الوعد', 'اليوم'],
        },
        rsvp: {
            cta: 'تأكيد الحضور',
            label: 'مكانكم محجوز في دارنا',
            ask: (name) => `${name}، هل تشرفوننا بحضوركم؟`,
            hint: 'اختاروا زليجتكم',
            accept: 'حاضرون بكل فرح',
            acceptSub: 'إن شاء الله',
            decline: 'معذرة منكم',
            declineSub: 'قلوبنا معكم',
            confirmYes: (name) => `تزيدنا فرحة بفرحتكم يا ${name}، زليجتكم وُضعت والعائلة في انتظاركم. مرحبا!`,
            confirmNo: (name) => `ستبقون في قلوبنا يا ${name}، وباب الدار مفتوح لكم دائماً.`,
        },
    },
};

/** Arabic display names for the shared demo so the AR ad demo is fully Arabic. */
export const AR_DEMO_NAMES = { Amina: 'أمينة', Yacine: 'ياسين', Mohamed: 'محمد' };
