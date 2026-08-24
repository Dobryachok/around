import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import styles from './PostList.module.css';

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>В этой подборке пока нет дополнительных материалов.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {posts.map((post, index) => (
        <li key={post.url} className={styles.row}>
          <Link to={post.url} className={styles.item}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.body}>
              <span className={styles.title}>{post.title}</span>
              <span className={styles.meta}>
                {post.date && <time className={styles.date}>{post.date}</time>}
                {post.date && post.excerpt && (
                  <span className={styles.metaSep} aria-hidden="true">
                    ·
                  </span>
                )}
                {post.excerpt && (
                  <span className={styles.excerpt}>{post.excerpt}</span>
                )}
              </span>
            </span>
            {post.image && (
              <span className={styles.thumb}>
                <img src={post.image} alt="" loading="lazy" />
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
