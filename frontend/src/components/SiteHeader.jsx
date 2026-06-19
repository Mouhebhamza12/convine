import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronDown,
    Heart,
    LogIn,
    Menu,
    Search,
    UserRound,
    X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const SAVED_KEY = 'convive-saved-categories';

const navMenus = [
    {
        id: 'cards',
        label: 'Wedding invitations',
        items: [
            { label: 'Ivoire', href: '/invite/demo-ivoire' },
            { label: 'Roseraie', href: '/invite/demo-roseraie' },
            { label: 'Velvet', href: '/invite/demo' },
            { label: 'Sage', href: '/invite/demo-sage' },
            { label: 'Azure', href: '/invite/demo-azure' },
        ],
    },
];


function readSaved() {
    try {
        const raw = localStorage.getItem(SAVED_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export default function SiteHeader({
    onSearch,
    onCategorySelect,
    savedItems = [],
    onRemoveSaved,
}) {
    const { user } = useAuth();
    const drawerBodyRef = useRef(null);
    const searchInputRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [savedOpen, setSavedOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenu, setOpenMenu] = useState(null);

    const [menuClosing, setMenuClosing] = useState(false);
    const [savedClosing, setSavedClosing] = useState(false);
    const [searchClosing, setSearchClosing] = useState(false);

    const animateCloseMenu = useCallback(() => {
        setMenuClosing(true);
        setTimeout(() => {
            setMenuOpen(false);
            setMenuClosing(false);
        }, 260);
    }, []);

    const animateCloseSaved = useCallback(() => {
        setSavedClosing(true);
        setTimeout(() => {
            setSavedOpen(false);
            setSavedClosing(false);
        }, 260);
    }, []);

    const animateCloseSearch = useCallback(() => {
        setSearchClosing(true);
        setTimeout(() => {
            setSearchOpen(false);
            setSearchClosing(false);
        }, 200);
    }, []);

    useEffect(() => {
        if (menuOpen && drawerBodyRef.current) {
            drawerBodyRef.current.scrollTop = 0;
        }
    }, [menuOpen]);

    const accountPath = user
        ? user.role === 'admin'
            ? '/admin'
            : '/dashboard'
        : '/login';

    const closePanels = useCallback(() => {
        if (menuOpen) animateCloseMenu();
        else setMenuOpen(false);

        if (savedOpen) animateCloseSaved();
        else setSavedOpen(false);

        if (searchOpen) animateCloseSearch();
        else setSearchOpen(false);

        setOpenMenu(null);
    }, [menuOpen, savedOpen, searchOpen, animateCloseMenu, animateCloseSaved, animateCloseSearch]);

    const scrollToCategories = useCallback((category) => {
        if (category && onCategorySelect) {
            onCategorySelect(category);
        }
        const el = document.getElementById('demo');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closePanels();
    }, [closePanels, onCategorySelect]);

    const handleSearch = useCallback(
        (value) => {
            setSearchQuery(value);
            onSearch?.(value);
            if (value.trim()) {
                const el = document.getElementById('demo');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },
        [onSearch],
    );

    useEffect(() => {
        if (!menuOpen && !searchOpen && !savedOpen && !openMenu) {
            return undefined;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                closePanels();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        const shouldBlock = menuOpen || savedOpen || searchOpen;
        document.body.style.overflow = shouldBlock ? 'hidden' : '';
        document.documentElement.style.overflow = shouldBlock ? 'hidden' : '';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [menuOpen, searchOpen, savedOpen, openMenu, closePanels]);

    useEffect(() => {
        if (searchOpen) {
            searchInputRef.current?.focus();
        }
    }, [searchOpen]);

    useEffect(() => {
        const onPointerDown = (event) => {
            if (!event.target.closest('[data-nav-dropdown]')) {
                setOpenMenu(null);
            }
            if (menuOpen && !event.target.closest('.mobile-drawer') && !event.target.closest('.nav-icon-btn')) {
                animateCloseMenu();
            }
            if (savedOpen && !event.target.closest('.saved-panel') && !event.target.closest('.nav-icon-btn')) {
                animateCloseSaved();
            }
            if (searchOpen && !event.target.closest('.search-overlay') && !event.target.closest('.nav-icon-btn')) {
                animateCloseSearch();
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [menuOpen, savedOpen, searchOpen, animateCloseMenu, animateCloseSaved, animateCloseSearch]);

    return (
        <header className="site-header">
            <div className="topbar">
                <div className="mobile-header-actions">
                    <button
                        type="button"
                        className={`nav-icon-btn ${menuOpen ? 'is-active' : ''}`}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => {
                            if (menuOpen) {
                                animateCloseMenu();
                            } else {
                                setMenuOpen(true);
                                if (searchOpen) animateCloseSearch();
                                if (savedOpen) animateCloseSaved();
                            }
                        }}
                    >
                        {menuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
                    </button>
                    <button
                        type="button"
                        className={`nav-icon-btn ${searchOpen ? 'is-active' : ''}`}
                        aria-label="Search"
                        aria-expanded={searchOpen}
                        onClick={() => {
                            if (searchOpen) {
                                animateCloseSearch();
                            } else {
                                setSearchOpen(true);
                                if (menuOpen) animateCloseMenu();
                                if (savedOpen) animateCloseSaved();
                            }
                        }}
                    >
                        <Search size={21} strokeWidth={1.75} />
                    </button>
                </div>

                <Link to="/" className="convive-logo" aria-label="Convive home" onClick={closePanels}>
                    <span className="convive-script">Convive</span>
                    <span className="convive-submark">MEMORABLE EVENTS</span>
                </Link>

                <div className="desktop-header-actions">
                    <button
                        type="button"
                        className={`nav-icon-btn ${searchOpen ? 'is-active' : ''}`}
                        aria-label="Search"
                        aria-expanded={searchOpen}
                        onClick={() => {
                            if (searchOpen) {
                                animateCloseSearch();
                            } else {
                                setSearchOpen(true);
                                if (menuOpen) animateCloseMenu();
                                if (savedOpen) animateCloseSaved();
                            }
                        }}
                    >
                        <Search size={21} strokeWidth={1.75} />
                    </button>
                    {user ? (
                        <Link className="auth-button auth-button-warm" to={accountPath}>
                            My account
                        </Link>
                    ) : (
                        <Link className="auth-button auth-button-warm" to="/login">
                            Log in
                        </Link>
                    )}
                </div>

                <div className="mobile-header-actions">
                    <Link
                        className="nav-icon-btn"
                        aria-label={user ? 'My account' : 'Sign in'}
                        to={accountPath}
                        onClick={closePanels}
                    >
                        <UserRound size={21} strokeWidth={1.75} />
                    </Link>
                </div>
            </div>

            {(searchOpen || searchClosing) && (
                <>
                    <button
                        type="button"
                        className={`nav-overlay ${searchClosing ? 'is-closing' : ''}`}
                        aria-label="Close search"
                        onClick={animateCloseSearch}
                    />
                    <div className={`search-overlay ${searchClosing ? 'is-closing' : ''}`} role="dialog" aria-label="Search">
                        <button
                            type="button"
                            className="search-overlay-close"
                            aria-label="Close search"
                            onClick={animateCloseSearch}
                        >
                            <X size={22} strokeWidth={1.75} />
                        </button>
                        <input
                            ref={searchInputRef}
                            className="search-overlay-input"
                            placeholder="Search wedding invitations..."
                            value={searchQuery}
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                        {searchQuery.trim() ? (
                            <button
                                type="button"
                                className="search-overlay-clear"
                                onClick={() => handleSearch('')}
                            >
                                Clear
                            </button>
                        ) : null}
                    </div>
                </>
            )}

            <nav className="nav-row" aria-label="Main navigation">
                {navMenus.map((menu) => (
                    <div key={menu.id} className="nav-dropdown" data-nav-dropdown>
                        <button
                            type="button"
                            className={`nav-link ${openMenu === menu.id ? 'is-open' : ''}`}
                            aria-expanded={openMenu === menu.id}
                            onClick={() => setOpenMenu((current) => (current === menu.id ? null : menu.id))}
                        >
                            {menu.label}
                            <ChevronDown size={16} className="nav-chevron" />
                        </button>
                        {openMenu === menu.id && (
                            <div className="nav-dropdown-panel">
                                {menu.items.map((item) => (
                                    item.href ? (
                                        <Link
                                            key={item.label}
                                            className="nav-dropdown-item"
                                            to={item.href}
                                            onClick={closePanels}
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            key={item.label}
                                            type="button"
                                            className="nav-dropdown-item"
                                            onClick={() => scrollToCategories(item.category)}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {(menuOpen || menuClosing) && (
                <>
                    <button
                        type="button"
                        className={`nav-overlay ${menuClosing ? 'is-closing' : ''}`}
                        aria-label="Close menu"
                        onClick={animateCloseMenu}
                    />
                    <aside className={`mobile-drawer ${menuClosing ? 'is-closing' : ''}`} aria-label="Mobile menu">
                        <div className="mobile-drawer-header">
                            <Link to="/" className="convive-script text-[26px]" onClick={animateCloseMenu}>
                                Convive
                            </Link>
                            <button
                                type="button"
                                className="nav-icon-btn"
                                aria-label="Close menu"
                                onClick={animateCloseMenu}
                            >
                                <X size={20} strokeWidth={1.75} />
                            </button>
                        </div>

                        <div ref={drawerBodyRef} className="mobile-drawer-body">
                            {navMenus.map((menu) => (
                                <div key={menu.id} className="mobile-drawer-group">
                                     <p className="drawer-section-title">{menu.label}</p>
                                     {menu.items.map((item) => (
                                         item.href ? (
                                             <Link
                                                 key={item.label}
                                                 className="mobile-drawer-link"
                                                 to={item.href}
                                                 onClick={animateCloseMenu}
                                             >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <button
                                                key={item.label}
                                                type="button"
                                                className="mobile-drawer-link"
                                                onClick={() => scrollToCategories(item.category)}
                                            >
                                                {item.label}
                                            </button>
                                        )
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="mobile-drawer-footer">
                            <Link
                                className="mobile-drawer-account"
                                to={accountPath}
                                onClick={() => setMenuOpen(false)}
                            >
                                <UserRound size={18} />
                                {user ? 'My account' : 'Sign in'}
                            </Link>
                        </div>
                    </aside>
                </>
            )}

            {savedOpen && (
                <>
                    <button
                        type="button"
                        className="nav-overlay"
                        aria-label="Close saved panel"
                        onClick={() => setSavedOpen(false)}
                    />
                    <aside className="saved-panel" aria-label="Saved invitations">
                        <div className="saved-panel-header">
                            <h2 className="saved-panel-title">Saved</h2>
                            <button
                                type="button"
                                className="nav-icon-btn"
                                aria-label="Close saved panel"
                                onClick={() => setSavedOpen(false)}
                            >
                                <X size={20} strokeWidth={1.75} />
                            </button>
                        </div>

                        {savedItems.length === 0 ? (
                            <div className="saved-panel-empty">
                                <Heart size={28} strokeWidth={1.5} />
                                <p>Hearts you tap on a category land here.</p>
                                {!user && (
                                    <Link className="saved-panel-login" to="/login" onClick={closePanels}>
                                        <LogIn size={16} />
                                        Sign in
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <ul className="saved-panel-list">
                                {savedItems.map((category) => (
                                    <li key={category}>
                                        <button
                                            type="button"
                                            className="saved-panel-item"
                                            onClick={() => scrollToCategories(category)}
                                        >
                                            <span>{category} invitations</span>
                                            <Heart size={16} className="nav-heart-filled" />
                                        </button>
                                        <button
                                            type="button"
                                            className="saved-panel-remove"
                                            aria-label={`Remove ${category} from saved`}
                                            onClick={() => onRemoveSaved?.(category)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </aside>
                </>
            )}
        </header>
    );
}

export { SAVED_KEY, readSaved };
