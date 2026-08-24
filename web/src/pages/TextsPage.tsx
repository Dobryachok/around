import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogMasonryGrid from '../components/blog/BlogMasonryGrid';
import BlogToolbar from '../components/blog/BlogToolbar';
import PageLayout from '../components/layout/PageLayout';
import { buildTagFilterOptions } from '../data/tags';
import { getTextsPosts } from '../data/texts';
import { useContentTags } from '../hooks/useContentTags';
import { filterThemedPosts } from '../utils/filterThemedPosts';
import styles from './TextsPage.module.css';

export default function TextsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFilters = searchParams.getAll('filter');
  const allPosts = useMemo(() => getTextsPosts(), []);
  const tagData = useContentTags('texts');
  const tagFilters = useMemo(
    () => buildTagFilterOptions(tagData.tags, tagData.subtags),
    [tagData],
  );
  const filteredPosts = useMemo(
    () => filterThemedPosts(allPosts, searchQuery, selectedFilters),
    [allPosts, searchQuery, selectedFilters],
  );

  const handleToggleFilter = useCallback((key: string) => {
    const nextFilters = selectedFilters.includes(key)
      ? selectedFilters.filter((item) => item !== key)
      : [...selectedFilters, key];
    const nextParams = new URLSearchParams();
    nextFilters.forEach((filter) => nextParams.append('filter', filter));
    setSearchParams(nextParams);
  }, [selectedFilters, setSearchParams]);

  const emptyMessage =
    searchQuery || selectedFilters.length > 0 ? 'Ничего не найдено.' : undefined;

  return (
    <PageLayout>
      <div className={styles.page} data-nav-bg="light">
        <h1 className={styles.title}>Тексты</h1>
        <BlogToolbar
          filters={tagFilters}
          searchQuery={searchQuery}
          searchPlaceholder="Поиск по текстам..."
          searchLabel="Поиск по текстам"
          selectedFilters={selectedFilters}
          onSearchChange={setSearchQuery}
          onToggleFilter={handleToggleFilter}
          onClearFilters={() => setSearchParams(new URLSearchParams())}
        />
        <BlogMasonryGrid posts={filteredPosts} emptyMessage={emptyMessage} />
      </div>
    </PageLayout>
  );
}
