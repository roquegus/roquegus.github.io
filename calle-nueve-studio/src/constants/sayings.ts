import type { DesignTokens, Saying, SayingsCardsDesign } from "../types";

// Cuban domino table talk. Card 1 is what you say at the table; card 2 is
// what you hear. Keep each phrase short enough for one line at 44 px in
// Bebas Neue (about 26 characters) and each meaning under about 110
// characters so it wraps to two lines at most.
export const DEFAULT_SAYINGS_1: Saying[] = [
  { es: "La Gorda", en: "The 9|9. The fat one. Eighteen points if it dies in your hand." },
  { es: "La Blanquita", en: "The 0|0. Zero points, and the safest card at the table." },
  { es: "Dale agua", en: "Shuffle. Literally \"give it water.\"" },
  { es: "Paso", en: "I cannot play. The only thing you are obliged to say out loud." },
  { es: "Me pegué", en: "I am out. Said while laying your last card down harder than necessary." },
  { es: "Capicúa", en: "Going out with a card that fits both ends. Bragging rights." },
  { es: "Tranca", en: "The line is blocked. Count your hands." },
];

export const DEFAULT_SAYINGS_2: Saying[] = [
  { es: "Te la pongo fresca", en: "Playing a number nobody has touched yet. A gift, or a trap." },
  { es: "Estás agachao", en: "You are hiding a number. Usually said to a partner, usually correctly." },
  { es: "Bota la gorda", en: "Get rid of your heavy cards. Also the beginner who leads with them." },
  { es: "Caja de muerto", en: "The 6|6. The coffin. Ask an older player why." },
  { es: "Pollona", en: "A shutout. Do not let it happen twice." },
  { es: "¡Se acabó lo que se daba!", en: "That is all, folks. Said by the winner, loudly." },
  { es: "Chucho", en: "The running commentary. Friendly, loud, and required." },
];

export const DEFAULT_SAYINGS_CARDS: SayingsCardsDesign = {
  enabled: true,
  count: 2,
  headline: "EL CHUCHO",
  subhead: "TABLE TALK · WHAT YOU WILL HEAR",
  sayings: DEFAULT_SAYINGS_1,
  sayings2: DEFAULT_SAYINGS_2,
};

export function getSayingsCards(tokens: DesignTokens): SayingsCardsDesign {
  return { ...DEFAULT_SAYINGS_CARDS, ...(tokens.sayingsCards ?? {}) };
}

/** One saying per line, "phrase | meaning". Used by the panel textarea. */
export function sayingsToText(list: Saying[]): string {
  return list.map((s) => `${s.es} | ${s.en}`).join("\n");
}

export function textToSayings(text: string): Saying[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => {
      const i = l.indexOf("|");
      if (i < 0) return { es: l, en: "" };
      return { es: l.slice(0, i).trim(), en: l.slice(i + 1).trim() };
    });
}
