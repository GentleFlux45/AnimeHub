import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimeDialog, type DialogMode } from './components/AnimeDialog';
import { CatalogSection } from './components/CatalogSection';
import { FeaturedSection } from './components/FeaturedSection';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { TrendingWatchlistSection } from './components/TrendingWatchlistSection';
import {
  fetchAnimeById,
  fetchAnimePage,
  parseWatchlistJson,
  THEME_STORAGE_KEY,
  toggleWatchlistItem,
  WATCHLIST_STORAGE_KEY,
  type AnimeMedia,
  type FeaturedAnime,
  type FeaturedCategory,
  type ThemeMode,
  type WatchlistItem,
} from './lib/anime';

function readInitialTheme(): ThemeMode {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function readInitialWatchlist(): { items: WatchlistItem[]; error: string | null } {
  try {
    return {
      items: parseWatchlistJson(localStorage.getItem(WATCHLIST_STORAGE_KEY)),
      error: null,
    };
  } catch {
    return {
      items: [],
      error: 'Your saved watchlist could not be read in this browser.',
    };
  }
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);
  const [watchlistState] = useState(readInitialWatchlist);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(watchlistState.items);

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [results, setResults] = useState<AnimeMedia[]>([]);
  const [trending, setTrending] = useState<AnimeMedia[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    watchlistState.error || 'Loading trending anime...',
  );
  const [isError, setIsError] = useState(Boolean(watchlistState.error));

  const [featuredFilter, setFeaturedFilter] = useState<FeaturedCategory>('all');
  const [dialogMode, setDialogMode] = useState<DialogMode>({ type: 'closed' });

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#111a28' : '#f7f8fb');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage may be restricted in private browsing contexts.
    }
  }, [theme]);

  const loadCatalogPage = useCallback(
    async (pageNumber: number, searchText: string, selectedGenre: string) => {
      const thisRequest = ++requestIdRef.current;
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const trimmedSearch = searchText.trim();
      const isSearch = trimmedSearch.length > 0;
      const isGenreFiltered = selectedGenre.trim().length > 0;

      if (pageNumber === 1) {
        setIsLoading(true);
        setIsError(false);
        setHasNextPage(false);
        setResults([]);
        setStatusMessage(
          isSearch ? `Searching for “${trimmedSearch}”...` : 'Loading trending anime...',
        );
      } else {
        setIsLoadingMore(true);
      }

      const timeoutId = window.setTimeout(() => controller.abort(), 15000);

      try {
        const data = await fetchAnimePage({
          page: pageNumber,
          search: trimmedSearch,
          genre: selectedGenre,
          signal: controller.signal,
        });

        if (thisRequest !== requestIdRef.current) return;

        setCurrentPage(pageNumber);
        setHasNextPage(data.hasNextPage);
        setIsError(false);
        setIsLoading(false);
        setIsLoadingMore(false);

        setResults((prev) =>
          pageNumber === 1 ? data.media : [...prev, ...data.media],
        );

        const totalShown =
          pageNumber === 1 ? data.media.length : results.length + data.media.length;

        if (pageNumber === 1 && data.media.length === 0) {
          setStatusMessage(
            'No anime matched that search. Try another title or genre.',
          );
        } else {
          const resultDescription = isSearch
            ? `${totalShown} results for “${trimmedSearch}”`
            : isGenreFiltered
              ? `Showing ${totalShown} ${selectedGenre} anime`
              : `Showing ${totalShown} trending anime`;
          setStatusMessage(
            `${resultDescription}${data.hasNextPage ? ' · more available' : ''}.`,
          );
        }

        if (!isSearch && !isGenreFiltered && pageNumber === 1) {
          setTrending(data.media.slice(0, 4));
        }
      } catch (error) {
        if (thisRequest !== requestIdRef.current) return;
        const isAbort =
          error instanceof DOMException && error.name === 'AbortError';

        setIsLoading(false);
        setIsLoadingMore(false);
        setIsError(true);
        setStatusMessage(
          isAbort
            ? 'The request timed out. Check your connection and try again.'
            : 'Could not load the anime catalog. Check your connection and try again.',
        );
      } finally {
        window.clearTimeout(timeoutId);
      }
    },
    [results.length],
  );

  // Initial load
  useEffect(() => {
    loadCatalogPage(1, '', '');
    return () => {
      abortControllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced live search on query changes after initial mount
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const timer = window.setTimeout(() => {
      loadCatalogPage(1, search, genre);
    }, 400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, genre]);

  const persistWatchlist = (nextList: WatchlistItem[]) => {
    setWatchlist(nextList);
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      setIsError(true);
      setStatusMessage('Could not save your watchlist in this browser.');
    }
  };

  const handleToggleWatchlist = (anime: AnimeMedia) => {
    const { nextList } = toggleWatchlistItem(watchlist, anime);
    persistWatchlist(nextList);
  };

  const handleRemoveWatchlistId = (id: number) => {
    persistWatchlist(watchlist.filter((item) => item.id !== id));
  };

  const handleSelectFeatured = async (item: FeaturedAnime) => {
    const fallbackMedia: AnimeMedia = {
      id:
        item.anilistId ??
        Math.abs(
          item.id.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7),
        ),
      title: { english: item.title },
      coverImage: { extraLarge: item.imageSrc, large: item.imageSrc },
      description: item.description,
      genres: [item.tag],
      format: 'TV',
    };

    setDialogMode({ type: 'details', anime: fallbackMedia });

    try {
      const matched = item.anilistId
        ? await fetchAnimeById(item.anilistId)
        : (
            await fetchAnimePage({
              page: 1,
              search: item.searchQuery,
              genre: '',
            })
          ).media[0];

      if (matched) {
        setDialogMode((prev) =>
          prev.type === 'details' ? { type: 'details', anime: matched } : prev,
        );
      }
    } catch {
      // Keep the curated details modal visible if offline.
    }
  };

  const handleInspectWatchlistItem = async (item: WatchlistItem) => {
    const fallbackMedia: AnimeMedia = {
      id: item.id,
      title: { english: item.title },
      coverImage: { large: item.cover, extraLarge: item.cover },
      siteUrl: item.siteUrl,
      genres: item.genres,
    };
    setDialogMode({ type: 'details', anime: fallbackMedia });

    try {
      const data = await fetchAnimePage({
        page: 1,
        search: item.title,
        genre: '',
      });
      const matched =
        data.media.find((entry) => entry.id === item.id) || data.media[0];
      if (matched) {
        setDialogMode({ type: 'details', anime: matched });
      }
    } catch {
      // Keep saved summary visible if offline.
    }
  };

  const handleBrowseCatalogGenre = (genreName: string) => {
    setSearch('');
    setGenre(genreName);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
        }
      />

      <main className="container" id="top">
        <HeroSection />

        <CatalogSection
          search={search}
          genre={genre}
          results={results}
          statusMessage={statusMessage}
          isError={isError}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onSearchChange={setSearch}
          onGenreChange={setGenre}
          onSearchSubmit={() => loadCatalogPage(1, search, genre)}
          onLoadMore={() => loadCatalogPage(currentPage + 1, search, genre)}
          onRetry={() => loadCatalogPage(1, search, genre)}
          onOpenDetails={(anime) => setDialogMode({ type: 'details', anime })}
        />

        <FeaturedSection
          activeFilter={featuredFilter}
          onFilterChange={setFeaturedFilter}
          onSelectFeatured={handleSelectFeatured}
          onBrowseCatalogGenre={handleBrowseCatalogGenre}
        />

        <TrendingWatchlistSection
          trending={trending}
          isLoadingTrending={isLoading}
          watchlistCount={watchlist.length}
          onSelectAnime={(anime) => setDialogMode({ type: 'details', anime })}
          onOpenWatchlist={() => setDialogMode({ type: 'watchlist' })}
        />

        <section className="cta" id="join">
          <div>
            <h2>Ready for your next binge?</h2>
            <p>
              Join thousands of anime fans discovering fresh stories every week.
            </p>
          </div>
          <a className="btn btn-primary" href="#catalog">
            Find anime to watch
          </a>
        </section>
      </main>

      <footer>
        <div className="container">
          © {new Date().getFullYear()} Nighter. Crafted for anime lovers.
        </div>
      </footer>

      <AnimeDialog
        mode={dialogMode}
        watchlist={watchlist}
        onClose={() => setDialogMode({ type: 'closed' })}
        onToggleWatchlist={handleToggleWatchlist}
        onRemoveWatchlistId={handleRemoveWatchlistId}
        onInspectWatchlistItem={handleInspectWatchlistItem}
      />
    </>
  );
}
