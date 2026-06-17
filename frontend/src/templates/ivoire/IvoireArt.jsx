/* Ivoire hand-built SVG art. The monogram is real vector lettering-the
   couple's initials, set in Arabic calligraphy (Aref Ruqaa) by default-struck
   into the porcelain plate as an engraving: an incised relief with a faint
   gilt, so it reads like a mark carved into stone rather than printed on top.
   The finish lives entirely in the SVG (gradient + carve filter on the glyphs);
   CSS adds none of it. */

/**
 * IvoireDivider-a slender engraved rule with a central lozenge floret. Drawn
 * with currentColor so the scene's ink sets the tone.
 */
export function IvoireDivider({ className, ...rest }) {
    return (
        <svg
            viewBox="0 0 220 16"
            className={className}
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
            style={{ display: 'block', height: 'auto', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <line x1="8" y1="8" x2="92" y2="8" strokeWidth="0.9" />
            <line x1="128" y1="8" x2="212" y2="8" strokeWidth="0.9" />
            <path d="M110 1.5 L116.5 8 L110 14.5 L103.5 8 Z" strokeWidth="0.9" />
            <circle cx="110" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="96.5" cy="8" r="1.1" fill="currentColor" stroke="none" />
            <circle cx="123.5" cy="8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
    );
}

/**
 * IvoireCameo-the couple's cameo monogram: two initials locked around a fine
 * ampersand on a single baseline, struck in rose-gold with an engraved relief.
 * A balanced horizontal lockup (not a stacked column), drawn as vector art so
 * it reads as a commissioned mark. Latin pairs use a high-contrast Garamond;
 * Arabic pairs use Naskh.
 */
export function IvoireCameo({ a = '', b = '', arabic = false, letterSpacing, className }) {
    const family = arabic ? "'Amiri', serif" : "'Cinzel', serif";
    const cap = arabic ? 96 : 82;

    return (
        <svg
            viewBox="0 0 240 150"
            className={className}
            role="img"
            aria-label="Couple monogram"
            style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* rose-gold gild so the cipher reads richly against the blush oval */}
                <linearGradient id="iv-cameo-gild" x1="0" y1="0" x2="0.14" y2="1">
                    <stop offset="0" stopColor="#e9cda0" />
                    <stop offset="0.34" stopColor="#cea36b" />
                    <stop offset="0.6" stopColor="#b9824a" />
                    <stop offset="0.82" stopColor="#cfa66e" />
                    <stop offset="1" stopColor="#e6cd9a" />
                </linearGradient>
                {/* incised relief: a pale lift below + warm shadow above so the
                   calligraphy reads as struck into the cream cameo */}
                <filter id="iv-cameo-carve" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="1.2" stdDeviation="0.5" floodColor="#fff7ee" floodOpacity="0.92" />
                    <feDropShadow dx="0" dy="-1" stdDeviation="0.8" floodColor="#7c4f47" floodOpacity="0.45" />
                </filter>
            </defs>

            {/* one text element, one size, one baseline-"A & Y" is a single
               centred run, so it can never drift off-centre or split across lines */}
            <text
                x="120"
                y="104"
                fill="url(#iv-cameo-gild)"
                filter="url(#iv-cameo-carve)"
                textAnchor="middle"
                fontFamily={family}
                fontWeight="600"
                fontSize={cap}
                letterSpacing={letterSpacing}
            >{`${a} & ${b}`}</text>
        </svg>
    );
}

/**
 * IvoirePin-a slim engraved map-pin, stroked with currentColor.
 */
export function IvoirePin({ className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z" />
            <circle cx="12" cy="10.4" r="2.3" />
        </svg>
    );
}

/**
 * IvoireMonogram-the couple's engraved cameo mark.
 * `letters` is an array of one or two glyphs already chosen by the caller
 * (Arabic initials for an Arabic couple, Latin otherwise). `arabic` switches
 * the calligraphic face and the right-to-left flow.
 */
export function IvoireMonogram({ letters = [], arabic = true, className }) {
    const a = letters[0] || '';
    const b = letters[1] || '';
    const family = arabic ? "'Aref Ruqaa', 'Amiri', serif" : "'Cinzel', serif";
    const size = arabic ? 112 : 104;

    return (
        <svg
            viewBox="0 0 240 200"
            className={className}
            role="img"
            aria-label="Couple monogram"
            style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="iv-gild" x1="0" y1="0" x2="0.12" y2="1">
                    <stop offset="0" stopColor="#e7c89a" />
                    <stop offset="0.34" stopColor="#cda36c" />
                    <stop offset="0.6" stopColor="#b9854e" />
                    <stop offset="0.82" stopColor="#cea76e" />
                    <stop offset="1" stopColor="#e3c794" />
                </linearGradient>
                {/* incised relief: a pale lift along the lower edge + a warm
                   shadow along the upper edge reads as a glyph pressed into the
                   plate (carved), not floating on it */}
                <filter id="iv-carve" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.4" stdDeviation="0.5" floodColor="#fff7ee" floodOpacity="0.9" />
                    <feDropShadow dx="0" dy="-1.1" stdDeviation="0.9" floodColor="#7c5132" floodOpacity="0.5" />
                </filter>
            </defs>

            {/* two initials set as an interlocked cipher-one lifted, one
               dropped, overlapping at the centre-so the mark reads as a
               crafted monogram rather than a written word */}
            <g fontFamily={family} fontWeight="700" fill="url(#iv-gild)" filter="url(#iv-carve)" textAnchor="middle">
                <text x="144" y="136" fontSize={size}>{a}</text>
                <text x="110" y="174" fontSize={size}>{b}</text>
            </g>
        </svg>
    );
}

/**
 * IvoireSealEmblem-the motif struck into the RSVP wax in place of initials:
 * a gilded heart crest with a small jewel-lozenge and leaf sprigs, given the
 * same incised gold relief as the monogram so it reads as a pressed seal.
 */
export function IvoireSealEmblem({ className }) {
    return (
        <svg
            viewBox="0 0 240 200"
            className={className}
            role="img"
            aria-label="Wedding seal"
            style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="iv-emblem-gild" x1="0" y1="0" x2="0.14" y2="1">
                    <stop offset="0" stopColor="#e9cda0" />
                    <stop offset="0.34" stopColor="#cea36b" />
                    <stop offset="0.6" stopColor="#b9824a" />
                    <stop offset="0.82" stopColor="#cfa66e" />
                    <stop offset="1" stopColor="#e6cd9a" />
                </linearGradient>
                <filter id="iv-emblem-carve" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.4" stdDeviation="0.5" floodColor="#fff7ee" floodOpacity="0.9" />
                    <feDropShadow dx="0" dy="-1.1" stdDeviation="0.9" floodColor="#7c5132" floodOpacity="0.5" />
                </filter>
            </defs>

            <g filter="url(#iv-emblem-carve)" stroke="url(#iv-emblem-gild)" strokeLinecap="round" strokeLinejoin="round">
                {/* heart crest */}
                <path
                    d="M120 152 C 112 138 86 121 76 101 C 66 85 75 66 94 66 C 109 66 117 78 120 91 C 123 78 131 66 146 66 C 165 66 174 85 164 101 C 154 121 128 138 120 152 Z"
                    fill="none"
                    strokeWidth="5.5"
                />
                {/* leaf sprigs curling up from the dip */}
                <path d="M120 92 C 110 80 100 77 90 80" fill="none" strokeWidth="2.4" />
                <path d="M120 92 C 130 80 140 77 150 80" fill="none" strokeWidth="2.4" />
            </g>

            {/* jewel-lozenge set in the heart + bottom drop */}
            <g fill="url(#iv-emblem-gild)" filter="url(#iv-emblem-carve)" stroke="none">
                <path d="M120 100 L127 112 L120 124 L113 112 Z" />
                <circle cx="120" cy="112" r="2.6" fill="#fff7ee" />
                <circle cx="98" cy="80" r="2.2" />
                <circle cx="142" cy="80" r="2.2" />
            </g>
        </svg>
    );
}
