export type TagArea = 'blog' | 'texts';

export type ContentTag = {
  slug: string;
  title: string;
  area: TagArea;
  color: string;
  legacyCategorySlug?: string;
};

export type ContentSubtag = {
  slug: string;
  title: string;
  parentTagSlug: string;
};

export type ContentTagsFile = {
  tags: ContentTag[];
  subtags: ContentSubtag[];
};

export type PostTagAssignment = {
  tagSlugs: string[];
  subtagSlugs: string[];
};

export type PostTagAssignmentsFile = {
  assignments: Record<string, PostTagAssignment>;
};
