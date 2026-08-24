import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AdminPostRecord, AdminPostsFile } from '../../types/adminPost';
import { deleteAdminPost, fetchAdminPosts } from '../../utils/adminApi';
import styles from './AdminPostsPage.module.css';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const data = (await fetchAdminPosts()) as AdminPostsFile;
      setPosts(data.posts);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const handleDelete = async (post: AdminPostRecord) => {
    if (!window.confirm(`Удалить «${post.title}»?`)) {
      return;
    }

    await deleteAdminPost(post.id);
    await loadPosts();
  };

  return (
    <div className={styles.page}>
        <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Записи</h2>
          <p className={styles.subtitle}>
            Созданные через админ-панель записи появятся на сайте после сохранения и обновления страницы (F5).
          </p>
        </div>
        <Link to="/admin/posts/new" className={styles.createButton}>Новая запись</Link>
      </div>

      {loading && <p className={styles.message}>Загрузка...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && posts.length === 0 && (
        <p className={styles.message}>Пока нет созданных записей. Нажмите «Новая запись».</p>
      )}

      {!loading && posts.length > 0 && (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id} className={styles.item}>
              <div className={styles.body}>
                <div className={styles.meta}>{post.rubricTitle} · {post.date}</div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <div className={styles.slug}>/post/{post.slug}</div>
              </div>
              <div className={styles.actions}>
                <Link to={`/admin/posts/${post.id}`}>Редактировать</Link>
                <a href={`/post/${encodeURIComponent(post.slug)}`} target="_blank" rel="noreferrer">Просмотр</a>
                <button type="button" onClick={() => void handleDelete(post)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
