import { formatAnimeScore, getAnimeTitle, type AnimeMedia } from '../lib/anime';

interface TrendingWatchlistSectionProps {
  trending: AnimeMedia[];
  isLoadingTrending: boolean;
  watchlistCount: number;
  onSelectAnime: (anime: AnimeMedia) => void;
  onOpenWatchlist: () => void;
}

export function TrendingWatchlistSection({
  trending,
  isLoadingTrending,
  watchlistCount,
  onSelectAnime,
  onOpenWatchlist,
}: TrendingWatchlistSectionProps) {
  return (
    <section id="trending">
      <div className="trend-list">
        <div className="panel">
          <h2>Trending Now</h2>
          <ul id="trendingList">
            {trending.length > 0 ? (
              trending.slice(0, 4).map((anime, index) => (
                <li key={anime.id}>
                  <span className="rank">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <button
                    className="name trending-link"
                    type="button"
                    onClick={() => onSelectAnime(anime)}
                  >
                    {getAnimeTitle(anime)}
                  </button>
                  <span className="delta">
                    {formatAnimeScore(anime) || anime.seasonYear || ''}
                  </span>
                </li>
              ))
            ) : (
              <li>
                <span className="name">
                  {isLoadingTrending
                    ? 'Loading trending anime...'
                    : 'Trending rankings will appear once catalog loads.'}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="panel">
          <h2>Watchlist</h2>
          <p className="note">Save your favorites and come back anytime.</p>
          <div className="hero-actions watchlist-actions">
            <button
              className="btn btn-primary"
              id="openWatchlist"
              type="button"
              onClick={onOpenWatchlist}
            >
              View Watchlist
            </button>
            <span className="watch-count" id="watchCount" data-testid="watch-count">
              {watchlistCount} saved
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
