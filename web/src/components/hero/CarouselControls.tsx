import styles from './CarouselControls.module.css';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  variant?: 'light' | 'dark' | 'muted';
  size?: 'default' | 'large';
}

export default function CarouselControls({
  onPrev,
  onNext,
  variant = 'light',
  size = 'default',
}: CarouselControlsProps) {
  const variantClass =
    variant === 'dark' ? styles.dark : variant === 'muted' ? styles.muted : styles.light;
  const sizeClass = size === 'large' ? styles.large : '';

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${styles.btn} ${variantClass} ${sizeClass}`}
        onClick={onPrev}
        aria-label="Предыдущая"
      >
        ←
      </button>
      <button
        type="button"
        className={`${styles.btn} ${variantClass} ${sizeClass}`}
        onClick={onNext}
        aria-label="Следующая"
      >
        →
      </button>
    </div>
  );
}
