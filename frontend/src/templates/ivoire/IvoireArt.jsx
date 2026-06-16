/* Ivoire hand-built SVG art. The monogram is real vector lettering — the
   couple's initials, set in Arabic calligraphy (Aref Ruqaa) by default — struck
   into the porcelain plate as an engraving: an incised relief with a faint
   gilt, so it reads like a mark carved into stone rather than printed on top.
   The finish lives entirely in the SVG (gradient + carve filter on the glyphs);
   CSS adds none of it. */

/**
 * IvoireDivider — a slender engraved rule with a central lozenge floret. Drawn
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
 * IvoirePin — a slim engraved map-pin, stroked with currentColor.
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
 * IvoireMonogram — the couple's engraved cameo mark.
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

            {/* two initials set as an interlocked cipher — one lifted, one
               dropped, overlapping at the centre — so the mark reads as a
               crafted monogram rather than a written word */}
            <g fontFamily={family} fontWeight="700" fill="url(#iv-gild)" filter="url(#iv-carve)" textAnchor="middle">
                <text x="144" y="136" fontSize={size}>{a}</text>
                <text x="110" y="174" fontSize={size}>{b}</text>
            </g>
        </svg>
    );
}
