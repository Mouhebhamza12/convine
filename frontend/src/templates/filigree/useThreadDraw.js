import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** True when the guest has asked the OS to minimise motion. */
export function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Prime an SVG <path> so it is ready to be "stitched" — the whole stroke is
 * hidden behind a single dash the exact length of the path.
 * Returns the path length so callers can drive the offset themselves.
 */
export function primePath(pathEl) {
    if (!pathEl) return 0;
    const len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${len}`;
    pathEl.style.strokeDashoffset = `${len}`;
    return len;
}

/**
 * Draw a path over TIME (used for the opening, not tied to scroll).
 * Returns the GSAP tween so it can be sequenced inside a timeline.
 */
export function drawPath(pathEl, { duration = 1.6, ease = 'power2.inOut', delay = 0 } = {}) {
    const len = primePath(pathEl);
    if (prefersReducedMotion()) {
        pathEl.style.strokeDashoffset = '0';
        return gsap.set(pathEl, { strokeDashoffset: 0 });
    }
    return gsap.to(pathEl, { strokeDashoffset: 0, duration, ease, delay });
}

/**
 * Stitch a path as the guest SCROLLS through `trigger`. A glowing "needle eye"
 * (tipEl) rides the leading edge of the thread. The thread is never faded in —
 * it is always *drawn*, so motion reads as one continuous hand gesture.
 */
export function useScrollDraw(pathRef, { triggerRef, tipRef, start = 'top 88%', end = 'bottom 62%', scrub = 0.85 } = {}) {
    useEffect(() => {
        const path = pathRef.current;
        if (!path) return undefined;

        const len = primePath(path);
        const tip = tipRef?.current ?? null;

        if (prefersReducedMotion()) {
            path.style.strokeDashoffset = '0';
            if (tip) tip.style.opacity = '0';
            return undefined;
        }

        const placeTip = (progress) => {
            if (!tip) return;
            const point = path.getPointAtLength(Math.min(Math.max(progress, 0.0001), 0.9999) * len);
            tip.setAttribute('transform', `translate(${point.x} ${point.y})`);
            tip.style.opacity = progress > 0.004 && progress < 0.992 ? '1' : '0';
        };

        const st = ScrollTrigger.create({
            trigger: triggerRef?.current ?? path,
            start,
            end,
            scrub,
            onUpdate: (self) => {
                const p = self.progress;
                path.style.strokeDashoffset = `${len * (1 - p)}`;
                placeTip(p);
            },
            onRefresh: (self) => {
                const newLen = primePath(path);
                path.style.strokeDashoffset = `${newLen * (1 - self.progress)}`;
            },
        });

        return () => st.kill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
