import { Link } from 'react-router-dom';
import type { NewsItem } from '../../types';
import NewsCarousel from './NewsCarousel';
import styles from './HeroNews.module.css';

interface HeroNewsProps {
  item: NewsItem;
  items: NewsItem[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export default function HeroNews({
  item,
  items,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
}: HeroNewsProps) {
  const photoStyle = { backgroundImage: `url(${item.image})` };

  return (
    <div className={styles.root}>
      <div className={styles.stage}>
        <div className={styles.feature} key={item.id}>
          <div className={styles.featurePhoto} style={photoStyle} />
          <div className={styles.featurePhotoBlur} style={photoStyle} aria-hidden="true" />
          <div className={styles.featureShade} />
          <div className={styles.featureFrame} aria-hidden="true" />
          <div className={styles.featureMark} aria-hidden="true" />
          <div className={styles.featureMarkEnd} aria-hidden="true" />

          <div className={styles.featureCopy}>
            <span className={styles.label}>Последние новости</span>
            <h2 className={styles.headline}>{item.title}</h2>
            <p className={styles.excerpt}>{item.excerpt}</p>
            <Link to={item.url} className={styles.cta}>
              Читать новость
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <NewsCarousel
            items={items}
            activeIndex={activeIndex}
            onSelect={onSelect}
            onPrev={onPrev}
            onNext={onNext}
          />
        </aside>
      </div>

      <div className={styles.dots} aria-label="Навигация по новостям">
        {items.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
            onClick={() => onSelect(index)}
            aria-label={`Новость ${index + 1}: ${entry.cardTitle}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
