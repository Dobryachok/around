import { cleanText } from '../data/content';

export type BookItem = {
  title: string;
  description: string;
  image?: string;
  year?: string;
};

const LEARN_MORE_PATTERN =
  /\[learn_more\s+caption=(?:&#187;|»|")?([^[\]]+?)(?:&#171;|«|")?\s*\]([\s\S]*?)\[\/learn_more\]/gi;

const UPLOAD_URL_PATTERN =
  /https?:\/\/aroundmyself\.ru\/wp-content\/uploads\/[^\s"'<>]+/gi;

const THUMB_SIZE_PATTERN = /-\d+x\d+\.(jpe?g|png|webp|gif)$/i;

const YEAR_PATTERN = /\b(19|20)\d{2}\s*г\.?/i;

function normalizeUploadUrl(url: string) {
  try {
    const absolute = url.replace(/^http:\/\//i, 'https://');
    const parsed = new URL(absolute);
    parsed.pathname = parsed.pathname
      .split('/')
      .map((part) => encodeURIComponent(decodeURIComponent(part)))
      .join('/');

    return THUMB_SIZE_PATTERN.test(parsed.pathname)
      ? parsed.toString().replace(THUMB_SIZE_PATTERN, (_, ext) => `.${ext}`)
      : parsed.toString();
  } catch {
    const normalized = url.replace(/^http:\/\//i, 'https://');
    return THUMB_SIZE_PATTERN.test(normalized)
      ? normalized.replace(THUMB_SIZE_PATTERN, (_, ext) => `.${ext}`)
      : normalized;
  }
}

function extractImage(content: string) {
  const candidates = [
    ...content.matchAll(/data-src=["']([^"']+)["']/gi),
    ...content.matchAll(/src=["']([^"']*\/wp-content\/uploads\/[^"']+)["']/gi),
    ...content.matchAll(UPLOAD_URL_PATTERN),
  ].map((match) => match[1] ?? match[0]);

  const fullSize = candidates
    .map((url) => normalizeUploadUrl(url))
    .filter((url) => !url.startsWith('data:'));

  return fullSize[0];
}

function extractYear(content: string) {
  const match = content.match(YEAR_PATTERN);
  return match ? match[0].replace(/\s*г\.?/i, ' г.') : undefined;
}

function stripMarkup(content: string) {
  return cleanText(
    content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\bpuhkuseestis\.com\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

export function parseLearnMoreBlocks(content: string): BookItem[] {
  const books: BookItem[] = [];

  for (const match of content.matchAll(LEARN_MORE_PATTERN)) {
    const title = cleanText(match[1]);
    const body = match[2];

    if (!title) {
      continue;
    }

    books.push({
      title,
      description: stripMarkup(body),
      image: extractImage(body),
      year: extractYear(body),
    });
  }

  return books;
}
