import { Link } from 'react-router-dom';
import type { PortfolioPost } from '../../data/portfolio';
import { cleanText } from '../../data/content';
import { postPath } from '../../data/routes';
import shared from './portfolioShared.module.css';
import styles from './PortfolioPublicationList.module.css';

interface PortfolioPublicationListProps {
  posts: PortfolioPost[];
}

export default function PortfolioPublicationList({ posts }: PortfolioPublicationListProps) {
  if (posts.length === 0) {
    return <p className={styles.empty}>В этой рубрике пока нет записей.</p>;
  }

  return (
    <section className={shared.section} aria-label="Публикации">
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.slug} className={styles.item}>
            <div className={styles.meta}>{cleanText(post.date)}</div>
            <h3 className={styles.title}>
              <Link to={postPath(post.slug)}>{post.title}</Link>
            </h3>
            {post.excerpt && <p className={styles.excerpt}>{cleanText(post.excerpt)}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
