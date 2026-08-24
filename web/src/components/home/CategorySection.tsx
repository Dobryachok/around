import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import CarouselControls from '../hero/CarouselControls';
import styles from './CategorySection.module.css';

interface CategorySectionProps {
  title: string;
  themes: Post[];
}

export default function CategorySection({ title, themes }: CategorySectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const card = track.querySelector<HTMLElement>(`.${styles.card}`);
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.7;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  if (themes.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} data-nav-bg="light">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.glowSoft} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowMirror}`} aria-hidden="true" />
      <div className={`${styles.glowSoft} ${styles.glowSoftMirror}`} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>Подборка</span>
            <h2 className={styles.heading}>{title}</h2>
          </div>

          {themes.length > 1 && (
            <div className={styles.headerActions}>
              <CarouselControls
                onPrev={() => scrollByCard(-1)}
                onNext={() => scrollByCard(1)}
                variant="muted"
              />
            </div>
          )}
        </header>

        <div
          className={styles.track}
          ref={trackRef}
          aria-label={`Закреплённые темы: ${title}`}
        >
          {themes.map((theme) => {
            const photoStyle = theme.image
              ? { backgroundImage: `url(${theme.image})` }
              : undefined;

            return (
              <article className={styles.card} key={theme.url}>
                <Link to={theme.url} className={styles.cardLink}>
                  {theme.image ? (
                    <div className={styles.photo} style={photoStyle} />
                  ) : (
                    <div className={styles.mediaFallback} aria-hidden="true" />
                  )}
                  <div className={styles.photoBlur} aria-hidden="true" />
                  <div className={styles.shade} aria-hidden="true" />
                  <div className={styles.frame} aria-hidden="true" />
                  <div className={styles.mark} aria-hidden="true" />
                  <div className={styles.markEnd} aria-hidden="true" />

                  <div className={styles.copy}>
                    <div className={styles.copyMain}>
                      {theme.date && (
                        <time className={styles.date}>{theme.date}</time>
                      )}
                      <h3 className={styles.title}>{theme.title}</h3>
                      <p className={styles.excerpt}>{theme.excerpt}</p>
                    </div>

                    <span className={styles.read}>
                      Читать
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
