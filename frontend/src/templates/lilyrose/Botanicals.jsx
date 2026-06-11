/* ════════════════════════════════════════════════════════════════════
   Lily & Rose — the botanical universe
   Original, hand-authored SVG illustrations. Every flower is built from
   layered petals with watercolour gradient depth and gold-foil accents.
   Flowers are characters: the white lily (her) and the rose (him).
   ════════════════════════════════════════════════════════════════════ */

/* Shared gradients + filters, rendered once at the root and referenced
   document-wide by every flower via url(#id). */
export function BotanicalDefs() {
    return (
        <svg className="lr-defs" width="0" height="0" aria-hidden="true" focusable="false">
            <defs>
                {/* Petals — light pools at the flower's heart, colour gathers at the tips */}
                <radialGradient id="lr-petal-cream" cx="0.5" cy="0.96" r="0.95">
                    <stop offset="0%" stopColor="#fffdf8" />
                    <stop offset="52%" stopColor="#f5e8cf" />
                    <stop offset="100%" stopColor="#e2cda7" />
                </radialGradient>
                <radialGradient id="lr-petal-blush" cx="0.5" cy="0.96" r="0.95">
                    <stop offset="0%" stopColor="#fff7f2" />
                    <stop offset="55%" stopColor="#f3d3cb" />
                    <stop offset="100%" stopColor="#e3b1a8" />
                </radialGradient>
                <radialGradient id="lr-petal-rose" cx="0.5" cy="0.96" r="0.95">
                    <stop offset="0%" stopColor="#fceae5" />
                    <stop offset="50%" stopColor="#e2a79f" />
                    <stop offset="100%" stopColor="#cd8a82" />
                </radialGradient>
                <radialGradient id="lr-petal-core" cx="0.5" cy="0.7" r="0.8">
                    <stop offset="0%" stopColor="#f0c9b0" />
                    <stop offset="100%" stopColor="#d99e8f" />
                </radialGradient>

                {/* Leaves */}
                <linearGradient id="lr-leaf-sage" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#b7c4a1" />
                    <stop offset="55%" stopColor="#92a37b" />
                    <stop offset="100%" stopColor="#74855d" />
                </linearGradient>
                <radialGradient id="lr-throat" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#e7d79a" />
                    <stop offset="60%" stopColor="#c0b06f" />
                    <stop offset="100%" stopColor="#9aa86f" />
                </radialGradient>

                {/* Gold foil — a soft champagne sheen, never garish */}
                <linearGradient id="lr-foil" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#efdcae" />
                    <stop offset="38%" stopColor="#c9a86a" />
                    <stop offset="62%" stopColor="#a8854c" />
                    <stop offset="100%" stopColor="#e3cfa0" />
                </linearGradient>

                {/* Watercolour bleed for the soft halo behind each bloom */}
                <filter id="lr-bleed" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.4" />
                </filter>
            </defs>
        </svg>
    );
}

/* ── Leaf ───────────────────────────────────────────────────────── */
export function Leaf({ size = 56, className = '', style, rotate = 0 }) {
    return (
        <svg
            className={`lr-bot lr-leaf ${className}`}
            viewBox="0 0 60 104"
            width={size}
            style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
            aria-hidden="true"
        >
            <path d="M30 4 C52 26 52 74 30 100 C8 74 8 26 30 4 Z" fill="url(#lr-leaf-sage)" />
            <path d="M30 9 L30 95" stroke="#65754f" strokeWidth="0.8" opacity="0.55" fill="none" />
            <g stroke="#65754f" strokeWidth="0.6" opacity="0.4" fill="none">
                <path d="M30 28 C38 31 43 37 46 45" />
                <path d="M30 28 C22 31 17 37 14 45" />
                <path d="M30 50 C38 53 43 59 46 67" />
                <path d="M30 50 C22 53 17 59 14 67" />
            </g>
        </svg>
    );
}

/* ── Rose ───────────────────────────────────────────────────────── */
const ROSE_OUTER = [0, 72, 144, 216, 288];
const ROSE_MID = [36, 108, 180, 252, 324];

export function Rose({ size = 120, variant = 'cream', className = '', style }) {
    const grad = variant === 'rose' ? 'lr-petal-rose' : variant === 'blush' ? 'lr-petal-blush' : 'lr-petal-cream';
    const wash = variant === 'rose' ? '#e6b1a8' : variant === 'blush' ? '#f0cbc2' : '#f0e2c8';
    return (
        <svg className={`lr-bot lr-rose ${className}`} viewBox="0 0 100 100" width={size} style={style} aria-hidden="true">
            <ellipse cx="50" cy="51" rx="43" ry="43" fill={wash} opacity="0.2" filter="url(#lr-bleed)" />
            <g className="lr-petal-ring">
                {ROSE_OUTER.map((a) => (
                    <path
                        key={a}
                        className="lr-petal"
                        transform={`rotate(${a} 50 52)`}
                        d="M50 55 C31 48 26 22 43 10 C47 7 53 7 57 10 C74 22 69 48 50 55 Z"
                        fill={`url(#${grad})`}
                        stroke="#ffffff"
                        strokeOpacity="0.4"
                        strokeWidth="0.4"
                    />
                ))}
            </g>
            <g className="lr-petal-ring">
                {ROSE_MID.map((a) => (
                    <path
                        key={a}
                        className="lr-petal"
                        transform={`rotate(${a} 50 52)`}
                        d="M50 50 C39 45 35 28 46 18 C48 16 52 16 54 18 C65 28 61 45 50 50 Z"
                        fill={`url(#${grad})`}
                        stroke="#ffffff"
                        strokeOpacity="0.35"
                        strokeWidth="0.35"
                    />
                ))}
            </g>
            <g className="lr-petal-ring">
                {[18, 90, 162, 234, 306].map((a) => (
                    <path
                        key={a}
                        className="lr-petal"
                        transform={`rotate(${a} 50 52)`}
                        d="M50 48 C43 44 41 34 48 27 C49.3 25.6 50.7 25.6 52 27 C59 34 57 44 50 48 Z"
                        fill={`url(#${grad})`}
                        stroke="#ffffff"
                        strokeOpacity="0.3"
                        strokeWidth="0.3"
                    />
                ))}
            </g>
            {/* the curled heart of the rose */}
            <g className="lr-petal">
                <path d="M50 46 C44 43 43 36 48 31 C49.2 29.8 50.8 29.8 52 31 C57 36 56 43 50 46 Z" fill="url(#lr-petal-core)" />
                <path d="M50 32 C53.5 34 53.5 40 50 43" stroke="#c98f80" strokeWidth="0.7" fill="none" opacity="0.7" />
                <path d="M50 43 C47 41 47 37 49 35" stroke="#c98f80" strokeWidth="0.6" fill="none" opacity="0.6" />
            </g>
        </svg>
    );
}

/* ── Lily ───────────────────────────────────────────────────────── */
const LILY_PETALS = [0, 60, 120, 180, 240, 300];
const LILY_STAMENS = [30, 90, 150, 210, 270, 330];

export function Lily({ size = 134, variant = 'white', className = '', style }) {
    const grad = variant === 'blush' ? 'lr-petal-blush' : 'lr-petal-cream';
    return (
        <svg className={`lr-bot lr-lily ${className}`} viewBox="0 0 100 100" width={size} style={style} aria-hidden="true">
            <ellipse cx="50" cy="51" rx="46" ry="46" fill="#f3e6cd" opacity="0.16" filter="url(#lr-bleed)" />
            <g className="lr-petal-ring">
                {LILY_PETALS.map((a) => (
                    <g key={a} transform={`rotate(${a} 50 52)`} className="lr-petal">
                        <path
                            d="M50 53 C40.5 41 37.5 19 46 4.5 C48 1 52 1 54 4.5 C62.5 19 59.5 41 50 53 Z"
                            fill={`url(#${grad})`}
                            stroke="#e7d6b8"
                            strokeOpacity="0.7"
                            strokeWidth="0.4"
                        />
                        <path d="M50 50 L50 9" stroke="#c7b88a" strokeWidth="0.6" opacity="0.5" fill="none" />
                        {/* faint blush guide-lines, as real lilies wear */}
                        <path d="M50 45 C47.5 35 47.5 23 49.5 13" stroke="#dcae9f" strokeWidth="0.6" opacity="0.4" fill="none" />
                        <path d="M50 45 C52.5 35 52.5 23 50.5 13" stroke="#dcae9f" strokeWidth="0.6" opacity="0.4" fill="none" />
                    </g>
                ))}
            </g>
            <circle cx="50" cy="52" r="7" fill="url(#lr-throat)" opacity="0.92" />
            <g>
                {LILY_STAMENS.map((a) => (
                    <g key={a} transform={`rotate(${a} 50 52)`}>
                        <path d="M50 52 C49.3 44 50 37 50 30" stroke="url(#lr-foil)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                        <ellipse cx="50" cy="27.5" rx="2.8" ry="1.4" fill="#b06a3a" transform="rotate(16 50 27.5)" />
                    </g>
                ))}
                {/* central pistil */}
                <path d="M50 52 L50 37" stroke="url(#lr-foil)" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="50" cy="36" r="1.9" fill="#9aa86f" />
            </g>
        </svg>
    );
}

/* ── Bud (lily or rose) ─────────────────────────────────────────── */
export function Bud({ size = 54, variant = 'rose', className = '', style }) {
    const grad = variant === 'rose' ? 'lr-petal-rose' : variant === 'blush' ? 'lr-petal-blush' : 'lr-petal-cream';
    return (
        <svg className={`lr-bot lr-bud ${className}`} viewBox="0 0 60 100" width={size} style={style} aria-hidden="true">
            <path d="M30 6 C42 18 44 44 30 64 C16 44 18 18 30 6 Z" fill={`url(#${grad})`} stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.4" />
            <path d="M30 10 C34 22 34 44 30 60" stroke="#c98f80" strokeWidth="0.6" opacity="0.5" fill="none" />
            {/* calyx */}
            <path d="M30 58 C24 66 22 78 24 92" stroke="url(#lr-leaf-sage)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M30 62 C32 72 31 82 30 96" stroke="url(#lr-leaf-sage)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M30 60 C36 68 39 78 38 90" stroke="url(#lr-leaf-sage)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
    );
}

/* ── Small sprig of leaves, for fine accents ────────────────────── */
export function Sprig({ size = 90, className = '', style, flip = false }) {
    return (
        <svg
            className={`lr-bot lr-sprig ${className}`}
            viewBox="0 0 120 60"
            width={size}
            style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
            aria-hidden="true"
        >
            <path d="M6 30 C40 28 80 24 116 18" stroke="url(#lr-foil)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
            <g fill="url(#lr-leaf-sage)">
                <path d="M30 28 C34 16 46 12 54 14 C48 24 40 30 30 28 Z" />
                <path d="M52 24 C56 12 68 8 76 10 C70 20 62 26 52 24 Z" />
                <path d="M74 20 C78 9 90 5 98 7 C92 17 84 22 74 20 Z" />
                <path d="M26 30 C20 22 10 22 4 26 C12 32 20 34 26 30 Z" />
            </g>
        </svg>
    );
}

/* ── A gold flourish, used to underline labels ──────────────────── */
export function GoldFlourish({ className = '', width = 220 }) {
    return (
        <svg className={`lr-bot lr-flourish ${className}`} viewBox="0 0 220 24" width={width} aria-hidden="true">
            <path d="M10 12 C60 4 90 4 110 11 C130 18 160 18 210 10" stroke="url(#lr-foil)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
            <path d="M110 11 l-5 -5 l5 -5 l5 5 z" fill="url(#lr-foil)" />
            <circle cx="10" cy="12" r="1.4" fill="url(#lr-foil)" />
            <circle cx="210" cy="10" r="1.4" fill="url(#lr-foil)" />
        </svg>
    );
}

/* ── Floral divider between scenes ──────────────────────────────── */
export function FloralDivider({ className = '' }) {
    return (
        <div className={`lr-divider ${className}`} aria-hidden="true">
            <span className="lr-divider__line" />
            <Leaf size={22} rotate={-28} className="lr-divider__leaf" />
            <Rose size={34} variant="blush" className="lr-divider__rose" />
            <Leaf size={22} rotate={28} className="lr-divider__leaf lr-divider__leaf--r" />
            <span className="lr-divider__line" />
        </div>
    );
}

/* ── Corner cluster, for framing letters & photos ───────────────── */
export function FloralCorner({ className = '', placement = 'tl' }) {
    return (
        <div className={`lr-corner lr-corner--${placement} ${className}`} aria-hidden="true">
            <Leaf size={46} rotate={-38} className="lr-corner__leaf lr-corner__leaf--a" />
            <Leaf size={34} rotate={26} className="lr-corner__leaf lr-corner__leaf--b" />
            <Bud size={34} variant="rose" className="lr-corner__bud" />
            <Lily size={70} className="lr-corner__lily" />
            <Rose size={58} variant="rose" className="lr-corner__rose" />
            <Rose size={40} variant="cream" className="lr-corner__rose lr-corner__rose--sm" />
        </div>
    );
}
