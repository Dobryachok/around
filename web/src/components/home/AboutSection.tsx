import { author } from '../../data/author';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.section} aria-labelledby="about-heading" data-nav-bg="light">
      <div className={styles.inner}>
        <h2 id="about-heading" className={styles.heading}>
          {author.greeting}
        </h2>

        <div className={styles.content}>
          <div className={styles.pair}>
            <div className={styles.visual}>
              <div className={styles.photoWrap}>
                <div className={styles.frame} aria-hidden="true" />
                <div className={styles.mark} aria-hidden="true" />
                <div className={styles.markEnd} aria-hidden="true" />
                <img
                  src={author.image}
                  alt={author.fullName}
                  loading="lazy"
                  width={280}
                  height={350}
                />
              </div>
            </div>

            <div className={styles.copy}>
              <p className={styles.lead}>{author.paragraphs[0]}</p>

              <div className={styles.body}>
                {author.paragraphs.slice(1).map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <p className={styles.closing}>{author.closing}</p>
            </div>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.caption}>
              <span className={styles.captionName}>{author.fullName}</span>
              <span className={styles.captionRole}>{author.name}</span>
            </div>

            <div className={styles.social} id="contacts">
              <h3 className={styles.socialHeading}>{author.socialHeading}</h3>
              <p className={styles.socialText}>{author.socialText}</p>
              <div className={styles.links}>
                <a
                  href={author.telegram}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                  <span aria-hidden="true">→</span>
                </a>
                <a
                  href={author.vk}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VK
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
