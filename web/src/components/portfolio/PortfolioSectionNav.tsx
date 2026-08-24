import { PORTFOLIO_SECTIONS, type PortfolioSectionId } from '../../data/portfolio';
import styles from './PortfolioSectionNav.module.css';

interface PortfolioSectionNavProps {
  activeSection: PortfolioSectionId;
  onSectionChange: (sectionId: PortfolioSectionId) => void;
}

export default function PortfolioSectionNav({
  activeSection,
  onSectionChange,
}: PortfolioSectionNavProps) {
  return (
    <nav className={styles.nav} aria-label="Рубрики портфолио">
      <ul className={styles.list}>
        {PORTFOLIO_SECTIONS.map((section) => {
          const isActive = section.id === activeSection;

          return (
            <li key={section.id}>
              <button
                type="button"
                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                onClick={() => onSectionChange(section.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                {section.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
