import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Small gold fleuron, sits at the top of the arch ─── */
function ArchFleuron() {
    return (
        <svg className="hero-arch-fleuron" width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden="true">
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

/* ─── Fleuron divider — engraved center motif with tapering rules ─── */
function FleuronDivider() {
    return (
        <svg className="hero-fleuron" width="200" height="16" viewBox="0 0 200 16" fill="none" aria-hidden="true">
            <g stroke="var(--hero-gold)" fill="none" strokeLinecap="round">
                <line x1="20" y1="8" x2="80" y2="8" strokeWidth="0.8" opacity="0.5" />
                <line x1="120" y1="8" x2="180" y2="8" strokeWidth="0.8" opacity="0.5" />
                <path d="M80 8 C88 3 92 5 96 8" strokeWidth="0.8" opacity="0.75" />
                <path d="M120 8 C112 3 108 5 104 8" strokeWidth="0.8" opacity="0.75" />
                <path d="M100 2.5 L105 8 L100 13.5 L95 8 Z" strokeWidth="0.9" opacity="0.85" />
            </g>
            <circle cx="100" cy="8" r="1.5" fill="var(--hero-gold)" />
        </svg>
    );
}

/* ─── Tiny heart + flourish beneath the tagline ─── */
function HeartFlourish() {
    return (
        <svg className="hero-heart" width="120" height="24" viewBox="0 0 120 24" fill="none" aria-hidden="true">
            <path
                d="M60 9 C58 5 52 5 52 10 C52 14 60 18 60 18 C60 18 68 14 68 10 C68 5 62 5 60 9 Z"
                stroke="var(--hero-gold)"
                strokeWidth="1"
                fill="none"
            />
            <path d="M14 18 C30 22 44 20 50 16" stroke="var(--hero-gold)" strokeWidth="0.7" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M106 18 C90 22 76 20 70 16" stroke="var(--hero-gold)" strokeWidth="0.7" fill="none" opacity="0.5" strokeLinecap="round" />
        </svg>
    );
}

export default function CoupleNames({
    brideName,
    groomName,
    visible,
    eyebrow = 'The Wedding of',
    tagline = 'Two hearts, one promise,\na lifetime together',
}) {
    const sceneRef = useRef(null);
    const archRef = useRef(null);
    const brideRef = useRef(null);
    const ampRef = useRef(null);
    const groomRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!visible || !sceneRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(archRef.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 1.3 }, 0)
                .fromTo('.hero-arch-fleuron', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8 }, 0.4)
                .fromTo(
                    '.hero-eyebrow',
                    { opacity: 0, y: 12, letterSpacing: '0.2em' },
                    { opacity: 1, y: 0, letterSpacing: '0.38em', duration: 1 },
                    0.6,
                )
                .fromTo(brideRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 0.9)
                .fromTo(ampRef.current, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.7 }, 1.4)
                .fromTo(groomRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 1.6)
                .fromTo('.hero-fleuron', { opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1, duration: 0.9 }, 2.1)
                .fromTo('.hero-tagline', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 2.3)
                .fromTo('.hero-heart', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.6)
                .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 0.85, duration: 0.9 }, 2.9);

            /* Subtle parallax on scroll */
            ScrollTrigger.create({
                trigger: sceneRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                animation: gsap.to('.hero-arch', { y: -26, ease: 'none' }),
            });
        }, sceneRef);

        return () => ctx.revert();
    }, [visible]);

    const taglineLines = tagline.split('\n');

    return (
        <section ref={sceneRef} className="invite-scene names-scene velvet-hero">
            <div ref={archRef} className="hero-arch">
                <div className="hero-arch-inner">
                    <ArchFleuron />

                    {eyebrow && <p className="hero-eyebrow">{eyebrow}</p>}

                    <div className="hero-names">
                        <span ref={brideRef} className="hero-name">
                            {brideName}
                        </span>
                        <span ref={ampRef} className="hero-amp">
                            &amp;
                        </span>
                        <span ref={groomRef} className="hero-name">
                            {groomName}
                        </span>
                    </div>

                    <FleuronDivider />

                    {tagline && (
                        <p className="hero-tagline">
                            {taglineLines.map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i < taglineLines.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    )}

                    <HeartFlourish />
                </div>
            </div>

            <div ref={scrollRef} className="scroll-cue">
                <span className="scroll-cue__label">Scroll</span>
                <span className="scroll-cue__line" />
                <span className="scroll-cue__tip" />
            </div>
        </section>
    );
}
