import type { NewsItem } from '../../types';
import CarouselControls from './CarouselControls';
import styles from './NewsCarousel.module.css';

interface NewsCarouselProps {
  items: NewsItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function NewsCarousel({
  items,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
}: NewsCarouselProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.heading}>Последние новости</span>
        <div className={styles.headerControls}>
          <CarouselControls onPrev={onPrev} onNext={onNext} variant="muted" />
        </div>
      </div>

      <ul className={styles.list}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <li key={item.id} className={styles.row}>
              <button
                type="button"
                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                onClick={() => onSelect(index)}
                aria-label={item.cardTitle}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className={styles.index}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.body}>
                  <span className={styles.title}>{item.cardTitle}</span>
                  <span className={styles.meta}>
                    <time className={styles.date}>{item.date}</time>
                    <span className={styles.metaSep} aria-hidden="true">
                      ·
                    </span>
                    <span>{item.location}</span>
                  </span>
                </span>
                <span className={styles.thumb}>
                  <img src={item.image} alt="" loading="lazy" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
