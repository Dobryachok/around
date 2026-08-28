import HeroLandingBlock from '../components/hero/HeroLandingBlock';
import HeroNewsBlock from '../components/hero/HeroNewsBlock';
import CategorySection from '../components/home/CategorySection';
import AboutSection from '../components/home/AboutSection';
import StoriesShowcase from '../components/home/StoriesShowcase';
import Footer from '../components/layout/Footer';
import { getPinnedThemesBlock } from '../data/homePage';
import styles from './HomePage.module.css';

export default function HomePage() {
  const pinnedBlock = getPinnedThemesBlock();

  return (
    <>
      <div className={styles.heroBand}>
        <HeroLandingBlock />
        <StoriesShowcase />

        <main className={styles.main} data-nav-bg="light">
          {pinnedBlock && (
            <CategorySection
              title={pinnedBlock.title}
              themes={pinnedBlock.themes}
            />
          )}
          <HeroNewsBlock />
          <AboutSection />
        </main>

        <Footer flush />
      </div>
    </>
  );
}
