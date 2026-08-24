import { postsBySlug, type StoredPost } from './content';
import { getTagsForArea, postBelongsToArea, resolvePostTags } from './tags';
import type { ThemedPost } from '../types/themedPost';

export const TEXTS_TAGS = getTagsForArea('texts');

type TaggablePost = Pick<StoredPost, 'slug' | 'categoryIds' | 'tagSlugs' | 'subtagSlugs'>;

export function getTextThemeForPost(post: TaggablePost) {
  const primaryTag = resolvePostTags(post).tags.find((tag) => tag.area === 'texts');
  return primaryTag ? { slug: primaryTag.slug, title: primaryTag.title } : null;
}

export function isTextPost(post: TaggablePost) {
  return postBelongsToArea(post, 'texts');
}

export function getTextsPosts(): ThemedPost[] {
  const seen = new Set<string>();
  const posts: ThemedPost[] = [];

  for (const post of Object.values(postsBySlug)) {
    if (seen.has(post.slug)) {
      continue;
    }

    const taxonomy = resolvePostTags(post);
    const tags = taxonomy.tags.filter((tag) => tag.area === 'texts');
    if (tags.length === 0) {
      continue;
    }

    const tagSlugs = new Set(tags.map((tag) => tag.slug));

    seen.add(post.slug);
    posts.push({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      image: post.image,
      dateIso: post.dateIso,
      tags,
      subtags: taxonomy.subtags.filter((subtag) => tagSlugs.has(subtag.parentTagSlug)),
    });
  }

  return posts.sort(
    (left, right) => new Date(right.dateIso).getTime() - new Date(left.dateIso).getTime(),
  );
}
