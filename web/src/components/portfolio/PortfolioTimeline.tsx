import { Link } from 'react-router-dom';
import type { PortfolioPost } from '../../data/portfolio';
import { cleanText } from '../../data/content';
import { postPath } from '../../data/routes';
import shared from './portfolioShared.module.css';
import styles from './PortfolioTimeline.module.css';

interface PortfolioTimelineProps {
  posts: PortfolioPost[];
}

export default function PortfolioTimeline({ posts }: PortfolioTimelineProps) {
  if (posts.length === 0) {
    return <p className={styles.empty}>В этой рубрике пока нет записей.</p>;
  }

  return (
    <section className={shared.section} aria-label="Интервью">
      <ol className={styles.list}>
        {posts.map((post) => (
          <li key={post.slug} className={styles.item}>
            <div className={styles.date}>{cleanText(post.date)}</div>
            <div className={styles.body}>
              <h3 className={styles.title}>
                <Link to={postPath(post.slug)}>{post.title}</Link>
              </h3>
              {post.excerpt && <p className={styles.excerpt}>{cleanText(post.excerpt)}</p>}
            </div>
            {post.image && (
              <Link to={postPath(post.slug)} className={styles.thumb}>
                <img src={post.image} alt={post.title} loading="lazy" />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
