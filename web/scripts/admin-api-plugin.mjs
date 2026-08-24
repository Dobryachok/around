import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const adminPostsPath = join(rootDir, 'src/data/generated/admin-posts.json');
const homePinsPath = join(rootDir, 'src/data/generated/home-pins.json');
const tagsPath = join(rootDir, 'src/data/generated/tags.json');
const postTagsPath = join(rootDir, 'src/data/generated/post-tags.json');
const uploadsDir = join(rootDir, 'public/admin-uploads');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'around-admin';

function readAdminPosts() {
  const raw = readFileSync(adminPostsPath, 'utf8');
  return JSON.parse(raw);
}

function writeAdminPosts(data) {
  writeFileSync(adminPostsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readHomePins() {
  const raw = readFileSync(homePinsPath, 'utf8');
  return JSON.parse(raw);
}

function writeHomePins(data) {
  writeFileSync(homePinsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readTags() {
  return JSON.parse(readFileSync(tagsPath, 'utf8'));
}

function writeTags(data) {
  writeFileSync(tagsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readPostTags() {
  return JSON.parse(readFileSync(postTagsPath, 'utf8'));
}

function writePostTags(data) {
  writeFileSync(postTagsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function isAuthorized(req) {
  return req.headers['x-admin-password'] === ADMIN_PASSWORD;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function formatDate(dateIso) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateIso));
  } catch {
    return dateIso;
  }
}

function buildContent(html, galleryImages) {
  const galleryHtml = galleryImages
    .filter(Boolean)
    .map((url) => `<p><img src="${url}" alt="" /></p>`)
    .join('\n');

  return `${html}\n${galleryHtml}`.trim();
}

function nextAdminId(posts) {
  const minId = posts.reduce((min, post) => Math.min(min, post.id), 0);
  return minId <= 0 ? minId - 1 : -1;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function saveUploadBase64(filename, dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error('Invalid data URL');
  }

  mkdirSync(uploadsDir, { recursive: true });
  const extension = extname(filename || '') || '.jpg';
  const savedName = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
  const absolutePath = join(uploadsDir, savedName);
  writeFileSync(absolutePath, Buffer.from(match[2], 'base64'));
  return `/admin-uploads/${savedName}`;
}

export function adminApiPlugin() {
  return {
    name: 'admin-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/tags') && req.method === 'GET') {
          sendJson(res, 200, readTags());
          return;
        }

        if (!req.url?.startsWith('/api/admin')) {
          next();
          return;
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        if (pathname === '/api/admin/login' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            if (body.password === ADMIN_PASSWORD) {
              sendJson(res, 200, { ok: true });
              return;
            }
            sendJson(res, 401, { error: 'Неверный пароль' });
          } catch {
            sendJson(res, 400, { error: 'Некорректный запрос' });
          }
          return;
        }

        if (!isAuthorized(req)) {
          sendJson(res, 401, { error: 'Требуется авторизация' });
          return;
        }

        if (pathname === '/api/admin/home-pins' && req.method === 'GET') {
          sendJson(res, 200, readHomePins());
          return;
        }

        if (pathname === '/api/admin/tags' && req.method === 'GET') {
          sendJson(res, 200, readTags());
          return;
        }

        if (pathname === '/api/admin/tags' && req.method === 'PUT') {
          try {
            const body = await parseBody(req);
            const tags = Array.isArray(body.tags) ? body.tags : [];
            const tagSlugs = new Set(tags.map((tag) => tag.slug));
            const subtags = (Array.isArray(body.subtags) ? body.subtags : []).filter((subtag) =>
              tagSlugs.has(subtag.parentTagSlug),
            );

            writeTags({ tags, subtags });
            sendJson(res, 200, readTags());
          } catch {
            sendJson(res, 400, { error: 'Не удалось сохранить теги' });
          }
          return;
        }

        if (pathname === '/api/admin/post-tags' && req.method === 'GET') {
          sendJson(res, 200, readPostTags());
          return;
        }

        if (pathname === '/api/admin/post-tags' && req.method === 'PUT') {
          try {
            const body = await parseBody(req);
            const tagData = readTags();
            const validTagSlugs = new Set(tagData.tags.map((tag) => tag.slug));
            const subtagBySlug = new Map(
              tagData.subtags.map((subtag) => [subtag.slug, subtag]),
            );
            const assignments = Object.fromEntries(
              Object.entries(body.assignments ?? {}).map(([postSlug, assignment]) => {
                const tagSlugs = (assignment.tagSlugs ?? []).filter((slug) =>
                  validTagSlugs.has(slug),
                );
                const subtagSlugs = (assignment.subtagSlugs ?? []).filter((slug) => {
                  const subtag = subtagBySlug.get(slug);
                  return subtag ? tagSlugs.includes(subtag.parentTagSlug) : false;
                });

                return [postSlug, { tagSlugs, subtagSlugs }];
              }),
            );

            writePostTags({ assignments });
            sendJson(res, 200, readPostTags());
          } catch {
            sendJson(res, 400, { error: 'Не удалось сохранить привязки тегов' });
          }
          return;
        }

        if (pathname === '/api/admin/home-pins' && req.method === 'PUT') {
          try {
            const body = await parseBody(req);
            let pinnedSlugs = Array.isArray(body.pinnedSlugs) ? body.pinnedSlugs : null;

            // Migrate legacy multi-block payload if still sent.
            if (!pinnedSlugs && Array.isArray(body.sections)) {
              pinnedSlugs = [];
              for (const section of body.sections) {
                if (section?.featuredSlug && !pinnedSlugs.includes(section.featuredSlug)) {
                  pinnedSlugs.push(section.featuredSlug);
                }
                for (const slug of section?.listSlugs ?? []) {
                  if (slug && !pinnedSlugs.includes(slug)) {
                    pinnedSlugs.push(slug);
                  }
                }
              }
            }

            writeHomePins({
              title: typeof body.title === 'string' && body.title.trim()
                ? body.title.trim()
                : 'Закреплённые темы',
              categorySlug: typeof body.categorySlug === 'string' && body.categorySlug.trim()
                ? body.categorySlug.trim()
                : 'puteshestviya',
              pinnedSlugs: (pinnedSlugs ?? []).filter((slug) => typeof slug === 'string' && slug.length > 0),
            });
            sendJson(res, 200, readHomePins());
          } catch {
            sendJson(res, 400, { error: 'Не удалось сохранить главную страницу' });
          }
          return;
        }

        if (pathname === '/api/admin/posts' && req.method === 'GET') {
          sendJson(res, 200, readAdminPosts());
          return;
        }

        if (pathname === '/api/admin/upload' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            const savedUrl = saveUploadBase64(body.filename, body.dataUrl);
            sendJson(res, 200, { url: savedUrl });
          } catch {
            sendJson(res, 500, { error: 'Не удалось загрузить файл' });
          }
          return;
        }

        if (pathname === '/api/admin/posts' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            const data = readAdminPosts();
            const now = new Date().toISOString();
            const dateIso = body.dateIso ?? now;
            const post = {
              id: nextAdminId(data.posts),
              slug: body.slug,
              title: body.title,
              excerpt: body.excerpt ?? '',
              bodyContent: body.bodyContent ?? body.content ?? '',
              content: buildContent(body.bodyContent ?? body.content ?? '', body.galleryImages ?? []),
              date: formatDate(dateIso),
              dateIso,
              image: body.image || undefined,
              galleryImages: body.galleryImages ?? [],
              rubricSlug: body.rubricSlug,
              rubricTitle: body.rubricTitle,
              categoryId: body.categoryId,
              tagSlugs: body.tagSlugs ?? [],
              subtagSlugs: body.subtagSlugs ?? [],
              createdAt: now,
              updatedAt: now,
            };

            data.posts.unshift(post);
            writeAdminPosts(data);
            sendJson(res, 201, post);
          } catch {
            sendJson(res, 400, { error: 'Не удалось создать запись' });
          }
          return;
        }

        const postMatch = pathname.match(/^\/api\/admin\/posts\/(\d+)$/);
        if (postMatch && req.method === 'PUT') {
          try {
            const postId = Number(postMatch[1]);
            const body = await parseBody(req);
            const data = readAdminPosts();
            const index = data.posts.findIndex((post) => post.id === postId);

            if (index < 0) {
              sendJson(res, 404, { error: 'Запись не найдена' });
              return;
            }

            const current = data.posts[index];
            const updated = {
              ...current,
              slug: body.slug ?? current.slug,
              title: body.title ?? current.title,
              excerpt: body.excerpt ?? current.excerpt,
              content: buildContent(body.bodyContent ?? '', body.galleryImages ?? current.galleryImages),
              bodyContent: body.bodyContent ?? current.bodyContent,
              image: body.image || undefined,
              galleryImages: body.galleryImages ?? current.galleryImages,
              rubricSlug: body.rubricSlug ?? current.rubricSlug,
              rubricTitle: body.rubricTitle ?? current.rubricTitle,
              categoryId: body.categoryId ?? current.categoryId,
              tagSlugs: body.tagSlugs ?? current.tagSlugs ?? [],
              subtagSlugs: body.subtagSlugs ?? current.subtagSlugs ?? [],
              updatedAt: new Date().toISOString(),
            };

            data.posts[index] = updated;
            writeAdminPosts(data);
            sendJson(res, 200, updated);
          } catch {
            sendJson(res, 400, { error: 'Не удалось обновить запись' });
          }
          return;
        }

        if (postMatch && req.method === 'DELETE') {
          const postId = Number(postMatch[1]);
          const data = readAdminPosts();
          const nextPosts = data.posts.filter((post) => post.id !== postId);
          if (nextPosts.length === data.posts.length) {
            sendJson(res, 404, { error: 'Запись не найдена' });
            return;
          }
          data.posts = nextPosts;
          writeAdminPosts(data);
          sendJson(res, 200, { ok: true });
          return;
        }

        sendJson(res, 404, { error: 'Не найдено' });
      });
    },
  };
}
