import { useState, type FormEvent } from 'react';
import {
  ANIME_GENRES,
  formatAnimeScore,
  getAnimeDescription,
  getAnimeTitle,
  getStreamingLinks,
  type AnimeMedia,
} from '../lib/anime';

interface CatalogCardProps {
  anime: AnimeMedia;
  onOpenDetails: (anime: AnimeMedia) => void;
}

function CatalogCard({ anime, onOpenDetails }: CatalogCardProps) {
  const title = getAnimeTitle(anime);
  const coverUrl = anime.coverImage?.extraLarge || anime.coverImage?.large || '';
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    coverUrl ? 'loading' : 'error',
  );
  const primaryProvider = getStreamingLinks(anime, 1)[0];
  const genresText = (anime.genres || []).slice(0, 2).join(' · ') || 'Anime';
  const scoreText = formatAnimeScore(anime);

  return (
    <article className="card catalog-card">
      <div className="card-media">
        {imageState !== 'loaded' && (
          <span className="cover-fallback" aria-hidden="true">
            {imageState === 'error' ? 'Cover unavailable' : 'Anime'}
          </span>
        )}
        {coverUrl && imageState !== 'error' && (
          <img
            className="anime-art"
            src={coverUrl}
            alt={`${title} cover artwork`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
          />
        )}
        <span className="ep-badge">
          {anime.seasonYear || anime.format || 'ANIME'}
        </span>
      </div>

      <div className="card-body">
        <h3>{title}</h3>
        <p className="card-description">{getAnimeDescription(anime)}</p>
        <div className="meta">
          <span className="tag">{genresText}</span>
          {scoreText && <span className="ep-count">{scoreText}</span>}
        </div>
        <div className="card-actions">
          <button
            className="btn btn-secondary"
            type="button"
            aria-label={`Details for ${title}`}
            onClick={() => onOpenDetails(anime)}
          >
            Details
          </button>
          {primaryProvider && (
            <a
              className="btn btn-primary"
              href={primaryProvider.safeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on {primaryProvider.site}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

interface CatalogSectionProps {
  search: string;
  genre: string;
  results: AnimeMedia[];
  statusMessage: string;
  isError: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onSearchSubmit: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onOpenDetails: (anime: AnimeMedia) => void;
}

export function CatalogSection({
  search,
  genre,
  results,
  statusMessage,
  isError,
  isLoading,
  isLoadingMore,
  hasNextPage,
  onSearchChange,
  onGenreChange,
  onSearchSubmit,
  onLoadMore,
  onRetry,
  onOpenDetails,
}: CatalogSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <section id="catalog" className="catalog-section">
      <div className="section-head">
        <div>
          <h2>Explore the anime catalog</h2>
          <p>Search titles and find official services that list each show.</p>
        </div>
      </div>

      <form
        className="catalog-search"
        id="animeSearchForm"
        role="search"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="animeSearch">
          Search anime titles
        </label>
        <input
          id="animeSearch"
          name="search"
          type="search"
          placeholder="Search any anime..."
          autoComplete="off"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <label className="sr-only" htmlFor="genreSelect">
          Filter by genre
        </label>
        <select
          id="genreSelect"
          name="genre"
          value={genre}
          onChange={(event) => onGenreChange(event.target.value)}
        >
          <option value="">All genres</option>
          {ANIME_GENRES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      <div className="catalog-status-row">
        <p
          className={`catalog-status${isError ? ' error' : ''}`}
          id="catalogStatus"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
        {isError && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onRetry}
          >
            Try again
          </button>
        )}
      </div>

      <p className="provider-note">
        Nighter helps you discover anime; episodes play on licensed streaming
        services. Availability may vary by location and subscription.
      </p>

      <div
        className="cards catalog-results"
        id="animeResults"
        data-testid="catalog-results"
        aria-busy={isLoading}
      >
        {results.map((anime) => (
          <CatalogCard
            key={anime.id}
            anime={anime}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          className="btn btn-secondary load-more"
          id="loadMore"
          type="button"
          disabled={isLoadingMore}
          onClick={onLoadMore}
        >
          {isLoadingMore ? 'Loading...' : 'Load more anime'}
        </button>
      )}
    </section>
  );
}
