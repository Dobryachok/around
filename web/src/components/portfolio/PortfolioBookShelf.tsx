import type { BookItem } from '../../utils/parseLearnMore';
import shared from './portfolioShared.module.css';
import styles from './PortfolioBookShelf.module.css';

interface PortfolioBookShelfProps {
  books: BookItem[];
}

export default function PortfolioBookShelf({ books }: PortfolioBookShelfProps) {
  if (books.length === 0) {
    return <p className={styles.empty}>В этой рубрике пока нет записей.</p>;
  }

  return (
    <section className={shared.section} aria-label="Книги">
      <ul className={styles.list}>
        {books.map((book) => (
          <li key={book.title}>
            <article className={styles.card}>
              {book.image && (
                <div className={styles.cover}>
                  <img src={book.image} alt={book.title} loading="lazy" />
                </div>
              )}
              <div className={styles.body}>
                <h3 className={styles.title}>{book.title}</h3>
                {book.year && <div className={styles.year}>{book.year}</div>}
                {book.description && <p className={styles.description}>{book.description}</p>}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
