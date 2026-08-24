import { postsBySlug, type StoredPost } from './content';
import { getTagsForArea, postBelongsToArea, resolvePostTags } from './tags';
import type { ThemedPost } from '../types/themedPost';

export type BlogPost = ThemedPost;

export const BLOG_TAGS = getTagsForArea('blog');

type TaggablePost = Pick<StoredPost, 'slug' | 'categoryIds' | 'tagSlugs' | 'subtagSlugs'>;

export function getBlogThemeForPost(post: TaggablePost) {
  const primaryTag = resolvePostTags(post).tags.find((tag) => tag.area === 'blog');
  return primaryTag ? { slug: primaryTag.slug, title: primaryTag.title } : null;
}

export function isBlogPost(post: TaggablePost) {
  return postBelongsToArea(post, 'blog');
}

export function getBlogPosts(): BlogPost[] {
  const seen = new Set<string>();
  const posts: BlogPost[] = [];

  for (const post of Object.values(postsBySlug)) {
    if (seen.has(post.slug)) {
      continue;
    }

    const taxonomy = resolvePostTags(post);
    const tags = taxonomy.tags.filter((tag) => tag.area === 'blog');
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
