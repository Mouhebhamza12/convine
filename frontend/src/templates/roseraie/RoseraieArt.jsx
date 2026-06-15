/* Roseraie hand-drawn SVG art. Hearts are stroked/filled with `currentColor`
   so the RSVP buttons set the colour. Path-by-path, no CSS ornament. */

/* a plump, solid sweetheart for the acceptance */
export function HeartWhole({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 20.8C12 20.8 3.4 13.9 3.4 8.3C3.4 5.3 5.7 3.5 8.1 3.5C10 3.5 11.4 4.7 12 6.2C12.6 4.7 14 3.5 15.9 3.5C18.3 3.5 20.6 5.3 20.6 8.3C20.6 13.9 12 20.8 12 20.8Z" />
        </svg>
    );
}

/* the same heart, cleft into two halves drifting apart, for the regret */
export function HeartBroken({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path transform="translate(-0.7 0)" d="M12 6.2C11.4 4.7 10 3.5 8.1 3.5C5.7 3.5 3.4 5.3 3.4 8.3C3.4 13.9 12 20.8 12 20.8L10.2 14.3L12.5 11.5L10.5 8.7Z" />
            <path transform="translate(0.7 0)" d="M12 6.2C12.6 4.7 14 3.5 15.9 3.5C18.3 3.5 20.6 5.3 20.6 8.3C20.6 13.9 12 20.8 12 20.8L13.8 14.3L11.5 11.5L13.5 8.7Z" />
        </svg>
    );
}
