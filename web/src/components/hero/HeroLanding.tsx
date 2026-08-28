import { useEffect, useState } from 'react';
import { block1Images, heroImageFallbacks } from '../../data/images';
import { NEWS_SECTION_ID } from './heroIds';
import styles from './HeroLanding.module.css';

function HeroPhoto({
  src,
  fallback,
  frameClass,
  imgClass,
  animKey,
}: {
  src: string;
  fallback: string;
  frameClass: string;
  imgClass: string;
  animKey: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <div className={frameClass} key={animKey}>
      <img
        src={currentSrc}
        alt=""
        className={`${imgClass} ${styles.photoEnter}`}
        loading="eager"
        onError={() => {
          if (currentSrc !== fallback) setCurrentSrc(fallback);
        }}
      />
    </div>
  );
}

export default function HeroLanding() {
  return (
    <div className={`${styles.root} ${styles.landing}`}>
      <div className={styles.navSpacer} aria-hidden="true" />

      <div className={styles.layout}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Aroundmyself</h1>
          <div className={styles.introBody}>
            <p className={styles.tagline}>
              Открываю окно.
              <br />
              Впускаю невозможное.
            </p>
            <a className={styles.moreLink} href={`#${NEWS_SECTION_ID}`}>
              <span className={styles.moreLinkLabel}>Последние новости</span>
              <span className={styles.moreLinkArrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        <div className={styles.collage} aria-label="Избранные фотографии">
          <div className={styles.backingMain} aria-hidden="true" />
          <div className={styles.backingRight} aria-hidden="true" />
          <div className={styles.outline} aria-hidden="true" />

          <HeroPhoto
            animKey="block1-left"
            src={block1Images.left}
            fallback={heroImageFallbacks.photo1}
            frameClass={styles.leftStrip}
            imgClass={styles.leftStripImage}
          />

          <HeroPhoto
            animKey="block1-main"
            src={block1Images.main}
            fallback={heroImageFallbacks.photo1}
            frameClass={styles.mainFrame}
            imgClass={styles.mainPhoto}
          />

          <HeroPhoto
            animKey="block1-right"
            src={block1Images.right}
            fallback={heroImageFallbacks.photo3}
            frameClass={styles.rightFrame}
            imgClass={styles.rightPhoto}
          />

          <HeroPhoto
            animKey="block1-bottom"
            src={block1Images.bottom}
            fallback={heroImageFallbacks.photo1}
            frameClass={styles.bottomFrame}
            imgClass={styles.bottomPhoto}
          />

          <HeroPhoto
            animKey="block1-accent"
            src={block1Images.accent}
            fallback={heroImageFallbacks.photo3}
            frameClass={styles.accentFrame}
            imgClass={styles.accentPhoto}
          />

          <div className={styles.sequence} aria-hidden="true">
            <span>взгляд</span>
            <i />
            <span>история</span>
          </div>

          <aside className={styles.meta}>
            <p>
              Вдохновение
              <br />
              в деталях мира
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
