import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { scrollToContacts } from '../../data/navUtils';
import StickySiteNav from './StickySiteNav';
import styles from './SiteLayout.module.css';

export default function SiteLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (location.hash !== '#contacts') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash !== '#contacts') return;

    const frame = requestAnimationFrame(() => {
      scrollToContacts();
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <>
      <StickySiteNav />
      <div className={isHome ? styles.home : styles.page}>
        <Outlet />
      </div>
    </>
  );
}
