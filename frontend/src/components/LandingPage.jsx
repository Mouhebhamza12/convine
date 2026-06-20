import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import TemplateDemoSection from './TemplateDemoSection.jsx';
import { VELVET_TEMPLATE, WEDDING_TEMPLATES } from '../lib/templates';
import heroVideo from '../../assets/hero-web-landscape.mp4';
import '../css/landing.css';

const Arrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

/* bright tints so each world's name glows on the dark footer */
const FOOT_ACCENT = {
    velvet: '#e3596d',
    roseraie: '#e36f88',
    ivoire: '#e6c486',
    sage: '#a9bd7e',
    azure: '#7aa6e0',
};

const DEMO_CHOICES = [
    { name: 'Ivoire', path: '/invite/demo-ivoire', color: '#ac7d2d', tx: '-10px', ty: '18px', rot: '-14deg' },
    { name: 'Roseraie', path: '/invite/demo-roseraie', color: '#b53f57', tx: '-5px', ty: '5px', rot: '-7deg' },
    { name: 'Velvet', path: '/invite/demo', color: '#9d0a1c', tx: '0px', ty: '0px', rot: '0deg' },
    { name: 'Sage', path: '/invite/demo-sage', color: '#4a6841', tx: '5px', ty: '5px', rot: '7deg' },
    { name: 'Azure', path: '/invite/demo-azure', color: '#2d5f9e', tx: '10px', ty: '18px', rot: '14deg' },
];

export default function LandingPage() {
    const [showChoices, setShowChoices] = useState(false);
    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <main className="min-h-screen bg-[#faf7f2] text-[#2c2419]">
            <SiteHeader />

            <section className="relative overflow-hidden border-b border-black/10 bg-[#e7ded2]">
                <div className="hero-shell">
                    <video className="hero-video-backdrop" src={heroVideo} autoPlay muted loop playsInline />
                    <video className="hero-video" src={heroVideo} autoPlay muted loop playsInline />

                    <div className="absolute inset-0 bg-white/18"></div>

                    <nav className="hero-mobile-tabs" aria-label="Invitation categories">
                        <a href="#categories" className="hero-mobile-tab is-active">Card invitations</a>
                    </nav>

                    <div className="hero-content">
                        <h1 className="hero-title">
                            Online <em>invitations</em> &amp; <em>cards</em> for the moments that matter
                        </h1>

                        <div className="hero-cta-group-container">
                            {!showChoices ? (
                                <div className="hero-cta-group fade-in-fast">
                                    <button
                                        type="button"
                                        onClick={() => setShowChoices(true)}
                                        className="hero-cta hero-cta--primary"
                                    >
                                        Try live demo
                                    </button>
                                    <a href="#demo" className="hero-cta hero-cta--secondary">
                                        Get started
                                    </a>
                                </div>
                            ) : (
                                <div className="demo-choices-wrapper">
                                    <div className="demo-choices-container">
                                        {DEMO_CHOICES.map((tpl, idx) => (
                                            <Link
                                                key={tpl.name}
                                                to={tpl.path}
                                                className="demo-choice-item"
                                                style={{
                                                    '--color': tpl.color,
                                                    '--tx': tpl.tx,
                                                    '--ty': tpl.ty,
                                                    '--rot': tpl.rot,
                                                    '--delay': `${idx * 0.08}s`,
                                                }}
                                            >
                                                {tpl.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowChoices(false)}
                                        className="demo-choices-close"
                                    >
                                        Back to options
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <TemplateDemoSection />

            {/* ── Footer: a bold closing statement ── */}
            <footer className="lx lx-footer">
                <div className="lx-foot-cta-wrap">
                    <span className="lx-foot-eye">Ready when you are</span>
                    <h2>Make it <b>unforgettable.</b></h2>
                    <p className="lx-foot-cta-sub">Build a living invitation in minutes. Free to try, no card, no catch.</p>
                    <Link to={VELVET_TEMPLATE.demoPath} className="lx-btn lx-btn--gold">
                        Start your invitation <Arrow />
                    </Link>
                </div>

                {/* ── Footer body: the line worth keeping, a grand nav, a clean close ── */}
                <div className="lx-foot-body">
                    <p className="lx-foot-statement">Some moments deserve to be announced, not just sent.</p>

                    <nav className="lx-foot-index" aria-label="Browse templates">
                        {WEDDING_TEMPLATES.map((t) => (
                            <Link
                                key={t.slug}
                                to={t.demoPath}
                                className="lx-foot-world"
                                style={{ '--c': FOOT_ACCENT[t.preview] }}
                            >
                                <span>{t.name}</span>
                                <Arrow />
                            </Link>
                        ))}
                    </nav>

                    <div className="lx-finale">
                        <h3 className="lx-fin-head">Be first <em>through the door.</em></h3>
                        <p className="lx-fin-sub">One quiet note when a new world joins the collection. Nothing else, ever.</p>
                        <form className="lx-fin-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your email address" aria-label="Email address" required />
                            <button type="submit">Notify me <Arrow /></button>
                        </form>

                        <div className="lx-fin-credits">
                            <span className="lx-fin-tag">Invitations for the moments that matter.</span>
                            <div className="lx-fin-links">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <Link to="/login">Contact</Link>
                            </div>
                        </div>

                        <div className="lx-fin-wordmark" aria-hidden="true"><span>Convive</span></div>
                    </div>
                </div>

                <p className="lx-makers">
                    Designed and developed by{' '}
                    <span className="lx-maker">Mouheb Abdelhak HAMZA</span> and{' '}
                    <span className="lx-maker">Mustapha Nedjmeddine DJELLOUT</span>
                </p>

                <div className="lx-foot-bottom">
                    <p>© {new Date().getFullYear()} Convive. All rights reserved.</p>
                    <div className="lx-foot-legal">
                        <Link to="/login">Privacy</Link>
                        <Link to="/login">Terms</Link>
                        <button type="button" className="lx-totop" onClick={scrollTop}>Back to top ↑</button>
                    </div>
                </div>
            </footer>
        </main>
    );
}
