import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
    'andalus-fr': '#d97f92',
};

export default function LandingPage() {
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
                        <a href="#categories" className="hero-mobile-tab">Flyer event pages</a>
                    </nav>

                    <div className="hero-content">
                        <h1 className="hero-title">
                            Online <em>invitations</em> &amp; <em>cards</em> for the moments that matter
                        </h1>

                        <div className="hero-cta-group">
                            <Link to={VELVET_TEMPLATE.demoPath} className="hero-cta hero-cta--primary">
                                Try live demo
                            </Link>
                            <a href="#demo" className="hero-cta hero-cta--secondary">
                                Get started
                            </a>
                        </div>
                    </div>

                    <button className="hero-arrow">
                        <ChevronRight size={32} strokeWidth={1.5} />
                    </button>
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
                                <Link to="/login">Professional plans</Link>
                                <Link to="/login">Contact</Link>
                            </div>
                        </div>

                        <div className="lx-fin-wordmark" aria-hidden="true"><span>Convive</span></div>
                    </div>
                </div>

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
