import { useCallback, useEffect } from 'react';
import styles from './ImageLightbox.module.css';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'ArrowLeft' && hasPrev) {
        onNavigate(currentIndex - 1);
      }
      if (event.key === 'ArrowRight' && hasNext) {
        onNavigate(currentIndex + 1);
      }
    },
    [currentIndex, hasNext, hasPrev, onClose, onNavigate],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
        ×
      </button>

      {hasPrev && (
        <button
          type="button"
          className={`${styles.nav} ${styles.navPrev}`}
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          aria-label="Предыдущее фото"
        >
          ‹
        </button>
      )}

      <img
        src={images[currentIndex]}
        alt=""
        className={styles.image}
        onClick={(event) => event.stopPropagation()}
      />

      {hasNext && (
        <button
          type="button"
          className={`${styles.nav} ${styles.navNext}`}
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          aria-label="Следующее фото"
        >
          ›
        </button>
      )}
    </div>
  );
}
