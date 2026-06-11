/**
 * BloomBotanicals — reusable watercolor-garden ornament components for the
 * Bloom template. Sage-green leaves + dusty-rose buds, hand-drawn line art.
 * Deliberately nothing like Velvet's gold geometric fleurons.
 *
 * Colours come from the bloom CSS variables so they stay on-palette.
 */

const SAGE = 'var(--bloom-sage, #8fa98f)';
const SAGE_DEEP = 'var(--bloom-sage-deep, #6f8a6f)';
const ROSE = 'var(--bloom-rose, #c47b84)';
const BLUSH = 'var(--bloom-blush, #e8b4b8)';

/* Almond leaf path pointing "up" from the origin. */
function leaf(len = 15, w = 4.6) {
    return `M0 0 C ${w} ${-len * 0.35} ${w} ${-len * 0.75} 0 ${-len} C ${-w} ${-len * 0.75} ${-w} ${-len * 0.35} 0 0 Z`;
}

/* A small layered dusty-rose bud. */
function RoseBud({ x, y, r = 5 }) {
    return (
        <g transform={`translate(${x} ${y})`}>
            <circle r={r} fill={BLUSH} />
            <circle r={r * 0.62} fill={ROSE} fillOpacity="0.85" />
            <path d={`M0 ${-r * 0.5} A ${r * 0.5} ${r * 0.5} 0 0 1 0 ${r * 0.5}`} fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.6" />
        </g>
    );
}

/* ─── Single leafy sprig (for corners / accents) ─── */
export function LeafSprig({ className, flip = false }) {
    const leaves = [
        { x: 30, y: 62, a: -38 }, { x: 30, y: 62, a: 38 },
        { x: 30, y: 50, a: -32 }, { x: 30, y: 50, a: 32 },
        { x: 30, y: 38, a: -26 }, { x: 30, y: 38, a: 26 },
        { x: 30, y: 27, a: -20 }, { x: 30, y: 27, a: 20 },
    ];
    return (
        <svg
            className={className}
            viewBox="0 0 60 82"
            width="46"
            height="62"
            fill="none"
            aria-hidden="true"
            style={flip ? { transform: 'scaleX(-1)' } : undefined}
        >
            <path d="M30 80 C30 58 30 36 30 16" stroke={SAGE_DEEP} strokeWidth="1.2" strokeLinecap="round" />
            {leaves.map((l, i) => (
                <path
                    key={i}
                    d={leaf(15, 4.4)}
                    fill={i % 3 === 0 ? SAGE_DEEP : SAGE}
                    fillOpacity="0.85"
                    transform={`translate(${l.x} ${l.y}) rotate(${l.a})`}
                />
            ))}
            <RoseBud x={30} y={14} r={4.5} />
        </svg>
    );
}

/* ─── Horizontal leaf divider with a rose bud at center ─── */
export function LeafDivider({ className }) {
    const side = (sign) =>
        [70, 56, 42, 28].map((dx, i) => {
            const x = 130 + sign * dx;
            return (
                <g key={`${sign}-${i}`}>
                    <path d={leaf(11, 3.4)} fill={i % 2 ? SAGE_DEEP : SAGE} fillOpacity="0.8" transform={`translate(${x} 18) rotate(${sign * 60})`} />
                    <path d={leaf(11, 3.4)} fill={i % 2 ? SAGE_DEEP : SAGE} fillOpacity="0.8" transform={`translate(${x} 22) rotate(${sign * 120})`} />
                </g>
            );
        });
    return (
        <svg className={className} viewBox="0 0 260 40" width="220" height="34" fill="none" aria-hidden="true">
            <line x1="42" y1="20" x2="112" y2="20" stroke={SAGE} strokeWidth="1" opacity="0.55" strokeLinecap="round" />
            <line x1="148" y1="20" x2="218" y2="20" stroke={SAGE} strokeWidth="1" opacity="0.55" strokeLinecap="round" />
            {side(-1)}
            {side(1)}
            <RoseBud x={130} y={20} r={6} />
        </svg>
    );
}

/* ─── Oval botanical wreath (frames names / venue) ─── */
export function OvalWreath({ className }) {
    const cx = 130;
    const cy = 160;
    const rx = 104;
    const ry = 150;

    const pt = (deg) => {
        const r = (deg * Math.PI) / 180;
        return [cx + rx * Math.cos(r), cy + ry * Math.sin(r)];
    };
    // Two arcs leaving gaps at top (270°) and bottom (90°).
    const leftArc = `M ${pt(108)[0].toFixed(1)} ${pt(108)[1].toFixed(1)} A ${rx} ${ry} 0 0 1 ${pt(252)[0].toFixed(1)} ${pt(252)[1].toFixed(1)}`;
    const rightArc = `M ${pt(72)[0].toFixed(1)} ${pt(72)[1].toFixed(1)} A ${rx} ${ry} 0 0 0 ${pt(-72)[0].toFixed(1)} ${pt(-72)[1].toFixed(1)}`;

    const leavesFor = (a0, a1, n, inward) => {
        const arr = [];
        for (let i = 0; i <= n; i++) {
            const deg = a0 + ((a1 - a0) * i) / n;
            const [x, y] = pt(deg);
            const ang = deg + (inward ? 165 : 15);
            arr.push(
                <path
                    key={`${a0}-${i}`}
                    d={leaf(15, 4.4)}
                    fill={i % 3 === 0 ? SAGE_DEEP : SAGE}
                    fillOpacity="0.85"
                    transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`}
                />,
            );
        }
        return arr;
    };

    return (
        <svg className={className} viewBox="0 0 260 320" fill="none" aria-hidden="true">
            <path d={leftArc} stroke={SAGE_DEEP} strokeWidth="1.1" opacity="0.7" />
            <path d={rightArc} stroke={SAGE_DEEP} strokeWidth="1.1" opacity="0.7" />
            {leavesFor(110, 250, 9, true)}
            {leavesFor(70, -70, 9, false)}
            <RoseBud x={pt(250)[0]} y={pt(250)[1]} r={6} />
            <RoseBud x={pt(-70)[0]} y={pt(-70)[1]} r={6} />
            <RoseBud x={pt(108)[0]} y={pt(108)[1]} r={5} />
            <RoseBud x={pt(72)[0]} y={pt(72)[1]} r={5} />
        </svg>
    );
}

/* ─── Botanical wax-seal medallion (sage disc + rose sprig) ─── */
export function BudSeal({ className }) {
    return (
        <svg className={className} viewBox="0 0 96 96" width="76" height="76" fill="none" aria-hidden="true">
            <circle cx="48" cy="48" r="32" fill={SAGE} fillOpacity="0.9" />
            <circle cx="48" cy="48" r="32" stroke={SAGE_DEEP} strokeWidth="1" />
            <circle cx="48" cy="48" r="27" stroke="#fff" strokeWidth="0.8" opacity="0.45" />
            <g opacity="0.92">
                <path d="M48 66 C48 56 48 44 48 34" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                <path d={leaf(12, 3.6)} fill="#fff" fillOpacity="0.55" transform="translate(48 50) rotate(-35)" />
                <path d={leaf(12, 3.6)} fill="#fff" fillOpacity="0.55" transform="translate(48 50) rotate(35)" />
                <path d={leaf(12, 3.6)} fill="#fff" fillOpacity="0.45" transform="translate(48 42) rotate(-25)" />
                <path d={leaf(12, 3.6)} fill="#fff" fillOpacity="0.45" transform="translate(48 42) rotate(25)" />
                <RoseBud x={48} y={34} r={4.5} />
            </g>
        </svg>
    );
}
