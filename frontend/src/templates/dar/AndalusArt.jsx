/**
 * AndalusArt — engraved-gold & botanical artwork for the Andalus
 * (vintage Maghrebi / Ottoman Nikkah) template.
 *
 * The opening velvet curtain is NOT here — it is a real WebGL cloth
 * simulation under ./AndalusCurtain/. This module holds the flat-vector
 * stationery ornaments: the engraved Nikkah card frame, peony / bud /
 * leaf botanicals, ring motif and gold flourish dividers.
 */

export const ANDALUS = {
    wine: '#7a2236',
    wineDeep: '#4d1122',
    wineNight: '#25050f', // deep velvet shadow
    wineLight: '#9c3346',
    rose: '#b75a68',
    rosePale: '#d99aa2',
    gold: '#a9863f',
    goldLight: '#d8b765',
    goldPale: '#ecd9a6',
    goldDeep: '#6f521f',
    cream: '#f3e8cf',
    creamDeep: '#e7d6b0',
    leaf: '#5e6b3a',
    leafDeep: '#414c25',
    leafLight: '#8a9560',
};

/* ───────────── shared defs (gold, floral, leaf gradients) ─────────────
   NOTE: the velvet-curtain gradients/filters were removed when the flat SVG
   curtain was retired in favour of the WebGL cloth curtain (AndalusCurtain/).
   These defs now serve only the engraved card + botanical ornaments below. */
function Defs() {
    return (
        <defs>
            <linearGradient id="an-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={ANDALUS.goldPale} />
                <stop offset="0.5" stopColor={ANDALUS.gold} />
                <stop offset="1" stopColor={ANDALUS.goldDeep} />
            </linearGradient>
            <linearGradient id="an-gold-h" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={ANDALUS.goldDeep} />
                <stop offset="0.5" stopColor={ANDALUS.goldLight} />
                <stop offset="1" stopColor={ANDALUS.goldDeep} />
            </linearGradient>
            <radialGradient id="an-peony" cx="0.5" cy="0.42" r="0.62">
                <stop offset="0" stopColor={ANDALUS.rosePale} />
                <stop offset="0.4" stopColor={ANDALUS.rose} />
                <stop offset="0.8" stopColor={ANDALUS.wine} />
                <stop offset="1" stopColor={ANDALUS.wineDeep} />
            </radialGradient>
            <radialGradient id="an-bud" cx="0.5" cy="0.4" r="0.7">
                <stop offset="0" stopColor={ANDALUS.wineLight} />
                <stop offset="1" stopColor={ANDALUS.wineDeep} />
            </radialGradient>
            <linearGradient id="an-leaf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={ANDALUS.leafLight} />
                <stop offset="0.55" stopColor={ANDALUS.leaf} />
                <stop offset="1" stopColor={ANDALUS.leafDeep} />
            </linearGradient>
        </defs>
    );
}

/* ───────────────── ENGRAVED NIKKAH CARD ───────────────── */
export function EngravedFrame({ className }) {
    return (
        <svg className={className} viewBox="0 0 380 520" fill="none" aria-hidden="true">
            <Defs />
            <pattern id="an-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                <rect width="5" height="5" fill="url(#an-gold)" />
                <line x1="0" y1="0" x2="0" y2="5" stroke={ANDALUS.goldDeep} strokeWidth="0.7" opacity="0.5" />
            </pattern>
            <path d="M60 120 C60 70 120 44 190 44 C260 44 320 70 320 120 L320 430 C320 452 305 466 282 466 L98 466 C75 466 60 452 60 430 Z" stroke="url(#an-gold-h)" strokeWidth="2" />
            <path d="M70 122 C70 80 126 56 190 56 C254 56 310 80 310 122 L310 428 C310 446 298 456 280 456 L100 456 C82 456 70 446 70 428 Z" stroke={ANDALUS.gold} strokeWidth="0.8" opacity="0.7" />
            {[[58], [318]].map(([x]) => (
                <rect key={x} x={x - 5} y="128" width="10" height="300" rx="3" fill="url(#an-hatch)" stroke={ANDALUS.goldDeep} strokeWidth="0.8" />
            ))}
            {/* top crest */}
            <g transform="translate(190 44)">
                <path d="M0 -2 C 40 -22 86 -10 96 16 C 70 0 36 -4 0 6 Z" fill="url(#an-gold)" stroke={ANDALUS.goldDeep} strokeWidth="0.8" />
                <path d="M0 -2 C -40 -22 -86 -10 -96 16 C -70 0 -36 -4 0 6 Z" fill="url(#an-gold)" stroke={ANDALUS.goldDeep} strokeWidth="0.8" />
                <path d="M-3 -2 C -6 -26 -2 -40 0 -46 C 2 -40 6 -26 3 -2 Z" fill="url(#an-gold)" stroke={ANDALUS.goldDeep} strokeWidth="0.7" />
                <path d="M-12 -8 C -22 -24 -20 -36 -16 -42 M12 -8 C 22 -24 20 -36 16 -42" stroke={ANDALUS.gold} strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <circle cx="0" cy="2" r="4.5" fill="url(#an-gold)" stroke={ANDALUS.goldDeep} strokeWidth="0.7" />
                <g stroke={ANDALUS.goldDeep} strokeWidth="0.5" opacity="0.5">
                    {[18, 34, 50, 66, 82].map((i) => <line key={i} x1={i} y1="2" x2={i + 6} y2="10" />)}
                    {[18, 34, 50, 66, 82].map((i) => <line key={`l${i}`} x1={-i} y1="2" x2={-i - 6} y2="10" />)}
                </g>
            </g>
            {/* side trophy scrolls */}
            {[[64, 1], [316, -1]].map(([x, s]) => (
                <g key={x} transform={`translate(${x} 250) scale(${s} 1)`}>
                    <path d="M0 -34 C 22 -26 24 -6 6 4 C 20 -4 16 -22 0 -28 Z" fill="url(#an-gold)" opacity="0.92" />
                    <path d="M0 8 C 22 16 24 36 6 46 C 20 38 16 20 0 14 Z" fill="url(#an-gold)" opacity="0.92" />
                    <circle cx="2" cy="-10" r="2.4" fill={ANDALUS.goldDeep} />
                </g>
            ))}
            {/* bottom shield cartouche */}
            <g transform="translate(190 470)">
                <path d="M-46 -8 C -54 6 -40 8 -36 2 C -40 18 -16 30 0 30 C 16 30 40 18 36 2 C 40 8 54 6 46 -8 C 40 2 30 0 28 -6 C 18 4 -18 4 -28 -6 C -30 0 -40 2 -46 -8 Z" fill="url(#an-gold)" stroke={ANDALUS.goldDeep} strokeWidth="0.9" />
                <path d="M-20 -2 C -20 16 0 24 0 24 C 0 24 20 16 20 -2 C 8 4 -8 4 -20 -2 Z" fill={ANDALUS.cream} stroke={ANDALUS.gold} strokeWidth="1" />
                <path d="M0 30 L0 42 M-4 38 L0 46 L4 38" stroke="url(#an-gold)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
        </svg>
    );
}

export function Peony({ size = 120, className, style }) {
    const petal = (rot, rx, ry, dist, fill) => (
        <g key={`${rot}-${dist}`} transform={`rotate(${rot}) translate(0 ${-dist})`}>
            <path
                d={`M0 0 C ${-rx} ${-ry * 0.5} ${-rx * 0.7} ${-ry * 1.4} 0 ${-ry * 1.7} C ${rx * 0.7} ${-ry * 1.4} ${rx} ${-ry * 0.5} 0 0 Z`}
                fill={fill}
                stroke={ANDALUS.wineDeep}
                strokeWidth="1"
            />
            <path d={`M0 ${-ry * 0.3} C ${-rx * 0.3} ${-ry * 0.8} ${-rx * 0.2} ${-ry * 1.2} 0 ${-ry * 1.5}`} stroke={ANDALUS.wineDeep} strokeWidth="0.6" opacity="0.5" fill="none" />
        </g>
    );
    return (
        <svg className={className} style={style} width={size} height={size} viewBox="-60 -60 120 120" aria-hidden="true">
            <Defs />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => petal(a, 24, 22, 16, 'url(#an-peony)'))}
            {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => petal(a, 18, 16, 8, ANDALUS.wine))}
            {[0, 60, 120, 180, 240, 300].map((a) => petal(a, 12, 11, 2, ANDALUS.wineLight))}
            <circle r="6" fill={ANDALUS.wineDeep} />
            {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 3} cy={Math.sin((a * Math.PI) / 180) * 3} r="0.9" fill={ANDALUS.goldLight} />
            ))}
        </svg>
    );
}

export function Bud({ size = 60, className, style }) {
    return (
        <svg className={className} style={style} width={size} height={size * 1.4} viewBox="0 0 40 56" aria-hidden="true">
            <Defs />
            <path d="M20 56 C 16 40 18 30 20 24" stroke="url(#an-leaf)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M20 26 C 10 24 6 14 12 6 C 16 14 24 14 28 6 C 34 14 30 24 20 26 Z" fill="url(#an-bud)" stroke={ANDALUS.wineDeep} strokeWidth="0.9" />
            <path d="M20 26 C 12 30 6 28 4 22 C 12 24 16 26 20 26 Z" fill="url(#an-leaf)" />
            <path d="M20 26 C 28 30 34 28 36 22 C 28 24 24 26 20 26 Z" fill="url(#an-leaf)" />
        </svg>
    );
}

export function LeafSpray({ size = 120, className, style, flip = false }) {
    const leaf = (x, y, rot, len) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <path d={`M0 0 C ${len * 0.4} ${-len * 0.28} ${len * 0.4} ${-len * 0.75} 0 ${-len} C ${-len * 0.4} ${-len * 0.75} ${-len * 0.4} ${-len * 0.28} 0 0 Z`} fill="url(#an-leaf)" stroke={ANDALUS.leafDeep} strokeWidth="0.8" />
            <path d={`M0 ${-len * 0.1} L0 ${-len * 0.9}`} stroke={ANDALUS.leafDeep} strokeWidth="0.8" opacity="0.7" />
        </g>
    );
    return (
        <svg className={className} style={style} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" transform={flip ? 'scale(-1 1)' : undefined}>
            <Defs />
            <path d="M10 112 C 40 96 64 70 84 36" stroke="url(#an-leaf)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            {leaf(36, 92, 40, 34)}
            {leaf(60, 70, 58, 40)}
            {leaf(82, 44, 36, 32)}
        </svg>
    );
}

export function RingMotif({ className }) {
    return (
        <svg className={className} viewBox="0 0 60 30" fill="none" aria-hidden="true">
            <Defs />
            <circle cx="23" cy="15" r="10" stroke="url(#an-gold-h)" strokeWidth="2" />
            <circle cx="37" cy="15" r="10" stroke="url(#an-gold-h)" strokeWidth="2" />
            <path d="M23 5 l1.6 3 -1.6 2.4 -1.6 -2.4 z" fill={ANDALUS.goldLight} />
            <path d="M37 5 l1.6 3 -1.6 2.4 -1.6 -2.4 z" fill={ANDALUS.goldLight} />
        </svg>
    );
}

/* Redesigned gold flourish to match the elegant 1px gold diamond divider line in the provided reference */
export function GoldFlourish({ className }) {
    return (
        <svg className={className} viewBox="0 0 160 8" fill="none" aria-hidden="true">
            <Defs />
            <line x1="0" y1="4" x2="72" y2="4" stroke="url(#an-gold-h)" strokeWidth="1" />
            <rect x="76" y="0" width="8" height="8" fill="url(#an-gold-h)" transform="rotate(45 80 4)" />
            <line x1="88" y1="4" x2="160" y2="4" stroke="url(#an-gold-h)" strokeWidth="1" />
        </svg>
    );
}
