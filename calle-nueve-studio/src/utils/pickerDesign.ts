import type { DesignTokens } from "../types";
import { PRESETS } from "../constants/presets";
import { DEFAULT_TUCK_BOX } from "../constants/tuckbox";

// The design picker on callenueve.com/design lets a customer choose the bar,
// dot and back colors, upload a logo and name the box. The same function turns
// those choices into deck tokens for the live preview on the site (through the
// c9-render.js bundle) and for "Create project" on a lead in the Studio, so the
// customer sees exactly what we start from.

export type PickerDesign = {
  bar: string;
  pips: string;
  back: string;
  /** Data URL (PNG, JPEG or SVG), resized by the page to at most 900 px. */
  logo?: string;
  logoOrientation?: "portrait" | "landscape";
  logoScale?: number;
  /** Printed on the box front. */
  boxTitle?: string;
};

/** White or near-black, whichever reads better on the given hex color. */
export function contrastOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#FFFFFF";
  const n = parseInt(m[1], 16);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.4 ? "#111111" : "#FFFFFF";
}

export function tokensFromDesign(d: PickerDesign): DesignTokens {
  const base: DesignTokens = JSON.parse(JSON.stringify(PRESETS["Clean"]));
  base.colors.divider = d.bar;
  base.colors.heroAccent = d.bar;
  base.colors.pip = d.pips;
  base.colors.pipSecondary = d.pips;
  base.colors.index = d.pips;
  base.colors.border = d.pips;
  base.colors.footer = d.pips;
  base.colors.backBackground = d.back;
  base.colors.backAccent = contrastOn(d.back);
  if (d.logo) {
    base.back.logo = d.logo;
    base.back.logoOrientation = d.logoOrientation ?? "portrait";
    base.back.logoScale = d.logoScale ?? 0.85;
  }
  base.tuckBox = {
    ...DEFAULT_TUCK_BOX,
    frontStyle: "simple",
    title: (d.boxTitle || "CALLE NUEVE").toUpperCase().slice(0, 28),
  };
  return base;
}
