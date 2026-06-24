import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
    ArchPanel, ChevronCue,
    OrnateFrame, CoupleIllustration, StarsCluster, Star, Flourish, HeartDivider,
} from './AzureArt';
import { azCoverDate } from './AzureStrings';

const reduceMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * AzureOverture-the opening screen for the Azure template.
 *
 * Restraint over ornament: a single tall arched panel (the wedding-arch motif)
 * frames the couple's names and the signature blue line-art couple in their
 * scalloped medallion-the same drawing that runs through the invitation.
 * The arch draws itself on, the content settles, and a tap dissolves it.
 */
export default function AzureOverture({ onStart, onComplete, bride, groom, eventDate, venue, strings }) {
    const rootRef = useRef(null);
    const stageRef = useRef(null);
    const [opening, setOpening] = useState(false);

    const dateLabel = azCoverDate(eventDate, strings.code);

    /* ── entrance ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            const reveal = ['.az-ov__rise', '.az-ov__center', '.az-ov__decor', '.az-ov__keystone'];

            if (reduceMotion()) {
                gsap.set(reveal, { opacity: 1, y: 0, scale: 1 });
                gsap.set('.az-ov__draw', { strokeDashoffset: 0 });
                return;
            }

            gsap.set('.az-ov__draw', { strokeDasharray: 1, strokeDashoffset: 1 });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.to('.az-ov__draw', { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 0)
                .fromTo('.az-ov__keystone', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.7, transformOrigin: 'center' }, 0.85)
                .fromTo('.az-ov__rise', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.95, stagger: 0.13 }, 0.7)
                .fromTo('.az-ov__center', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.1 }, 1.0)
                .fromTo('.az-ov__decor', { opacity: 0, scale: 0.5 }, { opacity: 0.85, scale: 1, duration: 0.8, stagger: 0.12, transformOrigin: 'center' }, 1.15);

            // idle life
            gsap.to('.az-ov__cue', { y: 6, repeat: -1, yoyo: true, duration: 1.15, ease: 'sine.inOut', delay: 2.4 });
            gsap.to('.az-ov__center', { y: -6, repeat: -1, yoyo: true, duration: 3.6, ease: 'sine.inOut', delay: 2.6 });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    /* ── open ── */
    function open() {
        if (opening) return;
        setOpening(true);
        onStart?.();
        if (reduceMotion()) { onComplete?.(); return; }

        gsap.killTweensOf(['.az-ov__cue', '.az-ov__center']);

        const tl = gsap.timeline({ onComplete });
        tl.to('.az-ov__cue', { opacity: 0, duration: 0.3 }, 0)
            .to('.az-ov__decor', { opacity: 0, scale: 1.4, duration: 0.6, stagger: 0.05, ease: 'power2.out' }, 0)
            .to(stageRef.current, { scale: 1.08, opacity: 0, duration: 1.05, transformOrigin: 'center 44%', ease: 'power2.inOut' }, 0.1)
            .to('.az-ov__rise', { opacity: 0, y: -14, duration: 0.6, stagger: 0.05 }, 0.1)
            .to('.az-ov__center', { scale: 1.14, opacity: 0, duration: 0.85, ease: 'power2.in' }, 0.18)
            .to(rootRef.current, { opacity: 0, duration: 0.4 }, 0.8);
    }

    return (
        <div
            ref={rootRef}
            className="az-ov"
            role="button"
            tabIndex={0}
            aria-label="Tap to open the invitation"
            onClick={open}
            onTouchEnd={(e) => { e.preventDefault(); open(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(); }}
        >
            <div ref={stageRef} className="az-ov__stage">
                <div className="az-ov__arch">
                    <ArchPanel className="az-ov__archframe" />
                    <Star className="az-ov__keystone" />

                    {/* quiet accents tucked into the empty arch shoulders */}
                    <StarsCluster className="az-ov__decor az-ov__decor--l" />
                    <Flourish variant="b" className="az-ov__decor az-ov__decor--r" />

                    <div className="az-ov__col">
                        <p className="az-ov__rise az-ov__eyebrow">{strings.overture.eyebrow}</p>

                        <h1 className="az-ov__rise az-ov__names">
                            <span>{bride}</span>
                            <span className="az-ov__amp">&amp;</span>
                            <span>{groom}</span>
                        </h1>

                        <HeartDivider className="az-ov__rise az-ov__divider" />

                        <div className="az-ov__center az-ov__art">
                            <OrnateFrame className="azure-frame">
                                <CoupleIllustration className="azure-couple" />
                            </OrnateFrame>
                        </div>

                        {dateLabel && <p className="az-ov__rise az-ov__date">{dateLabel}</p>}
                        {venue && <p className="az-ov__rise az-ov__venue">{venue}</p>}
                    </div>
                </div>
            </div>

            <div className="az-ov__cue az-ov__tap" aria-hidden="true">
                <span>{strings.overture.tap}</span>
                <ChevronCue className="az-ov__chevron" />
            </div>
        </div>
    );
}
