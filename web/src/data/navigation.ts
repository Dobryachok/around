import type { NavItem } from '../types';
import { blogPath, categoryPath, portfolioPath, textsPath } from './routes';

export const heroNavItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Портфолио', href: portfolioPath() },
  { label: 'Блог', href: blogPath() },
  { label: 'Фотографии', href: categoryPath('photo') },
  { label: 'Тексты', href: textsPath() },
  { label: 'Контакты', href: '#contacts' },
];
