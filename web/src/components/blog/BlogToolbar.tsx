import { useState } from 'react';
import type { TagFilterOption } from '../../types/themedPost';
import BlogThemeFilter from './BlogThemeFilter';
import styles from './BlogToolbar.module.css';

interface BlogToolbarProps {
  filters: readonly TagFilterOption[];
  searchQuery: string;
  searchPlaceholder: string;
  searchLabel: string;
  selectedFilters: string[];
  onSearchChange: (value: string) => void;
  onToggleFilter: (key: string) => void;
  onClearFilters: () => void;
}

export default function BlogToolbar({
  filters,
  searchQuery,
  searchPlaceholder,
  searchLabel,
  selectedFilters,
  onSearchChange,
  onToggleFilter,
  onClearFilters,
}: BlogToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className={styles.toolbar}>
      <label className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
        />
      </label>

      <div className={styles.filterWrap}>
        <button
          type="button"
          className={`${styles.filterButton} ${selectedFilters.length > 0 ? styles.filterButtonActive : ''}`}
          onClick={() => setFilterOpen((open) => !open)}
          aria-expanded={filterOpen}
          aria-label="Фильтр по тегам"
        >
          <span className={styles.filterIcon} aria-hidden="true" />
          {selectedFilters.length > 0 && (
            <span className={styles.filterBadge}>{selectedFilters.length}</span>
          )}
        </button>

        <BlogThemeFilter
          filters={filters}
          open={filterOpen}
          selectedFilters={selectedFilters}
          onToggleFilter={onToggleFilter}
          onClear={onClearFilters}
          onClose={() => setFilterOpen(false)}
        />
      </div>
    </div>
  );
}
