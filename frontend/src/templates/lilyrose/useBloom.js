import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** True when the guest prefers reduced motion. */
export function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Prime an SVG <path> to be revealed (drawn) by animating stroke-dashoffset. */
export function primePath(pathEl) {
    if (!pathEl) return 0;
    const len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${len}`;
    pathEl.style.strokeDashoffset = `${len}`;
    return len;
}

/** Draw a path over time (used for stems unfurling on entrance). */
export function drawPath(pathEl, { duration = 1.6, ease = 'power2.inOut', delay = 0 } = {}) {
    const len = primePath(pathEl);
    if (prefersReducedMotion()) {
        pathEl.style.strokeDashoffset = '0';
        return gsap.set(pathEl, { strokeDashoffset: 0 });
    }
    return gsap.to(pathEl, { strokeDashoffset: 0, duration, ease, delay });
}

/**
 * Grow an SVG path as the guest scrolls. An optional tip element (a dewdrop /
 * a leaf bud) rides the leading edge. Motion is slow and intentional.
 */
export function useGrowOnScroll(pathRef, { triggerRef, tipRef, start = 'top 86%', end = 'bottom 60%', scrub = 1 } = {}) {
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

        const clamp = (p) => Math.min(Math.max(p, 0.0001), 0.9999);
        const st = ScrollTrigger.create({
            trigger: triggerRef?.current ?? path,
            start,
            end,
            scrub,
            onUpdate: (self) => {
                const p = self.progress;
                path.style.strokeDashoffset = `${len * (1 - p)}`;
                if (tip) {
                    const point = path.getPointAtLength(clamp(p) * len);
                    tip.setAttribute('transform', `translate(${point.x} ${point.y})`);
                    tip.style.opacity = p > 0.01 && p < 0.99 ? '1' : '0';
                }
            },
            onRefresh: (self) => {
                const fresh = primePath(path);
                path.style.strokeDashoffset = `${fresh * (1 - self.progress)}`;
            },
        });

        return () => st.kill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
