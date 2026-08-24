export type HomePinsFile = {
  title: string;
  categorySlug: string;
  pinnedSlugs: string[];
};

/** Legacy multi-block format from earlier admin UI. */
export type LegacyHomePinsFile = {
  sections: Array<{
    id?: string;
    title?: string;
    categorySlug?: string;
    featuredSlug?: string;
    listSlugs?: string[];
  }>;
};
