import { useState, type MouseEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { heroNavItems } from '../../data/navigation';
import { scrollToContacts } from '../../data/navUtils';
import { useContentTags } from '../../hooks/useContentTags';
import type { NavTone } from '../../utils/navTone';
import NavTagDropdown from './NavTagDropdown';
import gridStyles from './heroGrid.module.css';
import styles from './HeroNav.module.css';

interface HeroNavProps {
  tone: NavTone;
  heroGrid?: boolean;
  transparentBackground?: boolean;
}

function NavItemLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const linkClass = className ?? styles.link;

  if (href === '/') {
    const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onNavigate?.();
      if (isHome) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <Link to="/" className={linkClass} onClick={handleHomeClick}>
        {children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    const handleHashClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onNavigate?.();

      if (href === '#contacts') {
        if (isHome) {
          scrollToContacts();
        } else {
          navigate('/#contacts');
        }
      }
    };

    return (
      <a href={href} className={linkClass} onClick={handleHashClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={linkClass} onClick={onNavigate}>
      {children}
    </Link>
  );
}

export default function HeroNav({
  tone,
  heroGrid = false,
  transparentBackground = false,
}: HeroNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toneClass = tone === 'dark' ? styles.toneDark : styles.toneLight;
  const closeMenu = () => setMenuOpen(false);
  const blogTags = useContentTags('blog').tags;
  const textTags = useContentTags('texts').tags;

  const [, portfolio, blog, photos, texts, contacts] = heroNavItems;

  return (
    <nav
      className={[
        styles.nav,
        toneClass,
        heroGrid ? styles.heroGridNav : '',
        transparentBackground ? styles.transparentBackground : '',
      ].join(' ')}
    >
      <div
        className={`${styles.desktopRow} ${heroGrid ? `${gridStyles.gridColumns} ${gridStyles.gridLineH}` : ''}`}
      >
        {heroGrid ? (
          <>
            <div className={`${styles.navGridHome} ${gridStyles.gridLineV}`}>
              <NavItemLink href={heroNavItems[0].href}>{heroNavItems[0].label}</NavItemLink>
            </div>
            <div className={`${styles.navGridPortfolio} ${gridStyles.gridLineV}`}>
              <NavItemLink href={portfolio.href}>{portfolio.label}</NavItemLink>
            </div>
            <div className={`${styles.navGridCenter} ${gridStyles.gridLineV}`}>
              <NavTagDropdown
                label={blog.label}
                href={blog.href}
                tags={blogTags}
                menuKind="blog"
                heroBlur={transparentBackground}
              />
              <NavItemLink href={photos.href}>{photos.label}</NavItemLink>
            </div>
            <div className={styles.navGridRight}>
              <NavTagDropdown
                label={texts.label}
                href={texts.href}
                tags={textTags}
                menuKind="texts"
                heroBlur={transparentBackground}
              />
              <NavItemLink href={contacts.href}>{contacts.label}</NavItemLink>
            </div>
          </>
        ) : (
          <>
            <div className={styles.navLeft}>
              <NavItemLink href={heroNavItems[0].href}>{heroNavItems[0].label}</NavItemLink>
            </div>

            <div className={styles.navRight}>
              <div className={styles.navSection}>
                <NavItemLink href={portfolio.href}>{portfolio.label}</NavItemLink>
              </div>
              <div className={styles.navSection}>
                <NavTagDropdown
                  label={blog.label}
                  href={blog.href}
                  tags={blogTags}
                  menuKind="blog"
                  heroBlur={transparentBackground}
                />
                <NavItemLink href={photos.href}>{photos.label}</NavItemLink>
              </div>
              <div className={styles.navSection}>
                <NavTagDropdown
                  label={texts.label}
                  href={texts.href}
                  tags={textTags}
                  menuKind="texts"
                  extendToViewport
                  heroBlur={transparentBackground}
                />
                <NavItemLink href={contacts.href}>{contacts.label}</NavItemLink>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.mobileRow}>
        <NavItemLink href="/" onNavigate={closeMenu}>
          Главная
        </NavItemLink>
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {heroNavItems.slice(1).map((item) => {
            if (item.href === blog.href) {
              return (
                <NavTagDropdown
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  tags={blogTags}
                  mobile
                  menuKind="blog"
                  heroBlur={transparentBackground}
                  onNavigate={closeMenu}
                />
              );
            }

            if (item.href === texts.href) {
              return (
                <NavTagDropdown
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  tags={textTags}
                  mobile
                  menuKind="texts"
                  heroBlur={transparentBackground}
                  onNavigate={closeMenu}
                />
              );
            }

            return (
              <NavItemLink
                key={item.label}
                href={item.href}
                className={styles.mobileLink}
                onNavigate={closeMenu}
              >
                {item.label}
              </NavItemLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}
