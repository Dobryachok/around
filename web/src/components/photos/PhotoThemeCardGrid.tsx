import { Link } from 'react-router-dom';
import type { ArchivePost } from '../../data/content';
import { cleanText } from '../../data/content';
import { postPath } from '../../data/routes';
import styles from './PhotoThemeCardGrid.module.css';

interface PhotoThemeCardGridProps {
  posts: ArchivePost[];
  emptyMessage?: string;
}

export default function PhotoThemeCardGrid({ posts, emptyMessage }: PhotoThemeCardGridProps) {
  if (posts.length === 0) {
    return <p className={styles.empty}>{emptyMessage ?? 'В этой рубрике пока нет записей.'}</p>;
  }

  return (
    <ul className={styles.grid}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.card}>
          {post.image && (
            <Link to={postPath(post.slug)} className={styles.imageLink}>
              <img src={post.image} alt={post.title} loading="lazy" />
            </Link>
          )}

          <div className={styles.body}>
            {post.date && (
              <time className={styles.date}>{cleanText(post.date)}</time>
            )}

            <div className={styles.row}>
              <div className={styles.main}>
                <h2 className={styles.title}>
                  <Link to={postPath(post.slug)}>{post.title}</Link>
                </h2>
                {post.excerpt && (
                  <p className={styles.excerpt}>{cleanText(post.excerpt)}</p>
                )}
              </div>

              <Link to={postPath(post.slug)} className={styles.readMore}>
                Читать далее
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
