import { useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { getPage } from '../data/content';
import { decodeRouteParam } from '../data/routes';
import postStyles from '../components/archive/PostArticle.module.css';
import NotFoundPage from './NotFoundPage';

export default function StaticPage() {
  const { slug = '' } = useParams();
  const page = getPage(decodeRouteParam(slug));

  if (!page) {
    return <NotFoundPage />;
  }

  return (
    <PageLayout title={page.title}>
      <div
        className={postStyles.article}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </PageLayout>
  );
}
