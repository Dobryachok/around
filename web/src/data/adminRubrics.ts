import { categories } from './content';
import { getTag } from './tags';

export type AdminRubric = {
  slug: string;
  title: string;
  group: 'blog' | 'texts' | 'photo' | 'portfolio';
  groupTitle: string;
  categoryId: number;
};

const RUBRIC_DEFINITIONS = [
  { slug: 'blog', categorySlug: 'puteshestviya', title: 'Блог', group: 'blog', groupTitle: 'Блог' },
  { slug: 'texts', categorySlug: 'proza', title: 'Тексты', group: 'texts', groupTitle: 'Тексты' },
  { slug: 'photo', categorySlug: 'photo', title: 'Фотография', group: 'photo', groupTitle: 'Фотографии' },
  { slug: 'interview', categorySlug: 'interview', title: 'Интервью', group: 'portfolio', groupTitle: 'Портфолио' },
  { slug: 'publikacii', categorySlug: 'publikacii', title: 'Публикации', group: 'portfolio', groupTitle: 'Портфолио' },
  { slug: 'dostizheniya', categorySlug: 'dostizheniya', title: 'Достижения', group: 'portfolio', groupTitle: 'Портфолио' },
] as const;

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

export const ADMIN_RUBRICS: AdminRubric[] = RUBRIC_DEFINITIONS.flatMap((rubric) => {
  const category = categoryBySlug.get(rubric.categorySlug);
  if (!category) {
    return [];
  }

  return [
    {
      slug: rubric.slug,
      title: rubric.title,
      group: rubric.group,
      groupTitle: rubric.groupTitle,
      categoryId: category.id,
    },
  ];
});

export function getAdminRubric(slug: string) {
  const directRubric = ADMIN_RUBRICS.find((rubric) => rubric.slug === slug);
  if (directRubric) {
    return directRubric;
  }

  const legacyTag = getTag(slug);
  return legacyTag
    ? ADMIN_RUBRICS.find((rubric) => rubric.slug === legacyTag.area) ?? null
    : null;
}

export const ADMIN_RUBRIC_GROUPS = [
  { id: 'blog', title: 'Блог' },
  { id: 'texts', title: 'Тексты' },
  { id: 'photo', title: 'Фотографии' },
  { id: 'portfolio', title: 'Портфолио' },
] as const;
