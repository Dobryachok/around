import { useMemo, useState } from 'react';
import {
  extractGalleryImages,
  extractThemeIntro,
  formatArticleIntro,
  formatPoeticIntro,
} from '../../utils/themeContent';
import ImageLightbox from './ImageLightbox';
import styles from './PhotoThemeArticle.module.css';

interface PhotoThemeArticleProps {
  title: string;
  date?: string;
  image?: string;
  content: string;
  categoryLabel: string;
  categoryHref: string;
  introStyle?: 'poetic' | 'article';
}

export default function PhotoThemeArticle({
  title,
  date,
  image,
  content,
  categoryLabel,
  categoryHref,
  introStyle = 'poetic',
}: PhotoThemeArticleProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const intro =
    introStyle === 'article'
      ? formatArticleIntro(content)
      : formatPoeticIntro(extractThemeIntro(content));
  const galleryImages = extractGalleryImages(content, image);
  const allImages = useMemo(
    () => (image ? [image, ...galleryImages] : galleryImages),
    [galleryImages, image],
  );

  return (
    <article className={styles.article} aria-label={title}>
      <header className={styles.header}>
        <div className={styles.meta}>
          {date && <time>{date}</time>}
          <span className={styles.metaDivider}>·</span>
          <a href={categoryHref}>{categoryLabel}</a>
        </div>
      </header>

      {image && (
        <button
          type="button"
          className={styles.featured}
          onClick={() => setLightboxIndex(0)}
          aria-label={`Открыть фото: ${title}`}
        >
          <img src={image} alt={title} />
        </button>
      )}

      {intro.length > 0 && (
        <div className={`${styles.intro} ${introStyle === 'article' ? styles.introArticle : ''}`}>
          {intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className={styles.gallery}>
          {galleryImages.map((src, index) => {
            const imageIndex = image ? index + 1 : index;

            return (
              <button
                key={src}
                type="button"
                className={styles.galleryItem}
                onClick={() => setLightboxIndex(imageIndex)}
                aria-label="Открыть фото"
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </article>
  );
}
