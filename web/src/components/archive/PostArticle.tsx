import { cleanText } from '../../data/content';
import styles from './PostArticle.module.css';

interface PostArticleProps {
  title: string;
  date?: string;
  image?: string;
  content: string;
}

export default function PostArticle({ title, date, image, content }: PostArticleProps) {
  return (
    <article aria-label={title}>
      {(date || image) && (
        <header>
          {date && (
            <div className={styles.meta}>
              <time>{cleanText(date)}</time>
            </div>
          )}
          {image && (
            <div className={styles.featured}>
              <img src={image} alt={title} />
            </div>
          )}
        </header>
      )}
      <div className={styles.article} dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
