import generated from './generated/content.json';
import { mergeAdminContent } from './mergeContent';
import { decodeRouteParam } from './routes';
import type {
  Archive,
  ArchivePost,
  Category,
  GeneratedContent,
  StoredPage,
  StoredPost,
} from './contentTypes';

export type { Archive, ArchivePost, Category, StoredPage, StoredPost };

const content = mergeAdminContent(generated as GeneratedContent);

export function cleanText(text: string) {
  return text
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&#171;/g, '«')
    .replace(/&#187;/g, '»')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

export function getArchive(slug: string) {
  const key = decodeRouteParam(slug);
  return content.archives[key] ?? null;
}

export function getPost(slug: string) {
  const key = decodeRouteParam(slug);
  return content.postsBySlug[key] ?? null;
}

export function getPage(slug: string) {
  const key = decodeRouteParam(slug);
  return content.pages[key] ?? null;
}

export const archives = content.archives;
export const postsBySlug = content.postsBySlug;
export const categories = content.categories;
