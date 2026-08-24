import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { ContentTag } from '../../types/contentTag';
import styles from './NavTagDropdown.module.css';

interface NavTagDropdownProps {
  label: string;
  href: string;
  tags: ContentTag[];
  mobile?: boolean;
  menuKind?: 'blog' | 'texts';
  extendToViewport?: boolean;
  heroBlur?: boolean;
  onNavigate?: () => void;
}

export default function NavTagDropdown({
  label,
  href,
  tags,
  mobile = false,
  menuKind,
  extendToViewport = false,
  heroBlur = false,
  onNavigate,
}: NavTagDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', closeOnOutsideClick);
    return () => window.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div
      ref={ref}
      className={`${styles.dropdown} ${mobile ? styles.dropdownMobile : ''}`}
    >
      <button
        type="button"
        className={`${styles.trigger} ${mobile ? styles.triggerMobile : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {label}
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>⌄</span>
      </button>

      {open && (
        <div
          className={[
            styles.menu,
            menuKind === 'blog' ? styles.blogMenu : '',
            menuKind === 'texts' ? styles.textsMenu : '',
            extendToViewport ? styles.extendToViewport : '',
            heroBlur ? styles.menuHeroBlur : '',
            mobile ? styles.menuMobile : '',
          ].join(' ')}
          role="menu"
        >
          <Link
            to={href}
            className={styles.allLink}
            style={{ '--item-index': 0 } as CSSProperties}
            onClick={close}
          >
            Все записи
          </Link>
          {tags.map((tag, index) => (
            <Link
              key={tag.slug}
              to={`${href}?filter=${encodeURIComponent(`tag:${tag.slug}`)}`}
              className={styles.tagLink}
              style={{ '--item-index': index + 1 } as CSSProperties}
              onClick={close}
              role="menuitem"
            >
              <span
                className={styles.dot}
                style={{ backgroundColor: tag.color }}
                aria-hidden="true"
              />
              {tag.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
