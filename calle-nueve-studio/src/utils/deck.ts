import type { DominoCard } from "../types";

export function generateDeck(): DominoCard[] {
  const cards: DominoCard[] = [];
  for (let top = 0; top <= 9; top++) {
    for (let bottom = 0; bottom <= top; bottom++) {
      cards.push({
        id: `${top}-${bottom}`,
        top,
        bottom,
        label: `${top}/${bottom}`,
        isHero: top === bottom,
      });
    }
  }
  return cards;
}

export const DECK = generateDeck();
