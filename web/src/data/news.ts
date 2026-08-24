import { heroImages, landingImages } from './images';
import { postPath } from './routes';
import type { NewsItem } from '../types';

export const newsItems: NewsItem[] = [
  {
    id: 'piter',
    title: 'Питер. Севкабель',
    excerpt:
      'Моя мечта заблудилась в порту Севкабель… Сноска для вашего необычного текста из новости, на которую будет перенос, Сноска для вашего необычно...',
    location: 'Россия — Санкт-Петербург',
    cardTitle: 'Питер. Севкабель',
    date: '12 ноября, 2021',
    image: landingImages.cityWarm,
    url: postPath('питер'),
  },
  {
    id: 'zelenogradsk',
    title: 'Зеленоградск. История одного дня',
    excerpt:
      'Посмотрите на город с высоты! Он восхитителен! Сноска для вашего необычного текста из новости, на которую будет перенос...',
    location: 'Россия — Зеленоградск',
    cardTitle: 'Зеленоградск с высоты',
    date: '24 марта, 2021',
    image: landingImages.cityDusk,
    url: postPath('zelenogradsk_high-point'),
  },
  {
    id: 'snow',
    title: 'Когда идёт снег',
    excerpt:
      'Добрая нынче зимушка, истинная: с высоченными сугробами, с заледенелыми гроздьями рябины там, где птицы не...',
    location: 'Эстония — зимний пейзаж',
    cardTitle: 'Когда идёт снег',
    date: '23 марта, 2021',
    image: heroImages.newsBg,
    url: postPath('its-snowing'),
  },
  {
    id: 'birds',
    title: 'На благо птиц!',
    excerpt:
      'Успех крауд-проекта — это хорошее начало! Сноска для вашего необычного текста из новости, на которую будет перенос...',
    location: 'Россия — природа',
    cardTitle: 'На благо птиц!',
    date: '8 апреля, 2021',
    image: landingImages.unusedBird,
    url: postPath('for-birds_news'),
  },
  {
    id: 'estonia',
    title: 'Приближается Рождество',
    excerpt:
      'Приближается Рождество — этот семейный праздник в Эстонии очень любят. Сноска для вашего необычного текста...',
    location: 'Эстония — Таллин',
    cardTitle: 'Приближается Рождество',
    date: '18 декабря, 2020',
    image: landingImages.cityGold,
    url: postPath('приближается-рождество'),
  },
  {
    id: 'ships',
    title: 'Кладбище кораблей',
    excerpt:
      'Бледное неприветливое утро коснулось океана. Сноска для вашего необычного текста из новости...',
    location: 'Гарифико — океан',
    cardTitle: 'Кладбище кораблей',
    date: '16 октября, 2021',
    image: landingImages.cityLines,
    url: postPath('кладбище-кораблей'),
  },
];
