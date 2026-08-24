import { Link } from 'react-router-dom';
import type { ArchivePost } from '../../data/content';
import { cleanText } from '../../data/content';
import { postPath } from '../../data/routes';
import styles from './ArchivePostList.module.css';

interface ArchivePostListProps {
  posts: ArchivePost[];
}

export default function ArchivePostList({ posts }: ArchivePostListProps) {
  if (posts.length === 0) {
    return <p className={styles.empty}>В этой рубрике пока нет записей.</p>;
  }

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.item}>
          {post.image && (
            <div className={styles.thumb}>
              <Link to={postPath(post.slug)}>
                <img src={post.image} alt={post.title} loading="lazy" />
              </Link>
            </div>
          )}
          <div className={styles.body}>
            <h2 className={styles.postTitle}>
              <Link to={postPath(post.slug)}>{post.title}</Link>
            </h2>
            {post.excerpt && <p className={styles.excerpt}>{cleanText(post.excerpt)}</p>}
            {post.date && <div className={styles.date}>{post.date}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}
