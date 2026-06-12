/**
 * DarArt — painted SVG artwork for the Dar template (Algeria).
 * Rich vector illustration: glazed zellige, carved voussoir arches, a studded
 * Casbah door with real depth. Gradients and grout lines live inside the SVG,
 * never in CSS.
 */

/* shared palette */
export const DAR = {
    blue: '#2e6f93',
    blueDeep: '#1d4a63',
    blueNight: '#16384c',
    blueLight: '#7fa9c0',
    clay: '#c06a45',
    clayDeep: '#9c4f30',
    sand: '#e9dcbf',
    sandDeep: '#d9c69d',
    white: '#f7f2e6',
    cream: '#f6efdf',
    ink: '#33424a',
    leaf: '#6f8757',
    leafDeep: '#55693f',
    brass: '#c8a35f',
    brassLight: '#e6cc92',
    glow: '#e9c48a',
};

/* ── shared defs: every gradient and the zellige pattern ── */
function DarDefs() {
    return (
        <defs>
            <linearGradient id="dar-wood" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={DAR.blueNight} />
                <stop offset="0.5" stopColor={DAR.blueDeep} />
                <stop offset="1" stopColor="#27597a" />
            </linearGradient>
            <linearGradient id="dar-plaster" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#faf5e9" />
                <stop offset="1" stopColor="#eee3c9" />
            </linearGradient>
            <linearGradient id="dar-stone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#efe3c6" />
                <stop offset="1" stopColor={DAR.sandDeep} />
            </linearGradient>
            <linearGradient id="dar-marble" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#d8cba8" />
                <stop offset="0.45" stopColor="#f3ead2" />
                <stop offset="1" stopColor="#cdbd96" />
            </linearGradient>
            <radialGradient id="dar-stud" cx="0.35" cy="0.3" r="0.9">
                <stop offset="0" stopColor={DAR.brassLight} />
                <stop offset="0.6" stopColor={DAR.brass} />
                <stop offset="1" stopColor="#8a6c35" />
            </radialGradient>
            <radialGradient id="dar-glow" cx="0.5" cy="0.45" r="0.6">
                <stop offset="0" stopColor={DAR.glow} stopOpacity="0.95" />
                <stop offset="0.55" stopColor={DAR.glow} stopOpacity="0.35" />
                <stop offset="1" stopColor={DAR.glow} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dar-night" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={DAR.blueNight} />
                <stop offset="1" stopColor="#2a5d7d" />
            </linearGradient>
            <radialGradient id="dar-glaze" cx="0.3" cy="0.25" r="1.1">
                <stop offset="0" stopColor="#4d8cab" />
                <stop offset="0.55" stopColor={DAR.blue} />
                <stop offset="1" stopColor="#205573" />
            </radialGradient>
            <radialGradient id="dar-glaze-clay" cx="0.3" cy="0.25" r="1.1">
                <stop offset="0" stopColor="#d98a62" />
                <stop offset="0.55" stopColor={DAR.clay} />
                <stop offset="1" stopColor={DAR.clayDeep} />
            </radialGradient>
            <linearGradient id="dar-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f3d9a8" />
                <stop offset="1" stopColor="#bcd2da" />
            </linearGradient>
            {/* the zellige unit: glazed star and cross with grout */}
            <pattern id="dar-zl" width="38" height="38" patternUnits="userSpaceOnUse">
                <rect width="38" height="38" fill={DAR.sand} />
                <g transform="translate(19 19)">
                    <rect x="-11.5" y="-11.5" width="23" height="23" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.3" />
                    <rect x="-11.5" y="-11.5" width="23" height="23" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.3" transform="rotate(45)" />
                    <circle r="3" fill={DAR.white} opacity="0.92" />
                </g>
                {[[0, 0], [38, 0], [0, 38], [38, 38]].map(([x, y]) => (
                    <rect key={`${x}${y}`} x={x - 7.5} y={y - 7.5} width="15" height="15" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="1.2" transform={`rotate(45 ${x} ${y})`} />
                ))}
            </pattern>
        </defs>
    );
}

/* ── zellige frieze band ── */
export function ZelligeBand({ className }) {
    return (
        <svg className={className} viewBox="0 0 360 46" aria-hidden="true">
            <DarDefs />
            <rect x="3" y="3" width="354" height="40" fill="url(#dar-zl)" />
            <rect x="3" y="3" width="354" height="40" fill="none" stroke={DAR.blueDeep} strokeWidth="2" />
            <rect x="7" y="7" width="346" height="32" fill="none" stroke={DAR.white} strokeWidth="1" opacity="0.7" />
        </svg>
    );
}

/* ── glazed khatem star medallion ── */
export function KhatemStar({ className }) {
    return (
        <svg className={className} viewBox="0 0 300 300" aria-hidden="true">
            <DarDefs />
            <g transform="translate(150 150)">
                <rect x="-92" y="-92" width="184" height="184" rx="6" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="3" />
                <rect x="-92" y="-92" width="184" height="184" rx="6" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="3" transform="rotate(45)" />
                <rect x="-78" y="-78" width="156" height="156" rx="4" fill="none" stroke={DAR.white} strokeWidth="1.2" opacity="0.55" />
                <rect x="-78" y="-78" width="156" height="156" rx="4" fill="none" stroke={DAR.white} strokeWidth="1.2" opacity="0.55" transform="rotate(45)" />
                {/* glaze sheen */}
                <path d="M-80 -50 C-40 -90 30 -100 80 -70 C30 -86 -30 -78 -80 -50 Z" fill="#ffffff" opacity="0.16" />
                {/* tip accents */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                    <circle key={a} cx="0" cy="-116" r="4.2" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="1" transform={`rotate(${a})`} />
                ))}
            </g>
        </svg>
    );
}

/* ── the portal: plaster wall, voussoir horseshoe arch, dark threshold ──
   The doors themselves are HTML overlays (DoorLeaf) so they can swing in 3D. */
export function Portal({ className }) {
    // voussoir division rays around the arch
    const rays = [];
    for (let i = 1; i < 12; i++) {
        const a = Math.PI * (1 - i / 12);
        const cx = 160;
        const cy = 178;
        const r1 = 78;
        const r2 = 104;
        rays.push(
            <line
                key={i}
                x1={cx + r1 * Math.cos(a)}
                y1={cy - r1 * Math.sin(a) - 22}
                x2={cx + r2 * Math.cos(a)}
                y2={cy - r2 * Math.sin(a) - 30}
                stroke={DAR.clayDeep}
                strokeWidth="1.4"
                opacity="0.55"
            />,
        );
    }
    return (
        <svg className={className} viewBox="0 0 320 430" aria-hidden="true">
            <DarDefs />
            {/* plaster wall */}
            <rect x="0" y="0" width="320" height="430" fill="url(#dar-plaster)" />
            {/* soft wall stains */}
            <ellipse cx="40" cy="380" rx="60" ry="90" fill={DAR.sandDeep} opacity="0.18" />
            <ellipse cx="290" cy="120" rx="50" ry="80" fill={DAR.sandDeep} opacity="0.14" />
            {/* zellige wainscot flanking the door */}
            <rect x="8" y="318" width="72" height="86" fill="url(#dar-zl)" stroke={DAR.blueDeep} strokeWidth="2" />
            <rect x="240" y="318" width="72" height="86" fill="url(#dar-zl)" stroke={DAR.blueDeep} strokeWidth="2" />
            {/* voussoir band: a thick sand arc with carved divisions */}
            <path
                d="M70 404 L70 176 C44 156 42 104 72 70 C104 34 216 34 248 70 C278 104 276 156 250 176 L250 404"
                fill="none"
                stroke="url(#dar-stone)"
                strokeWidth="26"
            />
            {rays}
            {/* keystone */}
            <g transform="translate(160 40)">
                <rect x="-13" y="-13" width="26" height="26" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="2" transform="rotate(45)" />
            </g>
            {/* carved inner edge */}
            <path
                d="M84 404 L84 180 C62 162 60 112 86 82 C114 50 206 50 234 82 C260 112 258 162 236 180 L236 404"
                fill="none"
                stroke={DAR.clayDeep}
                strokeWidth="2"
                opacity="0.65"
            />
            {/* dark threshold behind the doors */}
            <path
                d="M86 404 L86 181 C65 163 63 113 88 84 C115 53 205 53 232 84 C257 113 255 163 234 181 L234 404 Z"
                fill={DAR.blueNight}
            />
            {/* spandrel stars */}
            <g transform="translate(34 60)">
                <rect x="-10" y="-10" width="20" height="20" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.4" />
                <rect x="-10" y="-10" width="20" height="20" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.4" transform="rotate(45)" />
            </g>
            <g transform="translate(286 60)">
                <rect x="-10" y="-10" width="20" height="20" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.4" />
                <rect x="-10" y="-10" width="20" height="20" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.4" transform="rotate(45)" />
            </g>
            {/* threshold step */}
            <rect x="62" y="404" width="196" height="12" fill="url(#dar-stone)" stroke={DAR.clayDeep} strokeWidth="1.4" />
            <rect x="50" y="416" width="220" height="12" fill="url(#dar-plaster)" stroke={DAR.clayDeep} strokeWidth="1.2" opacity="0.9" />
        </svg>
    );
}

/* warm courtyard light revealed when the doors open (SVG, animated by GSAP) */
export function PortalGlow({ className }) {
    return (
        <svg className={className} viewBox="0 0 160 260" aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%' }}>
            <DarDefs />
            <ellipse cx="80" cy="120" rx="90" ry="140" fill="url(#dar-glow)" />
            {/* a lantern silhouette inside the courtyard */}
            <g transform="translate(80 96)" opacity="0.85">
                <line x1="0" y1="-58" x2="0" y2="-34" stroke={DAR.brass} strokeWidth="1.6" />
                <path d="M0 -34 L12 -22 L9 6 L-9 6 L-12 -22 Z" fill="none" stroke={DAR.brass} strokeWidth="2" />
                <circle cx="0" cy="-9" r="4.5" fill={DAR.glow} />
                <line x1="-9" y1="6" x2="9" y2="6" stroke={DAR.brass} strokeWidth="2.4" />
            </g>
        </svg>
    );
}

/* ── one leaf of the studded door, arched top, carved panels ── */
export function DoorLeaf({ className, side = 'left' }) {
    const mirrored = side === 'right';
    // top edge rises toward the meeting edge (the arch apex)
    const shape = 'M0 64 C30 28 64 12 100 8 L100 300 L0 300 Z';
    const clipId = `dar-leaf-${side}`;
    const studRows = [104, 152, 200, 248];
    const studs = [];
    studRows.forEach((y, r) => {
        [18, 50, 82].forEach((x, c) => {
            studs.push(<circle key={`${r}${c}`} cx={x} cy={y} r="4.6" fill="url(#dar-stud)" stroke="#6e5527" strokeWidth="0.8" />);
        });
    });
    return (
        <svg
            className={className}
            viewBox="0 0 100 300"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
        >
            <DarDefs />
            <clipPath id={clipId}>
                <path d={shape} />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>
                <rect x="0" y="0" width="100" height="300" fill="url(#dar-wood)" />
                {/* plank seams */}
                {[25, 50, 75].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="#10293a" strokeWidth="1.2" opacity="0.7" />
                ))}
                {[25, 50, 75].map((x) => (
                    <line key={`h${x}`} x1={x + 1.4} y1="0" x2={x + 1.4} y2="300" stroke={DAR.blueLight} strokeWidth="0.6" opacity="0.25" />
                ))}
                {/* carved top panel with star */}
                <g transform="translate(50 64)">
                    <rect x="-26" y="-26" width="52" height="52" fill="none" stroke={DAR.brass} strokeWidth="1.4" opacity="0.85" transform="rotate(45)" />
                    <rect x="-16" y="-16" width="32" height="32" fill="none" stroke={DAR.brass} strokeWidth="1.1" opacity="0.7" />
                    <rect x="-16" y="-16" width="32" height="32" fill="none" stroke={DAR.brass} strokeWidth="1.1" opacity="0.7" transform="rotate(45)" />
                    <circle r="4" fill="url(#dar-stud)" stroke="#6e5527" strokeWidth="0.8" />
                </g>
                {studs}
                {/* edge bolts along the meeting edge */}
                {[36, 90, 144, 198, 252, 284].map((y) => (
                    <circle key={`e${y}`} cx="95" cy={y} r="2.6" fill="url(#dar-stud)" />
                ))}
                {/* light catching the leaf */}
                <path d="M0 64 C30 28 64 12 100 8 L100 14 C66 18 34 33 4 68 Z" fill={DAR.blueLight} opacity="0.35" />
                {/* ring knocker near the meeting edge */}
                <g transform="translate(84 168)">
                    <circle r="5.4" fill="url(#dar-stud)" stroke="#6e5527" strokeWidth="1" />
                    <circle cx="0" cy="13" r="10" fill="none" stroke="url(#dar-stud)" strokeWidth="3.4" />
                </g>
            </g>
            <path d={shape} fill="none" stroke="#0e2433" strokeWidth="2" />
        </svg>
    );
}

/* ── the hero arch: voussoirs, marble columns, zellige crown ── */
export function ArchFrame({ className, children }) {
    const rays = [];
    for (let i = 1; i < 12; i++) {
        const a = Math.PI * (1 - i / 12);
        rays.push(
            <line
                key={i}
                x1={170 + 86 * Math.cos(a)}
                y1={186 - 86 * Math.sin(a) - 18}
                x2={170 + 112 * Math.cos(a)}
                y2={186 - 112 * Math.sin(a) - 26}
                stroke={DAR.clayDeep}
                strokeWidth="1.3"
                opacity="0.5"
            />,
        );
    }
    return (
        <div className={className} style={{ position: 'relative' }}>
            <svg viewBox="0 0 340 440" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto' }}>
                <DarDefs />
                {/* paper panel with shadowed border */}
                <rect x="4" y="4" width="332" height="432" fill="url(#dar-plaster)" stroke={DAR.blueDeep} strokeWidth="2.4" />
                {/* zellige crown band */}
                <rect x="12" y="12" width="316" height="34" fill="url(#dar-zl)" stroke={DAR.blueDeep} strokeWidth="1.6" />
                {/* voussoir arch */}
                <path
                    d="M72 420 L72 184 C46 162 46 110 78 76 C112 40 228 40 262 76 C294 110 294 162 268 184 L268 420"
                    fill="none"
                    stroke="url(#dar-stone)"
                    strokeWidth="24"
                />
                {rays}
                <g transform="translate(170 52)">
                    <rect x="-12" y="-12" width="24" height="24" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="1.8" transform="rotate(45)" />
                </g>
                {/* inner carved line */}
                <path
                    d="M86 420 L86 188 C64 168 64 116 90 88 C120 56 220 56 250 88 C276 116 276 168 254 188 L254 420"
                    fill="none"
                    stroke={DAR.clayDeep}
                    strokeWidth="1.8"
                    opacity="0.6"
                />
                {/* marble column shafts */}
                <rect x="58" y="196" width="28" height="196" fill="url(#dar-marble)" stroke={DAR.clayDeep} strokeWidth="1.2" />
                <rect x="254" y="196" width="28" height="196" fill="url(#dar-marble)" stroke={DAR.clayDeep} strokeWidth="1.2" />
                {/* capitals + bases */}
                {[[50, 184], [246, 184]].map(([x, y]) => (
                    <g key={`c${x}`}>
                        <rect x={x} y={y} width="44" height="14" rx="3" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.4" />
                        <rect x={x + 4} y={y - 8} width="36" height="8" rx="2" fill="url(#dar-stone)" stroke={DAR.clayDeep} strokeWidth="1" />
                    </g>
                ))}
                {[[50, 392], [246, 392]].map(([x]) => (
                    <g key={`b${x}`}>
                        <rect x={x} y="392" width="44" height="12" rx="2" fill="url(#dar-stone)" stroke={DAR.clayDeep} strokeWidth="1.2" />
                        <rect x={x - 4} y="404" width="52" height="12" rx="2" fill="url(#dar-marble)" stroke={DAR.clayDeep} strokeWidth="1.2" />
                    </g>
                ))}
                {/* spandrel stars */}
                {[[36, 70], [304, 70]].map(([x, y]) => (
                    <g key={`s${x}`} transform={`translate(${x} ${y})`}>
                        <rect x="-9" y="-9" width="18" height="18" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.3" />
                        <rect x="-9" y="-9" width="18" height="18" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.3" transform="rotate(45)" />
                    </g>
                ))}
                {/* hanging pendant from the apex */}
                <line x1="170" y1="64" x2="170" y2="92" stroke={DAR.brass} strokeWidth="1.6" />
                <g transform="translate(170 100)">
                    <rect x="-7" y="-7" width="14" height="14" fill="url(#dar-stud)" stroke="#6e5527" strokeWidth="0.9" transform="rotate(45)" />
                </g>
                {/* threshold */}
                <rect x="64" y="416" width="212" height="12" fill="url(#dar-stone)" stroke={DAR.clayDeep} strokeWidth="1.3" />
            </svg>
            <div style={{ position: 'absolute', left: '27%', right: '27%', top: '30%', bottom: '12%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </div>
        </div>
    );
}

/* ── jasmine branch, painted ── */
export function JasmineSprig({ className, flip = false }) {
    const flower = (x, y, r, rot = 0) => (
        <g key={`${x}${y}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
            {[0, 72, 144, 216, 288].map((a) => (
                <g key={a} transform={`rotate(${a})`}>
                    <ellipse cx="0" cy={-r * 0.66} rx={r * 0.38} ry={r * 0.66} fill="#fdfaf2" stroke="#d8cba8" strokeWidth="0.9" />
                    <ellipse cx="0" cy={-r * 0.5} rx={r * 0.16} ry={r * 0.34} fill="#f1e8d2" opacity="0.8" />
                </g>
            ))}
            <circle r={r * 0.18} fill={DAR.brass} />
            <circle r={r * 0.08} fill={DAR.brassLight} />
        </g>
    );
    const leafShape = (x, y, rot, len = 26) => (
        <g key={`l${x}${y}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <path d={`M0 0 C ${len * 0.36} ${-len * 0.3} ${len * 0.36} ${-len * 0.8} 0 ${-len} C ${-len * 0.36} ${-len * 0.8} ${-len * 0.36} ${-len * 0.3} 0 0 Z`} fill={DAR.leaf} />
            <path d={`M0 ${-len * 0.12} L0 ${-len * 0.88}`} stroke={DAR.leafDeep} strokeWidth="1" opacity="0.8" />
        </g>
    );
    return (
        <svg className={className} viewBox="0 0 180 130" fill="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
            <path d="M6 122 C52 104 92 76 126 42 C140 28 154 20 172 16" stroke={DAR.leafDeep} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M64 96 C76 94 86 86 92 76" stroke={DAR.leafDeep} strokeWidth="1.4" strokeLinecap="round" />
            {leafShape(46, 104, 48)}
            {leafShape(90, 74, 60, 24)}
            {leafShape(118, 52, -50, 22)}
            {flower(128, 40, 17)}
            {flower(94, 68, 13, 24)}
            {flower(158, 24, 11, -16)}
            <ellipse cx="66" cy="88" rx="3.6" ry="7" fill="#fdfaf2" stroke="#d8cba8" strokeWidth="0.9" transform="rotate(-34 66 88)" />
            <ellipse cx="172" cy="38" rx="3.2" ry="6" fill="#fdfaf2" stroke="#d8cba8" strokeWidth="0.9" transform="rotate(26 172 38)" />
        </svg>
    );
}

/* ── khamsa, glazed ceramic ── */
export function Khamsa({ className }) {
    return (
        <svg className={className} viewBox="0 0 60 78" aria-hidden="true">
            <DarDefs />
            <path
                d="M30 74 C15 67 9 56 9 42 L9 22 C9 16.5 16 16.5 16 22 L16 34 L16 13 C16 7.5 23 7.5 23 13 L23 32 L23 8 C23 2.5 31 2.5 31 8 L31 32 L31 9 C31 3.5 39 3.5 39 9 L39 33 L39 21 C39 15.5 46 15.5 46 21 L46 42 C46 56 45 67 30 74 Z"
                fill="url(#dar-glaze)"
                stroke={DAR.blueDeep}
                strokeWidth="1.4"
            />
            <path d="M9 40 C4 36 2 30 5 25 M46 40 C51 36 53 30 50 25" stroke={DAR.blueDeep} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <g transform="translate(28 46)">
                <rect x="-6" y="-6" width="12" height="12" fill={DAR.white} opacity="0.95" />
                <rect x="-6" y="-6" width="12" height="12" fill={DAR.white} opacity="0.95" transform="rotate(45)" />
                <circle r="2.2" fill="url(#dar-glaze-clay)" />
            </g>
            <path d="M16 16 C20 10 30 7 38 10" stroke="#ffffff" strokeWidth="1.6" opacity="0.4" fill="none" strokeLinecap="round" />
        </svg>
    );
}

/* ── small horseshoe arch for the countdown arcade ── */
export function ArcadeArch({ className, children }) {
    return (
        <div className={className} style={{ position: 'relative' }}>
            <svg viewBox="0 0 110 134" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto' }}>
                <DarDefs />
                <path d="M20 128 L20 62 C11 54 10 33 23 20 C37 6 73 6 87 20 C100 33 99 54 90 62 L90 128" fill="none" stroke="url(#dar-stone)" strokeWidth="11" />
                <path d="M20 128 L20 62 C11 54 10 33 23 20 C37 6 73 6 87 20 C100 33 99 54 90 62 L90 128" fill="none" stroke={DAR.clayDeep} strokeWidth="1.2" opacity="0.55" />
                <g transform="translate(55 13)">
                    <rect x="-5.5" y="-5.5" width="11" height="11" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="1.2" transform="rotate(45)" />
                </g>
                {[[10, 58], [78, 58]].map(([x]) => (
                    <rect key={x} x={x} y="58" width="22" height="9" rx="2" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="1.1" />
                ))}
                <rect x="8" y="128" width="94" height="6" fill="url(#dar-stone)" stroke={DAR.clayDeep} strokeWidth="1" />
                {/* interior wash */}
                <path d="M26 126 L26 64 C18 56 18 36 28 26 C40 14 70 14 82 26 C92 36 92 56 84 64 L84 126 Z" fill="url(#dar-night)" opacity="0.12" />
            </svg>
            <div style={{ position: 'absolute', inset: '30% 16% 10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </div>
        </div>
    );
}

/* ── the Casbah alley at dusk: painted scene ── */
export function AlleyScene({ className }) {
    return (
        <svg className={className} viewBox="0 0 360 320" aria-hidden="true">
            <DarDefs />
            {/* dusk sky between the walls */}
            <rect x="112" y="6" width="136" height="70" fill="url(#dar-sky)" />
            {[[132, 20], [218, 14], [176, 34]].map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill={DAR.white} opacity="0.9" />
            ))}
            {/* left wall */}
            <path d="M6 2 L112 58 L112 260 L6 314 Z" fill="url(#dar-plaster)" stroke={DAR.ink} strokeWidth="1.6" />
            <path d="M96 50 L112 58 L112 260 L96 268 Z" fill={DAR.sandDeep} opacity="0.45" />
            {/* right wall, in shadow */}
            <path d="M354 2 L248 58 L248 260 L354 314 Z" fill="#ead9b9" stroke={DAR.ink} strokeWidth="1.6" />
            <path d="M264 50 L248 58 L248 260 L264 268 Z" fill="#c9b385" opacity="0.5" />
            {/* the sabat bridging the alley */}
            <rect x="112" y="58" width="136" height="54" fill="url(#dar-plaster)" stroke={DAR.ink} strokeWidth="1.6" />
            <path d="M112 112 C146 90 214 90 248 112" fill="none" stroke={DAR.ink} strokeWidth="2" />
            <path d="M112 112 C146 90 214 90 248 112 L248 117 C214 95 146 95 112 117 Z" fill={DAR.sandDeep} opacity="0.6" />
            {/* corbels under the sabat */}
            {[126, 162, 198, 234].map((x) => (
                <path key={x} d={`M${x} 112 L${x + 6} 112 L${x + 3} 121 Z`} fill={DAR.clayDeep} opacity="0.7" />
            ))}
            {/* tiny shuttered window on the sabat */}
            <rect x="164" y="68" width="32" height="30" rx="10" fill="url(#dar-night)" stroke={DAR.ink} strokeWidth="1.3" />
            <line x1="180" y1="68" x2="180" y2="98" stroke={DAR.blueLight} strokeWidth="1" opacity="0.7" />
            {/* far wall + the blue door */}
            <rect x="112" y="112" width="136" height="146" fill="#f4ecd8" stroke={DAR.ink} strokeWidth="1.4" />
            <path d="M150 246 L150 172 C143 165 143 148 152 139 C162 129 198 129 208 139 C217 148 217 165 210 172 L210 246" fill="none" stroke="url(#dar-stone)" strokeWidth="9" />
            <path d="M153 246 L153 173 C147 167 147 150 155 142 C165 133 195 133 205 142 C213 150 213 167 207 173 L207 246 Z" fill="url(#dar-wood)" stroke={DAR.ink} strokeWidth="1.2" />
            <line x1="180" y1="140" x2="180" y2="246" stroke="#10293a" strokeWidth="1.1" opacity="0.8" />
            {[[166, 160], [194, 160], [166, 196], [194, 196], [166, 230], [194, 230]].map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="2" fill="url(#dar-stud)" />
            ))}
            <circle cx="174" cy="196" r="3.4" fill="none" stroke={DAR.brass} strokeWidth="1.3" />
            {/* lantern on the left wall, lit */}
            <ellipse cx="84" cy="160" rx="26" ry="34" fill="url(#dar-glow)" opacity="0.8" />
            <path d="M70 128 L88 136" stroke={DAR.ink} strokeWidth="1.8" strokeLinecap="round" />
            <g transform="translate(88 150)">
                <line x1="0" y1="-14" x2="0" y2="-8" stroke={DAR.ink} strokeWidth="1.4" />
                <path d="M0 -8 L7 -2 L5 14 L-5 14 L-7 -2 Z" fill="url(#dar-night)" stroke={DAR.brass} strokeWidth="1.4" />
                <circle cx="0" cy="4" r="3" fill={DAR.glow} />
                <line x1="-5" y1="14" x2="5" y2="14" stroke={DAR.brass} strokeWidth="1.8" />
            </g>
            {/* steps */}
            <path d="M112 258 L248 258 L258 272 L102 272 Z" fill="url(#dar-stone)" stroke={DAR.ink} strokeWidth="1.3" />
            <path d="M102 272 L258 272 L270 288 L90 288 Z" fill="#efe5cb" stroke={DAR.ink} strokeWidth="1.3" />
            <path d="M90 288 L270 288 L282 306 L78 306 Z" fill="url(#dar-stone)" stroke={DAR.ink} strokeWidth="1.3" />
            <line x1="112" y1="258" x2="248" y2="258" stroke="#fff" strokeWidth="1" opacity="0.6" />
            <line x1="102" y1="272" x2="258" y2="272" stroke="#fff" strokeWidth="1" opacity="0.6" />
            <line x1="90" y1="288" x2="270" y2="288" stroke="#fff" strokeWidth="1" opacity="0.6" />
            {/* jasmine cascading over the left wall */}
            <path d="M54 84 C76 98 94 120 104 148 C108 160 110 172 110 184" stroke={DAR.leafDeep} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {[[60, 92, 9], [82, 112, 8], [98, 136, 7], [106, 162, 6]].map(([x, y, r]) => (
                <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
                    {[0, 72, 144, 216, 288].map((a) => (
                        <ellipse key={a} cx="0" cy={-r * 0.62} rx={r * 0.36} ry={r * 0.62} fill="#fdfaf2" stroke="#d8cba8" strokeWidth="0.8" transform={`rotate(${a})`} />
                    ))}
                    <circle r={r * 0.18} fill={DAR.brass} />
                </g>
            ))}
            <path d="M70 100 C78 96 84 90 86 82 C78 84 72 92 70 100 Z" fill={DAR.leaf} />
            <path d="M92 124 C100 120 104 113 105 106 C97 109 92 116 92 124 Z" fill={DAR.leaf} />
            {/* potted plant on the steps */}
            <path d="M292 268 C292 290 318 290 318 268 L314 252 L296 252 Z" fill="url(#dar-glaze-clay)" stroke={DAR.ink} strokeWidth="1.2" />
            <path d="M298 252 C297 240 302 232 305 228 M305 252 C305 238 308 232 312 226 M312 252 C313 242 316 236 320 232" stroke={DAR.leafDeep} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
    );
}

/* ── arched night window with open shutters; the hour glows inside ── */
export function WindowScene({ className, children }) {
    return (
        <div className={className} style={{ position: 'relative' }}>
            <svg viewBox="0 0 300 244" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto' }}>
                <DarDefs />
                {/* stone surround */}
                <path d="M100 200 L100 96 C92 88 92 62 105 49 C120 34 180 34 195 49 C208 62 208 88 200 96 L200 200" fill="none" stroke="url(#dar-stone)" strokeWidth="13" />
                <g transform="translate(150 40)">
                    <rect x="-7" y="-7" width="14" height="14" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="1.3" transform="rotate(45)" />
                </g>
                {/* night interior */}
                <path d="M104 198 L104 97 C97 90 97 64 109 53 C123 40 177 40 191 53 C203 64 203 90 196 97 L196 198 Z" fill="url(#dar-night)" />
                {/* stars inside */}
                {[[128, 78], [168, 64], [184, 96], [140, 110]].map(([x, y]) => (
                    <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
                        <path d="M0 -3.4 L0.9 -0.9 L3.4 0 L0.9 0.9 L0 3.4 L-0.9 0.9 L-3.4 0 L-0.9 -0.9 Z" fill={DAR.glow} opacity="0.9" />
                    </g>
                ))}
                {/* open shutters */}
                <g>
                    <path d="M96 58 L48 42 L48 206 L96 196 Z" fill="url(#dar-wood)" stroke="#0e2433" strokeWidth="1.6" />
                    <rect x="56" y="58" width="32" height="56" rx="3" fill="none" stroke={DAR.blueLight} strokeWidth="1.1" opacity="0.55" transform="skewY(-6)" />
                    <rect x="56" y="128" width="32" height="56" rx="3" fill="none" stroke={DAR.blueLight} strokeWidth="1.1" opacity="0.55" transform="skewY(-6)" />
                    <path d="M96 58 L48 42 L48 48 L96 63 Z" fill={DAR.blueLight} opacity="0.3" />
                </g>
                <g>
                    <path d="M204 58 L252 42 L252 206 L204 196 Z" fill="url(#dar-wood)" stroke="#0e2433" strokeWidth="1.6" />
                    <rect x="212" y="52" width="32" height="56" rx="3" fill="none" stroke={DAR.blueLight} strokeWidth="1.1" opacity="0.55" transform="skewY(6)" />
                    <rect x="212" y="122" width="32" height="56" rx="3" fill="none" stroke={DAR.blueLight} strokeWidth="1.1" opacity="0.55" transform="skewY(6)" />
                    <path d="M204 58 L252 42 L252 48 L204 63 Z" fill={DAR.blueLight} opacity="0.3" />
                </g>
                {/* sill + wrought iron rail */}
                <rect x="86" y="200" width="128" height="9" fill="url(#dar-stone)" stroke={DAR.clayDeep} strokeWidth="1.2" />
                <line x1="80" y1="222" x2="220" y2="222" stroke={DAR.ink} strokeWidth="2.4" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <path key={i} d={`M${92 + i * 22} 222 C${92 + i * 22} 211 ${108 + i * 22} 211 ${108 + i * 22} 222`} fill="none" stroke={DAR.ink} strokeWidth="1.5" />
                ))}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <line key={`v${i}`} x1={92 + i * 19.5} y1="209" x2={92 + i * 19.5} y2="222" stroke={DAR.ink} strokeWidth="1.1" opacity="0.7" />
                ))}
                {/* jasmine resting on the sill */}
                <g transform="translate(112 204)">
                    {[0, 72, 144, 216, 288].map((a) => (
                        <ellipse key={a} cx="0" cy="-4.6" rx="2.6" ry="4.6" fill="#fdfaf2" stroke="#d8cba8" strokeWidth="0.7" transform={`rotate(${a})`} />
                    ))}
                    <circle r="1.5" fill={DAR.brass} />
                </g>
            </svg>
            <div style={{ position: 'absolute', left: '36%', right: '36%', top: '26%', bottom: '26%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </div>
        </div>
    );
}

/* ── ceramic street plaque, glazed, like the address tiles of Algiers ── */
export function CeramicPlaque({ className, children }) {
    return (
        <div className={className} style={{ position: 'relative' }}>
            <svg viewBox="0 0 340 124" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto' }}>
                <DarDefs />
                <rect x="4" y="4" width="332" height="116" rx="12" fill="url(#dar-glaze)" stroke={DAR.blueDeep} strokeWidth="2.4" />
                <rect x="14" y="14" width="312" height="96" rx="8" fill={DAR.white} stroke={DAR.blueDeep} strokeWidth="1.2" />
                {/* glaze sheen across the tile */}
                <path d="M16 30 C100 8 240 6 324 22 L324 14 L16 14 Z" fill="#ffffff" opacity="0.25" />
                {/* corner florets */}
                {[[26, 26], [314, 26], [26, 98], [314, 98]].map(([x, y]) => (
                    <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
                        <rect x="-4.5" y="-4.5" width="9" height="9" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="0.9" />
                        <rect x="-4.5" y="-4.5" width="9" height="9" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="0.9" transform="rotate(45)" />
                    </g>
                ))}
                {/* mounting screws */}
                {[[12, 62], [328, 62]].map(([x, y]) => (
                    <circle key={`m${x}`} cx={x} cy={y} r="2.6" fill="url(#dar-stud)" />
                ))}
            </svg>
            <div style={{ position: 'absolute', inset: '16% 12%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </div>
        </div>
    );
}

/* ── glazed zellige tile for the RSVP choice ── */
export function RsvpTile({ className, variant = 'accept' }) {
    const glaze = variant === 'accept' ? 'url(#dar-glaze)' : 'url(#dar-glaze-clay)';
    const alt = variant === 'accept' ? 'url(#dar-glaze-clay)' : 'url(#dar-glaze)';
    return (
        <svg className={className} viewBox="0 0 130 130" aria-hidden="true">
            <DarDefs />
            <rect x="3" y="3" width="124" height="124" rx="4" fill={DAR.white} stroke={DAR.blueDeep} strokeWidth="2" />
            <g transform="translate(65 65)">
                <rect x="-27" y="-27" width="54" height="54" fill={glaze} stroke={DAR.white} strokeWidth="2.2" />
                <rect x="-27" y="-27" width="54" height="54" fill={glaze} stroke={DAR.white} strokeWidth="2.2" transform="rotate(45)" />
                <circle r="9" fill={DAR.white} opacity="0.95" />
                <circle r="3.6" fill={alt} />
            </g>
            {[[3, 3], [127, 3], [3, 127], [127, 127]].map(([x, y]) => (
                <rect key={`${x}${y}`} x={x - 12} y={y - 12} width="24" height="24" fill={alt} stroke={DAR.white} strokeWidth="1.6" transform={`rotate(45 ${x} ${y})`} />
            ))}
            {/* glaze sheen */}
            <path d="M8 38 C40 10 90 4 122 18 C84 12 40 20 8 46 Z" fill="#ffffff" opacity="0.22" />
        </svg>
    );
}

/* ── photo niche: arched frame with the image clipped inside (pure SVG) ── */
export function PhotoNiche({ className, src, fallback = '#dce6ea' }) {
    const id = `dar-niche-${src ? src.slice(-7).replace(/[^a-z0-9]/gi, '') : fallback.replace('#', '')}`;
    return (
        <svg className={className} viewBox="0 0 120 150" aria-hidden="true">
            <DarDefs />
            <clipPath id={id}>
                <path d="M14 144 L14 58 C8 50 8 30 19 19 C31 7 89 7 101 19 C112 30 112 50 106 58 L106 144 Z" />
            </clipPath>
            {src ? (
                <image href={src} x="-2" y="-2" width="124" height="154" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
            ) : (
                <path d="M14 144 L14 58 C8 50 8 30 19 19 C31 7 89 7 101 19 C112 30 112 50 106 58 L106 144 Z" fill={fallback} />
            )}
            {/* stone surround */}
            <path d="M14 144 L14 58 C8 50 8 30 19 19 C31 7 89 7 101 19 C112 30 112 50 106 58 L106 144" fill="none" stroke="url(#dar-stone)" strokeWidth="9" />
            <path d="M14 144 L14 58 C8 50 8 30 19 19 C31 7 89 7 101 19 C112 30 112 50 106 58 L106 144" fill="none" stroke={DAR.clayDeep} strokeWidth="1.2" opacity="0.5" />
            <g transform="translate(60 11)">
                <rect x="-5" y="-5" width="10" height="10" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="1" transform="rotate(45)" />
            </g>
            <rect x="6" y="144" width="108" height="6" fill="url(#dar-stone)" stroke={DAR.clayDeep} strokeWidth="1" />
        </svg>
    );
}

/* ── quiet divider: glazed diamonds on a line ── */
export function DiamondRule({ className }) {
    return (
        <svg className={className} viewBox="0 0 200 16" aria-hidden="true">
            <DarDefs />
            <line x1="0" y1="8" x2="80" y2="8" stroke={DAR.blue} strokeWidth="1" opacity="0.55" />
            <line x1="120" y1="8" x2="200" y2="8" stroke={DAR.blue} strokeWidth="1" opacity="0.55" />
            <rect x="94" y="2" width="12" height="12" fill="url(#dar-glaze-clay)" stroke={DAR.white} strokeWidth="1" transform="rotate(45 100 8)" />
            <rect x="81" y="5" width="6" height="6" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="0.8" transform="rotate(45 84 8)" />
            <rect x="113" y="5" width="6" height="6" fill="url(#dar-glaze)" stroke={DAR.white} strokeWidth="0.8" transform="rotate(45 116 8)" />
        </svg>
    );
}

/* ── Reference-style entrance scene: carved arch, dark door, lanterns, vines.
   Built as a reusable SVG asset so the hero does not fake decoration in CSS. */
export function DarEntranceBackdrop({ className }) {
    const vineLeaves = [
        [42, 72, -28], [58, 104, 22], [36, 138, -18], [64, 176, 26], [44, 214, -20], [72, 258, 18],
        [303, 82, 26], [288, 118, -18], [312, 158, 22], [282, 204, -26], [306, 246, 16],
    ];
    const blossoms = [[52, 92], [34, 160], [70, 236], [298, 110], [315, 182], [286, 270]];
    const tiles = [];
    for (let y = 52; y < 296; y += 44) {
        tiles.push(<path key={`l${y}`} d={`M102 ${y}h46v34h-46zM212 ${y}h46v34h-46z`} fill="none" stroke="#b89461" strokeWidth="1" opacity="0.38" />);
    }

    return (
        <svg className={className} viewBox="0 0 360 520" aria-hidden="true">
            <DarDefs />
            <rect width="360" height="520" fill="#efe2cc" />
            <path d="M0 0h360v520H0z" fill="#f8f0df" opacity="0.42" />
            <path d="M12 14h336v330H12z" fill="#efe1c9" stroke="#cdb58f" strokeWidth="1.2" />
            <g opacity="0.32" stroke="#b89461" strokeWidth="1">
                <path d="M18 34c48 28 78 28 126 0M216 34c48 28 78 28 126 0" fill="none" />
                <path d="M20 74h72M268 74h72M22 118h60M278 118h60M22 162h54M284 162h54" />
                <path d="M34 28 50 44 34 60 18 44zM326 28l16 16-16 16-16-16z" fill="none" />
            </g>

            <path
                d="M68 508V205C39 181 38 116 76 73 119 25 241 25 284 73c38 43 37 108 8 132v303"
                fill="none"
                stroke="#d9c6a6"
                strokeWidth="34"
            />
            <path
                d="M86 508V210C62 188 61 123 92 89c36-40 140-40 176 0 31 34 30 99 6 121v298"
                fill="none"
                stroke="#f8f0df"
                strokeWidth="19"
            />
            <path
                d="M98 508V214C77 193 76 130 104 99c31-34 121-34 152 0 28 31 27 94 6 115v294Z"
                fill="#211b14"
            />
            <path
                d="M106 508V220C88 201 88 138 112 111c28-30 108-30 136 0 24 27 24 90 6 109v288Z"
                fill="#1a2b22"
                stroke="#3b2a18"
                strokeWidth="2"
            />
            <path d="M180 86v422" stroke="#0d160f" strokeWidth="2" opacity="0.8" />
            {tiles}
            <g stroke="#8d6a37" opacity="0.45" fill="none">
                <path d="M126 132c24-20 84-20 108 0M124 184c28-18 84-18 112 0M124 236c28-18 84-18 112 0" />
                <path d="M132 142 150 160l-18 18-18-18zM228 142l18 18-18 18-18-18z" />
                <path d="M132 238 150 256l-18 18-18-18zM228 238l18 18-18 18-18-18z" />
            </g>

            <g transform="translate(72 180)">
                <ellipse cx="0" cy="28" rx="28" ry="40" fill="url(#dar-glow)" opacity="0.62" />
                <path d="M0-28v14M-14-7 0-18 14-7 10 36h-20z" fill="#3a2512" stroke="#c8a35f" strokeWidth="2" />
                <rect x="-7" y="0" width="14" height="24" fill="#e9c48a" opacity="0.86" />
                <path d="M-18 36h36M-8 45h16" stroke="#3a2512" strokeWidth="2" />
            </g>
            <g transform="translate(288 180)">
                <ellipse cx="0" cy="28" rx="28" ry="40" fill="url(#dar-glow)" opacity="0.62" />
                <path d="M0-28v14M-14-7 0-18 14-7 10 36h-20z" fill="#3a2512" stroke="#c8a35f" strokeWidth="2" />
                <rect x="-7" y="0" width="14" height="24" fill="#e9c48a" opacity="0.86" />
                <path d="M-18 36h36M-8 45h16" stroke="#3a2512" strokeWidth="2" />
            </g>

            <path d="M34 44c23 58 30 122 18 191M320 46c-27 62-34 128-22 196" stroke="#596b42" strokeWidth="3" fill="none" strokeLinecap="round" />
            {vineLeaves.map(([x, y, r]) => (
                <ellipse key={`${x}${y}`} cx={x} cy={y} rx="7" ry="14" fill={DAR.leaf} transform={`rotate(${r} ${x} ${y})`} />
            ))}
            {blossoms.map(([x, y]) => (
                <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
                    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-6" rx="3.5" ry="6" fill="#fffaf0" stroke="#d8cba8" strokeWidth=".7" transform={`rotate(${a})`} />)}
                    <circle r="1.7" fill={DAR.brass} />
                </g>
            ))}

            <path d="M0 344h360v176H0z" fill="#e9d8bd" />
            <path d="M72 344h216v18H72zM56 362h248v20H56z" fill="#d3bd96" />
            <path d="M26 468c10-31 39-50 76-52-17 47-43 66-76 52Z" fill={DAR.leafDeep} />
            <path d="M317 468c-10-31-39-50-76-52 17 47 43 66 76 52Z" fill={DAR.leafDeep} />
            <g transform="translate(70 420)">
                <path d="M-21 62c4 21 38 21 42 0l-5-34h-32z" fill="#b57946" stroke="#69401f" />
                <path d="M-14 28c0-24 11-42 30-54M0 28c-8-29-3-53 15-74M12 28c2-24 13-40 33-48" stroke="#596b42" strokeWidth="2.4" fill="none" />
            </g>
            <g transform="translate(290 424)">
                <path d="M-18 58c4 18 32 18 36 0l-4-30h-28z" fill="#b57946" stroke="#69401f" />
                <path d="M-10 28c-3-24 5-41 24-52M5 28c-4-22 2-38 18-50M12 28c5-18 16-30 32-35" stroke="#596b42" strokeWidth="2.2" fill="none" />
            </g>
        </svg>
    );
}

export function BrassMedallionFloral({ className }) {
    return (
        <svg className={className} viewBox="0 0 260 160" aria-hidden="true">
            <DarDefs />
            <g transform="translate(172 96)">
                <circle r="48" fill="#8a5a21" stroke="#d6ae62" strokeWidth="4" />
                <circle r="37" fill="none" stroke="#d6ae62" strokeWidth="1.6" />
                <circle r="24" fill="none" stroke="#d6ae62" strokeWidth="1.2" strokeDasharray="3 5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                    <path key={a} d="M0-31 5-18 0-11-5-18Z" fill="#d6ae62" opacity=".75" transform={`rotate(${a})`} />
                ))}
            </g>
            <path d="M30 115c42-42 84-58 132-48" stroke={DAR.leafDeep} strokeWidth="3" fill="none" strokeLinecap="round" />
            {[54, 84, 114].map((x, i) => (
                <g key={x} transform={`translate(${x} ${86 - i * 14})`}>
                    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-12" rx="7" ry="12" fill="#fff8ec" stroke="#d8cba8" transform={`rotate(${a})`} />)}
                    <circle r="4" fill={DAR.brass} />
                </g>
            ))}
            {[70, 104, 134].map((x, i) => <ellipse key={x} cx={x} cy={112 - i * 20} rx="9" ry="18" fill={DAR.leaf} transform={`rotate(${i % 2 ? 45 : -40} ${x} ${112 - i * 20})`} />)}
        </svg>
    );
}
