import { useState } from 'react';

/**
 * Shared RSVP state machine so each template can present the response
 * in its own medium while keeping identical functionality.
 */
export function useRsvp(initialStatus, onSubmit, isDemo) {
    const [status, setStatus] = useState(initialStatus);
    const [submitting, setSubmitting] = useState(false);

    async function respond(nextStatus) {
        if (submitting || status) return;
        setSubmitting(true);
        try {
            if (isDemo) {
                await new Promise((r) => setTimeout(r, 600));
            } else {
                await onSubmit(nextStatus);
            }
            setStatus(nextStatus);
        } finally {
            setSubmitting(false);
        }
    }

    return { status, submitting, respond };
}
