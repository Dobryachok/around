import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Админ-панель</h1>
          <p className={styles.subtitle}>Управление записями, тегами и главной страницей</p>
        </div>
        <div className={styles.actions}>
          <a href="/" className={styles.link}>На сайт</a>
          <button type="button" onClick={logout}>Выйти</button>
        </div>
      </header>
      <nav className={styles.nav}>
        <NavLink to="/admin" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
          Записи
        </NavLink>
        <NavLink to="/admin/tags" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
          Теги
        </NavLink>
        <NavLink to="/admin/home" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
          Главная
        </NavLink>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
