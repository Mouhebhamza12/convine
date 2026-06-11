import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useBloom';

/**
 * A few soft petals drifting on a still morning. Deliberately sparse —
 * elegance, not a snow-globe. Canvas-based, DPR-capped, one rAF loop.
 */
export default function PetalDrift({ count = 11 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');
        const reduced = prefersReducedMotion();

        let w = 0;
        let h = 0;
        let dpr = 1;
        let petals = [];
        let raf = 0;

        const palette = [
            ['#f6dcd6', '#e6b3ab'], // blush
            ['#fbf3e8', '#ecdcc2'], // cream
            ['#f1d9d6', '#dca7a0'], // dusty rose
        ];

        function petalPath(p) {
            // A simple cupped petal silhouette.
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(p.s, p.s);
            const grad = ctx.createLinearGradient(0, -7, 0, 7);
            grad.addColorStop(0, p.c0);
            grad.addColorStop(1, p.c1);
            ctx.fillStyle = grad;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.bezierCurveTo(5, -4, 5, 4, 0, 7);
            ctx.bezierCurveTo(-5, 4, -5, -4, 0, -7);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        function build() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            petals = Array.from({ length: count }, () => {
                const [c0, c1] = palette[Math.floor(Math.random() * palette.length)];
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    s: 0.8 + Math.random() * 1.3,
                    rot: Math.random() * Math.PI * 2,
                    vr: (Math.random() - 0.5) * 0.006,
                    vy: 0.12 + Math.random() * 0.22,
                    sway: 0.4 + Math.random() * 0.7,
                    swayPhase: Math.random() * Math.PI * 2,
                    swaySpeed: 0.006 + Math.random() * 0.008,
                    alpha: 0.35 + Math.random() * 0.4,
                    c0,
                    c1,
                };
            });
        }

        function frame() {
            ctx.clearRect(0, 0, w, h);
            for (const p of petals) {
                p.y += p.vy;
                p.swayPhase += p.swaySpeed;
                p.x += Math.sin(p.swayPhase) * p.sway;
                p.rot += p.vr;
                if (p.y > h + 14) { p.y = -14; p.x = Math.random() * w; }
                if (p.x > w + 14) p.x = -14;
                if (p.x < -14) p.x = w + 14;
                petalPath(p);
            }
            raf = requestAnimationFrame(frame);
        }

        build();
        if (reduced) { frame(); cancelAnimationFrame(raf); } else { frame(); }

        const onResize = () => { cancelAnimationFrame(raf); build(); if (!reduced) frame(); };
        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }, [count]);

    return <canvas ref={canvasRef} className="lr-petal-drift" aria-hidden="true" />;
}
