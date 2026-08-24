import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminTagSelector from '../../components/admin/AdminTagSelector';
import GalleryField from '../../components/admin/GalleryField';
import ImageField from '../../components/admin/ImageField';
import RichTextEditor from '../../components/admin/RichTextEditor';
import RubricSelector from '../../components/admin/RubricSelector';
import { getAdminRubric } from '../../data/adminRubrics';
import { getTag } from '../../data/tags';
import type { AdminPostsFile } from '../../types/adminPost';
import { createAdminPost, fetchAdminPosts, updateAdminPost } from '../../utils/adminApi';
import { slugifyTitle } from '../../utils/slugify';
import styles from './AdminPostEditorPage.module.css';

const EMPTY_DRAFT = {
  title: '',
  excerpt: '',
  bodyContent: '',
  image: '',
  galleryImages: [] as string[],
  rubricSlug: 'blog',
  tagSlugs: ['puteshestviya'] as string[],
  subtagSlugs: [] as string[],
  slug: '',
};

export default function AdminPostEditorPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) {
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      setError('');

      try {
        const data = (await fetchAdminPosts()) as AdminPostsFile;
        const post = data.posts.find((item) => item.id === Number(id));
        if (!post) {
          setError('Запись не найдена');
          return;
        }

        const normalizedRubric = getAdminRubric(post.rubricSlug);
        const legacyTag = getTag(post.rubricSlug);

        setDraft({
          title: post.title,
          excerpt: post.excerpt,
          bodyContent: post.bodyContent ?? post.content,
          image: post.image ?? '',
          galleryImages: post.galleryImages,
          rubricSlug: normalizedRubric?.slug ?? post.rubricSlug,
          tagSlugs: post.tagSlugs ?? (legacyTag ? [legacyTag.slug] : []),
          subtagSlugs: post.subtagSlugs ?? [],
          slug: post.slug,
        });
        setSlugTouched(true);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить запись');
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [id, isNew]);

  const rubric = useMemo(() => getAdminRubric(draft.rubricSlug), [draft.rubricSlug]);

  const updateDraft = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    setDraft((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugifyTitle(title),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!rubric) {
      setError('Выберите рубрику');
      return;
    }

    const tagArea = rubric.slug === 'blog' || rubric.slug === 'texts' ? rubric.slug : null;
    if (tagArea && draft.tagSlugs.length === 0) {
      setError('Добавьте хотя бы один тег. Подтег не может существовать без тега.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      bodyContent: draft.bodyContent,
      image: draft.image.trim(),
      galleryImages: draft.galleryImages,
      rubricSlug: rubric.slug,
      rubricTitle: rubric.title,
      categoryId: rubric.categoryId,
      tagSlugs: draft.tagSlugs,
      subtagSlugs: draft.subtagSlugs,
      slug: draft.slug.trim() || slugifyTitle(draft.title),
    };

    try {
      if (isNew) {
        await createAdminPost(payload);
      } else {
        await updateAdminPost(Number(id), payload);
      }

      navigate('/admin');
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
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{isNew ? 'Новая запись' : 'Редактирование записи'}</h2>
          <p className={styles.subtitle}>Выберите раздел, затем назначьте теги и подтеги.</p>
        </div>
        <Link to="/admin" className={styles.backLink}>К списку</Link>
      </div>

      <RubricSelector
        value={draft.rubricSlug}
        onChange={(slug) => {
          setDraft((current) => ({
            ...current,
            rubricSlug: slug,
            tagSlugs: [],
            subtagSlugs: [],
          }));
        }}
      />

      {(draft.rubricSlug === 'blog' || draft.rubricSlug === 'texts') && (
        <AdminTagSelector
          area={draft.rubricSlug}
          tagSlugs={draft.tagSlugs}
          subtagSlugs={draft.subtagSlugs}
          onChange={(tagSlugs, subtagSlugs) => {
            setDraft((current) => ({ ...current, tagSlugs, subtagSlugs }));
          }}
        />
      )}

      <label className={styles.field}>
        <span>Заголовок</span>
        <input
          type="text"
          value={draft.title}
          onChange={(event) => handleTitleChange(event.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Краткое описание</span>
        <textarea
          value={draft.excerpt}
          onChange={(event) => updateDraft('excerpt', event.target.value)}
          rows={3}
        />
      </label>

      <label className={styles.field}>
        <span>URL-slug</span>
        <input
          type="text"
          value={draft.slug}
          onChange={(event) => {
            setSlugTouched(true);
            updateDraft('slug', event.target.value);
          }}
          required
        />
      </label>

      <ImageField
        label="Главная фотография"
        value={draft.image}
        onChange={(url) => updateDraft('image', url)}
      />

      <div className={styles.field}>
        <span>Текст</span>
        <RichTextEditor
          value={draft.bodyContent}
          onChange={(html) => updateDraft('bodyContent', html)}
          placeholder="Введите текст темы..."
        />
      </div>

      <GalleryField
        label="Дополнительные фотографии"
        values={draft.galleryImages}
        onChange={(values) => updateDraft('galleryImages', values)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}
