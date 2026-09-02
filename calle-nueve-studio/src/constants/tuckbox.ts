import type { DesignTokens, TuckBoxDesign } from "../types";

// Geometry of the MakePlayingCards "Custom Tuck Box for Domino Sized Cards"
// (1.75" x 3.5" cards, 19 mm deck) taken from their Domino_19mm.pdf template.
// All values are PDF points (1/72 in), measured relative to the top-left of the
// bleed sheet. `offset` is where that sheet sits on the template page.

export const PT = 300 / 72; // px per point at 300 DPI

export const TUCK_PT = {
  page: { w: 716.8, h: 936 },
  offset: { x: 152.9, y: 243.2 },
  sheet: { w: 411.0, h: 449.6 },
  bleed: 8.5,
  x: {
    leftSide: [8.5, 60.9],
    front: [60.9, 192.7],
    rightSide: [192.7, 246.6],
    back: [246.6, 378.4],
    glue: [378.4, 402.5],
  },
  body: [104.9, 361.7],
  lid: { x: [62.1, 191.6], y: [37.1, 104.9], tongueTop: 8.5, tongueStraight: 28 },
  topFlaps: {
    left: { x: [15.4, 56.1], y: [51.3, 104.9] },
    right: { x: [197.6, 239.0], y: [51.6, 104.9] },
  },
  bottomFlaps: {
    left: { x: [8.5, 60.1], y: [361.7, 415.6] },
    right: { x: [193.6, 241.8], y: [361.7, 415.6] },
    back: { x: [247.7, 377.3], y: [361.7, 415.6] },
    tongue: { x: [270.4, 354.6], straight: 432, bottom: 441.1 },
  },
  notch: { cx: 312.5, cy: 104.9, r: 22 },
} as const;

export const TUCK_PX = {
  w: Math.round(TUCK_PT.sheet.w * PT),
  h: Math.round(TUCK_PT.sheet.h * PT),
};

export const DEFAULT_TUCK_BOX: TuckBoxDesign = {
  frontStyle: "emblem",
  title: "CALLE NUEVE",
  subtitle: "CUBAN DOUBLE-NINE DOMINO DECK",
  tagline: "55 CARDS · 0-0 TO 9-9",
  edition: "FIRST EDITION",
  url: "CALLENUEVE.COM",
  backText:
    "Every card is a tile. Same table energy, same strategy, same chucho, anywhere the tiles don't travel.\nMatch the numbers, control the ends, block the table.",
  showIcons: true,
  showDieline: true,
};

export function getTuckBox(tokens: DesignTokens): TuckBoxDesign {
  return { ...DEFAULT_TUCK_BOX, ...(tokens.tuckBox ?? {}) };
}
