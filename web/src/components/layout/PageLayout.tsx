import type { ReactNode } from 'react';
import Footer from './Footer';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'archive';
}

export default function PageLayout({
  title,
  children,
  variant = 'default',
}: PageLayoutProps) {
  return (
    <div className={styles.page} data-nav-bg="light">
      <main className={styles.main} data-layout={variant}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
}
