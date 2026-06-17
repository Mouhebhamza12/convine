import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SiteHeader from './SiteHeader.jsx';
import TemplateDemoSection from './TemplateDemoSection.jsx';
import { CloseFlourish, CloseSeal, CloseLeaf, CloseSend } from './CloseArt.jsx';
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

/* a curated one-line descriptor per world, set as an editorial index */
const WORLD_NOTE = {
    ivoire: 'Gilded ivory & blush',
    roseraie: 'A sealed botanical keepsake',
    'andalus-fr': 'Royal velour & gold',
    velvet: 'Cinematic crimson drape',
    sage: 'Sage & ivory botanicals',
    azure: 'Illustrated blue & cream',
};
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

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

                {/* ── The closing leaf: a colophon, an index of worlds, a sign-off ── */}
                <div className="lx-close">
                    <CloseFlourish className="lx-close-flourish" />

                    <div className="lx-close-colophon">
                        <CloseSeal className="lx-close-seal" />
                        <p className="lx-close-eye">The last word</p>
                        <p className="lx-close-script">Some moments deserve to be announced, not just sent.</p>
                    </div>

                    <div className="lx-close-spread">
                        <div className="lx-close-voice">
                            <p className="lx-close-manifesto">
                                <span className="lx-close-name">Convive</span> composes cinematic invitations and
                                stationery-grade keepsakes for the milestones that quietly define a life.
                            </p>

                            <div className="lx-close-corr">
                                <p className="lx-close-corr-eye">Correspondence</p>
                                <p className="lx-close-corr-line">We write only when a new world joins the house. Never otherwise.</p>
                                <form className="lx-close-rsvp" onSubmit={(e) => e.preventDefault()}>
                                    <input type="email" required placeholder="Leave your address" aria-label="Your email address" />
                                    <button type="submit" aria-label="Send your address">
                                        <CloseSend className="lx-close-send" />
                                    </button>
                                </form>
                            </div>

                            <div className="lx-close-credits">
                                <div className="lx-close-credit-row">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                                </div>
                                <div className="lx-close-credit-row">
                                    <Link to="/login">Professional plans</Link>
                                    <Link to="/login">The concierge</Link>
                                    <Link to="/login">Our craft</Link>
                                </div>
                            </div>
                        </div>

                        <nav className="lx-close-index" aria-label="Browse the collection">
                            <p className="lx-close-index-eye">The collection &mdash; six worlds</p>
                            <ol className="lx-close-index-list">
                                {WEDDING_TEMPLATES.map((t, i) => (
                                    <li key={t.slug}>
                                        <Link
                                            to={t.demoPath}
                                            className="lx-close-world"
                                            style={{ '--c': FOOT_ACCENT[t.preview] }}
                                        >
                                            <span className="lx-close-world-num">{ROMAN[i]}</span>
                                            <span className="lx-close-world-text">
                                                <span className="lx-close-world-name">{t.name}</span>
                                                <span className="lx-close-world-note">{WORLD_NOTE[t.slug]}</span>
                                            </span>
                                            <CloseLeaf className="lx-close-world-leaf" />
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>

                    <div className="lx-close-signoff">
                        <p className="lx-close-bientot">&agrave; bient&ocirc;t</p>
                        <div className="lx-close-wordmark" aria-hidden="true">Convive</div>
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
