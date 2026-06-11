/**
 * AzureArt — blue line-art illustrations for the Azure template.
 * Couple drawing, ornate cartouche frame, hand-drawn doodles, phone icon.
 * All use currentColor so the blue is set in CSS.
 */

/* ─── Ornate double-outline cartouche frame ─── */
export function OrnateFrame({ className, children }) {
    // A wavy "label" outline, drawn twice (outer + inner) for the double line.
    const shape =
        'M40 18 ' +
        'C 90 8 170 8 220 18 ' +
        'C 232 40 232 60 224 78 ' +
        'C 236 110 236 150 224 182 ' +
        'C 232 200 232 220 220 242 ' +
        'C 170 252 90 252 40 242 ' +
        'C 28 220 28 200 36 182 ' +
        'C 24 150 24 110 36 78 ' +
        'C 28 60 28 40 40 18 Z';
    return (
        <div className={className}>
            <svg className="azure-frame__svg" viewBox="0 0 260 260" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d={shape} strokeWidth="2.4" />
                <path d={shape} strokeWidth="1" transform="translate(130 130) scale(0.93) translate(-130 -130)" opacity="0.9" />
                {/* little center points top & bottom */}
                <path d="M130 6 l5 8 -5 6 -5 -6 z" strokeWidth="1.6" />
                <path d="M130 254 l5 -8 -5 -6 -5 6 z" strokeWidth="1.6" />
            </svg>
            <div className="azure-frame__content">{children}</div>
        </div>
    );
}

/* ─── Line-art couple (bride + groom, arm in arm) ─── */
export function CoupleIllustration({ className }) {
    return (
        <svg className={className} viewBox="0 0 200 280" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {/* ===== BRIDE (left) ===== */}
            {/* veil flowing behind */}
            <path d="M72 60 C50 90 46 160 56 250" strokeWidth="1.4" opacity="0.8" />
            <path d="M80 58 C96 78 98 120 96 150" strokeWidth="1.2" opacity="0.5" />
            {/* head + hair */}
            <circle cx="84" cy="60" r="14" />
            <path d="M71 56 C72 44 96 44 97 56 C99 50 94 42 84 42 C74 42 69 50 71 56 Z" strokeWidth="1.6" />
            {/* neck + shoulders */}
            <path d="M84 74 L84 84" strokeWidth="1.6" />
            {/* gown: bodice to flaring A-line skirt */}
            <path d="M84 84 C72 90 68 110 70 132 L66 150" />
            <path d="M84 84 C96 90 100 110 100 132 L106 150" />
            <path d="M66 150 C52 185 50 225 54 262" />
            <path d="M106 150 C112 190 110 230 104 262" />
            <path d="M54 262 C70 270 90 270 104 262" />
            {/* skirt fold lines */}
            <path d="M82 156 C80 200 80 230 80 258" strokeWidth="1.1" opacity="0.6" />
            <path d="M92 156 C94 196 94 228 94 258" strokeWidth="1.1" opacity="0.6" />
            {/* bouquet at waist */}
            <g strokeWidth="1.4">
                <circle cx="104" cy="150" r="5" />
                <circle cx="112" cy="146" r="5" />
                <circle cx="110" cy="156" r="5" />
                <circle cx="118" cy="152" r="4.5" />
                <path d="M108 160 L106 176 M114 159 L116 176" strokeWidth="1.1" />
            </g>
            {/* bride arm linking */}
            <path d="M98 96 C108 104 116 116 120 132" strokeWidth="1.6" />

            {/* ===== GROOM (right) ===== */}
            {/* head + hair */}
            <circle cx="138" cy="58" r="14" />
            <path d="M125 54 C126 42 151 42 151 55 C153 47 147 40 138 40 C129 40 123 47 125 54 Z" strokeWidth="1.6" />
            {/* neck */}
            <path d="M138 72 L138 82" strokeWidth="1.6" />
            {/* shoulders + jacket */}
            <path d="M138 82 C126 86 120 96 118 110 L116 170" />
            <path d="M138 82 C150 86 156 96 158 110 L160 172" />
            {/* lapels + shirt V */}
            <path d="M138 84 L131 104 L138 116 L145 104 L138 84" strokeWidth="1.5" />
            <path d="M138 116 L138 150" strokeWidth="1.1" opacity="0.7" />
            {/* trousers */}
            <path d="M118 170 C120 200 122 235 122 264 L132 264 L138 176" />
            <path d="M160 172 C160 205 156 238 154 264 L144 264 L138 176" />
            {/* shoes */}
            <path d="M120 264 L134 264 M142 264 L156 264" strokeWidth="2.4" />
            {/* groom arm linking bride */}
            <path d="M120 110 C112 118 110 126 116 134" strokeWidth="1.6" />
        </svg>
    );
}

/* ─── Hand-drawn doodle accents ─── */
export function Doodle({ type = 'sparkle', className }) {
    const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
    if (type === 'sparkle') {
        return (
            <svg viewBox="0 0 24 24" {...common}>
                <path d="M12 2 C13 9 15 11 22 12 C15 13 13 15 12 22 C11 15 9 13 2 12 C9 11 11 9 12 2 Z" />
            </svg>
        );
    }
    if (type === 'spiral') {
        return (
            <svg viewBox="0 0 24 24" {...common}>
                <path d="M12 12 C12 9 16 9 16 12 C16 16 9 16 9 11 C9 5 18 5 18 13" />
            </svg>
        );
    }
    if (type === 'swirl') {
        return (
            <svg viewBox="0 0 28 16" {...common}>
                <path d="M2 8 C8 0 12 0 12 6 C12 10 8 10 9 6 C10 2 18 2 20 8 C22 13 26 12 26 9" />
            </svg>
        );
    }
    // 'curl'
    return (
        <svg viewBox="0 0 24 24" {...common}>
            <path d="M4 18 C4 8 14 8 14 14 C14 18 9 18 10 13 C11 8 20 8 20 16" />
        </svg>
    );
}

/* ─── Phone in a circle (RSVP line) ─── */
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
