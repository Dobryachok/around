import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogMasonryGrid from '../components/blog/BlogMasonryGrid';
import BlogToolbar from '../components/blog/BlogToolbar';
import PageLayout from '../components/layout/PageLayout';
import { getBlogPosts } from '../data/blog';
import { buildTagFilterOptions } from '../data/tags';
import { useContentTags } from '../hooks/useContentTags';
import { filterThemedPosts } from '../utils/filterThemedPosts';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFilters = searchParams.getAll('filter');
  const allPosts = useMemo(() => getBlogPosts(), []);
  const tagData = useContentTags('blog');
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
    <PageLayout variant="archive">
      <div className={styles.page} data-nav-bg="light">
        <h1 className={styles.title}>Блог</h1>
        <BlogToolbar
          filters={tagFilters}
          searchQuery={searchQuery}
          searchPlaceholder="Поиск по блогу..."
          searchLabel="Поиск по блогу"
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
