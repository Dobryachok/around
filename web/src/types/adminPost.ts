export type AdminRubricGroup = 'blog' | 'texts' | 'photo' | 'portfolio';

export type AdminPostRecord = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  bodyContent: string;
  content: string;
  date: string;
  dateIso: string;
  image?: string;
  galleryImages: string[];
  rubricSlug: string;
  rubricTitle: string;
  categoryId: number;
  tagSlugs?: string[];
  subtagSlugs?: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminPostDraft = {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  galleryImages: string[];
  rubricSlug: string;
  tagSlugs: string[];
  subtagSlugs: string[];
};

export type AdminPostsFile = {
  posts: AdminPostRecord[];
};
