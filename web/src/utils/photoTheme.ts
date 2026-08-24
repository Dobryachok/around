import { getArchive, type StoredPost } from '../data/content';

export const PHOTO_CATEGORY_ID = 242;

export function isPhotoThemePost(post: StoredPost): boolean {
  if (!post.categoryIds.includes(PHOTO_CATEGORY_ID)) {
    return false;
  }

  const photoArchive = getArchive('photo');
  return photoArchive?.posts.some((item) => item.slug === post.slug) ?? false;
}

export {
  extractGalleryImages,
  extractThemeIntro,
  formatArticleIntro,
  formatPoeticIntro,
} from './themeContent';

// Backward-compatible aliases used by photo theme article.
export { extractThemeIntro as extractPhotoThemeIntro, formatPoeticIntro as formatPhotoThemeIntro } from './themeContent';
