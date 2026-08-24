import { useEffect, useState } from 'react';
import { postsBySlug } from '../../data/content';
import { resolvePostTagAssignment } from '../../data/tags';
import { notifyContentTagsUpdated } from '../../hooks/useContentTags';
import type {
  ContentSubtag,
  ContentTag,
  ContentTagsFile,
  PostTagAssignment,
  PostTagAssignmentsFile,
  TagArea,
} from '../../types/contentTag';
import {
  fetchContentTags,
  fetchPostTagAssignments,
  saveContentTags,
  savePostTagAssignments,
} from '../../utils/adminApi';
import { slugifyTitle } from '../../utils/slugify';
import styles from './AdminTagsPage.module.css';

const DEFAULT_COLOR = '#3d7dd6';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<ContentTag[]>([]);
  const [subtags, setSubtags] = useState<ContentSubtag[]>([]);
  const [newTagTitle, setNewTagTitle] = useState('');
  const [newTagArea, setNewTagArea] = useState<TagArea>('blog');
  const [newTagColor, setNewTagColor] = useState(DEFAULT_COLOR);
  const [subtagDrafts, setSubtagDrafts] = useState<Record<string, string>>({});
  const [assignments, setAssignments] = useState<Record<string, PostTagAssignment>>({});
  const [postQuery, setPostQuery] = useState('');
  const [selectedPostSlug, setSelectedPostSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [tagData, assignmentData] = await Promise.all([
          fetchContentTags() as Promise<ContentTagsFile>,
          fetchPostTagAssignments() as Promise<PostTagAssignmentsFile>,
        ]);
        setTags(tagData.tags);
        setSubtags(tagData.subtags);
        setAssignments(assignmentData.assignments);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить теги');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const persistTaxonomy = async (
    nextTags: ContentTag[],
    nextSubtags: ContentSubtag[],
  ) => {
    setError('');
    setMessage('');

    try {
      await saveContentTags(nextTags, nextSubtags);
      notifyContentTagsUpdated();
      setMessage('Изменения тегов сохранены.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить теги');
    }
  };

  const addTag = () => {
    const title = newTagTitle.trim();
    if (!title) {
      return;
    }

    const baseSlug = slugifyTitle(title);
    let slug = baseSlug;
    let suffix = 2;
    while (tags.some((tag) => tag.slug === slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const nextTags = [
      ...tags,
      { slug, title, area: newTagArea, color: newTagColor },
    ];
    setTags(nextTags);
    setNewTagTitle('');
    void persistTaxonomy(nextTags, subtags);
  };

  const updateTag = (slug: string, patch: Partial<ContentTag>) => {
    setTags((current) =>
      current.map((tag) => (tag.slug === slug ? { ...tag, ...patch } : tag)),
    );
  };

  const removeTag = (tag: ContentTag) => {
    if (!window.confirm(`Удалить тег «${tag.title}» и все его подтеги?`)) {
      return;
    }

    const nextTags = tags.filter((item) => item.slug !== tag.slug);
    const nextSubtags = subtags.filter((subtag) => subtag.parentTagSlug !== tag.slug);
    setTags(nextTags);
    setSubtags(nextSubtags);
    void persistTaxonomy(nextTags, nextSubtags);
  };

  const addSubtag = (parentTagSlug: string) => {
    const title = (subtagDrafts[parentTagSlug] ?? '').trim();
    if (!title) {
      return;
    }

    const baseSlug = slugifyTitle(title);
    let slug = baseSlug;
    let suffix = 2;
    while (subtags.some((subtag) => subtag.slug === slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const nextSubtags = [...subtags, { slug, title, parentTagSlug }];
    setSubtags(nextSubtags);
    setSubtagDrafts((current) => ({ ...current, [parentTagSlug]: '' }));
    void persistTaxonomy(tags, nextSubtags);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const validTagSlugs = new Set(tags.map((tag) => tag.slug));
      const validSubtags = new Map(subtags.map((subtag) => [subtag.slug, subtag]));
      const cleanedAssignments = Object.fromEntries(
        Object.entries(assignments).map(([postSlug, assignment]) => {
          const tagSlugs = assignment.tagSlugs.filter((slug) => validTagSlugs.has(slug));
          const subtagSlugs = assignment.subtagSlugs.filter((slug) => {
            const subtag = validSubtags.get(slug);
            return subtag ? tagSlugs.includes(subtag.parentTagSlug) : false;
          });

          return [postSlug, { tagSlugs, subtagSlugs }];
        }),
      );
      const [data] = await Promise.all([
        saveContentTags(tags, subtags) as Promise<ContentTagsFile>,
        savePostTagAssignments(cleanedAssignments),
      ]);
      setTags(data.tags);
      setSubtags(data.subtags);
      setAssignments(cleanedAssignments);
      notifyContentTagsUpdated();
      setMessage('Теги и привязки записей сохранены.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить теги');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className={styles.message}>Загрузка...</p>;
  }

  const allPosts = Object.values(postsBySlug)
    .filter((post) => {
      const query = postQuery.trim().toLowerCase();
      return !query || `${post.title} ${post.slug}`.toLowerCase().includes(query);
    })
    .sort((left, right) => new Date(right.dateIso).getTime() - new Date(left.dateIso).getTime());
  const selectedPost = selectedPostSlug ? postsBySlug[selectedPostSlug] : null;
  const selectedAssignment = selectedPost
    ? assignments[selectedPost.slug] ?? resolvePostTagAssignment(selectedPost)
    : null;

  const updateSelectedAssignment = (next: PostTagAssignment) => {
    if (!selectedPost) {
      return;
    }

    setAssignments((current) => ({ ...current, [selectedPost.slug]: next }));
  };

  return (
    <div className={styles.page}>
      <div>
        <h2 className={styles.title}>Теги и подтеги</h2>
        <p className={styles.subtitle}>
          Тег относится к блогу или текстам. Подтег создаётся только внутри существующего тега.
        </p>
      </div>

      <section className={styles.createCard}>
        <label>
          <span>Название нового тега</span>
          <input
            value={newTagTitle}
            onChange={(event) => setNewTagTitle(event.target.value)}
            placeholder="Например, Эстония"
          />
        </label>
        <label>
          <span>Раздел</span>
          <select
            value={newTagArea}
            onChange={(event) => setNewTagArea(event.target.value as TagArea)}
          >
            <option value="blog">Блог</option>
            <option value="texts">Тексты</option>
          </select>
        </label>
        <label>
          <span>Цвет</span>
          <input
            type="color"
            value={newTagColor}
            onChange={(event) => setNewTagColor(event.target.value)}
          />
        </label>
        <button type="button" onClick={addTag}>Добавить тег</button>
      </section>

      <div className={styles.tagList}>
        {tags.map((tag) => {
          const childSubtags = subtags.filter((subtag) => subtag.parentTagSlug === tag.slug);

          return (
            <section key={tag.slug} className={styles.tagCard}>
              <div className={styles.tagHeader}>
                <div className={styles.tagFields}>
                  <input
                    value={tag.title}
                    onChange={(event) => updateTag(tag.slug, { title: event.target.value })}
                    aria-label="Название тега"
                  />
                  <select
                    value={tag.area}
                    onChange={(event) =>
                      updateTag(tag.slug, { area: event.target.value as TagArea })
                    }
                    aria-label="Раздел тега"
                  >
                    <option value="blog">Блог</option>
                    <option value="texts">Тексты</option>
                  </select>
                  <input
                    type="color"
                    value={tag.color}
                    onChange={(event) => updateTag(tag.slug, { color: event.target.value })}
                    aria-label="Цвет тега"
                  />
                </div>
                <button type="button" className={styles.remove} onClick={() => removeTag(tag)}>
                  Удалить тег
                </button>
              </div>

              <div className={styles.subtagList}>
                {childSubtags.map((subtag) => (
                  <div key={subtag.slug} className={styles.subtagRow}>
                    <input
                      value={subtag.title}
                      onChange={(event) =>
                        setSubtags((current) =>
                          current.map((item) =>
                            item.slug === subtag.slug
                              ? { ...item, title: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSubtags((current) =>
                          current.filter((item) => item.slug !== subtag.slug),
                        )
                      }
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.addSubtag}>
                <input
                  value={subtagDrafts[tag.slug] ?? ''}
                  onChange={(event) =>
                    setSubtagDrafts((current) => ({
                      ...current,
                      [tag.slug]: event.target.value,
                    }))
                  }
                  placeholder="Название подтега"
                />
                <button type="button" onClick={() => addSubtag(tag.slug)}>
                  Добавить подтег
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <section className={styles.assignmentCard}>
        <div>
          <h3>Привязка тегов к существующим записям</h3>
          <p>Выберите любую запись сайта и назначьте ей теги. Подтег доступен только вместе с родительским тегом.</p>
        </div>

        <label className={styles.assignmentSearch}>
          <span>Поиск записи</span>
          <input
            type="search"
            value={postQuery}
            onChange={(event) => setPostQuery(event.target.value)}
            placeholder="Название или slug"
          />
        </label>

        <label className={styles.assignmentSearch}>
          <span>Запись</span>
          <select
            value={selectedPostSlug}
            onChange={(event) => setSelectedPostSlug(event.target.value)}
          >
            <option value="">Выберите запись</option>
            {allPosts.map((post) => (
              <option key={post.slug} value={post.slug}>
                {post.title} · {post.date}
              </option>
            ))}
          </select>
        </label>

        {selectedPost && selectedAssignment && (
          <div className={styles.assignmentTags}>
            {tags.map((tag) => {
              const checked = selectedAssignment.tagSlugs.includes(tag.slug);
              const childSubtags = subtags.filter(
                (subtag) => subtag.parentTagSlug === tag.slug,
              );

              return (
                <div key={tag.slug} className={styles.assignmentTagGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          const childSlugs = new Set(childSubtags.map((subtag) => subtag.slug));
                          updateSelectedAssignment({
                            tagSlugs: selectedAssignment.tagSlugs.filter(
                              (slug) => slug !== tag.slug,
                            ),
                            subtagSlugs: selectedAssignment.subtagSlugs.filter(
                              (slug) => !childSlugs.has(slug),
                            ),
                          });
                        } else {
                          updateSelectedAssignment({
                            ...selectedAssignment,
                            tagSlugs: [...selectedAssignment.tagSlugs, tag.slug],
                          });
                        }
                      }}
                    />
                    <strong>{tag.title}</strong>
                    <small>{tag.area === 'blog' ? 'Блог' : 'Тексты'}</small>
                  </label>

                  {childSubtags.length > 0 && (
                    <div className={styles.assignmentSubtags}>
                      {childSubtags.map((subtag) => (
                        <label key={subtag.slug}>
                          <input
                            type="checkbox"
                            disabled={!checked}
                            checked={selectedAssignment.subtagSlugs.includes(subtag.slug)}
                            onChange={() =>
                              updateSelectedAssignment({
                                ...selectedAssignment,
                                subtagSlugs: selectedAssignment.subtagSlugs.includes(subtag.slug)
                                  ? selectedAssignment.subtagSlugs.filter(
                                      (slug) => slug !== subtag.slug,
                                    )
                                  : [...selectedAssignment.subtagSlugs, subtag.slug],
                              })
                            }
                          />
                          {subtag.title}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {assignments[selectedPost.slug] && (
              <button
                type="button"
                className={styles.resetAssignment}
                onClick={() =>
                  setAssignments((current) => {
                    const next = { ...current };
                    delete next[selectedPost.slug];
                    return next;
                  })
                }
              >
                Вернуть исходные теги записи
              </button>
            )}
          </div>
        )}
      </section>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      <button
        type="button"
        className={styles.save}
        onClick={() => void handleSave()}
        disabled={saving}
      >
        {saving ? 'Сохранение...' : 'Сохранить теги'}
      </button>
    </div>
  );
}
