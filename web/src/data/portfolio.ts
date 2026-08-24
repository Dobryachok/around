import { archives, categories, getPage, postsBySlug, type ArchivePost } from './content';
import adminGenerated from './generated/admin-posts.json';
import type { AdminPostsFile } from '../types/adminPost';
import type { AchievementItem } from '../utils/parseAchievements';
import { parseAchievementItems } from '../utils/parseAchievements';
import type { BookItem } from '../utils/parseLearnMore';
import { parseLearnMoreBlocks } from '../utils/parseLearnMore';
import { cleanText } from './content';

export const PORTFOLIO_SECTIONS = [
  { id: 'interview', slug: 'interview', title: 'Интервью' },
  { id: 'publikacii', slug: 'publikacii', title: 'Публикации' },
  { id: 'books', slug: 'книги', title: 'Книги' },
  { id: 'dostizheniya', slug: 'dostizheniya', title: 'Достижения' },
] as const;

export type PortfolioSectionId = (typeof PORTFOLIO_SECTIONS)[number]['id'];

export const DEFAULT_PORTFOLIO_SECTION: PortfolioSectionId = 'interview';

export const PORTFOLIO_POST_SLUGS = ['interview', 'publikacii', 'dostizheniya'] as const;

export type PortfolioPost = ArchivePost & {
  id: number;
  sectionSlug: string;
  sectionTitle: string;
  dateIso: string;
};

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

export function getPortfolioThemeForPost(categoryIds: number[]) {
  for (const slug of PORTFOLIO_POST_SLUGS) {
    const category = categoryBySlug.get(slug);
    if (category && categoryIds.includes(category.id)) {
      const section = PORTFOLIO_SECTIONS.find((item) => item.slug === slug);
      return section ? { slug: section.slug, title: section.title } : null;
    }
  }

  return null;
}

export function isPortfolioPost(post: { categoryIds: number[] }) {
  return getPortfolioThemeForPost(post.categoryIds) !== null;
}

function enrichPost(post: ArchivePost, sectionSlug: string, sectionTitle: string): PortfolioPost {
  const stored = postsBySlug[post.slug];

  return {
    ...post,
    id: stored?.id ?? 0,
    sectionSlug,
    sectionTitle,
    dateIso: stored?.dateIso ?? '',
  };
}

export function getPortfolioPosts(sectionSlug: string): PortfolioPost[] {
  const archive = archives[sectionSlug];
  if (!archive) {
    return [];
  }

  const section = PORTFOLIO_SECTIONS.find((item) => item.slug === sectionSlug);

  return archive.posts
    .map((post) => enrichPost(post, sectionSlug, section?.title ?? archive.title))
    .sort((left, right) => new Date(right.dateIso).getTime() - new Date(left.dateIso).getTime());
}

export function getPortfolioBooks(): BookItem[] {
  const page = getPage('книги');
  if (!page) {
    return [];
  }

  return parseLearnMoreBlocks(page.content);
}

export function getPortfolioAchievements(): AchievementItem[] {
  const posts = getPortfolioPosts('dostizheniya');
  const wpContent = posts
    .filter((post) => post.id > 0)
    .map((post) => postsBySlug[post.slug]?.content ?? '')
    .join('\n');

  const adminData = adminGenerated as AdminPostsFile;
  const wpItems = parseAchievementItems(wpContent);
  const adminItems: AchievementItem[] = adminData.posts
    .filter((post) => post.rubricSlug === 'dostizheniya')
    .map((post) => ({
      text: cleanText(
        (post.bodyContent ?? post.excerpt)
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
      ),
      image: post.image,
    }))
    .filter((item) => item.text || item.image);

  return [...adminItems, ...wpItems];
}
