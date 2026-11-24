import heroSpotlightFallback from '../assets/images/hero_anime_spotlight_1795522225791.jpg';
import jujutsuFallback from '../assets/images/featured_jujutsu_sorcerer_1795522227245.jpg';
import mushokuFallback from '../assets/images/featured_mushoku_adventure_1795522227107.jpg';
import classroomFallback from '../assets/images/featured_elite_academy_1795522227978.jpg';
import spyFamilyFallback from '../assets/images/featured_spy_family_1795522228400.jpg';
import bleachFallback from '../assets/images/featured_bleach_soul_1795522228078.jpg';
import frierenFallback from '../assets/images/featured_frieren_journey_1795522229627.jpg';
import type { FeaturedAnime } from '../lib/anime';

export const HERO_SPOTLIGHT_IMAGE =
  'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx813-ZhnFNOeCU5dQ.png';
export const HERO_SPOTLIGHT_FALLBACK = heroSpotlightFallback;

export const FEATURED_ANIME: FeaturedAnime[] = [
  {
    id: 'jujutsu-kaisen-s3',
    anilistId: 172463,
    category: 'action',
    title: 'Jujutsu Kaisen S3',
    searchQuery: 'JUJUTSU KAISEN Season 3: The Culling Game Part 1',
    badge: 'EP 12',
    description:
      'The Culling Game spreads across ten colonies as Itadori and Choso hunt cursed spirits unleashed on Japan.',
    tag: 'Action',
    formatLabel: 'TV series',
    imageSrc:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx172463-LnXqHzt74SJL.jpg',
    fallbackImageSrc: jujutsuFallback,
    imageAlt: 'Jujutsu Kaisen Season 3 cover artwork',
  },
  {
    id: 'mushoku-tensei-s3',
    anilistId: 178789,
    category: 'fantasy',
    title: 'Mushoku Tensei S3',
    searchQuery: 'Mushoku Tensei: Jobless Reincarnation Season 3',
    badge: 'S3',
    description:
      "Rudeus' journey through his second life continues, with old bonds tested and new threats on the horizon.",
    tag: 'Fantasy',
    formatLabel: 'TV series',
    imageSrc:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx178789-hNXjKFzUq7mk.jpg',
    fallbackImageSrc: mushokuFallback,
    imageAlt: 'Mushoku Tensei Season 3 cover artwork',
  },
  {
    id: 'classroom-of-the-elite-s4',
    anilistId: 180745,
    category: 'thriller',
    title: 'Classroom Of The Elite S4',
    searchQuery: 'Classroom of the Elite 4th Season',
    badge: 'S4',
    description:
      'The story follows Kiyotaka Ayanokoji, a quiet Class D student who hides his genius while using strategy and mind games to help his class climb to the top.',
    tag: 'Psychological Thriller',
    formatLabel: 'TV series',
    imageSrc:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx180745-OEZaBeEdWozn.png',
    fallbackImageSrc: classroomFallback,
    imageAlt: 'Classroom of the Elite Season 4 cover artwork',
  },
  {
    id: 'spy-x-family',
    anilistId: 177937,
    category: 'comedy',
    title: 'SPY x FAMILY',
    searchQuery: 'SPY x FAMILY Season 3',
    badge: 'S3',
    description:
      'Spy Twilight builds a pretend family for a mission, unaware his daughter can read minds and his wife is a skilled assassin.',
    tag: 'Comedy',
    formatLabel: 'TV series',
    imageSrc:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx177937-Tzgg6rAdhCoH.jpg',
    fallbackImageSrc: spyFamilyFallback,
    imageAlt: 'Spy x Family cover artwork',
  },
  {
    id: 'bleach-tybw',
    anilistId: 169755,
    category: 'action',
    title: 'Bleach: Thousand-Year Blood War',
    searchQuery: 'BLEACH: Thousand-Year Blood War - The Conflict',
    badge: 'COUR 3',
    description:
      "The final arc of the Thousand-Year Blood War as Ichigo and the Soul Reapers face the war's last great threat.",
    tag: 'Action',
    formatLabel: 'TV series',
    imageSrc:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx169755-Rqb7MjnzdTc6.jpg',
    fallbackImageSrc: bleachFallback,
    imageAlt: 'Bleach: Thousand-Year Blood War cover artwork',
  },
  {
    id: 'frieren-s2',
    anilistId: 182255,
    category: 'fantasy',
    title: "Frieren: Beyond Journey's End",
    searchQuery: "Frieren: Beyond Journey's End Season 2",
    badge: 'S2',
    description:
      'The elf mage Frieren continues her slow, quiet journey to understand the humans she outlived.',
    tag: 'Fantasy',
    formatLabel: 'TV series',
    imageSrc:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx182255-butzrqd4I0aC.jpg',
    fallbackImageSrc: frierenFallback,
    imageAlt: "Frieren: Beyond Journey's End Season 2 cover artwork",
  },
];
