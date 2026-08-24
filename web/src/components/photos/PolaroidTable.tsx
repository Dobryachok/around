import { Link } from 'react-router-dom';
import { cleanText } from '../../data/content';
import type { PolaroidCard } from '../../data/polaroidCards';
import { polaroidTableBg } from '../../data/polaroidCards';
import { postPath } from '../../data/routes';
import styles from './PolaroidTable.module.css';

interface PolaroidTableProps {
  cards: PolaroidCard[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function PolaroidTable({ cards, searchQuery, onSearchChange }: PolaroidTableProps) {
  return (
    <section
      className={styles.section}
      style={{ backgroundImage: `url(${polaroidTableBg})` }}
      aria-label="Фотографии"
      data-nav-bg="light"
    >
      <div className={styles.scene}>
        {cards.map((card) => (
          <Link
            key={card.slug}
            to={postPath(card.slug)}
            className={styles.polaroid}
            style={{
              top: card.top,
              left: card.left,
              zIndex: card.zIndex,
              ['--rotate' as string]: `${card.rotate}deg`,
            }}
          >
            <div className={styles.photoFrame}>
              <img src={card.image} alt={card.title} loading="lazy" />
            </div>
            <p className={styles.caption}>{cleanText(card.title)}</p>
          </Link>
        ))}

        <label className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по темам..."
            aria-label="Поиск по темам фотографий"
          />
        </label>
      </div>
    </section>
  );
}
