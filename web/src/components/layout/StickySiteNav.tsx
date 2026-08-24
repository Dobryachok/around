import HeroNav from '../hero/HeroNav';
import styles from './StickySiteNav.module.css';

export default function StickySiteNav() {
  return (
    <div
      className={`${styles.wrap} ${styles.homeOverlay} ${styles.homeHeroBlur}`}
      data-site-nav
    >
      <HeroNav tone="light" heroGrid transparentBackground />
    </div>
  );
}
