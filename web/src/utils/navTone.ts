export type NavTone = 'light' | 'dark';

function parseRgba(color: string): { r: number; g: number; b: number; a: number } | null {
  const match = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
  );
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function getLuminance(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getEffectiveBackground(el: Element | null): string | null {
  let node = el;

  while (node && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const bg = style.backgroundColor;
    const rgba = parseRgba(bg);
    if (rgba && rgba.a > 0.05) {
      return bg;
    }
    node = node.parentElement;
  }

  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  return bodyBg;
}

export function detectNavTone(navElement: HTMLElement | null): NavTone {
  if (!navElement) return 'light';

  navElement.style.pointerEvents = 'none';
  const sampleY = navElement.offsetHeight + 2;
  const sampleX = Math.round(window.innerWidth / 2);
  const target = document.elementFromPoint(sampleX, sampleY);
  navElement.style.pointerEvents = '';

  if (!target) return 'light';

  const marked = target.closest('[data-nav-bg]');
  if (marked) {
    return marked.getAttribute('data-nav-bg') === 'dark' ? 'dark' : 'light';
  }

  const bg = getEffectiveBackground(target);
  const rgba = bg ? parseRgba(bg) : null;
  if (!rgba) return 'light';

  return getLuminance(rgba.r, rgba.g, rgba.b) > 0.58 ? 'light' : 'dark';
}
