import { useEffect, useRef, type CSSProperties } from 'react';
import type { TagFilterOption } from '../../types/themedPost';
import styles from './BlogThemeFilter.module.css';

interface BlogThemeFilterProps {
  filters: readonly TagFilterOption[];
  open: boolean;
  selectedFilters: string[];
  onToggleFilter: (key: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function BlogThemeFilter({
  filters,
  open,
  selectedFilters,
  onToggleFilter,
  onClear,
  onClose,
}: BlogThemeFilterProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div ref={panelRef} className={styles.panel} role="dialog" aria-label="Фильтр по тегам">
      <div className={styles.header}>
        <span className={styles.title}>Теги и подтеги</span>
        {selectedFilters.length > 0 && (
          <button type="button" className={styles.clear} onClick={onClear}>
            Сбросить
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {filters.map((filter) => {
          const key = `${filter.kind}:${filter.slug}`;
          const checked = selectedFilters.includes(key);

          return (
            <li key={key}>
              <label
                className={`${styles.option} ${filter.kind === 'subtag' ? styles.subtagOption : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleFilter(key)}
                />
                <span
                  className={`${styles.badge} ${filter.kind === 'subtag' ? styles.subtagBadge : ''}`}
                  style={{ '--tag-color': filter.color } as CSSProperties}
                >
                  {filter.title}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
