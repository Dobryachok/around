import homePins from './generated/home-pins.json';
import { cleanText, postsBySlug } from './content';
import { postPath } from './routes';
import type { HomePinsFile, LegacyHomePinsFile } from '../types/homePins';
import type { Post } from '../types';

export type PinnedThemesBlock = {
  title: string;
  themes: Post[];
};

function toTheme(slug: string): Post | null {
  const post = postsBySlug[slug];
  if (!post) {
    return null;
  }

  return {
    title: post.title,
    excerpt: cleanText(post.excerpt),
    url: postPath(post.slug),
    date: post.date,
    image: post.image,
  };
}

export function normalizeHomePins(raw: unknown): HomePinsFile {
  if (raw && typeof raw === 'object' && Array.isArray((raw as HomePinsFile).pinnedSlugs)) {
    const data = raw as HomePinsFile;
    return {
      title: data.title?.trim() || 'Закреплённые темы',
      categorySlug: data.categorySlug?.trim() || 'puteshestviya',
      pinnedSlugs: data.pinnedSlugs.filter((slug): slug is string => typeof slug === 'string' && slug.length > 0),
    };
  }

  const sections = (raw as LegacyHomePinsFile | null)?.sections ?? [];
  const pinnedSlugs: string[] = [];

  for (const section of sections) {
    if (section.featuredSlug && !pinnedSlugs.includes(section.featuredSlug)) {
      pinnedSlugs.push(section.featuredSlug);
    }
    for (const slug of section.listSlugs ?? []) {
      if (slug && !pinnedSlugs.includes(slug)) {
        pinnedSlugs.push(slug);
      }
    }
  }

  return {
    title: sections[0]?.title?.trim() || 'Закреплённые темы',
    categorySlug: sections[0]?.categorySlug?.trim() || 'puteshestviya',
    pinnedSlugs,
  };
}

const pins = normalizeHomePins(homePins);

export function getPinnedThemesBlock(): PinnedThemesBlock | null {
  const themes = pins.pinnedSlugs
    .map((slug) => toTheme(slug))
    .filter((theme): theme is Post => theme !== null);

  if (themes.length === 0) {
    return null;
  }

  return {
    title: pins.title,
    themes,
  };
}
