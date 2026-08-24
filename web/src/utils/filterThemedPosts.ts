import type { ThemedPost } from '../types/themedPost';

export function filterThemedPosts(
  posts: ThemedPost[],
  query: string,
  selectedFilters: string[],
): ThemedPost[] {
  let result = posts;

  if (selectedFilters.length > 0) {
    result = result.filter((post) => {
      const postFilters = [
        ...post.tags.map((tag) => `tag:${tag.slug}`),
        ...post.subtags.map((subtag) => `subtag:${subtag.slug}`),
      ];

      return selectedFilters.some((filter) => postFilters.includes(filter));
    });
  }

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return result;
  }

  return result.filter((post) => {
    const haystack = [
      post.title,
      post.excerpt,
      post.slug,
      post.date,
      ...post.tags.map((tag) => tag.title),
      ...post.subtags.map((subtag) => subtag.title),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
