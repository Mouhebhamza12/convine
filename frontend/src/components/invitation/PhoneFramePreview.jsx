import { useMemo } from 'react';

/**
 * Apple-grade desktop guard. On large screens the invitation is rendered at true
 * phone dimensions inside an <iframe> (which carries its own viewport, so every
 * vw/vh/fixed value the templates rely on resolves to the phone, not the window),
 * presented as a device alongside a quiet, stationery-grade note.
 */
export default function PhoneFramePreview() {
    const src = useMemo(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('frame', 'raw');
        return url.pathname + url.search + url.hash;
    }, []);

    return (
        <div className="pfp-stage">
            <style>{STYLES}</style>

            <div className="pfp-wrap">
                <div className="pfp-copy">
                    <span className="pfp-eyebrow">
                        <WarningGlyph />
                        Best on mobile
                    </span>
                    <h1 className="pfp-title">Designed for your phone.</h1>
                    <p className="pfp-text">
                        This invitation unfolds full-screen, exactly as it was
                        crafted. Open the link on your phone for the full experience.
                    </p>
                </div>

                <div className="pfp-phone">
                    <span className="pfp-island" aria-hidden="true" />
                    <iframe
                        className="pfp-screen"
                        src={src}
                        title="Invitation preview"
                    />
                </div>
            </div>
        </div>
    );
}

function WarningGlyph() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 3.1c.5 0 .96.27 1.21.71l8.43 14.6c.5.86-.12 1.94-1.11 1.94H3.47c-.99 0-1.61-1.08-1.11-1.94l8.43-14.6c.25-.44.71-.71 1.21-.71z"
                fill="#FF9500"
            />
            <rect x="11" y="8.2" width="2" height="5.9" rx="1" fill="#fff" />
            <circle cx="12" cy="16.85" r="1.18" fill="#fff" />
        </svg>
    );
}

const STYLES = `
.pfp-stage {
  height: 100svh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  box-sizing: border-box;
  overflow: hidden;
  background: radial-gradient(135% 130% at 82% 0%, #ffffff 0%, #f5f5f7 52%, #ededf0 100%);
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.pfp-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(40px, 6vw, 88px);
  width: 100%;
  max-width: 1040px;
  height: 100%;
}
.pfp-copy {
  flex: 0 1 400px;
  max-width: 400px;
  animation: pfp-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.pfp-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 24px -14px rgba(0, 0, 0, 0.2);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
  color: #1d1d1f;
}
.pfp-title {
  margin: 20px 0 0;
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 600;
  letter-spacing: -0.028em;
  line-height: 1.06;
  color: #1d1d1f;
}
.pfp-text {
  margin: 14px 0 0;
  max-width: 360px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: #6e6e73;
}
.pfp-phone {
  position: relative;
  flex: 0 0 auto;
  width: min(384px, 86vw);
  height: min(800px, calc(100svh - 56px));
  padding: 11px;
  box-sizing: border-box;
  border-radius: 54px;
  background: linear-gradient(152deg, #3a3a40 0%, #101013 50%, #000000 100%);
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.18),
    0 44px 90px -34px rgba(0, 0, 0, 0.55),
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.07),
    inset 0 1.5px 1px rgba(255, 255, 255, 0.2);
  animation: pfp-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
}
.pfp-island {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 96px;
  height: 27px;
  border-radius: 999px;
  background: #000;
  z-index: 2;
  pointer-events: none;
}
.pfp-screen {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 43px;
  background: #ffffff;
  display: block;
}
/* Stacked layout: compact copy on top, device fills the remaining height so
   nothing is ever clipped, at any window height >= ~560px. */
@media (max-width: 880px) {
  .pfp-stage { padding: 22px 20px; }
  .pfp-wrap { flex-direction: column; gap: 16px; justify-content: center; }
  .pfp-copy { flex: 0 0 auto; max-width: 460px; text-align: center; }
  .pfp-eyebrow { margin: 0 auto; }
  .pfp-text {
    margin: 10px auto 0;
    max-width: 340px;
    font-size: 14px;
    line-height: 1.45;
  }
  .pfp-title { margin-top: 13px; font-size: clamp(22px, 5vw, 28px); }
  .pfp-phone {
    width: min(360px, 84vw);
    height: min(720px, calc(100svh - 210px));
  }
}
@keyframes pfp-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}`;
