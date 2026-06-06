import { useCallback, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import SiteHeader, { readSaved, SAVED_KEY } from './SiteHeader.jsx';
import heroVideo from '../../assets/hero-web-landscape.mp4';

const categories = [
    {
        name: 'Wedding',
        copy: 'Save the dates, invitations, and wedding weekend details.',
        preview: '#d9cfc3',
    },
    {
        name: 'Birthday',
        copy: 'Milestones, surprise parties, and group celebrations.',
        preview: '#c8d2d9',
    },
    {
        name: 'Dinner',
        copy: 'Holiday dinners, supper clubs, and seated gatherings.',
        preview: '#d5cdb8',
    },
    {
        name: 'Baby',
        copy: 'Showers, announcements, and first birthdays.',
        preview: '#d4c8cc',
    },
];

const products = [
    {
        title: 'Card invitations',
        copy: 'Digital invitations with envelopes, liners, RSVP tracking, guest lists, and delivery reminders.',
    },
    {
        title: 'Flyer event pages',
        copy: 'Shareable pages for launches, fundraisers, and community events with clear date, time, and location details.',
    },
    {
        title: 'Greeting cards',
        copy: 'Personal notes for holidays, thank-yous, birthdays, and announcements — send directly or by link.',
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
                <div className="celebrate-section-inner">
                    <header className="celebrate-header">
                        <h2 className="celebrate-heading">What are you celebrating?</h2>
                        <p className="celebrate-subheading">
                            Select an occasion to view invitation designs.
                        </p>
                    </header>

                    {searchQuery.trim() && visibleCategories.length > 0 ? (
                        <p className="celebrate-search-note">
                            {visibleCategories.length} result{visibleCategories.length === 1 ? '' : 's'} for
                            &ldquo;{searchQuery.trim()}&rdquo;
                        </p>
                    ) : null}

                    <div className="category-grid">
                        {visibleCategories.length === 0 ? (
                            <p className="category-empty">
                                No categories match your search. Try wedding, birthday, dinner, or baby.
                            </p>
                        ) : (
                            visibleCategories.map(({ name, copy, preview }) => {
                                const isSaved = savedItems.includes(name);
                                const isActive = activeCategory === name;

                                return (
                                    <article
                                        key={name}
                                        className={`category-tile ${isActive ? 'is-active' : ''}`}
                                        onClick={() => setActiveCategory(name)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                setActiveCategory(name);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={isActive}
                                    >
                                        <div
                                            className="category-tile-preview"
                                            style={{ backgroundColor: preview }}
                                            aria-hidden="true"
                                        />
                                        <div className="category-tile-body">
                                            <h3 className="category-tile-name">{name}</h3>
                                            <p className="category-tile-desc">{copy}</p>
                                            <div className="category-tile-footer">
                                                <span className="category-tile-action">View designs</span>
                                                <button
                                                    type="button"
                                                    className={`category-tile-save ${isSaved ? 'is-saved' : ''}`}
                                                    aria-pressed={isSaved}
                                                    onClick={(event) => toggleSaved(name, event)}
                                                >
                                                    {isSaved ? 'Saved' : 'Save for later'}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            <section id="products" className="products-section">
                <div className="products-section-inner">
                    <header className="products-header">
                        <h2 className="products-heading">
                            Invitations, event pages, and greeting cards
                        </h2>
                        <p className="products-subheading">
                            Design, send, and track guest responses in one place — from the
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
        </main>
    );
}
