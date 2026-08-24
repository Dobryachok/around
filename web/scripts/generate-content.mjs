import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../src/data/generated');
const API = 'https://aroundmyself.ru/wp-json/wp/v2';

const NAV_CATEGORY_SLUGS = [
  'poetry',
  'proza',
  'photo',
  'puteshestviya',
  'interview',
  'publikacii',
  'pticy',
  'priroda',
  'sobytiya',
  'o-knigah',
  'thinks',
  'estonia',
];

function stripHtml(html = '') {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeTitle(title = '') {
  return stripHtml(title);
}

function formatDate(dateStr) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

async function fetchAll(url) {
  const items = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}page=${page}&per_page=100`);
    if (!response.ok) break;

    totalPages = Number(response.headers.get('x-wp-totalpages') || 1);
    const batch = await response.json();
    items.push(...batch);
    page += 1;
  }

  return items;
}

function mapPost(post) {
  const featured = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  return {
    id: post.id,
    slug: decodeURIComponent(post.slug),
    title: decodeTitle(post.title?.rendered),
    excerpt: stripHtml(post.excerpt?.rendered),
    content: post.content?.rendered ?? '',
    date: formatDate(post.date),
    dateIso: post.date,
    image: featured,
    categoryIds: post.categories ?? [],
  };
}

async function main() {
  mkdirSync(outDir, { recursive: true });

  console.log('Fetching categories…');
  const categoriesRaw = await fetchAll(`${API}/categories`);
  const categories = categoriesRaw
    .filter((c) => c.count > 0)
    .map((c) => ({
      id: c.id,
      slug: decodeURIComponent(c.slug),
      name: decodeTitle(c.name),
      count: c.count,
    }));

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  console.log('Fetching pages…');
  const pagesRaw = await fetchAll(`${API}/pages`);
  const pages = pagesRaw.map((page) => ({
    slug: decodeURIComponent(page.slug),
    title: decodeTitle(page.title?.rendered),
    excerpt: stripHtml(page.excerpt?.rendered),
    content: page.content?.rendered ?? '',
  }));

  console.log('Fetching posts…');
  const postsRaw = await fetchAll(`${API}/posts?_embed`);
  const posts = postsRaw.map(mapPost);
  const postsBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

  const archives = {};
  for (const slug of NAV_CATEGORY_SLUGS) {
    const category = categoryBySlug.get(slug);
    if (!category) continue;

    archives[slug] = {
      title: category.name,
      slug,
      posts: posts
        .filter((p) => p.categoryIds.includes(category.id))
        .map(({ slug: postSlug, title, excerpt, date, image }) => ({
          slug: postSlug,
          title,
          excerpt,
          date,
          image,
        })),
    };
  }

  for (const category of categories) {
    if (archives[category.slug]) continue;
    archives[category.slug] = {
      title: category.name,
      slug: category.slug,
      posts: posts
        .filter((p) => p.categoryIds.includes(category.id))
        .map(({ slug: postSlug, title, excerpt, date, image }) => ({
          slug: postSlug,
          title,
          excerpt,
          date,
          image,
        })),
    };
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    categories,
    archives,
    pages: Object.fromEntries(pages.map((p) => [p.slug, p])),
    postsBySlug,
  };

  writeFileSync(join(outDir, 'content.json'), JSON.stringify(payload));
  console.log(`Done: ${categories.length} categories, ${posts.length} posts, ${pages.length} pages`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
