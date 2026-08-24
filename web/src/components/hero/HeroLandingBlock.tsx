import HeroLanding from './HeroLanding';
import styles from './HeroLandingBlock.module.css';

export default function HeroLandingBlock() {
  return (
    <section className={`${styles.section} ${styles.landing}`} id="hero" data-nav-bg="light">
      <HeroLanding />
    </section>
  );
}

export { NEWS_SECTION_ID } from './heroIds';
