import QRCode from "qrcode";
import type { DesignTokens } from "../../types";
import { PRINT } from "../../constants/print";
import { getRulesCard } from "../../constants/rulescard";
import DividerLine from "./DividerLine";

type Props = {
  tokens: DesignTokens;
  showTrimLine?: boolean;
  showSafeZone?: boolean;
};

const W = PRINT.width;
const H = PRINT.height;
const SAFE = PRINT.safeInset;
const TRIM = PRINT.trimInset;
const FRAME = TRIM + 16;

const fam = (f: string) => (f === "system" ? "system-ui, sans-serif" : `'${f}', serif`);

// Returns one SVG path covering every dark module. High error correction so
// the code still scans with a fingerprint on it or a slightly soft print.
export function qrPath(text: string, level: "M" | "Q" | "H" = "H"): { d: string; n: number } {
  const qr = QRCode.create(text, { errorCorrectionLevel: level });
  const n = qr.modules.size;
  const data = qr.modules.data;
  let d = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (data[y * n + x]) d += `M${x},${y}h1v1h-1z`;
    }
  }
  return { d, n };
}

export default function RulesCardSVG({ tokens, showTrimLine = false, showSafeZone = false }: Props) {
  const { background, colors, border, typography, divider } = tokens;
  const rc = getRulesCard(tokens);
  const titleFont = fam(typography.indexFont);
  const bodyFont = fam(typography.footerFont);
  const { d, n } = qrPath(rc.url);

  // QR block: 330 px of modules plus a 4-module quiet zone, centered
  const qrSize = 330;
  const quiet = 4;
  const scale = qrSize / n;
  const panel = qrSize + quiet * 2 * scale;
  const qx = (W - panel) / 2;
  const qy = 330;

  const cx = W / 2;
  const lines = rc.body.split("\n").filter((l) => l.trim().length > 0);
  const urlLabel = rc.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

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
        {rc.headline}
      </text>
      <text x={cx} y={SAFE + 134} textAnchor="middle" fontFamily={bodyFont} fontSize={16} fill={colors.footer} letterSpacing={3}>
        {rc.subhead}
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
        y={SAFE + 190}
      />

      {/* QR block. White panel keeps contrast on dark card backgrounds. */}
      <rect x={qx} y={qy} width={panel} height={panel} rx={14} fill="#FFFFFF" stroke={colors.border} strokeWidth={2} />
      <g transform={`translate(${qx + quiet * scale},${qy + quiet * scale}) scale(${scale})`}>
        <path d={d} fill="#000000" shapeRendering="crispEdges" />
      </g>

      <text x={cx} y={qy + panel + 58} textAnchor="middle" fontFamily={titleFont} fontSize={34} fill={colors.index} letterSpacing={3}>
        {urlLabel.toUpperCase()}
      </text>

      {lines.map((line, i) => (
        <text key={i} x={cx} y={qy + panel + 112 + i * 30} textAnchor="middle" fontFamily={bodyFont} fontSize={18} fill={colors.footer}>
          {line}
        </text>
      ))}

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
