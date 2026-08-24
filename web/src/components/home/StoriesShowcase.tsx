import { Link } from 'react-router-dom';
import { block3Images } from '../../data/images';
import { categoryPath } from '../../data/routes';
import styles from './StoriesShowcase.module.css';

const gallery = [
  { src: block3Images.gallery1, alt: 'Поющая птица' },
  { src: block3Images.gallery2, alt: 'Портрет человека' },
  { src: block3Images.gallery3, alt: 'Дятел на дереве' },
  { src: block3Images.gallery4, alt: 'Портрет человека с чашкой' },
];

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
          <figure
            className={styles.feature}
            aria-label="Птица и человек — две стороны одной истории"
          >
            <div className={`${styles.featureHalf} ${styles.featureAnimal}`}>
              <img
                src={block3Images.featureLeft}
                alt="Птица"
                loading="lazy"
              />
            </div>
            <div className={`${styles.featureHalf} ${styles.featurePerson}`}>
              <img
                src={block3Images.featureRight}
                alt="Правая половина мужского портрета"
                loading="lazy"
              />
            </div>
          </figure>

          <div className={styles.gallery}>
            {gallery.map((image, index) => (
              <figure className={styles.galleryItem} key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{String(index + 1).padStart(2, '0')}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
