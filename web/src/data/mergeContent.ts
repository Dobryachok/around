import adminGenerated from './generated/admin-posts.json';
import type { AdminPostsFile } from '../types/adminPost';
import type { Archive, ArchivePost, GeneratedContent, StoredPost } from './contentTypes';

const adminData = adminGenerated as AdminPostsFile;

function toArchivePost(post: StoredPost): ArchivePost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    image: post.image,
  };
}

export function mergeAdminContent(base: GeneratedContent): GeneratedContent {
  if (adminData.posts.length === 0) {
    return base;
  }

  const postsBySlug = { ...base.postsBySlug };
  const archives = Object.fromEntries(
    Object.entries(base.archives).map(([slug, archive]) => [
      slug,
      { ...archive, posts: [...archive.posts] },
    ]),
  ) as Record<string, Archive>;

  for (const adminPost of adminData.posts) {
    const storedPost: StoredPost = {
      id: adminPost.id,
      slug: adminPost.slug,
      title: adminPost.title,
      excerpt: adminPost.excerpt,
      content: adminPost.content,
      date: adminPost.date,
      dateIso: adminPost.dateIso,
      image: adminPost.image,
      categoryIds: [adminPost.categoryId],
      tagSlugs: adminPost.tagSlugs,
      subtagSlugs: adminPost.subtagSlugs,
    };

    postsBySlug[adminPost.slug] = storedPost;

    const archive = archives[adminPost.rubricSlug];
    if (!archive) {
      continue;
    }

    const archiveEntry = toArchivePost(storedPost);
    const existingIndex = archive.posts.findIndex((post) => post.slug === adminPost.slug);

    if (existingIndex >= 0) {
      archive.posts[existingIndex] = archiveEntry;
    } else {
      archive.posts.unshift(archiveEntry);
    }
  }

  return {
    ...base,
    postsBySlug,
    archives,
  };
}
