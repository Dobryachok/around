import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import styles from './FeaturedPost.module.css';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const photoStyle = post.image ? { backgroundImage: `url(${post.image})` } : undefined;

  return (
    <article className={styles.featured}>
      {post.image && (
        <>
          <div className={styles.photo} style={photoStyle} />
          <div className={styles.photoBlur} style={photoStyle} aria-hidden="true" />
        </>
      )}
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true" />
      <div className={styles.mark} aria-hidden="true" />
      <div className={styles.markEnd} aria-hidden="true" />

      <div className={styles.copy}>
        {post.date && <time className={styles.date}>{post.date}</time>}
        <h3 className={styles.title}>
          <Link to={post.url}>{post.title}</Link>
        </h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <Link to={post.url} className={styles.cta}>
          Читать
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
