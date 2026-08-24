import { cleanText } from '../data/content';

const THUMB_SIZE_PATTERN = /-\d+x\d+\.(jpe?g|png|webp|gif)$/i;
const UPLOAD_URL_PATTERN = /https:\/\/aroundmyself\.ru\/wp-content\/uploads\/[^\s"'<>]+/gi;
const UPLOAD_ATTR_PATTERN = /(?:src|href|data-src)=["']([^"']*\/wp-content\/uploads\/[^"']+)["']/gi;

function normalizeImageUrl(url: string) {
  try {
    const absolute = url.startsWith('http') ? url : `https://aroundmyself.ru${url}`;
    return decodeURIComponent(absolute).replace(/#.*$/, '').trim();
  } catch {
    return url.trim();
  }
}

function stripMarkup(content: string) {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function prepareHtmlContent(content: string) {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '')
    .replace(/http:\/\/aroundmyself\.ru/gi, 'https://aroundmyself.ru')
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const dataSrc = tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1];
      const dataSrcSet = tag.match(/\bdata-srcset=["']([^"']+)["']/i)?.[1];

      let nextTag = tag
        .replace(/\bdata-src=["'][^"']*["']/gi, '')
        .replace(/\bdata-srcset=["'][^"']*["']/gi, '')
        .replace(/\bdata-sizes=["'][^"']*["']/gi, '')
        .replace(/\sloading=["']lazy["']/gi, '');

      if (dataSrc) {
        if (/(?:\s)src=["'][^"']*["']/i.test(nextTag)) {
          nextTag = nextTag.replace(/(?:\s)src=["'][^"']*["']/i, ` src="${dataSrc}"`);
        } else {
          nextTag = nextTag.replace('<img', `<img src="${dataSrc}"`);
        }
      }

      if (dataSrcSet) {
        if (/(?:\s)srcset=["'][^"']*["']/i.test(nextTag)) {
          nextTag = nextTag.replace(/(?:\s)srcset=["'][^"']*["']/i, ` srcset="${dataSrcSet}"`);
        } else {
          nextTag = nextTag.replace('<img', `<img srcset="${dataSrcSet}"`);
        }
      }

      return nextTag;
    });
}

export function extractGalleryImages(content: string, featuredImage?: string): string[] {
  const urls: string[] = [];

  for (const match of content.matchAll(UPLOAD_URL_PATTERN)) {
    urls.push(match[0]);
  }

  for (const match of content.matchAll(UPLOAD_ATTR_PATTERN)) {
    const url = match[1];
    urls.push(url.startsWith('http') ? url : `https://aroundmyself.ru${url}`);
  }

  const featuredNormalized = featuredImage ? normalizeImageUrl(featuredImage) : '';
  const fullSize = urls
    .map((url) => normalizeImageUrl(url))
    .filter((url) => !THUMB_SIZE_PATTERN.test(url))
    .filter((url) => !featuredNormalized || url !== featuredNormalized);

  return [...new Set(fullSize)];
}

export function extractThemeIntro(content: string): string {
  return cleanText(stripMarkup(content));
}

export function formatPoeticIntro(text: string): string[] {
  const colonIndex = text.indexOf(':');
  if (colonIndex === -1) {
    return text ? [text] : [];
  }

  const lead = text.slice(0, colonIndex + 1).trim();
  const items = text
    .slice(colonIndex + 1)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? [lead, ...items] : [lead];
}

export function formatArticleIntro(content: string): string[] {
  const paragraphs = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((paragraph) => cleanText(paragraph))
    .filter((paragraph) => paragraph.length > 0);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  const fallback = extractThemeIntro(content);
  return fallback ? [fallback] : [];
}
