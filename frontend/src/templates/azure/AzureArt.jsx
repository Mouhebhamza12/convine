/**
 * AzureArt — blue line-art SVG asset pack for the Azure template.
 * Each asset is a separate, reusable component. All vector, all currentColor.
 *
 *   <CoupleIllustration/>  bride + groom line drawing
 *   <OrnateFrame/>         scalloped double-line cartouche (wraps children)
 *   <StarsCluster/>        small four-point sparkle cluster
 *   <Flourish/>            curved calligraphic divider / accent
 *   <HeartDivider/>        line · heart · line divider
 *   <ClockIcon/> <PinIcon/> <PhoneBadge/> <HeartGlyph/>   line icons
 */

/* ── scalloped wavy-circle path generator ── */
function wavyCircle(cx, cy, baseR, lobes, amp) {
    const total = 160;
    const pts = [];
    for (let i = 0; i <= total; i++) {
        const a = (i / total) * Math.PI * 2;
        const r = baseR + amp * Math.cos(lobes * a);
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    return `M${pts[0]} L ${pts.slice(1).join(' L ')} Z`;
}

/* ─── Ornate scalloped frame (wraps the couple) ─── */
export function OrnateFrame({ className, children }) {
    const outer = wavyCircle(130, 130, 118, 9, 7);
    const inner = wavyCircle(130, 130, 104, 9, 6);
    return (
        <div className={className}>
            <svg className="azure-frame__svg" viewBox="0 0 260 260" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d={outer} strokeWidth="3" />
                <path d={inner} strokeWidth="1.4" opacity="0.9" />
            </svg>
            <div className="azure-frame__content">{children}</div>
        </div>
    );
}

/* ─── Line-art couple: bride (left) leaning to groom (right) ─── */
export function CoupleIllustration({ className }) {
    return (
        <svg className={className} viewBox="0 0 240 320" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {/* ===================== BRIDE ===================== */}
            {/* hair updo + head (tilted toward groom) */}
            <path d="M86 52 C82 40 104 36 110 48 C116 44 112 30 98 30 C84 30 80 44 86 52 Z" strokeWidth="1.7" />
            <circle cx="98" cy="58" r="13" />
            <path d="M85 52 C78 50 74 56 78 62 C80 58 83 56 86 56" strokeWidth="1.5" />
            {/* neckline + bare shoulders */}
            <path d="M90 70 C92 76 104 76 106 70" strokeWidth="1.6" />
            <path d="M88 74 C80 78 76 86 76 96" />
            <path d="M108 74 C116 78 120 88 121 104" />
            {/* sweetheart bodice to waist */}
            <path d="M76 96 C78 112 80 124 84 138" />
            <path d="M121 104 C120 120 116 128 112 140" />
            <path d="M84 138 C92 144 104 144 112 140" strokeWidth="1.5" />
            {/* flowing gown + train sweeping left */}
            <path d="M84 138 C66 170 50 230 40 300" />
            <path d="M112 140 C124 180 126 250 118 300" />
            <path d="M40 300 C40 308 56 310 74 306 C92 310 110 308 118 300" />
            {/* train pool extra sweep */}
            <path d="M52 280 C44 292 36 300 26 304 C36 300 46 302 56 296" strokeWidth="1.5" opacity="0.85" />
            {/* gown fold lines */}
            <path d="M90 150 C82 200 74 250 66 296" strokeWidth="1.1" opacity="0.55" />
            <path d="M100 150 C100 205 100 252 98 300" strokeWidth="1.1" opacity="0.55" />
            <path d="M108 152 C114 205 116 255 112 298" strokeWidth="1.1" opacity="0.55" />
            {/* bride near-arm linking groom */}
            <path d="M112 112 C124 118 134 128 138 142" strokeWidth="1.7" />
            {/* bouquet held low at her left side */}
            <g strokeWidth="1.5">
                <circle cx="70" cy="150" r="6" />
                <circle cx="80" cy="146" r="6" />
                <circle cx="78" cy="158" r="6" />
                <circle cx="88" cy="153" r="5.5" />
                <circle cx="68" cy="161" r="5" />
                <path d="M74 168 C73 186 71 206 69 224 M84 166 C86 186 86 206 84 224" strokeWidth="1.2" opacity="0.8" />
            </g>

            {/* ===================== GROOM ===================== */}
            {/* hair + head (turned slightly to bride) */}
            <path d="M150 40 C140 40 134 50 138 60 C140 52 146 48 154 48 C162 48 167 52 168 60 C170 50 162 40 150 40 Z" strokeWidth="1.7" />
            <circle cx="153" cy="58" r="13" />
            {/* collar + bow tie */}
            <path d="M147 70 L150 80 L153 70" strokeWidth="1.6" />
            <path d="M144 82 C148 78 152 78 156 82 C152 86 148 86 144 82 Z" strokeWidth="1.6" />
            {/* jacket shoulders + sides */}
            <path d="M150 80 C138 84 132 96 131 112 L130 210" />
            <path d="M150 80 C164 84 172 96 174 112 L176 210" />
            {/* lapels */}
            <path d="M150 84 L140 110 L150 124 M150 84 L162 110 L150 124" strokeWidth="1.5" />
            <path d="M150 124 L150 188" strokeWidth="1.1" opacity="0.6" />
            {/* jacket pocket + hand-in-pocket arm */}
            <path d="M162 150 L172 150" strokeWidth="1.4" />
            <path d="M174 130 C180 142 180 152 170 152" strokeWidth="1.6" />
            {/* trousers */}
            <path d="M131 210 C132 244 134 280 134 304 L148 304 L153 214" />
            <path d="M176 210 C176 246 172 282 170 304 L156 304 L153 214" />
            {/* shoes */}
            <path d="M132 304 L150 304 M154 304 L172 304" strokeWidth="2.6" />
        </svg>
    );
}

/* ─── Small four-point star sparkle cluster ─── */
function star(cx, cy, r) {
    return `M${cx} ${cy - r} C ${cx + r * 0.22} ${cy - r * 0.22} ${cx + r * 0.22} ${cy - r * 0.22} ${cx + r} ${cy} C ${cx + r * 0.22} ${cy + r * 0.22} ${cx + r * 0.22} ${cy + r * 0.22} ${cx} ${cy + r} C ${cx - r * 0.22} ${cy + r * 0.22} ${cx - r * 0.22} ${cy + r * 0.22} ${cx - r} ${cy} C ${cx - r * 0.22} ${cy - r * 0.22} ${cx - r * 0.22} ${cy - r * 0.22} ${cx} ${cy - r} Z`;
}

export function StarsCluster({ className }) {
    return (
        <svg className={className} viewBox="0 0 80 70" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
            <path d={star(22, 24, 11)} />
            <path d={star(44, 16, 7)} />
            <path d={star(58, 30, 9)} />
            <path d={star(34, 44, 8)} />
            <circle cx="30" cy="34" r="1.1" fill="currentColor" stroke="none" />
            <circle cx="52" cy="48" r="1.1" fill="currentColor" stroke="none" />
        </svg>
    );
}

/* ─── Single four-point star (for scattering) ─── */
export function Star({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d={star(12, 12, 10)} />
        </svg>
    );
}

/* ─── Curved calligraphic flourish (scatter accent) ─── */
export function Flourish({ className, variant = 'a' }) {
    return (
        <svg className={className} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {variant === 'a' ? (
                <path d="M4 12 C10 4 16 4 16 10 C16 15 10 15 12 9 C14 4 24 4 28 12 C31 18 37 17 37 12" />
            ) : (
                <path d="M6 6 C6 16 18 16 18 9 C18 4 12 4 13 10 C14 18 30 18 34 8" />
            )}
        </svg>
    );
}

/* ─── Heart · line divider ─── */
function heartPath(cx, cy, s) {
    return `M${cx} ${cy + s * 0.7} C ${cx - s} ${cy - s * 0.2} ${cx - s * 0.55} ${cy - s} ${cx} ${cy - s * 0.35} C ${cx + s * 0.55} ${cy - s} ${cx + s} ${cy - s * 0.2} ${cx} ${cy + s * 0.7} Z`;
}

export function HeartDivider({ className }) {
    return (
        <svg className={className} viewBox="0 0 220 18" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
            <line x1="20" y1="9" x2="86" y2="9" strokeWidth="1.2" />
            <line x1="134" y1="9" x2="200" y2="9" strokeWidth="1.2" />
            <circle cx="96" cy="9" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="124" cy="9" r="1.5" fill="currentColor" stroke="none" />
            <path d={heartPath(110, 8, 5)} strokeWidth="1.3" fill="currentColor" />
        </svg>
    );
}

export function HeartGlyph({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d={heartPath(12, 10, 7)} />
        </svg>
    );
}

/* ─── Line icons for the meta row ─── */
export function ClockIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2.2" />
        </svg>
    );
}

export function PinIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s7-7.6 7-13a7 7 0 1 0-14 0c0 5.4 7 13 7 13z" />
            <circle cx="12" cy="9" r="2.6" />
        </svg>
    );
}

export function PhoneBadge({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="currentColor" />
            <path
                d="M9 6.5c.3 0 .6.2.7.5l.7 1.7c.1.3 0 .6-.2.8l-.8.7c.6 1.2 1.5 2.1 2.7 2.7l.7-.8c.2-.2.5-.3.8-.2l1.7.7c.3.1.5.4.5.7v1.8c0 .5-.4.9-.9.9C10.4 16.7 7.3 13.6 8 7.4c0-.5.4-.9.9-.9z"
                fill="#f6f1e3"
            />
        </svg>
    );
}
