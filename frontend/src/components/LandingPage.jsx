import { Link } from 'react-router-dom';
import { ChevronRight, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import SiteHeader from './SiteHeader.jsx';
import TemplateDemoSection from './TemplateDemoSection.jsx';
import { VELVET_TEMPLATE } from '../lib/templates';
import heroVideo from '../../assets/hero-web-landscape.mp4';

const products = [
    {
        title: 'Card invitations',
        copy: 'Cinematic wedding stories with red drape openings, scratch-to-reveal dates, RSVP, and personalized guest links.',
    },
    {
        title: 'Flyer event pages',
        copy: 'Shareable pages for launches, fundraisers, and community events with clear date, time, and location details.',
    },
    {
        title: 'Greeting cards',
        copy: 'Personal notes for holidays, thank-yous, birthdays, and announcements, send directly or by link.',
    },
];

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#faf7f2] text-[#2c2419]">
            <SiteHeader />

            <section className="relative overflow-hidden border-b border-black/10 bg-[#e7ded2]">
                <div className="hero-shell">
                    <video
                        className="hero-video-backdrop"
                        src={heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />

                    <video
                        className="hero-video"
                        src={heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />

                    <div className="absolute inset-0 bg-white/18"></div>

                    <nav className="hero-mobile-tabs" aria-label="Invitation categories">
                        <a href="#categories" className="hero-mobile-tab is-active">
                            Card invitations
                        </a>
                        <a href="#categories" className="hero-mobile-tab">
                            Flyer event pages
                        </a>
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

            <section id="products" className="products-section">
                <div className="products-section-inner">
                    <header className="products-header">
                        <h2 className="products-heading">
                            Invitations, event pages, and greeting cards
                        </h2>
                        <p className="products-subheading">
                            Design, send, and track guest responses in one place, from the
                            save-the-date through the final RSVP.
                        </p>
                    </header>

                    <div className="products-grid">
                        {products.map(({ title, copy }) => (
                            <article key={title} className="product-panel">
                                <h3 className="product-panel-title">{title}</h3>
                                <p className="product-panel-copy">{copy}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="site-footer">
                <div className="site-footer-inner">
                    <div className="footer-brand-section">
                        <div className="footer-logo">
                            <span className="footer-logo-script">Convive</span>
                            <span className="footer-logo-submark">MEMORABLE EVENTS</span>
                        </div>
                        <p className="footer-brand-desc">
                            Crafting cinematic online invitations and stationery-grade keepsakes for the milestones that define your life.
                        </p>
                        <div className="footer-socials">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                                <Instagram size={18} strokeWidth={1.5} />
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Pinterest">
                                <span style={{ fontFamily: 'serif', fontSize: '1.1rem', fontWeight: 'bold' }}>P</span>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                                <Facebook size={18} strokeWidth={1.5} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                                <Twitter size={18} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>
                    
                    <div className="footer-links-grid">
                        <div className="footer-link-group">
                            <h4 className="footer-group-title">Templates</h4>
                            <ul className="footer-links">
                                <li><Link to="/invite/demo">Velvet</Link></li>
                                <li><Link to="/invite/demo-roseraie">Roseraie</Link></li>
                                <li><Link to="/invite/demo-ivoire">Ivoire</Link></li>
                                <li><Link to="/invite/demo-sage">Sage</Link></li>
                                <li><Link to="/invite/demo-azure">Azure</Link></li>
                                <li><Link to="/invite/demo-andalus">Andalus</Link></li>
                            </ul>
                        </div>
                        <div className="footer-link-group">
                            <h4 className="footer-group-title">Products</h4>
                            <ul className="footer-links">
                                <li><a href="#products">Card invitations</a></li>
                                <li><a href="#products">Flyer event pages</a></li>
                                <li><a href="#products">Greeting cards</a></li>
                                <li><Link to="/login">Professional plans</Link></li>
                            </ul>
                        </div>
                        <div className="footer-link-group">
                            <h4 className="footer-group-title">Company</h4>
                            <ul className="footer-links">
                                <li><Link to="/login">About our craft</Link></li>
                                <li><Link to="/login">Contact concierge</Link></li>
                                <li><Link to="/login">Privacy policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-newsletter">
                        <h4 className="footer-group-title">Newsletter</h4>
                        <p className="footer-newsletter-desc">Subscribe to receive design inspirations and product updates.</p>
                        <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your email address" className="footer-newsletter-input" required />
                            <button type="submit" className="footer-newsletter-btn">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        &copy; {new Date().getFullYear()} Convive. All rights reserved. Made with love for unforgettable moments.
                    </p>
                </div>
            </footer>
        </main>
    );
}
