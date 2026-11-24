export type ThemeMode = 'light' | 'dark';

export type FeaturedCategory =
  | 'all'
  | 'action'
  | 'fantasy'
  | 'romance'
  | 'comedy'
  | 'thriller';

export interface ExternalLink {
  site: string;
  url: string;
  type?: string;
}

export interface SafeStreamingLink extends ExternalLink {
  safeUrl: string;
}

export interface AnimeTitle {
  english?: string | null;
  romaji?: string | null;
  native?: string | null;
}

export interface AnimeCoverImage {
  large?: string | null;
  extraLarge?: string | null;
}

export interface AnimeMedia {
  id: number;
  title?: AnimeTitle | null;
  coverImage?: AnimeCoverImage | null;
  description?: string | null;
  genres?: string[] | null;
  format?: string | null;
  seasonYear?: number | null;
  status?: string | null;
  episodes?: number | null;
  averageScore?: number | null;
  siteUrl?: string | null;
  externalLinks?: ExternalLink[] | null;
}

export interface WatchlistItem {
  id: number;
  title: string;
  cover: string;
  siteUrl?: string | null;
  genres: string[];
}

export interface FeaturedAnime {
  id: string;
  anilistId?: number;
  category: Exclude<FeaturedCategory, 'all'>;
  title: string;
  searchQuery: string;
  badge: string;
  description: string;
  tag: string;
  formatLabel: string;
  imageSrc: string;
  fallbackImageSrc?: string;
  imageAlt: string;
}

export const THEME_STORAGE_KEY = 'nighter-theme-v1';
export const WATCHLIST_STORAGE_KEY = 'nighter-watchlist-v1';
export const PAGE_SIZE = 24;

export const ANIME_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
] as const;

export const FEATURED_FILTERS: ReadonlyArray<{
  id: FeaturedCategory;
  label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'action', label: 'Action' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'romance', label: 'Romance' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'thriller', label: 'Thriller' },
];

export const TRUSTED_STREAMING_DOMAINS = [
  'crunchyroll.com',
  'hulu.com',
  'netflix.com',
  'disneyplus.com',
  'hidive.com',
  'primevideo.com',
  'amazon.com',
  'bilibili.tv',
  'bilibili.com',
  'tubi.tv',
  'iq.com',
] as const;

export const ANIME_SEARCH_QUERY = `
  query SearchAnime($page: Int, $perPage: Int, $search: String, $genres: [String]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: ANIME, sort: SEARCH_MATCH, search: $search, genre_in: $genres, isAdult: false) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
          extraLarge
        }
        description(asHtml: false)
        genres
        format
        seasonYear
        status
        episodes
        averageScore
        siteUrl
        externalLinks {
          site
          url
          type
        }
      }
    }
  }
`;

export const ANIME_TRENDING_QUERY = `
  query TrendingAnime($page: Int, $perPage: Int, $genres: [String]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: ANIME, sort: TRENDING_DESC, genre_in: $genres, isAdult: false) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
          extraLarge
        }
        description(asHtml: false)
        genres
        format
        seasonYear
        status
        episodes
        averageScore
        siteUrl
        externalLinks {
          site
          url
          type
        }
      }
    }
  }
`;

export function getAnimeTitle(anime: Pick<AnimeMedia, 'title'>): string {
  return anime.title?.english || anime.title?.romaji || 'Untitled anime';
}

export function getAnimeDescription(anime: Pick<AnimeMedia, 'description'>): string {
  const cleaned = (anime.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || 'No synopsis is available yet.';
}

export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

export function getStreamingLinks(
  anime: Pick<AnimeMedia, 'externalLinks'>,
  limit = 3,
): SafeStreamingLink[] {
  const seenSites = new Set<string>();
  const results: SafeStreamingLink[] = [];

  for (const link of anime.externalLinks || []) {
    if (link.type !== 'STREAMING') continue;
    const safeUrl = safeExternalUrl(link.url);
    if (!safeUrl) continue;

    const hostname = new URL(safeUrl).hostname.toLowerCase();
    const isTrusted = TRUSTED_STREAMING_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
    if (!isTrusted) continue;

    const dedupeKey = `${link.site.toLowerCase()}:${hostname}`;
    if (seenSites.has(dedupeKey)) continue;
    seenSites.add(dedupeKey);

    results.push({ ...link, safeUrl });
    if (results.length >= limit) break;
  }

  return results;
}

export function formatAnimeScore(anime: Pick<AnimeMedia, 'averageScore' | 'status' | 'format'>): string {
  if (typeof anime.averageScore === 'number' && anime.averageScore > 0) {
    return `★ ${(anime.averageScore / 10).toFixed(1)}`;
  }
  return anime.status || anime.format || '';
}

export function formatAnimeSubtitle(anime: AnimeMedia): string {
  return [
    anime.title?.native,
    anime.seasonYear,
    anime.format,
    anime.episodes ? `${anime.episodes} episodes` : '',
    typeof anime.averageScore === 'number' && anime.averageScore > 0
      ? `★ ${(anime.averageScore / 10).toFixed(1)}`
      : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

export function parseWatchlistJson(raw: string | null): WatchlistItem[] {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('Saved watchlist data is not an array.');
  }
  return parsed.filter(
    (entry): entry is WatchlistItem =>
      Boolean(entry) &&
      typeof entry === 'object' &&
      typeof (entry as WatchlistItem).id === 'number' &&
      typeof (entry as WatchlistItem).title === 'string',
  );
}

export function toggleWatchlistItem(
  list: ReadonlyArray<WatchlistItem>,
  anime: AnimeMedia,
): { nextList: WatchlistItem[]; added: boolean } {
  const exists = list.some((item) => item.id === anime.id);
  if (exists) {
    return {
      nextList: list.filter((item) => item.id !== anime.id),
      added: false,
    };
  }
  const newItem: WatchlistItem = {
    id: anime.id,
    title: getAnimeTitle(anime),
    cover: anime.coverImage?.large || anime.coverImage?.extraLarge || '',
    siteUrl: anime.siteUrl ?? null,
    genres: anime.genres ? [...anime.genres] : [],
  };
  return {
    nextList: [...list, newItem],
    added: true,
  };
}

export function filterFeaturedAnime(
  items: ReadonlyArray<FeaturedAnime>,
  category: FeaturedCategory,
): FeaturedAnime[] {
  if (category === 'all') return [...items];
  return items.filter((item) => item.category === category);
}

export interface FetchAnimePageParams {
  page: number;
  search: string;
  genre: string;
  signal?: AbortSignal;
}

export interface FetchAnimePageResult {
  media: AnimeMedia[];
  hasNextPage: boolean;
  currentPage: number;
}

export async function fetchAnimePage({
  page,
  search,
  genre,
  signal,
}: FetchAnimePageParams): Promise<FetchAnimePageResult> {
  const trimmedSearch = search.trim();
  const isSearch = trimmedSearch.length > 0;
  const hasGenre = genre.trim().length > 0;
  const variables: Record<string, unknown> = {
    page,
    perPage: PAGE_SIZE,
  };
  if (isSearch) variables.search = trimmedSearch;
  if (hasGenre) variables.genres = [genre.trim()];

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: isSearch || hasGenre ? ANIME_SEARCH_QUERY : ANIME_TRENDING_QUERY,
      variables,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Anime catalog request failed (${response.status}).`);
  }

  const payload = (await response.json()) as {
    errors?: Array<{ message: string }>;
    data?: {
      Page?: {
        pageInfo?: { currentPage?: number; hasNextPage?: boolean };
        media?: AnimeMedia[];
      };
    };
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(' '));
  }

  const media = payload.data?.Page?.media;
  if (!Array.isArray(media)) {
    throw new Error('The anime catalog returned an unexpected response.');
  }

  return {
    media,
    hasNextPage: Boolean(payload.data?.Page?.pageInfo?.hasNextPage),
    currentPage: payload.data?.Page?.pageInfo?.currentPage ?? page,
  };
}

export const ANIME_BY_ID_QUERY = `
  query AnimeById($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        english
        romaji
        native
      }
      coverImage {
        large
        extraLarge
      }
      description(asHtml: false)
      genres
      format
      seasonYear
      status
      episodes
      averageScore
      siteUrl
      externalLinks {
        site
        url
        type
      }
    }
  }
`;

export async function fetchAnimeById(
  id: number,
  signal?: AbortSignal,
): Promise<AnimeMedia | null> {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: ANIME_BY_ID_QUERY,
      variables: { id },
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Anime detail request failed (${response.status}).`);
  }

  const payload = (await response.json()) as {
    data?: { Media?: AnimeMedia | null };
  };

  return payload.data?.Media ?? null;
}
