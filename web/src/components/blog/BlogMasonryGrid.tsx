import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { cleanText } from '../../data/content';
import { postPath } from '../../data/routes';
import type { ThemedPost } from '../../types/themedPost';
import styles from './BlogMasonryGrid.module.css';

interface BlogMasonryGridProps {
  posts: ThemedPost[];
  emptyMessage?: string;
}

function distributePosts(posts: ThemedPost[], columnCount: number) {
  const columns = Array.from({ length: columnCount }, () => [] as ThemedPost[]);
  const columnWeights = Array.from({ length: columnCount }, () => 0);

  posts.forEach((post) => {
    const shortestColumnIndex = columnWeights.indexOf(Math.min(...columnWeights));

    columns[shortestColumnIndex].push(post);
    columnWeights[shortestColumnIndex] += post.image ? 2 : 1;
  });

  return columns;
}

function PostCard({ post }: { post: ThemedPost }) {
  return (
    <li className={styles.card}>
      <Link to={postPath(post.slug)} className={styles.cardLink}>
        {post.image && (
          <div className={styles.imageWrap}>
            <img src={post.image} alt={post.title} loading="lazy" />
          </div>
        )}

        <div className={styles.body}>
          {(post.tags.length > 0 || post.subtags.length > 0) && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className={styles.theme}
                  style={{ '--tag-color': tag.color } as CSSProperties}
                >
                  {tag.title}
                </span>
              ))}
              {post.subtags.map((subtag) => {
                const parentTag = post.tags.find((tag) => tag.slug === subtag.parentTagSlug);

                return (
                  <span
                    key={subtag.slug}
                    className={styles.subtag}
                    style={{ '--tag-color': parentTag?.color ?? '#7b7f86' } as CSSProperties}
                  >
                    {subtag.title}
                  </span>
                );
              })}
            </div>
          )}

          {post.date && (
            <time className={styles.date}>{cleanText(post.date)}</time>
          )}

          <h2 className={styles.title}>{post.title}</h2>
          {post.excerpt && (
            <p className={styles.excerpt}>{cleanText(post.excerpt)}</p>
          )}
        </div>
      </Link>
    </li>
  );
}

function MasonryLayout({
  posts,
  columnCount,
}: {
  posts: ThemedPost[];
  columnCount: number;
}) {
  const columns = distributePosts(posts, columnCount);

  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {columns.map((columnPosts, columnIndex) => (
        <ul key={columnIndex} className={styles.column}>
          {columnPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </ul>
      ))}
    </div>
  );
}

function getColumnCount() {
  if (window.matchMedia('(max-width: 560px)').matches) {
    return 1;
  }

  if (window.matchMedia('(max-width: 900px)').matches) {
    return 2;
  }

  return 3;
}

export default function BlogMasonryGrid({ posts, emptyMessage }: BlogMasonryGridProps) {
  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 560px)');
    const tabletQuery = window.matchMedia('(max-width: 900px)');
    const updateColumnCount = () => setColumnCount(getColumnCount());

    mobileQuery.addEventListener('change', updateColumnCount);
    tabletQuery.addEventListener('change', updateColumnCount);

    return () => {
      mobileQuery.removeEventListener('change', updateColumnCount);
      tabletQuery.removeEventListener('change', updateColumnCount);
    };
  }, []);

  if (posts.length === 0) {
    return <p className={styles.empty}>{emptyMessage ?? 'В блоге пока нет записей.'}</p>;
  }

  return <MasonryLayout posts={posts} columnCount={columnCount} />;
}
