import {graphColors} from '../styles';
import seedrandom from 'seedrandom';

export function getRandomColor() {
    const randomThemeIndex = Math.floor(Math.random() * graphColors.length);
    const randomTheme = graphColors[randomThemeIndex];
    const randomColorIndex = Math.floor(Math.random() * randomTheme.length);

    return graphColors[randomColorIndex];
}
export const randomizeArray = (seed: string) => {
  const rng = seedrandom(seed);

  const colorValues = Object.values(graphColors);
  const shuffledArray = [...colorValues];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

