import type { ArchivePost } from '../data/content';
import type { ContentSubtag, ContentTag } from './contentTag';

export type TagFilterOption = {
  slug: string;
  title: string;
  kind: 'tag' | 'subtag';
  color: string;
  parentTagSlug?: string;
};

export type ThemedPost = ArchivePost & {
  tags: ContentTag[];
  subtags: ContentSubtag[];
  dateIso: string;
};
