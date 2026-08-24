import { getArchive } from './content';
import { heroImages } from './images';
import type { ArchivePost } from './content';

export type PolaroidCardLayout = {
  top: string;
  left: string;
  rotate: number;
  zIndex: number;
};

export const polaroidTableBg = heroImages.table;

/** Расположение карточек на столе (как на макете). */
export const polaroidLayouts: PolaroidCardLayout[] = [
  { top: '6%', left: '14%', rotate: -14, zIndex: 2 },
  { top: '4%', left: '28%', rotate: 8, zIndex: 4 },
  { top: '10%', left: '42%', rotate: -6, zIndex: 3 },
  { top: '5%', left: '56%', rotate: 12, zIndex: 5 },
  { top: '8%', left: '70%', rotate: -10, zIndex: 2 },
  { top: '22%', left: '8%', rotate: 10, zIndex: 6 },
  { top: '20%', left: '22%', rotate: -8, zIndex: 7 },
  { top: '18%', left: '36%', rotate: 5, zIndex: 8 },
  { top: '24%', left: '50%', rotate: -12, zIndex: 9 },
  { top: '20%', left: '64%', rotate: 7, zIndex: 6 },
  { top: '22%', left: '78%', rotate: -5, zIndex: 4 },
  { top: '38%', left: '16%', rotate: -7, zIndex: 10 },
  { top: '36%', left: '32%', rotate: 11, zIndex: 11 },
  { top: '40%', left: '48%', rotate: -9, zIndex: 12 },
  { top: '38%', left: '62%', rotate: 6, zIndex: 10 },
  { top: '42%', left: '76%', rotate: -11, zIndex: 8 },
];

export type PolaroidCard = ArchivePost & PolaroidCardLayout;

export function getPolaroidCards(limit = polaroidLayouts.length): PolaroidCard[] {
  const archive = getArchive('photo');
  if (!archive) return [];

  const withImages = archive.posts.filter((post) => post.image);
  const selected = withImages.slice(0, limit);

  return selected.map((post, index) => ({
    ...post,
    ...polaroidLayouts[index],
  }));
}
