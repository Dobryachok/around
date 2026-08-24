export function categoryPath(slug: string) {
  return `/category/${encodeURIComponent(slug)}`;
}

export function postPath(slug: string) {
  return `/post/${encodeURIComponent(slug)}`;
}

export function pagePath(slug: string) {
  return `/page/${encodeURIComponent(slug)}`;
}

export function blogPath() {
  return '/blog';
}

export function textsPath() {
  return '/texts';
}

export function portfolioPath(section?: string) {
  if (!section || section === 'interview') {
    return '/portfolio';
  }

  return `/portfolio?section=${encodeURIComponent(section)}`;
}

export function decodeRouteParam(param: string | undefined) {
  if (!param) return '';
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

export function isInternalPath(href: string) {
  return href.startsWith('/') || href.startsWith('#');
}
