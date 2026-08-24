import HeroLandingBlock from '../components/hero/HeroLandingBlock';
import HeroNewsBlock from '../components/hero/HeroNewsBlock';
import CategorySection from '../components/home/CategorySection';
import AboutSection from '../components/home/AboutSection';
import StoriesShowcase from '../components/home/StoriesShowcase';
import Footer from '../components/layout/Footer';
import { heroImages } from '../data/images';
import { getPinnedThemesBlock } from '../data/homePage';
import styles from './HomePage.module.css';

export default function HomePage() {
  const pinnedBlock = getPinnedThemesBlock();

  const bandStyle = {
    backgroundImage: [
      'linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.22) 14%, rgba(255, 255, 255, 0.08) 32%, rgba(238, 242, 246, 0.42) 58%, rgba(238, 242, 246, 0.72) 78%, rgba(244, 245, 246, 0.9) 100%)',
      'linear-gradient(118deg, rgba(255, 255, 255, 0.96) 0%, rgba(242, 243, 242, 0.9) 36%, rgba(216, 224, 248, 0.84) 62%, rgba(232, 236, 248, 0.88) 100%)',
      `url(${heroImages.bg})`,
    ].join(', '),
  };

  return (
    <>
      <div className={styles.heroBand} style={bandStyle}>
        <div className={styles.heroAtmosphere} aria-hidden="true">
          <span className={`${styles.glow} ${styles.glowWarm}`} />
          <span className={`${styles.glow} ${styles.glowSoft}`} />
          <span className={`${styles.glow} ${styles.glowCool}`} />
          <span className={`${styles.glow} ${styles.glowCoolDeep}`} />
          <span className={`${styles.glow} ${styles.glowWarmLate}`} />
        </div>

        <HeroLandingBlock />
        <HeroNewsBlock />
        <StoriesShowcase />

        <main className={styles.main} data-nav-bg="light">
          {pinnedBlock && (
            <CategorySection
              title={pinnedBlock.title}
              themes={pinnedBlock.themes}
            />
          )}
          <AboutSection />
        </main>

        <Footer flush />
      </div>
    </>
  );
}
