import { useEffect, useMemo, useState } from 'react';
import { CONTENT_SUBTAGS, CONTENT_TAGS } from '../data/tags';
import type { ContentTagsFile, TagArea } from '../types/contentTag';

const FALLBACK_TAG_DATA: ContentTagsFile = {
  tags: CONTENT_TAGS,
  subtags: CONTENT_SUBTAGS,
};

export function notifyContentTagsUpdated() {
  window.dispatchEvent(new Event('content-tags-updated'));
}

export function useContentTags(area?: TagArea) {
  const [data, setData] = useState<ContentTagsFile>(FALLBACK_TAG_DATA);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          setData((await response.json()) as ContentTagsFile);
        }
      } catch {
        setData(FALLBACK_TAG_DATA);
      }
    };

    void load();
    window.addEventListener('content-tags-updated', load);
    return () => window.removeEventListener('content-tags-updated', load);
  }, []);

  return useMemo(() => {
    const tags = area ? data.tags.filter((tag) => tag.area === area) : data.tags;
    const tagSlugs = new Set(tags.map((tag) => tag.slug));

    return {
      tags,
      subtags: data.subtags.filter((subtag) => tagSlugs.has(subtag.parentTagSlug)),
    };
  }, [area, data]);
}
