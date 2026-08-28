const BASE = 'https://aroundmyself.ru/wp-content/uploads';

export const images = {
  travelFeatured: `${BASE}/DSC01283_2%D1%87%D0%B1-DeNoiseAI-standard-370x265.jpg`,
  estoniaFeatured: `${BASE}/DSC03952_2-570x450.jpg`,
  newsFeatured: `${BASE}/DSC00133_2%D1%82.jpg`,
  author: `${BASE}/2012/11/DSC7180_2.jpg`,
  heroWinter: `${BASE}/2020/11/DSC07314_2%D1%82.jpg`,
  cardPiter: `${BASE}/DSC01283_2%D1%87%D0%B1-DeNoiseAI-standard-370x265.jpg`,
  cardZelenogradsk: `${BASE}/DSC03952_2-570x450.jpg`,
  cardSnow: `${BASE}/2020/11/DSC07314_2%D1%82.jpg`,
  cardNews: `${BASE}/DSC00133_2%D1%82-600x400.jpg`,
};

/** Фото из папки d:\\around\\photo → web/public/photo */
export const heroImages = {
  bg: '/photo/bg.png',
  photo1: '/photo/photo-1.png',
  photo2: '/photo/photo-2.png',
  photo3: '/photo/photo-3.png',
  newsBg: '/photo/DSC03773_2%201.png',
  table: '/photo/table.png',
};

export const landingImages = {
  cityWarm: '/photo/DSC00006_2%D1%82.jpg',
  cityDusk: '/photo/DSC00011_2%D1%82.jpg',
  cityGold: '/photo/DSC09989_2%D1%82.jpg',
  cityLines: '/photo/001201206DSC09051-%D0%BE%D0%BA-DeNoiseAI-denoise.jpg',
  unusedBird: '/photo/block3/DSC02804-1-%D1%82.jpg',
  unusedPortrait: '/photo/block3/DSC07927-11.jpg',
};

/** Первый блок (hero-коллаж): порядок 1–5 по скриншоту, файлы из photo/block1_new */
export const block1Images = {
  main: '/photo/block1_new/1.jpg',
  right: '/photo/block1_new/2.jpg',
  left: '/photo/block1_new/3.jpg',
  bottom: '/photo/block1_new/4.jpg',
  accent: '/photo/block1_new/5.jpg',
};

/** Третий блок (StoriesShowcase): порядок 1–6 по скриншоту, файлы из photo/block3_new */
export const block3Images = {
  featureLeft: '/photo/block3_new/1.jpg',
  featureRight: '/photo/block3_new/2.jpg',
  gallery1: '/photo/block3_new/3.jpg',
  gallery2: '/photo/block3_new/4.jpg',
  gallery3: '/photo/block3_new/5.jpg',
  gallery4: '/photo/block3_new/6.jpg',
  gallery5: '/photo/block3_new/7.jpg',
  gallery6: '/photo/block3_new/8.jpg',
};

export const heroImageFallbacks = {
  bg: heroImages.bg,
  photo1: heroImages.photo1,
  photo2: heroImages.photo2,
  photo3: heroImages.photo3,
  newsBg: heroImages.newsBg,
};
