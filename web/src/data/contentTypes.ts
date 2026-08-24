export type ArchivePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
};

export type Archive = {
  title: string;
  slug: string;
  posts: ArchivePost[];
};

export type StoredPost = ArchivePost & {
  id: number;
  content: string;
  dateIso: string;
  categoryIds: number[];
  tagSlugs?: string[];
  subtagSlugs?: string[];
};

export type StoredPage = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  count: number;
};

export type GeneratedContent = {
  generatedAt: string;
  categories: Category[];
  archives: Record<string, Archive>;
  postsBySlug: Record<string, StoredPost>;
  pages: Record<string, StoredPage>;
};
