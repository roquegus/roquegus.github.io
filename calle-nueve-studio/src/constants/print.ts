// MakePlayingCards "Custom Domino Deck Game Cards": 1.75" x 3.5" (44 x 89 mm),
// 1/8" bleed on every side and a further 1/8" safe margin, 300 DPI.
// Canvas = (1.75 + 0.25) x (3.5 + 0.25) in = 600 x 1125 px nominal; MPC's own
// templates round the bleed to 36 px, giving 597 x 1122.
export const PRINT = {
  width: 597,
  height: 1122,
  trimInset: 36,
  safeInset: 72,
  dpi: 300,
  cardSize: 'Domino 1.75" × 3.5" (44 × 89 mm)',
} as const;

export const APP_VERSION = "0.2.0";
export const APP_NAME = "Calle Nueve Production Studio";
