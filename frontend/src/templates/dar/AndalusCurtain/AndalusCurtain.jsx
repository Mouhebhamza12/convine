/**
 * AndalusCurtain — a real WebGL velvet curtain reveal for the Andalus template.
 *
 * Two cloth-simulated oxblood drapes hang under an ornate gold-braided pelmet in
 * a cinematically lit room. On touch, the drapes do NOT slide like a drawer:
 * they shiver, take tension, then part heavily — gathering and bunching toward
 * the sides — while the pelmet lifts away and the scene dissolves straight onto
 * the invitation waiting behind it. Built on three.js + R3F + GSAP; same API as
 * the old opener (onComplete + strings) so it drops straight into DarOpening.
 */
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import AndalusVelvetPanel from './AndalusVelvetPanel';
import AndalusValance from './AndalusValance';
import useFabricSwish from './useFabricSwish';

/* ------------------------------------------------------------------ */
/*  Reduced motion                                                     */
/* ------------------------------------------------------------------ */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/*  Scene contents                                                     */
/* ------------------------------------------------------------------ */
function CurtainScene({ leftSimRef, rightSimRef, valanceRef }) {
  return (
    <>
      {/* soft venue ambience */}
      <ambientLight intensity={0.16} color="#ffe9d2" />
      <hemisphereLight args={['#ffe6c0', '#1a0207', 0.35]} />

      {/* cinematic key light, grazing from upper-right so folds self-shadow */}
      <directionalLight
        position={[2.6, 3.6, 3.0]}
        intensity={1.45}
        color="#fff3df"
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-bias={-0.0008}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-2.4, 2.4, 2.6, -2.6, 0.5, 14]} />
      </directionalLight>

      {/* warm + cool rim lights for fabric separation and gold glints */}
      <directionalLight position={[-3.6, 1.6, 1.2]} intensity={0.6} color="#ffd2c6" />
      <directionalLight position={[3.6, 1.4, -0.8]} intensity={0.5} color="#ffe7c4" />

      {/* low bounce */}
      <pointLight position={[0, -1.1, 1.3]} intensity={0.25} color="#ffb070" />


      {/* the drapes */}
      <AndalusVelvetPanel side="left" simulatorRef={leftSimRef} />
      <AndalusVelvetPanel side="right" simulatorRef={rightSimRef} />

      {/* ornate pelmet on top, lifts away at the end */}
      <AndalusValance ref={valanceRef} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function AndalusCurtain({ onComplete, strings }) {
  const leftSimRef = useRef(null);
  const rightSimRef = useRef(null);
  const valanceRef = useRef(null);
  const sceneDomRef = useRef(null);

  const [isOpening, setIsOpening] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const reducedMotion = useReducedMotion();
  const { play: playSwish } = useFabricSwish();

  const reveal = useMemo(() => ({ p: 0, shiver: 0, settle: 1, lift: 0 }), []);

  const handleOpen = useCallback(() => {
    if (isOpening || isDone) return;
    setIsOpening(true);
    playSwish();

    const finish = () => { setIsDone(true); onComplete?.(); };

    if (reducedMotion) {
      leftSimRef.current?.setOpenProgress(1);
      rightSimRef.current?.setOpenProgress(1);
      gsap.to(sceneDomRef.current, { opacity: 0, duration: 0.6, delay: 0.4, onComplete: finish });
      return;
    }

    const applyReveal = () => {
      const p = reveal.p;
      leftSimRef.current?.setOpenProgress(p);
      rightSimRef.current?.setOpenProgress(p);
    };

    const tl = gsap.timeline({ onComplete: finish });

    // 1. shiver / take tension before parting
    tl.to(reveal, {
      shiver: 1,
      duration: 0.45,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
      onUpdate: () => {
        const a = reveal.shiver * 0.7;
        leftSimRef.current?.setSettleAmplitude(a);
        rightSimRef.current?.setSettleAmplitude(a);
      },
    }, 0);

    // 2. the heavy part — slow, weighted, eased
    tl.to(reveal, {
      p: 1,
      duration: 2.6,
      ease: 'power3.inOut',
      onUpdate: applyReveal,
      onComplete: () => {
        if (sceneDomRef.current) sceneDomRef.current.style.pointerEvents = 'none';
      },
    }, 0.3);

    // 3. pelmet lifts away (accelerating up) in the second half
    tl.to(valanceRef.current.position, {
      y: 3.4,
      duration: 1.5,
      ease: 'power2.in',
    }, 1.7);

    // 4. settle oscillation as it comes to rest
    tl.to(reveal, {
      settle: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.55)',
      onUpdate: () => {
        const a = reveal.settle;
        leftSimRef.current?.setSettleAmplitude(a);
        rightSimRef.current?.setSettleAmplitude(a);
      },
    }, '-=0.5');

    // 5. dissolve to the invitation
    tl.to(sceneDomRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 2.9);
  }, [isOpening, isDone, reducedMotion, reveal, playSwish, onComplete]);

  if (isDone) return null;

  const hint = strings?.opening?.hint ?? 'Touch to open';
  const title = strings?.opening?.title ?? '';

  return (
    <div
      ref={sceneDomRef}
      className={`andalus-curtain-scene${isOpening ? ' is-opening' : ''}`}
      onClick={handleOpen}
      onTouchStart={(e) => { e.preventDefault(); handleOpen(); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
      aria-label={hint}
    >
      <Canvas
        className="andalus-curtain-canvas"
        shadows="soft"
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
        camera={{ position: [0, 0, 2.25], fov: 50, near: 0.1, far: 20 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <CurtainScene
          leftSimRef={leftSimRef}
          rightSimRef={rightSimRef}
          valanceRef={valanceRef}
        />
      </Canvas>

      {!isOpening && (
        <div className="andalus-curtain-cta">
          {title && <p className="andalus-curtain-cta__title">{title}</p>}
          <p className="andalus-curtain-cta__hint">{hint}</p>
        </div>
      )}
    </div>
  );
}
