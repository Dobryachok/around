import type { CSSProperties } from 'react';
import { useContentTags } from '../../hooks/useContentTags';
import type { TagArea } from '../../types/contentTag';
import styles from './AdminTagSelector.module.css';

interface AdminTagSelectorProps {
  area: TagArea;
  tagSlugs: string[];
  subtagSlugs: string[];
  onChange: (tagSlugs: string[], subtagSlugs: string[]) => void;
}

export default function AdminTagSelector({
  area,
  tagSlugs,
  subtagSlugs,
  onChange,
}: AdminTagSelectorProps) {
  const tagData = useContentTags(area);
  const tags = tagData.tags;
  const getSubtags = (tagSlug: string) =>
    tagData.subtags.filter((subtag) => subtag.parentTagSlug === tagSlug);

  const toggleTag = (slug: string) => {
    if (tagSlugs.includes(slug)) {
      const childSubtagSlugs = new Set(getSubtags(slug).map((subtag) => subtag.slug));
      onChange(
        tagSlugs.filter((tagSlug) => tagSlug !== slug),
        subtagSlugs.filter((subtagSlug) => !childSubtagSlugs.has(subtagSlug)),
      );
      return;
    }

    onChange([...tagSlugs, slug], subtagSlugs);
  };

  const toggleSubtag = (parentTagSlug: string, slug: string) => {
    if (!tagSlugs.includes(parentTagSlug)) {
      return;
    }

    onChange(
      tagSlugs,
      subtagSlugs.includes(slug)
        ? subtagSlugs.filter((subtagSlug) => subtagSlug !== slug)
        : [...subtagSlugs, slug],
    );
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>Теги и подтеги</span>
      <div className={styles.tags}>
        {tags.map((tag) => {
          const selected = tagSlugs.includes(tag.slug);
          const subtags = getSubtags(tag.slug);

          return (
            <div key={tag.slug} className={styles.tagGroup}>
              <label className={styles.tagOption}>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleTag(tag.slug)}
                />
                <span
                  className={styles.tagBadge}
                  style={{ '--tag-color': tag.color } as CSSProperties}
                >
                  {tag.title}
                </span>
              </label>

              {subtags.length > 0 && (
                <div className={styles.subtags}>
                  {subtags.map((subtag) => (
                    <label
                      key={subtag.slug}
                      className={`${styles.subtagOption} ${!selected ? styles.subtagDisabled : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={subtagSlugs.includes(subtag.slug)}
                        disabled={!selected}
                        onChange={() => toggleSubtag(tag.slug, subtag.slug)}
                      />
                      <span
                        className={styles.subtagBadge}
                        style={{ '--tag-color': tag.color } as CSSProperties}
                      >
                        {subtag.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {tags.length === 0 && (
        <p className={styles.empty}>Сначала создайте тег для этого раздела в меню «Теги».</p>
      )}
    </div>
  );
}
