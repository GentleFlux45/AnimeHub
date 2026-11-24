import { useState } from 'react';
import { FEATURED_ANIME } from '../data/featuredAnime';
import {
  FEATURED_FILTERS,
  filterFeaturedAnime,
  type FeaturedAnime,
  type FeaturedCategory,
} from '../lib/anime';

interface FeaturedCardProps {
  item: FeaturedAnime;
  onSelectFeatured: (item: FeaturedAnime) => void;
}

function FeaturedCard({ item, onSelectFeatured }: FeaturedCardProps) {
  const [imgSrc, setImgSrc] = useState(item.imageSrc);

  return (
    <article className="card" data-category={item.category}>
      <div className="card-media">
        <img
          className="anime-art"
          src={imgSrc}
          alt={item.imageAlt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            if (item.fallbackImageSrc && imgSrc !== item.fallbackImageSrc) {
              setImgSrc(item.fallbackImageSrc);
            }
          }}
        />
        <span className="ep-badge">{item.badge}</span>
      </div>
      <div className="card-body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="meta">
          <span className="tag">{item.tag}</span>
          <span className="ep-count">{item.formatLabel}</span>
        </div>
        <div className="card-actions">
          <button
            className="btn btn-secondary"
            type="button"
            aria-label={`Explore ${item.title}`}
            onClick={() => onSelectFeatured(item)}
          >
            Explore title
          </button>
        </div>
      </div>
    </article>
  );
}

interface FeaturedSectionProps {
  activeFilter: FeaturedCategory;
  onFilterChange: (category: FeaturedCategory) => void;
  onSelectFeatured: (item: FeaturedAnime) => void;
  onBrowseCatalogGenre: (genreName: string) => void;
}

export function FeaturedSection({
  activeFilter,
  onFilterChange,
  onSelectFeatured,
  onBrowseCatalogGenre,
}: FeaturedSectionProps) {
  const visibleCards = filterFeaturedAnime(FEATURED_ANIME, activeFilter);

  return (
    <section id="featured">
      <div className="section-head">
        <div>
          <h2>Featured Anime</h2>
          <p>Curated picks for your next binge session.</p>
        </div>
      </div>

      <div
        className="filters"
        id="genres"
        role="group"
        aria-label="Filter anime by genre"
      >
        {FEATURED_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              className={`filter-btn${isActive ? ' active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {visibleCards.length > 0 ? (
        <div className="cards" data-testid="featured-cards">
          {visibleCards.map((item) => (
            <FeaturedCard
              key={item.id}
              item={item}
              onSelectFeatured={onSelectFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="featured-empty">
          <p className="provider-note">
            No curated spotlight picks are listed under{' '}
            {FEATURED_FILTERS.find((f) => f.id === activeFilter)?.label ||
              activeFilter}{' '}
            yet. Search this genre directly in the live catalog.
          </p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              const label =
                FEATURED_FILTERS.find((f) => f.id === activeFilter)?.label || '';
              if (label && label !== 'All') {
                onBrowseCatalogGenre(label);
              }
            }}
          >
            Browse in Catalog
          </button>
        </div>
      )}
    </section>
  );
}
