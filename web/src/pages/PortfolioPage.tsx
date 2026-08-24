import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PortfolioAchievements from '../components/portfolio/PortfolioAchievements';
import PortfolioBookShelf from '../components/portfolio/PortfolioBookShelf';
import PortfolioPublicationList from '../components/portfolio/PortfolioPublicationList';
import PortfolioSectionNav from '../components/portfolio/PortfolioSectionNav';
import PortfolioTimeline from '../components/portfolio/PortfolioTimeline';
import PageLayout from '../components/layout/PageLayout';
import {
  DEFAULT_PORTFOLIO_SECTION,
  getPortfolioAchievements,
  getPortfolioBooks,
  getPortfolioPosts,
  PORTFOLIO_SECTIONS,
  type PortfolioSectionId,
} from '../data/portfolio';
import styles from './PortfolioPage.module.css';

export default function PortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionFromUrl = searchParams.get('section');
  const activeSection =
    PORTFOLIO_SECTIONS.find((section) => section.id === sectionFromUrl)?.id ??
    DEFAULT_PORTFOLIO_SECTION;
  const interviews = useMemo(() => getPortfolioPosts('interview'), []);
  const publications = useMemo(() => getPortfolioPosts('publikacii'), []);
  const books = useMemo(() => getPortfolioBooks(), []);
  const achievements = useMemo(() => getPortfolioAchievements(), []);

  const handleSectionChange = (sectionId: PortfolioSectionId) => {
    if (sectionId === DEFAULT_PORTFOLIO_SECTION) {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ section: sectionId }, { replace: true });
  };

  return (
    <PageLayout>
      <div className={styles.page} data-nav-bg="light">
        <header className={styles.header}>
          <h1 className={styles.title}>Портфолио</h1>
          <PortfolioSectionNav
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </header>

        <div className={styles.content} key={activeSection}>
          {activeSection === 'interview' && <PortfolioTimeline posts={interviews} />}
          {activeSection === 'publikacii' && <PortfolioPublicationList posts={publications} />}
          {activeSection === 'books' && <PortfolioBookShelf books={books} />}
          {activeSection === 'dostizheniya' && <PortfolioAchievements items={achievements} />}
        </div>
      </div>
    </PageLayout>
  );
}
