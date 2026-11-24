import { useState } from 'react';
import {
  HERO_SPOTLIGHT_FALLBACK,
  HERO_SPOTLIGHT_IMAGE,
} from '../data/featuredAnime';

export function HeroSection() {
  const [imgSrc, setImgSrc] = useState(HERO_SPOTLIGHT_IMAGE);

  return (
    <section className="hero">
      <div>
        <div className="eyebrow">Anime discovery · official watch links</div>
        <h1>
          Your next <span className="accent">anime</span> starts tonight.
        </h1>
        <p className="lede">
          Search thousands of anime, discover your next favorite, and find
          official services where you can watch it.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#catalog">
            Explore Catalog
          </a>
          <a className="btn btn-secondary" href="#trending">
            See What&apos;s Hot
          </a>
        </div>
        <div className="stats">
          <div className="stat">
            <strong>Thousands</strong>
            <span>Anime to explore</span>
          </div>
          <div className="stat">
            <strong>Live</strong>
            <span>Search results</span>
          </div>
          <div className="stat">
            <strong>Official</strong>
            <span>Watch links</span>
          </div>
        </div>
      </div>

      <div className="hero-card">
        <img
          className="hero-card-bg"
          src={imgSrc}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => {
            if (imgSrc !== HERO_SPOTLIGHT_FALLBACK) {
              setImgSrc(HERO_SPOTLIGHT_FALLBACK);
            }
          }}
        />
        <div className="hero-card-content">
          <span className="ep-tag">ANIME SPOTLIGHT</span>
          <h2>Home Of Anime</h2>
          <p className="hero-card-copy">
            Discover memorable anime and find a streaming service that lists each
            show.
          </p>
          <p className="spotlight-genres">
            Shounen · Supernatural · Action · Romance · Isekai · Adventure
          </p>
        </div>
      </div>
    </section>
  );
}
