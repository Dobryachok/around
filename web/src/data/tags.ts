import generatedTags from './generated/tags.json';
import generatedPostTags from './generated/post-tags.json';
import { categories } from './content';
import type { StoredPost } from './content';
import type {
  ContentSubtag,
  ContentTag,
  ContentTagsFile,
  PostTagAssignment,
  PostTagAssignmentsFile,
  TagArea,
} from '../types/contentTag';
import type { TagFilterOption } from '../types/themedPost';

const tagData = generatedTags as ContentTagsFile;
const postTagData = generatedPostTags as PostTagAssignmentsFile;
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

export const CONTENT_TAGS = tagData.tags;
export const CONTENT_SUBTAGS = tagData.subtags;

export function getTagsForArea(area: TagArea) {
  return CONTENT_TAGS.filter((tag) => tag.area === area);
}

export function getSubtagsForTag(tagSlug: string) {
  return CONTENT_SUBTAGS.filter((subtag) => subtag.parentTagSlug === tagSlug);
}

export function buildTagFilterOptions(
  tags: ContentTag[],
  subtags: ContentSubtag[],
): TagFilterOption[] {
  return tags.flatMap((tag) => [
    {
      slug: tag.slug,
      title: tag.title,
      kind: 'tag' as const,
      color: tag.color,
    },
    ...subtags
      .filter((subtag) => subtag.parentTagSlug === tag.slug)
      .map((subtag) => ({
      slug: subtag.slug,
      title: subtag.title,
      kind: 'subtag' as const,
      color: tag.color,
      parentTagSlug: tag.slug,
      })),
  ]);
}

export function getTagFilterOptions(area: TagArea): TagFilterOption[] {
  return buildTagFilterOptions(getTagsForArea(area), CONTENT_SUBTAGS);
}

export function getTag(slug: string) {
  return CONTENT_TAGS.find((tag) => tag.slug === slug) ?? null;
}

export function getSubtag(slug: string) {
  return CONTENT_SUBTAGS.find((subtag) => subtag.slug === slug) ?? null;
}

function inferLegacyTagSlugs(categoryIds: number[]) {
  return CONTENT_TAGS.filter((tag) => {
    if (!tag.legacyCategorySlug) {
      return false;
    }

    const category = categoryBySlug.get(tag.legacyCategorySlug);
    return category ? categoryIds.includes(category.id) : false;
  }).map((tag) => tag.slug);
}

export function resolvePostTagAssignment(
  post: Pick<StoredPost, 'slug' | 'categoryIds' | 'tagSlugs' | 'subtagSlugs'>,
): PostTagAssignment {
  const savedAssignment = postTagData.assignments[post.slug];
  const explicitTagSlugs = post.tagSlugs ?? savedAssignment?.tagSlugs;
  const explicitSubtagSlugs = post.subtagSlugs ?? savedAssignment?.subtagSlugs;
  const tagSlugs = explicitTagSlugs ?? inferLegacyTagSlugs(post.categoryIds);
  const validTagSlugs = tagSlugs.filter((slug) => Boolean(getTag(slug)));
  const validSubtagSlugs = (explicitSubtagSlugs ?? []).filter((slug) => {
    const subtag = getSubtag(slug);
    return subtag ? validTagSlugs.includes(subtag.parentTagSlug) : false;
  });

  return {
    tagSlugs: validTagSlugs,
    subtagSlugs: validSubtagSlugs,
  };
}

export function resolvePostTags(
  post: Pick<StoredPost, 'slug' | 'categoryIds' | 'tagSlugs' | 'subtagSlugs'>,
) {
  const assignment = resolvePostTagAssignment(post);

  return {
    tags: assignment.tagSlugs
      .map((slug) => getTag(slug))
      .filter((tag): tag is ContentTag => tag !== null),
    subtags: assignment.subtagSlugs
      .map((slug) => getSubtag(slug))
      .filter((subtag): subtag is ContentSubtag => subtag !== null),
  };
}

export function postBelongsToArea(
  post: Pick<StoredPost, 'slug' | 'categoryIds' | 'tagSlugs' | 'subtagSlugs'>,
  area: TagArea,
) {
  return resolvePostTags(post).tags.some((tag) => tag.area === area);
}
