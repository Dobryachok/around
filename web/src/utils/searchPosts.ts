type SearchablePost = {
  title: string;
  excerpt?: string;
  slug: string;
  date?: string;
};

export function filterPostsByQuery<T extends SearchablePost>(posts: T[], query: string): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return posts;
  }

  return posts.filter((post) => {
    const haystack = [post.title, post.excerpt, post.slug, post.date]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
