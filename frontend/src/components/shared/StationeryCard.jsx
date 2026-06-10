/**
 * StationeryCard — the gold-arch "card" that frames each velvet section's
 * content on the floral background. Provides the arch frame, a top fleuron and
 * a bottom flourish; children render inside the arch.
 */

function ArchFleuron() {
    return (
        <svg className="sc-fleuron-top" width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden="true">
            <g stroke="var(--hero-gold)" strokeWidth="0.9" fill="none" strokeLinecap="round">
                <path d="M17 3 C13 7 13 11 17 15 C21 11 21 7 17 3 Z" />
                <line x1="6" y1="19" x2="28" y2="19" opacity="0.6" />
            </g>
            <circle cx="17" cy="9.5" r="1.4" fill="var(--hero-gold)" />
            <circle cx="6" cy="19" r="1.1" fill="var(--hero-gold)" opacity="0.7" />
            <circle cx="28" cy="19" r="1.1" fill="var(--hero-gold)" opacity="0.7" />
        </svg>
    );
}

function BottomFlourish() {
    return (
        <svg className="sc-flourish-bottom" width="150" height="22" viewBox="0 0 150 22" fill="none" aria-hidden="true">
            <g stroke="var(--hero-gold)" strokeWidth="1" fill="none" strokeLinecap="round">
                <path d="M75 11 C60 4 45 4 40 11 C36 16 44 18 48 13" opacity="0.7" />
                <path d="M75 11 C90 4 105 4 110 11 C114 16 106 18 102 13" opacity="0.7" />
                <path d="M68 11 L75 5 L82 11 L75 17 Z" opacity="0.85" />
            </g>
            <circle cx="75" cy="11" r="1.4" fill="var(--hero-gold)" />
        </svg>
    );
}

export default function StationeryCard({ children, className = '' }) {
    return (
        <div className={`stationery-card ${className}`.trim()}>
            <ArchFleuron />
            <div className="sc-body">{children}</div>
            <BottomFlourish />
        </div>
    );
}
