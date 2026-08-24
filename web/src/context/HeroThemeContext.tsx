import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { heroImages } from '../data/images';

const PHOTO_COUNT = 3;

type HeroThemeContextValue = {
  activeIndex: number;
  photos: string[];
  centerPhoto: string;
  thumbPhotos: [string, string];
  cyclePrev: () => void;
  cycleNext: () => void;
};

const HeroThemeContext = createContext<HeroThemeContextValue | null>(null);

function getThumbPhotos(photos: string[], activeIndex: number): [string, string] {
  return [
    photos[(activeIndex + 1) % PHOTO_COUNT],
    photos[(activeIndex + 2) % PHOTO_COUNT],
  ];
}

export function HeroThemeProvider({ children }: { children: ReactNode }) {
  const photos = useMemo(
    () => [heroImages.photo1, heroImages.photo2, heroImages.photo3],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const cyclePrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? PHOTO_COUNT - 1 : i - 1));
  }, []);

  const cycleNext = useCallback(() => {
    setActiveIndex((i) => (i === PHOTO_COUNT - 1 ? 0 : i + 1));
  }, []);

  const value = useMemo(
    () => ({
      activeIndex,
      photos,
      centerPhoto: photos[activeIndex],
      thumbPhotos: getThumbPhotos(photos, activeIndex),
      cyclePrev,
      cycleNext,
    }),
    [activeIndex, photos, cyclePrev, cycleNext],
  );

  return (
    <HeroThemeContext.Provider value={value}>{children}</HeroThemeContext.Provider>
  );
}

export function useHeroTheme() {
  const ctx = useContext(HeroThemeContext);
  if (!ctx) {
    throw new Error('useHeroTheme must be used within HeroThemeProvider');
  }
  return ctx;
}

export const CONTACTS_SECTION_ID = 'contacts';
