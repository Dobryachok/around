import { cleanText } from '../data/content';
import { prepareHtmlContent } from './themeContent';

export type AchievementItem = {
  text: string;
  image?: string;
  year?: string;
};

const YEAR_PATTERN = /\b(19|20)\d{2}\s*г\.?/i;

function normalizeMediaUrl(url: string) {
  try {
    const absolute = url.replace(/^http:\/\//i, 'https://');
    const parsed = new URL(absolute);
    parsed.pathname = parsed.pathname
      .split('/')
      .map((part) => encodeURIComponent(decodeURIComponent(part)))
      .join('/');

    return parsed.toString();
  } catch {
    return url.replace(/^http:\/\//i, 'https://');
  }
}

function extractImage(chunk: string) {
  const raw =
    chunk.match(/href=["']([^"']*\/wp-content\/uploads\/[^"']+)["']/i)?.[1] ??
    chunk.match(/\bdata-src=["']([^"']+)["']/i)?.[1] ??
    chunk.match(/(?:\s)src=["']([^"']+)["']/i)?.[1];

  if (!raw || raw.startsWith('data:')) {
    return undefined;
  }

  return normalizeMediaUrl(raw);
}

function stripText(chunk: string) {
  return cleanText(
    chunk
      .replace(/<img[\s\S]*?>/gi, '')
      .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function extractYear(text: string) {
  const match = text.match(YEAR_PATTERN);
  return match ? match[0].replace(/\s*г\.?/i, ' г.') : undefined;
}

export function parseAchievementItems(content: string): AchievementItem[] {
  let html = prepareHtmlContent(content);

  html = html
    .replace(/<\/?(?:div|section)[^>]*class="[^"]*elementor[^"]*"[^>]*>/gi, '')
    .replace(/<\/?(?:div|section)[^>]*data-(?:id|element_type|settings)[^>]*>/gi, '');

  const chunks = [...html.matchAll(/<(?:p|div)\b[^>]*>([\s\S]*?)<\/(?:p|div)>/gi)].map(
    (match) => match[1],
  );

  const items: AchievementItem[] = [];
  let pendingText = '';

  for (const chunk of chunks) {
    const text = stripText(chunk);
    const image = /<img|uploads/i.test(chunk) ? extractImage(chunk) : undefined;

    if (text) {
      pendingText = pendingText ? `${pendingText} ${text}` : text;
    }

    if (image) {
      items.push({
        text: pendingText,
        image,
        year: pendingText ? extractYear(pendingText) : undefined,
      });
      pendingText = '';
    }
  }

  if (pendingText) {
    items.push({
      text: pendingText,
      year: extractYear(pendingText),
    });
  }

  return items.filter((item) => item.text || item.image);
}
