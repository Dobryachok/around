import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { normalizeHomePins } from '../../data/homePage';
import { getPickablePosts } from '../../data/pickablePosts';
import type { HomePinsFile } from '../../types/homePins';
import { fetchHomePins, saveHomePins } from '../../utils/adminApi';
import styles from './AdminHomePage.module.css';

export default function AdminHomePage() {
  const allPosts = useMemo(() => getPickablePosts(), []);
  const [title, setTitle] = useState('Закреплённые темы');
  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const data = normalizeHomePins(await fetchHomePins());
        setTitle(data.title);
        setPinnedSlugs(data.pinnedSlugs);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить настройки');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return allPosts;
    }

    return allPosts.filter((post) =>
      `${post.title} ${post.rubricTitle} ${post.slug}`.toLowerCase().includes(normalized),
    );
  }, [allPosts, query]);

  const pinnedPosts = useMemo(
    () =>
      pinnedSlugs
        .map((slug) => allPosts.find((post) => post.slug === slug))
        .filter((post): post is (typeof allPosts)[number] => Boolean(post)),
    [allPosts, pinnedSlugs],
  );

  const togglePinnedSlug = (slug: string) => {
    setPinnedSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  };

  const movePinnedSlug = (slug: string, direction: -1 | 1) => {
    setPinnedSlugs((current) => {
      const index = current.indexOf(slug);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const data = normalizeHomePins(
        (await saveHomePins({
          title,
          categorySlug: 'puteshestviya',
          pinnedSlugs,
        })) as HomePinsFile,
      );
      setTitle(data.title);
      setPinnedSlugs(data.pinnedSlugs);
      setMessage('Главная страница сохранена. Обновите сайт (F5), чтобы увидеть изменения.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className={styles.message}>Загрузка...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Главная страница</h2>
          <p className={styles.subtitle}>
            Закрепите темы — каждая попадёт отдельной карточкой в один слайдер на главной
            (четвёртый блок).
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/admin" className={styles.link}>
            К темам
          </Link>
        </div>
      </div>

      <label className={styles.field}>
        <span>Заголовок блока</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Закреплённые темы"
        />
      </label>

      <label className={styles.search}>
        <span>Поиск тем</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Название, рубрика или slug"
        />
      </label>

      <div className={styles.field}>
        <span>Закреплённые темы ({pinnedSlugs.length})</span>
        {pinnedPosts.length === 0 ? (
          <p className={styles.message}>Пока ничего не закреплено — отметьте темы ниже.</p>
        ) : (
          <ul className={styles.pinnedList}>
            {pinnedPosts.map((post, index) => (
              <li key={post.slug} className={styles.pinnedItem}>
                <span>
                  <strong>
                    {String(index + 1).padStart(2, '0')}. {post.title}
                  </strong>
                  <small>
                    {post.rubricTitle} · {post.date}
                  </small>
                </span>
                <div className={styles.pinnedActions}>
                  <button
                    type="button"
                    onClick={() => movePinnedSlug(post.slug, -1)}
                    disabled={index === 0}
                    aria-label="Выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => movePinnedSlug(post.slug, 1)}
                    disabled={index === pinnedPosts.length - 1}
                    aria-label="Ниже"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => togglePinnedSlug(post.slug)}
                  >
                    Убрать
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.field}>
        <span>Все темы</span>
        <ul className={styles.postPicker}>
          {filteredPosts.map((post) => {
            const checked = pinnedSlugs.includes(post.slug);

            return (
              <li key={post.slug}>
                <label className={styles.postOption}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePinnedSlug(post.slug)}
                  />
                  <span>
                    <strong>{post.title}</strong>
                    <small>
                      {post.rubricTitle} · {post.date}
                    </small>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      <button
        type="button"
        className={styles.saveButton}
        onClick={() => void handleSave()}
        disabled={saving}
      >
        {saving ? 'Сохранение...' : 'Сохранить главную'}
      </button>
    </div>
  );
}
