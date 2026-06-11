import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { primePath, prefersReducedMotion } from './useThreadDraw';

gsap.registerPlugin(ScrollTrigger);

/**
 * Build a softly meandering vertical path in document-pixel space.
 * The thread sways gently around centre — never far enough to cross the text,
 * close enough to feel like one stitch running the length of the story.
 */
function buildSpinePath(width, height) {
    const cx = width / 2;
    const amp = Math.min(width * 0.16, 62);
    const lobes = Math.max(3, Math.round(height / 760));
    const samples = Math.min(Math.max(Math.round(height / 110), 14), 110);

    const pts = [];
    for (let i = 0; i <= samples; i += 1) {
        const t = i / samples;
        const y = t * height;
        // Ease the sway in and out so the very top and very bottom sit centred.
        const envelope = Math.sin(t * Math.PI);
        const x = cx + Math.sin(t * lobes * Math.PI) * amp * (0.35 + 0.65 * envelope);
        pts.push([x, y]);
    }

    // Quadratic smoothing through the sample points.
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
 * The continuous golden thread. Absolutely positioned over the whole document
 * so it physically lives in the page; the stitch is revealed as the guest
 * scrolls, with a glowing "needle eye" riding the leading edge.
 */
export default function ThreadSpine({ enabled }) {
    const svgRef = useRef(null);
    const pathRef = useRef(null);
    const tipRef = useRef(null);

    useEffect(() => {
        if (!enabled) return undefined;
        const svg = svgRef.current;
        const path = pathRef.current;
        const tip = tipRef.current;
        if (!svg || !path) return undefined;

        let len = 0;

        const measure = () => {
            const w = document.documentElement.clientWidth;
            const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            svg.setAttribute('width', w);
            svg.setAttribute('height', h);
            svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
            path.setAttribute('d', buildSpinePath(w, h));
            len = primePath(path);
        };

        measure();

        if (prefersReducedMotion()) {
            path.style.strokeDashoffset = '0';
            if (tip) tip.style.opacity = '0';
            return undefined;
        }

        const clamp = (p) => Math.min(Math.max(p, 0.0001), 0.9999);

        const st = ScrollTrigger.create({
            start: 0,
            end: 'max',
            scrub: 0.9,
            onUpdate: (self) => {
                const p = self.progress;
                path.style.strokeDashoffset = `${len * (1 - p)}`;
                if (tip) {
                    const point = path.getPointAtLength(clamp(p) * len);
                    tip.setAttribute('transform', `translate(${point.x} ${point.y})`);
                    tip.style.opacity = p > 0.003 && p < 0.996 ? '1' : '0';
                }
            },
        });

        let resizeTimer = 0;
        const scheduleRefresh = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                measure();
                ScrollTrigger.refresh();
            }, 180);
        };

        window.addEventListener('resize', scheduleRefresh, { passive: true });
        const ro = new ResizeObserver(scheduleRefresh);
        ro.observe(document.body);

        // Re-measure once late assets (photos, fonts) have settled.
        const settle = window.setTimeout(() => { measure(); ScrollTrigger.refresh(); }, 700);

        return () => {
            st.kill();
            ro.disconnect();
            window.removeEventListener('resize', scheduleRefresh);
            window.clearTimeout(resizeTimer);
            window.clearTimeout(settle);
        };
    }, [enabled]);

    return (
        <svg ref={svgRef} className="filigree-spine" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path ref={pathRef} className="filigree-spine__thread" fill="none" />
            <g ref={tipRef} className="filigree-spine__tip" style={{ opacity: 0 }}>
                <circle r="7" className="filigree-spine__tip-halo" />
                <circle r="2.4" className="filigree-spine__tip-core" />
            </g>
        </svg>
    );
}
