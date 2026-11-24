import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterFeaturedAnime,
  formatAnimeScore,
  formatAnimeSubtitle,
  getAnimeDescription,
  getAnimeTitle,
  getStreamingLinks,
  parseWatchlistJson,
  safeExternalUrl,
  toggleWatchlistItem,
  type AnimeMedia,
  type FeaturedAnime,
} from './anime';

test('getAnimeTitle prefers English, falls back to Romaji, then Untitled anime', () => {
  assert.equal(
    getAnimeTitle({ title: { english: 'Frieren', romaji: 'Sousou no Frieren' } }),
    'Frieren',
  );
  assert.equal(
    getAnimeTitle({ title: { english: null, romaji: 'Sousou no Frieren' } }),
    'Sousou no Frieren',
  );
  assert.equal(getAnimeTitle({ title: {} }), 'Untitled anime');
});

test('getAnimeDescription strips HTML tags and normalizes whitespace', () => {
  assert.equal(
    getAnimeDescription({
      description: '  A <i>serene</i>   journey<br>through   time. ',
    }),
    'A serene journey through time.',
  );
  assert.equal(getAnimeDescription({ description: '   ' }), 'No synopsis is available yet.');
});

test('safeExternalUrl accepts only https URLs', () => {
  assert.equal(safeExternalUrl('https://www.crunchyroll.com/series/123'), 'https://www.crunchyroll.com/series/123');
  assert.equal(safeExternalUrl('http://www.crunchyroll.com/series/123'), null);
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('not-a-url'), null);
});

test('getStreamingLinks filters to trusted HTTPS streaming providers and respects limit', () => {
  const anime: Pick<AnimeMedia, 'externalLinks'> = {
    externalLinks: [
      { site: 'Official Site', url: 'https://example.com', type: 'INFO' },
      { site: 'Untrusted', url: 'https://malicious.example.org/watch', type: 'STREAMING' },
      { site: 'Crunchyroll', url: 'http://www.crunchyroll.com/show', type: 'STREAMING' },
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/show', type: 'STREAMING' },
      { site: 'Netflix', url: 'https://www.netflix.com/title/1', type: 'STREAMING' },
      { site: 'Hulu', url: 'https://www.hulu.com/series/2', type: 'STREAMING' },
      { site: 'HIDIVE', url: 'https://www.hidive.com/tv/3', type: 'STREAMING' },
    ],
  };

  const links = getStreamingLinks(anime, 3);
  assert.equal(links.length, 3);
  assert.deepEqual(
    links.map((item) => item.site),
    ['Crunchyroll', 'Netflix', 'Hulu'],
  );
});

test('formatAnimeScore and formatAnimeSubtitle format scores cleanly', () => {
  assert.equal(formatAnimeScore({ averageScore: 91, status: 'RELEASING', format: 'TV' }), '★ 9.1');
  assert.equal(formatAnimeScore({ averageScore: null, status: 'RELEASING', format: 'TV' }), 'RELEASING');

  assert.equal(
    formatAnimeSubtitle({
      id: 1,
      title: { native: '葬送のフリーレン' },
      seasonYear: 2023,
      format: 'TV',
      episodes: 28,
      averageScore: 93,
    }),
    '葬送のフリーレン · 2023 · TV · 28 episodes · ★ 9.3',
  );
});

test('toggleWatchlistItem adds and removes entries immutably', () => {
  const sample: AnimeMedia = {
    id: 42,
    title: { english: 'Spy x Family' },
    coverImage: { large: 'https://s4.anilist.co/cover.jpg' },
    siteUrl: 'https://anilist.co/anime/42',
    genres: ['Action', 'Comedy'],
  };

  const first = toggleWatchlistItem([], sample);
  assert.equal(first.added, true);
  assert.equal(first.nextList.length, 1);
  assert.equal(first.nextList[0].title, 'Spy x Family');

  const second = toggleWatchlistItem(first.nextList, sample);
  assert.equal(second.added, false);
  assert.equal(second.nextList.length, 0);
});

test('parseWatchlistJson handles empty, valid, and corrupt payloads', () => {
  assert.deepEqual(parseWatchlistJson(null), []);
  assert.deepEqual(
    parseWatchlistJson('[{"id":1,"title":"Bleach","cover":"","genres":[]}]'),
    [{ id: 1, title: 'Bleach', cover: '', genres: [] }],
  );
  assert.throws(() => parseWatchlistJson('{"invalid":true}'));
});

test('filterFeaturedAnime filters by category and preserves all on "all"', () => {
  const sample: FeaturedAnime[] = [
    {
      id: '1',
      category: 'action',
      title: 'Jujutsu Kaisen S3',
      searchQuery: 'Jujutsu Kaisen',
      badge: 'EP 12',
      description: 'Desc',
      tag: 'Action',
      formatLabel: 'TV series',
      imageSrc: '/a.jpg',
      imageAlt: 'A',
    },
    {
      id: '2',
      category: 'fantasy',
      title: 'Frieren',
      searchQuery: 'Frieren',
      badge: 'S2',
      description: 'Desc',
      tag: 'Fantasy',
      formatLabel: 'TV series',
      imageSrc: '/b.jpg',
      imageAlt: 'B',
    },
  ];

  assert.equal(filterFeaturedAnime(sample, 'all').length, 2);
  assert.deepEqual(
    filterFeaturedAnime(sample, 'fantasy').map((item) => item.id),
    ['2'],
  );
});
