import '../css/loading.css';

/**
 * Convive loading screen, warm ivory, burgundy & gold, matching the landing.
 *
 * Rendered as the Suspense fallback for lazy routes/templates and as the
 * invitation "opening" state. index.html paints a pixel-matched copy (#cv-boot)
 * before any JS, so the hand-off into React is invisible.
 *
 * @param {{ variant?: 'page' | 'invitation' }} props
 */
export default function LoadingScreen({ variant = 'page' }) {
    return (
        <div className="cv-load" data-variant={variant} role="status" aria-live="polite">
            <div className="cv-load__glow" aria-hidden="true" />

            <div className="cv-load__inner">
                <div className="cv-load__word">Convive</div>
                <div className="cv-load__pills" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <span className="cv-load__sr">Loading</span>
            </div>
        </div>
    );
}
