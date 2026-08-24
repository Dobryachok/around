import { footer } from '../../data/author';
import styles from './Footer.module.css';

interface FooterProps {
  flush?: boolean;
}

export default function Footer({ flush = false }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${flush ? styles.flush : ''}`}>
      <div className={styles.inner}>
        <p className={styles.text}>
          {footer.text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < footer.text.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
