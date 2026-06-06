import { useCallback, useMemo, useState } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import SiteHeader, { readSaved, SAVED_KEY } from './SiteHeader.jsx';
import heroVideo from '../../assets/hero-web-landscape.mp4';

const categories = [
    {
        name: 'Wedding',
        copy: 'Save the dates, invitations, and wedding weekend details.',
        accent: '#b8956f',
    },
    {
        name: 'Birthday',
        copy: 'Milestones, surprise parties, and group celebrations.',
        accent: '#7a96a8',
    },
    {
        name: 'Dinner',
        copy: 'Holiday dinners, supper clubs, and seated gatherings.',
        accent: '#a89b6a',
    },
    {
        name: 'Baby',
        copy: 'Showers, announcements, and first birthdays.',
        accent: '#a88a96',
    },
];

const products = [
    {
        title: 'Card invitations',
        copy: 'Digital invitations with envelopes, liners, and built-in RSVP tracking.',
        detail: 'Guest lists, reminders, and delivery in one place.',
    },
    {
        title: 'Flyer event pages',
        copy: 'Shareable event pages for launches, fundraisers, and community gatherings.',
        detail: 'Designed for quick publishing and clear event details.',
    },
    {
        title: 'Greeting cards',
        copy: 'Personal notes for holidays, thank-yous, birthdays, and announcements.',
        detail: 'Send individually or share a link with your message.',
    },
];

export default function LandingPage() {
    const [activeCategory, setActiveCategory] = useState('Wedding');
    const [searchQuery, setSearchQuery] = useState('');
    const [savedItems, setSavedItems] = useState(readSaved);

    const handleCategorySelect = useCallback((category) => {
        setActiveCategory(category);
    }, []);

    const updateSaved = useCallback((category, shouldSave) => {
        setSavedItems((prev) => {
            const next = shouldSave
                ? prev.includes(category)
                    ? prev
                    : [...prev, category]
                : prev.filter((item) => item !== category);
            localStorage.setItem(SAVED_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const toggleSaved = useCallback(
        (category, event) => {
            event.stopPropagation();
            updateSaved(category, !savedItems.includes(category));
        },
        [savedItems, updateSaved],
    );

    const visibleCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return categories;
        }

        return categories.filter(
            ({ name, copy }) =>
                name.toLowerCase().includes(query) ||
                copy.toLowerCase().includes(query) ||
                `${name} invitations`.toLowerCase().includes(query),
        );
    }, [searchQuery]);

    return (
        <main className="min-h-screen bg-[#faf7f2] text-[#2c2419]">
            <SiteHeader
                onSearch={setSearchQuery}
                onCategorySelect={handleCategorySelect}
                savedItems={savedItems}
                onRemoveSaved={(category) => updateSaved(category, false)}
            />

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
                            Online invitations and cards for all the moments that matter
                        </h1>

                        <a href="#categories" className="hero-cta">
                            Get started
                        </a>
                    </div>

                    <button className="hero-arrow">
                        <ChevronRight size={32} strokeWidth={1.5} />
                    </button>
                </div>
            </section>

            <section id="categories" className="celebrate-section">
                <div className="celebrate-section-header">
                    <p className="section-eyebrow">Invitations by occasion</p>
                    <h2 className="section-title">What are you celebrating?</h2>
                    <p className="section-lead">
                        Browse templates by event type. Every design can be customized for your guest list.
                    </p>
                </div>

                {searchQuery.trim() && visibleCategories.length > 0 ? (
                    <p className="celebrate-search-note">
                        {visibleCategories.length} result{visibleCategories.length === 1 ? '' : 's'} for
                        &ldquo;{searchQuery.trim()}&rdquo;
                    </p>
                ) : null}

                <div className="category-tabs" role="tablist" aria-label="Celebration categories">
                    {categories.map(({ name }) => (
                        <button
                            key={name}
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === name}
                            className={`category-tab ${activeCategory === name ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <div className="category-grid">
                    {visibleCategories.length === 0 ? (
                        <p className="category-empty">
                            No categories match your search. Try wedding, birthday, dinner, or baby.
                        </p>
                    ) : (
                        visibleCategories.map(({ name, copy, accent }) => (
                            <article
                                key={name}
                                className={`category-card ${activeCategory === name ? 'is-selected' : ''}`}
                                style={{ '--category-accent': accent }}
                                onClick={() => setActiveCategory(name)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setActiveCategory(name);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="category-card-accent" aria-hidden="true" />
                                <div className="category-card-body">
                                    <div className="category-card-top">
                                        <span className="category-card-label">{name} invitations</span>
                                        <button
                                            type="button"
                                            className={`category-save-btn ${savedItems.includes(name) ? 'is-saved' : ''}`}
                                            aria-label={
                                                savedItems.includes(name)
                                                    ? `Remove ${name} from saved`
                                                    : `Save ${name} invitations`
                                            }
                                            onClick={(event) => toggleSaved(name, event)}
                                        >
                                            <Heart size={16} strokeWidth={1.75} />
                                        </button>
                                    </div>
                                    <h3 className="category-card-title">{name}</h3>
                                    <p className="category-card-copy">{copy}</p>
                                    <span className="category-card-action">
                                        Browse templates
                                        <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                                    </span>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </section>

            <section id="products" className="products-section">
                <div className="products-section-inner">
                    <div className="products-intro">
                        <p className="section-eyebrow">What Convive offers</p>
                        <h2 className="section-title">
                            From the first save-the-date to the last RSVP.
                        </h2>
                        <p className="products-intro-copy">
                            Convive gives hosts one place to design invitations, manage guests, and
                            send polished communications without juggling multiple tools.
                        </p>
                        <ul className="products-trust-list">
                            <li>RSVP tracking and guest list management</li>
                            <li>Branded envelopes and delivery-ready formats</li>
                            <li>Templates built for weddings, parties, and private events</li>
                        </ul>
                    </div>

                    <div className="products-grid">
                        {products.map(({ title, copy, detail }) => (
                            <article key={title} className="product-card">
                                <h3 className="product-card-title">{title}</h3>
                                <p className="product-card-copy">{copy}</p>
                                <p className="product-card-detail">{detail}</p>
                                <button type="button" className="product-card-link">
                                    Learn more
                                    <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
