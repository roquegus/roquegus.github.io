// 55-tile double-nine domino deck.
// top >= bottom always; doubles flagged as isHero.
export function generateDeck() {
  const tiles = [];
  for (let top = 0; top <= 9; top++) {
    for (let bottom = 0; bottom <= top; bottom++) {
      tiles.push({
        id: `${top}-${bottom}`,
        top,
        bottom,
        isHero: top === bottom,
      });
    }
  }
  return tiles; // 55 tiles: Σ(1..10) = 55
}

export const DECK = generateDeck();
