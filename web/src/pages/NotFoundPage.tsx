import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';

export default function NotFoundPage() {
  return (
    <PageLayout title="Страница не найдена">
      <p>
        Запрашиваемая страница не существует.{' '}
        <Link to="/">Вернуться на главную</Link>
      </p>
    </PageLayout>
  );
}
