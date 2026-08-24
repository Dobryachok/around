import { images } from './images';
import { categoryPath, postPath } from './routes';
import type { CategoryData } from '../types';

export const categories: CategoryData[] = [
  {
    title: 'Путешествия',
    categoryUrl: categoryPath('puteshestviya'),
    featured: {
      title: 'Питер. Севкабель',
      excerpt: 'Моя мечта заблудилась в порту Севкабель…',
      url: postPath('питер'),
      image: images.travelFeatured,
      author: 'garachico',
    },
    posts: [
      {
        title: 'Кладбище кораблей',
        excerpt: 'Бледное неприветливое утро коснулось океана',
        url: postPath('кладбище-кораблей'),
        date: '16 октября, 2021',
      },
      {
        title: 'Зеленоградск. История одного дня',
        excerpt: 'Посмотрите на город с высоты! Он восхитителен!',
        url: postPath('zelenogradsk_high-point'),
        date: '24 марта, 2021',
      },
      {
        title: 'Журавли, озёра и радуга на память',
        excerpt: 'Часть II. Капелька Мещёрских озёр и обнаруженное вдохновение',
        url: postPath('журавли-озёра-и-радуга-на-память'),
        date: '17 марта, 2021',
      },
    ],
  },
  {
    title: 'Эстония',
    categoryUrl: categoryPath('estonia'),
    featured: {
      title: 'Приближается Рождество',
      excerpt: 'Приближается Рождество — этот семейный праздник в Эстонии очень любят.',
      url: postPath('приближается-рождество'),
      image: images.estoniaFeatured,
      author: 'garachico',
    },
    posts: [
      {
        title: 'Сааремааский февраль, или Как там, на...',
        excerpt: '«Сырвемаа, открытый морскому ветру, Я никогда не забуду тебя».',
        url: postPath('sorvemaa'),
        date: '20 ноября, 2021',
      },
      {
        title: 'Казара',
        excerpt: 'Я ахнула от восторга — сколько птиц!',
        url: postPath('kazara'),
        date: '23 марта, 2021',
      },
      {
        title: 'Когда идёт снег',
        excerpt:
          'Добрая нынче зимушка, истинная: с высоченными сугробами, с заледенелыми гроздьями рябины там, где птицы не...',
        url: postPath('its-snowing'),
        date: '23 марта, 2021',
      },
    ],
  },
];
