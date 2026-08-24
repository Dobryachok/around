import { postsBySlug, categories, type StoredPost } from './content';
import { getBlogThemeForPost } from './blog';
import { getPortfolioThemeForPost } from './portfolio';
import { getTextThemeForPost } from './texts';
import { PHOTO_CATEGORY_ID } from '../utils/photoTheme';

export type PickablePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateIso: string;
  image?: string;
  rubricTitle: string;
  categorySlug: string;
};

const categoryById = new Map(categories.map((category) => [category.id, category]));

function resolveRubric(post: StoredPost) {
  const { categoryIds } = post;
  const blog = getBlogThemeForPost(post);
  if (blog) {
    return { title: blog.title, slug: blog.slug };
  }

  const text = getTextThemeForPost(post);
  if (text) {
    return { title: text.title, slug: text.slug };
  }

  const portfolio = getPortfolioThemeForPost(categoryIds);
  if (portfolio && portfolio.slug !== 'dostizheniya') {
    return { title: portfolio.title, slug: portfolio.slug };
  }

  if (categoryIds.includes(PHOTO_CATEGORY_ID)) {
    return { title: 'Фотография', slug: 'photo' };
  }

  const primaryCategoryId = categoryIds.find((id) => categoryById.get(id)?.count);
  const category = primaryCategoryId ? categoryById.get(primaryCategoryId) : undefined;

  return category
    ? { title: category.name, slug: category.slug }
    : { title: 'Разное', slug: 'sobytiya' };
}

export function getPickablePosts(): PickablePost[] {
  return Object.values(postsBySlug)
    .map((post) => {
      const rubric = resolveRubric(post);

      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        dateIso: post.dateIso,
        image: post.image,
        rubricTitle: rubric.title,
        categorySlug: rubric.slug,
      };
    })
    .sort((left, right) => new Date(right.dateIso).getTime() - new Date(left.dateIso).getTime());
}
