import type { DesignTokens, RulesCardDesign } from "../types";

export const DEFAULT_RULES_CARD: RulesCardDesign = {
  enabled: true,
  url: "https://callenueve.com/play",
  headline: "HOW TO PLAY",
  subhead: "CUBAN DOUBLE-NINE · 55 CARDS",
  body: "Scan for the rules of the game.\nFound this deck at a friend's house?\nGet your own at callenueve.com",
};

export function getRulesCard(tokens: DesignTokens): RulesCardDesign {
  return { ...DEFAULT_RULES_CARD, ...(tokens.rulesCard ?? {}) };
}
