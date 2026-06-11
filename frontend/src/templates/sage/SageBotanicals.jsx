/**
 * SageBotanicals — line-art botanical ornaments for the Sage template.
 * All stroked vector art using currentColor, so colour is set in CSS.
 */

/* ─── Two love-doves + heart (cover monogram) ─── */
export function DoveMonogram({ className }) {
    // Left dove, facing right toward the centre.
    const dove = (
        <g>
            {/* body + head + little beak (one flowing line) */}
            <path d="M16 52 C30 30 52 26 66 31 C70 32 71 35 67 38" />
            {/* upswept wing */}
            <path d="M50 28 C53 40 46 47 35 46 C42 42 46 36 48 30" />
            {/* fanned tail */}
            <path d="M16 52 L27 50 M16 52 L26 55 M16 52 L23 58" />
            {/* eye */}
            <circle cx="63" cy="33" r="0.9" fill="currentColor" stroke="none" />
        </g>
    );
    return (
        <svg className={className} viewBox="0 0 140 70" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {dove}
            <g transform="translate(140 0) scale(-1 1)">{dove}</g>
            {/* heart cradled between them */}
            <path d="M70 44 C67 39 60 40 60 45 C60 51 70 57 70 57 C70 57 80 51 80 45 C80 40 73 39 70 44 Z" />
        </svg>
    );
}

/* ─── Ornate filigree corner (scrollwork) ─── */
export function FiligreeCorner({ className }) {
    return (
        <svg className={className} viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {/* main double scroll */}
            <path d="M12 12 C40 12 46 36 26 40 C12 43 11 26 22 26 C31 26 28 38 19 35" />
            <path d="M12 12 C12 40 36 46 40 26 C43 12 26 11 26 22 C26 31 38 28 35 19" />
            {/* inner flourish */}
            <path d="M12 12 C26 20 30 30 30 44" opacity="0.7" />
            <path d="M12 12 C20 26 30 30 44 30" opacity="0.7" />
            {/* small leaves */}
            <path d="M44 30 C50 28 56 30 58 36 C52 37 47 35 44 30 Z" />
            <path d="M30 44 C28 50 30 56 36 58 C37 52 35 47 30 44 Z" />
            {/* dots */}
            <circle cx="58" cy="36" r="1.1" fill="currentColor" stroke="none" />
            <circle cx="36" cy="58" r="1.1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
    );
}

/* ─── Rich botanical corner spray (emanates from the top-right corner) ─── */
export function FloralCornerLight({ className }) {
    return (
        <svg className={className} viewBox="0 0 220 220" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {/* trailing stems from the corner inward */}
            <path d="M212 10 C172 28 136 58 100 106" />
            <path d="M212 10 C184 46 160 84 148 132" />
            <path d="M194 18 C166 36 142 64 128 100" />
            {/* leaves trailing down the stems */}
            <LanceLeaf x={138} y={92} len={36} w={10} rot={150} />
            <LanceLeaf x={116} y={116} len={30} w={8} rot={170} />
            <LanceLeaf x={100} y={96} len={32} w={9} rot={208} />
            <LanceLeaf x={156} y={116} len={32} w={9} rot={138} />
            <LanceLeaf x={132} y={142} len={28} w={8} rot={188} />
            <LanceLeaf x={176} y={70} len={28} w={8} rot={120} />
            {/* baby's-breath filler */}
            {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                    <line x1={110 - i * 8} y1={130 + i * 7} x2={102 - i * 9} y2={126 + i * 7} />
                    <circle cx={101 - i * 9} cy={126 + i * 7} r="1.8" />
                </g>
            ))}
            {/* flower cluster, pulled inward so it isn't clipped */}
            <Poppy x={168} y={50} r={23} rot={26} />
            <Poppy x={132} y={74} r={19} rot={-6} />
            <Poppy x={158} y={98} r={15} rot={48} />
            {/* a closed bud on its own stem */}
            <g transform="translate(122 112) rotate(196)">
                <path d="M0 0 C-7 -6 -7 -18 0 -22 C7 -18 7 -6 0 0 Z" />
                <line x1="0" y1="0" x2="0" y2="12" />
            </g>
        </svg>
    );
}

/* ─── Wildflower / poppy sprig (cream-screen centerpiece) ─── */
function Poppy({ x, y, r = 16, rot = 0 }) {
    return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
            {/* 5 rounded petals */}
            <path d={`M0 0 C ${-r} ${-r * 0.6} ${-r} ${-r * 1.5} 0 ${-r * 1.4} C ${r} ${-r * 1.5} ${r} ${-r * 0.6} 0 0 Z`} />
            <path d={`M0 0 C ${-r * 1.3} ${-r * 0.2} ${-r * 1.6} ${-r * 0.9} ${-r * 0.9} ${-r * 1.2}`} />
            <path d={`M0 0 C ${r * 1.3} ${-r * 0.2} ${r * 1.6} ${-r * 0.9} ${r * 0.9} ${-r * 1.2}`} />
            <path d={`M0 0 C ${-r * 0.9} ${r * 0.3} ${-r * 1.3} ${-r * 0.2} ${-r * 1.1} ${-r * 0.7}`} />
            <path d={`M0 0 C ${r * 0.9} ${r * 0.3} ${r * 1.3} ${-r * 0.2} ${r * 1.1} ${-r * 0.7}`} />
            {/* center stamens */}
            <circle cx="0" cy={-r * 0.5} r={r * 0.18} />
            {[-3, 0, 3].map((dx, i) => (
                <line key={i} x1="0" y1={-r * 0.5} x2={dx} y2={-r * 0.95} />
            ))}
        </g>
    );
}

function LanceLeaf({ x, y, len = 34, w = 9, rot = 0 }) {
    return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
            <path d={`M0 0 C ${w} ${-len * 0.4} ${w} ${-len * 0.8} 0 ${-len} C ${-w} ${-len * 0.8} ${-w} ${-len * 0.4} 0 0 Z`} />
            <line x1="0" y1="0" x2="0" y2={-len} />
            {[0.25, 0.45, 0.65].map((t, i) => (
                <g key={i}>
                    <line x1="0" y1={-len * t} x2={w * 0.55} y2={-len * (t + 0.12)} />
                    <line x1="0" y1={-len * t} x2={-w * 0.55} y2={-len * (t + 0.12)} />
                </g>
            ))}
        </g>
    );
}

export function FloralSprig({ className }) {
    return (
        <svg className={className} viewBox="0 0 200 260" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {/* stems converging at base */}
            <path d="M100 250 C96 200 80 150 78 96" />
            <path d="M100 250 C104 200 118 150 126 110" />
            <path d="M100 250 C100 210 100 170 100 150" />
            {/* leaves */}
            <LanceLeaf x={90} y={210} len={40} w={11} rot={-22} />
            <LanceLeaf x={112} y={200} len={38} w={10} rot={26} />
            <LanceLeaf x={86} y={160} len={34} w={9} rot={-30} />
            <LanceLeaf x={120} y={158} len={32} w={9} rot={34} />
            {/* filler sprig with tiny buds */}
            <path d="M100 150 C92 138 86 128 84 116" />
            {[0, 1, 2].map((i) => (
                <g key={i}>
                    <line x1={88 - i * 2} y1={130 - i * 8} x2={80 - i * 3} y2={126 - i * 8} />
                    <circle cx={79 - i * 3} cy={126 - i * 8} r="1.6" />
                </g>
            ))}
            {/* poppies */}
            <Poppy x={78} y={96} r={17} rot={-12} />
            <Poppy x={126} y={108} r={15} rot={18} />
            <Poppy x={104} y={150} r={13} rot={6} />
            {/* a closed bud */}
            <g transform="translate(140 132) rotate(28)">
                <path d="M0 0 C -7 -6 -7 -18 0 -22 C 7 -18 7 -6 0 0 Z" />
                <line x1="0" y1="0" x2="0" y2="10" />
            </g>
        </svg>
    );
}

/* ─── Small centered divider ─── */
export function SageRule({ className }) {
    return (
        <svg className={className} viewBox="0 0 200 12" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
            <line x1="10" y1="6" x2="80" y2="6" strokeWidth="0.8" opacity="0.5" />
            <line x1="120" y1="6" x2="190" y2="6" strokeWidth="0.8" opacity="0.5" />
            <path d="M100 1 L104 6 L100 11 L96 6 Z" strokeWidth="0.8" />
            <circle cx="100" cy="6" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}
