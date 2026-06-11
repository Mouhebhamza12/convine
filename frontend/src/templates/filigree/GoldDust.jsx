import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useThreadDraw';

/**
 * A fixed canvas of slow, drifting gold motes with three depth layers.
 * Reads like fine dust caught in candle-light behind the thread.
 * Cheap on mobile: ~46 particles, single rAF loop, DPR-capped.
 */
export default function GoldDust({ density = 46 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');
        const reduced = prefersReducedMotion();

        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles = [];
        let raf = 0;

        function build() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            particles = Array.from({ length: density }, () => {
                const depth = Math.random();
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: 0.5 + depth * 1.9,
                    depth,
                    vx: (Math.random() - 0.5) * (0.12 + depth * 0.18),
                    vy: -(0.06 + depth * 0.16),
                    base: 0.12 + depth * 0.5,
                    tw: Math.random() * Math.PI * 2,
                    tws: 0.006 + Math.random() * 0.012,
                };
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.tw += p.tws;
                if (p.y < -8) { p.y = height + 8; p.x = Math.random() * width; }
                if (p.x < -8) p.x = width + 8;
                if (p.x > width + 8) p.x = -8;

                const flicker = 0.65 + Math.sin(p.tw) * 0.35;
                const alpha = p.base * flicker;
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                glow.addColorStop(0, `rgba(247, 226, 168, ${alpha})`);
                glow.addColorStop(0.5, `rgba(216, 178, 110, ${alpha * 0.5})`);
                glow.addColorStop(1, 'rgba(216, 178, 110, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        }

        build();

        if (reduced) {
            // One static, soft pass — presence without motion.
            draw();
            cancelAnimationFrame(raf);
        } else {
            draw();
        }

        const onResize = () => { cancelAnimationFrame(raf); build(); if (!reduced) draw(); };
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }, [density]);

    return <canvas ref={canvasRef} className="filigree-dust" aria-hidden="true" />;
}
