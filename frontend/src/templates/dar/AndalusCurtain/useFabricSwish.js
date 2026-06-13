/**
 * useFabricSwish — a subtle, synthesized heavy-fabric sweep.
 *
 * No audio file to ship: we generate filtered noise with the Web Audio API on
 * the opening gesture (which satisfies the autoplay-unlock requirement). A slow
 * gain swell + a band-pass frequency sweep evokes weighty velvet sliding, not a
 * cartoon "whoosh". Silently no-ops if Web Audio is unavailable or blocked.
 */
import { useRef, useCallback } from 'react';

export default function useFabricSwish() {
  const ctxRef = useRef(null);

  const play = useCallback(() => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = ctxRef.current || (ctxRef.current = new AC());
      if (ctx.state === 'suspended') ctx.resume();

      const dur = 2.3;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 0.7;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2400;

      const g = ctx.createGain();
      const t0 = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.14, t0 + 0.55); // swell as it parts
      g.gain.exponentialRampToValueAtTime(0.07, t0 + 1.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      // moving band gives the sense of fabric travelling sideways
      bp.frequency.setValueAtTime(480, t0);
      bp.frequency.linearRampToValueAtTime(1350, t0 + 0.8);
      bp.frequency.linearRampToValueAtTime(680, t0 + dur);

      src.connect(bp);
      bp.connect(lp);
      lp.connect(g);
      g.connect(ctx.destination);
      src.start(t0);
      src.stop(t0 + dur);
    } catch {
      /* audio blocked — ignore */
    }
  }, []);

  return { play };
}
