/* Closing-leaf artwork for the landing footer. Hand-drawn vector only-no CSS
   borders or pseudo-element ornament. Every glyph and leaf is a real path so
   the close reads like the last printed page of a fine wedding album, struck
   in gilt against dark stock. Strokes use currentColor so CSS sets the gold. */

/**
 * CloseFlourish-a slender, symmetric botanical rule that marks the threshold
 * into the closing leaf. A centred lozenge with two mirrored vines, each
 * tapering into a small sprig. Drawn once, mirrored across the centre.
 */
export function CloseFlourish({ className }) {
    const Vine = () => (
        <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M144 24 C 120 24 102 21 80 18" />
            {/* leaves riding the vine */}
            <path d="M118 22 C 114 14 106 11 102 13 C 106 19 114 23 118 22 Z" />
            <path d="M100 19 C 98 27 92 30 88 28 C 91 23 96 20 100 19 Z" />
            {/* terminal bud + accent seed */}
            <path d="M80 18 C 74 14 70 16 69 20 C 73 22 78 21 80 18 Z" />
            <circle cx="63" cy="19" r="1.1" fill="currentColor" stroke="none" />
        </g>
    );
    return (
        <svg
            viewBox="0 0 288 48"
            className={className}
            aria-hidden="true"
            style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* centre lozenge */}
            <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
                <path d="M144 14 L150 24 L144 34 L138 24 Z" />
            </g>
            <circle cx="144" cy="24" r="1.5" fill="currentColor" />
            <Vine />
            <g transform="translate(288,0) scale(-1,1)">
                <Vine />
            </g>
        </svg>
    );
}

/**
 * CloseSeal-the house mark: a gilt Cinzel "C" struck into the stock, ringed by
 * a hairline and a beaded engraving, flanked by two olive sprigs and clasped
 * top and bottom by small lozenges. The gild + carve relief live in the SVG.
 */
export function CloseSeal({ className }) {
    const Sprig = () => (
        <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M44 132 C 35 115 36 96 50 80" />
            <ellipse cx="40" cy="120" rx="5.4" ry="2.2" transform="rotate(-22 40 120)" />
            <ellipse cx="39" cy="104" rx="5.4" ry="2.2" transform="rotate(-4 39 104)" />
            <ellipse cx="44" cy="89" rx="5" ry="2" transform="rotate(20 44 89)" />
            <path d="M50 80 C 47 75 49 71 53 71 C 54 75 53 79 50 80 Z" />
        </g>
    );
    return (
        <svg
            viewBox="0 0 200 200"
            className={className}
            role="img"
            aria-label="Convive house mark"
            style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="cl-seal-gild" x1="0" y1="0" x2="0.16" y2="1">
                    <stop offset="0" stopColor="#f4dcaa" />
                    <stop offset="0.36" stopColor="#d2a86d" />
                    <stop offset="0.62" stopColor="#b9824a" />
                    <stop offset="0.84" stopColor="#d6ac72" />
                    <stop offset="1" stopColor="#efd49c" />
                </linearGradient>
                <filter id="cl-seal-carve" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.1" stdDeviation="0.4" floodColor="#fff3df" floodOpacity="0.55" />
                    <feDropShadow dx="0" dy="-1" stdDeviation="0.7" floodColor="#3a0c12" floodOpacity="0.6" />
                </filter>
            </defs>

            {/* rings: a solid hairline + a beaded engraving */}
            <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="0.6 7" />

            {/* clasp lozenges, top and bottom */}
            <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
                <path d="M100 9 L106 16 L100 23 L94 16 Z" />
                <path d="M100 177 L106 184 L100 191 L94 184 Z" />
            </g>
            <circle cx="100" cy="16" r="1.3" fill="currentColor" />
            <circle cx="100" cy="184" r="1.3" fill="currentColor" />

            {/* olive sprigs left + mirrored right */}
            <Sprig />
            <g transform="translate(200,0) scale(-1,1)">
                <Sprig />
            </g>

            {/* the gilt initial */}
            <text
                x="100"
                y="134"
                fill="url(#cl-seal-gild)"
                filter="url(#cl-seal-carve)"
                textAnchor="middle"
                fontFamily="'Cinzel', serif"
                fontWeight="600"
                fontSize="96"
            >C</text>
        </svg>
    );
}

/**
 * CloseLeaf-a single small leaf used as the marker beside each world in the
 * index. Reveals and takes the world's accent colour on hover (CSS).
 */
export function CloseLeaf({ className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M4 13 C 9 4 17 5 21 4 C 19 13 12 19 4 16 Z" />
            <path d="M5 15 C 9 12 13 9 19 5" />
        </svg>
    );
}

/**
 * CloseSend-a small letter, the submit affordance for the correspondence line.
 */
export function CloseSend({ className }) {
    return (
        <svg
            viewBox="0 0 32 32"
            className={className}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="4" y="8" width="24" height="16" rx="2.5" />
            <path d="M5 10 L16 19 L27 10" />
        </svg>
    );
}
