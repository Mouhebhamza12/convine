import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PhotoStory({ photos = [] }) {
    const sceneRef = useRef(null);
    const titleRef = useRef(null);
    const itemsRef = useRef([]);

    // Only the couple's real photos, 1 to 4. With none, the section is omitted.
    const photoList = (photos || []).filter((p) => typeof p === 'string' && p.trim()).slice(0, 4);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title entrance
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 80%',
                    },
                },
            );

            // Staggered reveal alternating direction: even from left, odd from right
            itemsRef.current.forEach((el, index) => {
                if (!el) {
                    return;
                }

                const isEven = index % 2 === 0;
                const fromVars = {
                    opacity: 0,
                    x: isEven ? -80 : 80,
                    y: 30,
                    rotation: isEven ? -4 : 4,
                    scale: 0.92,
                };

                gsap.fromTo(
                    el,
                    fromVars,
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotation: 0,
                        scale: 1,
                        duration: 1.4,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                    },
                );
            });
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    if (!photoList.length) return null;

    return (
        <section ref={sceneRef} className="invite-scene photo-story-scene">
            <p ref={titleRef} className="photo-story-title">
                Moments That Define Us
            </p>

            <div className="photo-story-stage">
                {photoList.map((src, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            itemsRef.current[index] = el;
                        }}
                        className={`photo-story-item photo-story-item--${index + 1} ken-burns photo-glow`}
                    >
                        <img src={src} alt="" loading="lazy" />
                    </div>
                ))}
            </div>
        </section>
    );
}
