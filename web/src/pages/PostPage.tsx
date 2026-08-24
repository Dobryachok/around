import { Navigate, useParams } from 'react-router-dom';
import PostArticle from '../components/archive/PostArticle';
import PageLayout from '../components/layout/PageLayout';
import PhotoThemeArticle from '../components/photos/PhotoThemeArticle';
import { getBlogThemeForPost, isBlogPost } from '../data/blog';
import { getPost } from '../data/content';
import { getPortfolioThemeForPost, isPortfolioPost } from '../data/portfolio';
import { getTextThemeForPost, isTextPost } from '../data/texts';
import { blogPath, categoryPath, decodeRouteParam, portfolioPath, textsPath } from '../data/routes';
import { isPhotoThemePost } from '../utils/photoTheme';
import NotFoundPage from './NotFoundPage';

export default function PostPage() {
  const { slug = '' } = useParams();
  const post = getPost(decodeRouteParam(slug));

  if (!post) {
    return <NotFoundPage />;
  }

  const isPhotoTheme = isPhotoThemePost(post);
  const blogTheme = getBlogThemeForPost(post);
  const textTheme = getTextThemeForPost(post);
  const portfolioTheme = getPortfolioThemeForPost(post.categoryIds);

  if (isPhotoTheme) {
    return (
      <PageLayout title={post.title}>
        <PhotoThemeArticle
          title={post.title}
          date={post.date}
          image={post.image}
          content={post.content}
          categoryLabel="Фотография"
          categoryHref={categoryPath('photo')}
          introStyle="poetic"
        />
      </PageLayout>
    );
  }

  if (isBlogPost(post) && blogTheme) {
    return (
      <PageLayout title={post.title}>
        <PhotoThemeArticle
          title={post.title}
          date={post.date}
          image={post.image}
          content={post.content}
          categoryLabel={blogTheme.title}
          categoryHref={blogPath()}
          introStyle="article"
        />
      </PageLayout>
    );
  }

  if (isTextPost(post) && textTheme) {
    return (
      <PageLayout title={post.title}>
        <PhotoThemeArticle
          title={post.title}
          date={post.date}
          image={post.image}
          content={post.content}
          categoryLabel={textTheme.title}
          categoryHref={textsPath()}
          introStyle="article"
        />
      </PageLayout>
    );
  }

  if (isPortfolioPost(post) && portfolioTheme) {
    if (portfolioTheme.slug === 'dostizheniya') {
      return <Navigate to={portfolioPath('dostizheniya')} replace />;
    }

    return (
      <PageLayout title={post.title}>
        <PhotoThemeArticle
          title={post.title}
          date={post.date}
          image={post.image}
          content={post.content}
          categoryLabel={portfolioTheme.title}
          categoryHref={portfolioPath()}
          introStyle="article"
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={post.title}>
      <PostArticle
        title={post.title}
        date={post.date}
        image={post.image}
        content={post.content}
      />
    </PageLayout>
  );
}
