import type { AchievementItem } from '../../utils/parseAchievements';
import shared from './portfolioShared.module.css';
import styles from './PortfolioAchievements.module.css';

interface PortfolioAchievementsProps {
  items: AchievementItem[];
}

export default function PortfolioAchievements({ items }: PortfolioAchievementsProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>В этой рубрике пока нет записей.</p>;
  }

  return (
    <section className={shared.section} aria-label="Достижения">
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={`${item.text}-${index}`}>
            <article className={styles.entry}>
              {item.text && <p className={styles.text}>{item.text}</p>}
              {item.image && (
                <div className={styles.imageWrap}>
                  <img src={item.image} alt={item.text.slice(0, 80)} loading="lazy" />
                </div>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
