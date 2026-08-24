import { useState } from 'react';
import { newsItems } from '../../data/news';
import HeroNews from './HeroNews';
import { NEWS_SECTION_ID } from './heroIds';
import styles from './HeroNewsBlock.module.css';

export default function HeroNewsBlock() {
  const [newsIndex, setNewsIndex] = useState(0);

  const prevNews = () => {
    setNewsIndex((i) => (i === 0 ? newsItems.length - 1 : i - 1));
  };

  const nextNews = () => {
    setNewsIndex((i) => (i === newsItems.length - 1 ? 0 : i + 1));
  };

  const selectNews = (index: number) => {
    setNewsIndex(index);
  };

  return (
    <section className={styles.section} id={NEWS_SECTION_ID} data-nav-bg="dark">
      <HeroNews
        item={newsItems[newsIndex]}
        items={newsItems}
        activeIndex={newsIndex}
        onPrev={prevNews}
        onNext={nextNews}
        onSelect={selectNews}
      />
    </section>
  );
}
