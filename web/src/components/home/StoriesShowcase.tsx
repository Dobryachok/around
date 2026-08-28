import { Link } from 'react-router-dom';
import { block3Images } from '../../data/images';
import { categoryPath } from '../../data/routes';
import styles from './StoriesShowcase.module.css';

const gallery = [
  { src: block3Images.gallery1, alt: 'Поющая птица' },
  { src: block3Images.gallery2, alt: 'Портрет человека' },
  { src: block3Images.gallery3, alt: 'Птица на тёмном фоне' },
  { src: block3Images.gallery4, alt: 'Портрет человека с чашкой' },
];

const mobileFacePairs = [
  {
    left: gallery[0],
    right: gallery[1],
  },
  {
    left: gallery[2],
    right: gallery[3],
  },
  {
    left: { src: block3Images.gallery5, alt: 'Птица крупным планом' },
    right: { src: block3Images.gallery6, alt: 'Портрет женщины' },
  },
];

function PrimaryFacePair({ shellClassName }: { shellClassName: string }) {
  return (
    <div className={shellClassName}>
      <div className={styles.primaryFaceShadowWrap}>
        <figure className={styles.primaryFacePair}>
          <div className={`${styles.primaryFaceHalf} ${styles.primaryFaceBird}`}>
            <img src={block3Images.featureLeft} alt="Птица" loading="lazy" />
            <span className={styles.primaryFaceNumber} aria-hidden="true">
              01
            </span>
          </div>
          <div className={`${styles.primaryFaceHalf} ${styles.primaryFacePerson}`}>
            <img src={block3Images.featureRight} alt="Портрет человека" loading="lazy" />
            <span className={styles.primaryFaceNumber} aria-hidden="true">
              02
            </span>
          </div>
        </figure>
      </div>
    </div>
  );
}

function GalleryPhoto({
  image,
  number,
}: {
  image: (typeof gallery)[number];
  number: string;
}) {
  return (
    <figure className={styles.galleryItem}>
      <div className={styles.galleryItemShadowWrap}>
        <div className={styles.galleryItemFrame}>
          <img src={image.src} alt={image.alt} loading="lazy" />
          <figcaption>{number}</figcaption>
        </div>
      </div>
    </figure>
  );
}

function MobileFacePair({
  pair,
  startNumber,
}: {
  pair: (typeof mobileFacePairs)[number];
  startNumber: number;
}) {
  return (
    <figure className={`${styles.mobileGalleryItem} ${styles.mobileFacePair}`}>
      <div className={styles.mobileGalleryShadowWrap}>
        <div className={`${styles.mobileFaceHalf} ${styles.mobileFaceLeft}`}>
          <img src={pair.left.src} alt={pair.left.alt} loading="lazy" />
          <span className={styles.mobileFaceNumber} aria-hidden="true">
            {String(startNumber).padStart(2, '0')}
          </span>
        </div>
        <div className={`${styles.mobileFaceHalf} ${styles.mobileFaceRight}`}>
          <img src={pair.right.src} alt={pair.right.alt} loading="lazy" />
          <span className={styles.mobileFaceNumber} aria-hidden="true">
            {String(startNumber + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </figure>
  );
}

export default function StoriesShowcase() {
  return (
    <section
      className={styles.section}
      aria-labelledby="stories-showcase-heading"
      data-nav-bg="light"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>В объективе — жизнь</span>
          <h2 id="stories-showcase-heading" className={styles.heading}>
            Люди. Птицы.
            <br />
            Истории.
          </h2>
          <p className={styles.lead}>
            В каждом кадре — характер, эмоция и момент, который говорит сам за себя.
          </p>

          <Link to={categoryPath('photo')} className={styles.cta}>
            Смотреть фотографии
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.visual}>
          <div className={styles.orbit} aria-hidden="true" />
          <PrimaryFacePair shellClassName={styles.feature} />

          <div className={styles.gallery}>
            {gallery.map((image, index) => (
              <GalleryPhoto
                key={image.src}
                image={image}
                number={String(index + 3).padStart(2, '0')}
              />
            ))}
          </div>

          <div className={styles.mobileGallery} aria-label="Галерея фотографий">
            <PrimaryFacePair shellClassName={styles.mobileGalleryItem} />
            {mobileFacePairs.map((pair, index) => (
              <MobileFacePair
                key={`${pair.left.src}-${pair.right.src}`}
                pair={pair}
                startNumber={index * 2 + 3}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
