import type { DesignTokens, Saying } from "../../types";
import { PRINT } from "../../constants/print";
import { getSayingsCards } from "../../constants/sayings";
import DividerLine from "./DividerLine";

type Props = {
  tokens: DesignTokens;
  /** Which card: 1 or 2. */
  which?: 1 | 2;
  showTrimLine?: boolean;
  showSafeZone?: boolean;
};

const W = PRINT.width;
const H = PRINT.height;
const SAFE = PRINT.safeInset;
const TRIM = PRINT.trimInset;
const FRAME = TRIM + 16;

const fam = (f: string) => (f === "system" ? "system-ui, sans-serif" : `'${f}', serif`);

// Rough per-character advance as a fraction of font size, used to wrap the
// meaning lines. Bebas Neue is narrow; the serif and system faces are wider.
const advance = (f: string) => (f === "Bebas Neue" ? 0.42 : 0.5);

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * The chucho cards: Cuban domino table talk, phrase in the title face and
 * the meaning underneath. Follows the theme's colors and fonts like the rules
 * card does, so it sits in the deck without looking like an insert.
 */
export default function SayingsCardSVG({ tokens, which = 1, showTrimLine = false, showSafeZone = false }: Props) {
  const { background, colors, border, typography, divider } = tokens;
  const sc = getSayingsCards(tokens);
  const list: Saying[] = which === 2 ? sc.sayings2 : sc.sayings;
  const titleFont = fam(typography.indexFont);
  const bodyFont = fam(typography.footerFont);
  // Seven meanings in all-caps Bebas are hard to read, so the meanings use the
  // serif (also embedded in exports) when the theme's body face is Bebas.
  const meaningFace = typography.footerFont === "Bebas Neue" ? "Playfair Display" : typography.footerFont;
  const meaningFont = fam(meaningFace);
  const cx = W / 2;

  const innerW = W - SAFE * 2 - 16;
  const phraseMax = 40;
  const meaningSize = 17;
  const meaningChars = Math.floor(innerW / (meaningSize * advance(meaningFace)));

  // Lay the entries out, then spread whatever room is left evenly between them.
  // A long phrase shrinks (down to 30 px) before it is allowed to wrap.
  const entries = list.slice(0, 8).map((s) => {
    const adv = advance(typography.indexFont);
    const fit = innerW / Math.max(1, s.es.length * adv);
    const phraseSize = Math.max(30, Math.min(phraseMax, fit));
    const phraseChars = Math.floor(innerW / (phraseSize * adv));
    const phraseLines = wrap(s.es, phraseChars);
    const meaningLines = wrap(s.en, meaningChars);
    const h = phraseLines.length * (phraseSize * 0.92) + meaningLines.length * (meaningSize * 1.3) + 6;
    return { phraseLines, meaningLines, phraseSize, h };
  });
  const top = SAFE + 226;
  const bottom = H - SAFE - 72;
  const used = entries.reduce((a, e) => a + e.h, 0);
  const gap = entries.length > 1 ? Math.max(10, (bottom - top - used) / (entries.length - 1)) : 0;

  let y = top;
  const placed = entries.map((e) => {
    const start = y;
    y += e.h + gap;
    return { ...e, y: start };
  });

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      <rect x={0} y={0} width={W} height={H} fill={background.color} />

      {border.outerWidth > 0 && (
        <rect
          x={FRAME + border.outerWidth / 2}
          y={FRAME + border.outerWidth / 2}
          width={W - FRAME * 2 - border.outerWidth}
          height={H - FRAME * 2 - border.outerWidth}
          fill="none"
          stroke={colors.border}
          strokeWidth={border.outerWidth}
        />
      )}

      <text x={cx} y={SAFE + 96} textAnchor="middle" fontFamily={titleFont} fontSize={72} fill={colors.index} letterSpacing={4}>
        {sc.headline}
      </text>
      <text x={cx} y={SAFE + 134} textAnchor="middle" fontFamily={bodyFont} fontSize={16} fill={colors.footer} letterSpacing={3}>
        {sc.subhead}
        {sc.count === 2 ? ` · ${which} OF 2` : ""}
      </text>

      <DividerLine
        type={divider.type === "bar" ? "bar" : "straight"}
        thickness={Math.min(divider.thickness, 8)}
        widthFraction={0.6}
        color={colors.divider}
        ornament={divider.ornament === "spinner" ? "spinner" : "none"}
        ornamentSize={divider.ornament === "spinner" ? divider.ornamentSize : 0}
        cardWidth={W}
        inset={SAFE}
        y={SAFE + 178}
      />

      {placed.map((e, i) => {
        let ly = e.y + e.phraseSize * 0.82;
        const nodes: React.ReactNode[] = [];
        e.phraseLines.forEach((line, j) => {
          nodes.push(
            <text key={`p${j}`} x={cx} y={ly} textAnchor="middle" fontFamily={titleFont} fontSize={e.phraseSize} fill={colors.index} letterSpacing={2}>
              {line}
            </text>
          );
          ly += e.phraseSize * 0.92;
        });
        ly += 2;
        e.meaningLines.forEach((line, j) => {
          nodes.push(
            <text key={`m${j}`} x={cx} y={ly} textAnchor="middle" fontFamily={meaningFont} fontSize={meaningSize} fill={colors.footer}>
              {line}
            </text>
          );
          ly += meaningSize * 1.3;
        });
        return <g key={i}>{nodes}</g>;
      })}

      <text x={cx} y={H - SAFE - 12} textAnchor="middle" fontFamily={titleFont} fontSize={22} fill={colors.footer} letterSpacing={5}>
        CALLE NUEVE
      </text>

      {showTrimLine && (
        <rect x={TRIM} y={TRIM} width={W - TRIM * 2} height={H - TRIM * 2} fill="none" stroke="#00AAFF" strokeWidth={1} strokeDasharray="6,4" />
      )}
      {showSafeZone && (
        <rect x={SAFE} y={SAFE} width={W - SAFE * 2} height={H - SAFE * 2} fill="none" stroke="#00FF88" strokeWidth={1} strokeDasharray="4,6" />
      )}
    </svg>
  );
}
