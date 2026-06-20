import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/legal.css';

/**
 * Shared layout for the Privacy and Terms pages, a quiet, readable document
 * on warm ivory, set entirely in Instrument Sans to match the rest of the site.
 *
 * @param {{ title: string, updated: string, lead: string,
 *           sections: { h: string, p: string[] }[] }} props
 */
export default function LegalPage({ title, updated, lead, sections }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="lg">
            <header className="lg-top">
                <Link to="/" className="lg-mark">Convive</Link>
                <Link to="/" className="lg-back">Home</Link>
            </header>

            <article className="lg-doc">
                <h1 className="lg-title">{title}</h1>
                <p className="lg-updated">Last updated {updated}</p>
                <p className="lg-lead">{lead}</p>

                {sections.map((section) => (
                    <section className="lg-sec" key={section.h}>
                        <h2 className="lg-h">{section.h}</h2>
                        {section.p.map((paragraph, index) => (
                            <p className="lg-p" key={index}>{paragraph}</p>
                        ))}
                    </section>
                ))}

                <div className="lg-foot">
                    <p>
                        Questions about this page? <Link to="/login">Get in touch</Link>.
                    </p>
                    <div className="lg-foot-links">
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                        <Link to="/">Home</Link>
                    </div>
                </div>
            </article>
        </main>
    );
}
