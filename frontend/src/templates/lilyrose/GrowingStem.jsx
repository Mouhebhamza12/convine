import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { primePath, prefersReducedMotion } from './useBloom';

gsap.registerPlugin(ScrollTrigger);

const LEAF_FRACS = [0.1, 0.22, 0.35, 0.48, 0.61, 0.74, 0.87];

/** A gentle climbing path along the left margin, full document height. */
function buildStemPath(width, height) {
    const baseX = Math.min(width * 0.085, 46);
    const amp = Math.min(width * 0.05, 26);
    const lobes = Math.max(4, Math.round(height / 620));
    const samples = Math.min(Math.max(Math.round(height / 120), 14), 110);

    const pts = [];
    for (let i = 0; i <= samples; i += 1) {
        const t = i / samples;
        const y = height - t * height; // grow upward from the base
        const x = baseX + Math.sin(t * lobes * Math.PI) * amp;
        pts.push([x, y]);
    }

    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i += 1) {
        const [x, y] = pts[i];
        const mx = (x + pts[i + 1][0]) / 2;
        const my = (y + pts[i + 1][1]) / 2;
        d += ` Q ${x.toFixed(1)} ${y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
    return d;
}

/**
 * The vine of their love — grows from the foot of the page upward as the
 * guest descends, unfurling small leaves along the way. Subtle, marginal.
 */
export default function GrowingStem({ enabled }) {
    const svgRef = useRef(null);
    const pathRef = useRef(null);
    const tipRef = useRef(null);
    const leafRefs = useRef([]);

    useEffect(() => {
        if (!enabled) return undefined;
        const svg = svgRef.current;
        const path = pathRef.current;
        if (!svg || !path) return undefined;

        let len = 0;

        const measure = () => {
            const w = document.documentElement.clientWidth;
            const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            svg.setAttribute('width', w);
            svg.setAttribute('height', h);
            svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
            path.setAttribute('d', buildStemPath(w, h));
            len = primePath(path);

            // Seat each leaf along the path, angled to the local tangent.
            LEAF_FRACS.forEach((frac, i) => {
                const g = leafRefs.current[i];
                if (!g) return;
                const here = path.getPointAtLength(frac * len);
                const ahead = path.getPointAtLength(Math.min(len, frac * len + 6));
                const angle = (Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180) / Math.PI;
                // grow upward (path runs bottom→top), tilt leaf inward, alternating
                const tilt = i % 2 === 0 ? 18 : -64;
                g.setAttribute('transform', `translate(${here.x} ${here.y}) rotate(${angle + tilt})`);
            });
        };

        measure();

        // progress that maps the *grown* portion of the stem (bottom→top of doc)
        const reduced = prefersReducedMotion();
        if (reduced) {
            path.style.strokeDashoffset = '0';
            if (tipRef.current) tipRef.current.style.opacity = '0';
            leafRefs.current.forEach((g) => g && (g.style.opacity = '1'));
            return undefined;
        }

        const clamp = (p) => Math.min(Math.max(p, 0.0001), 0.9999);
        const st = ScrollTrigger.create({
            start: 0,
            end: 'max',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                path.style.strokeDashoffset = `${len * (1 - p)}`;
                if (tipRef.current) {
                    const pt = path.getPointAtLength(clamp(p) * len);
                    tipRef.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
                    tipRef.current.style.opacity = p > 0.01 && p < 0.99 ? '1' : '0';
                }
                LEAF_FRACS.forEach((frac, i) => {
                    const g = leafRefs.current[i];
                    if (!g) return;
                    const local = gsap.utils.clamp(0, 1, (p - frac) / 0.05);
                    g.style.opacity = `${local}`;
                    g.style.transformOrigin = '0 0';
                });
            },
        });

        let t = 0;
        const schedule = () => { window.clearTimeout(t); t = window.setTimeout(() => { measure(); ScrollTrigger.refresh(); }, 180); };
        window.addEventListener('resize', schedule, { passive: true });
        const ro = new ResizeObserver(schedule);
        ro.observe(document.body);
        const settle = window.setTimeout(() => { measure(); ScrollTrigger.refresh(); }, 700);

        return () => {
            st.kill();
            ro.disconnect();
            window.removeEventListener('resize', schedule);
            window.clearTimeout(t);
            window.clearTimeout(settle);
        };
    }, [enabled]);

    return (
        <svg ref={svgRef} className="lr-stem" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path ref={pathRef} className="lr-stem__vine" fill="none" />
            {LEAF_FRACS.map((frac, i) => (
                <g
                    key={frac}
                    ref={(el) => { leafRefs.current[i] = el; }}
                    className="lr-stem__leaf"
                    style={{ opacity: 0 }}
                >
                    <path d="M0 0 C11 -8 25 -6 33 2 C23 9 9 9 0 0 Z" fill="url(#lr-leaf-sage)" />
                    <path d="M2 1 C12 -2 22 -1 30 2" stroke="#65754f" strokeWidth="0.7" opacity="0.5" fill="none" />
                </g>
            ))}
            <g ref={tipRef} className="lr-stem__tip" style={{ opacity: 0 }}>
                <circle r="3" className="lr-stem__bud-halo" />
                <circle r="1.5" className="lr-stem__bud" />
            </g>
        </svg>
    );
}
