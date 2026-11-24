import { useState } from 'react';
import type { ThemeMode } from '../lib/anime';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-wrap">
        <a className="brand" href="#top" onClick={closeMenu}>
          <span className="stamp" aria-hidden="true">
            夜
          </span>
          <span>Nighter</span>
        </a>

        <nav
          className={`nav-links${menuOpen ? ' open' : ''}`}
          id="navLinks"
          aria-label="Main navigation"
        >
          <a href="#catalog" onClick={closeMenu}>
            Catalog
          </a>
          <a href="#featured" onClick={closeMenu}>
            Featured
          </a>
          <a href="#trending" onClick={closeMenu}>
            Trending
          </a>
          <a href="#join" onClick={closeMenu}>
            Join
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-toggle"
            id="navToggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="navLinks"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
          </button>

          <button
            className="theme-toggle"
            id="themeToggle"
            type="button"
            aria-label={`Switch to ${nextTheme} mode`}
            aria-pressed={theme === 'dark'}
            title={`Switch to ${nextTheme} mode`}
            onClick={onToggleTheme}
          >
            <span className="theme-icon" aria-hidden="true">
              {theme === 'dark' ? '☀' : '☾'}
            </span>
            <span className="theme-label">{nextTheme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          <a className="btn btn-primary" href="#catalog" onClick={closeMenu}>
            Find anime
          </a>
        </div>
      </div>
    </header>
  );
}
