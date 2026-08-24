import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArchivePostList from '../components/archive/ArchivePostList';
import PageLayout from '../components/layout/PageLayout';
import PhotoThemeCardGrid from '../components/photos/PhotoThemeCardGrid';
import PolaroidTable from '../components/photos/PolaroidTable';
import { getArchive } from '../data/content';
import { getPolaroidCards } from '../data/polaroidCards';
import { decodeRouteParam } from '../data/routes';
import { filterPostsByQuery } from '../utils/searchPosts';
import NotFoundPage from './NotFoundPage';

export default function CategoryPage() {
  const { slug = '' } = useParams();
  const decodedSlug = decodeRouteParam(slug);
  const archive = getArchive(decodedSlug);
  const [searchQuery, setSearchQuery] = useState('');

  const isPhotoCategory = decodedSlug === 'photo';
  const polaroidCards = isPhotoCategory ? getPolaroidCards() : [];
  const filteredPosts = useMemo(
    () =>
      archive && isPhotoCategory ? filterPostsByQuery(archive.posts, searchQuery) : archive?.posts ?? [],
    [archive, isPhotoCategory, searchQuery],
  );
  const filteredPolaroidCards = useMemo(
    () => filterPostsByQuery(polaroidCards, searchQuery),
    [polaroidCards, searchQuery],
  );

  if (!archive) {
    return <NotFoundPage />;
  }

  return (
    <>
      {isPhotoCategory && polaroidCards.length > 0 && (
        <PolaroidTable
          cards={filteredPolaroidCards}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      <PageLayout title={isPhotoCategory ? undefined : archive.title}>
        {isPhotoCategory ? (
          <PhotoThemeCardGrid
            posts={filteredPosts}
            emptyMessage={searchQuery ? 'Ничего не найдено.' : undefined}
          />
        ) : (
          <ArchivePostList posts={archive.posts} />
        )}
      </PageLayout>
    </>
  );
}
