import type { ReactNode } from 'react';
import Footer from './Footer';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  title?: string;
  children: ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className={styles.page} data-nav-bg="light">
      <main className={styles.main}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
}
