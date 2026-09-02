
import type { DominoCard, DesignTokens } from "../../types";
import { PRINT } from "../../constants/print";
import PipZone from "./PipZone";
import DividerLine from "./DividerLine";

type DominoCardSVGProps = {
  card: DominoCard;
  tokens: DesignTokens;
  showGuides?: boolean;
  showTrimLine?: boolean;
  showSafeZone?: boolean;
};

const W = PRINT.width;
const H = PRINT.height;
const SAFE = PRINT.safeInset;
const TRIM = PRINT.trimInset;

const SAFE_W = W - SAFE * 2;

const DIVIDER_Y = H / 2;

const PIP_ZONE_X = SAFE;
const PIP_ZONE_W = SAFE_W;
const TOP_PIP_Y = SAFE + 60;
const BOTTOM_PIP_Y = DIVIDER_Y + 10;

function TextureOverlay({ texture, opacity }: { texture: string; opacity: number }) {
  if (texture === "none") return null;
  if (texture === "paper") {
    return (
      <rect
        x={0} y={0} width={W} height={H}
        fill="url(#paperTexture)"
        opacity={opacity}
      />
    );
  }
  if (texture === "grain") {
    return (
      <rect
        x={0} y={0} width={W} height={H}
        fill="url(#grainTexture)"
        opacity={opacity}
      />
    );
  }
  if (texture === "mosaic") {
    return (
      <rect
        x={0} y={0} width={W} height={H}
        fill="url(#mosaicTexture)"
        opacity={opacity}
      />
    );
  }
  return null;
}

function HeroFrame({
  color,
  innerBorderWidth,
  outerBorderWidth,
}: {
  color: string;
  innerBorderWidth: number;
  outerBorderWidth: number;
}) {
  const pad = outerBorderWidth + 6;
  const cornerSize = 24;
  const x = pad;
  const y = pad;
  const w = W - pad * 2;
  const h = H - pad * 2;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={color}
        strokeWidth={innerBorderWidth + 1}
      />
      {/* Corner ornaments */}
      {[
        [x, y, 1, 1],
        [x + w, y, -1, 1],
        [x, y + h, 1, -1],
        [x + w, y + h, -1, -1],
      ].map(([cx, cy, sx, sy], i) => (
        <g key={i} transform={`translate(${cx},${cy}) scale(${sx},${sy})`}>
          <path
            d={`M0,0 L${cornerSize},0 M0,0 L0,${cornerSize}`}
            stroke={color}
            strokeWidth={innerBorderWidth + 1}
            fill="none"
          />
          <polygon
            points={`0,0 ${cornerSize * 0.4},0 0,${cornerSize * 0.4}`}
            fill={color}
            opacity={0.4}
          />
        </g>
      ))}
    </g>
  );
}

function CornerDecorations({
  color,
  outerBorderWidth,
}: {
  color: string;
  outerBorderWidth: number;
}) {
  const pad = outerBorderWidth + 16;
  const cs = 34;
  const corners = [
    [pad, pad, 1, 1],
    [W - pad, pad, -1, 1],
    [pad, H - pad, 1, -1],
    [W - pad, H - pad, -1, -1],
  ];
  return (
    <g>
      {corners.map(([cx, cy, sx, sy], i) => (
        <g key={i} transform={`translate(${cx},${cy}) scale(${sx},${sy})`}>
          <path d={`M0,${cs} L0,0 L${cs},0`} stroke={color} strokeWidth={2.5} fill="none" />
          <polygon points="5,5 20,5 5,20" fill={color} opacity={0.85} />
        </g>
      ))}
    </g>
  );
}


export default function DominoCardSVG({
  card,
  tokens,
  showGuides = false,
  showTrimLine = false,
  showSafeZone = false,
}: DominoCardSVGProps) {
  const { background, colors, border, typography, footer, divider } =
    tokens;

  const fontFamily =
    typography.indexFont === "system"
      ? "system-ui, sans-serif"
      : `'${typography.indexFont}', serif`;

  const footerFontFamily =
    typography.footerFont === "system"
      ? "system-ui, sans-serif"
      : `'${typography.footerFont}', serif`;

  const topPipHeight = DIVIDER_Y - TOP_PIP_Y - 20;
  const bottomPipHeight = H - SAFE - BOTTOM_PIP_Y - (footer.visible ? 40 : 10);

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <pattern id="paperTexture" x={0} y={0} width={200} height={200} patternUnits="userSpaceOnUse">
          <rect width={200} height={200} fill={background.color} />
          <rect width={200} height={200} fill="url(#paperNoise)" opacity={0.08} />
        </pattern>
        <pattern id="grainTexture" x={0} y={0} width={4} height={4} patternUnits="userSpaceOnUse">
          <rect width={4} height={4} fill={background.color} />
          <circle cx={1} cy={1} r={0.5} fill="#000" opacity={0.06} />
          <circle cx={3} cy={3} r={0.4} fill="#000" opacity={0.04} />
        </pattern>
        <pattern id="mosaicTexture" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
          <rect width={20} height={20} fill={background.color} />
          <rect x={1} y={1} width={8} height={8} fill="#000" opacity={0.04} />
          <rect x={11} y={11} width={8} height={8} fill="#000" opacity={0.04} />
        </pattern>
        <filter id="pipShadow" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background */}
      <rect x={0} y={0} width={W} height={H} fill={background.color} />
      <TextureOverlay texture={background.texture} opacity={background.opacity} />

      {/* Hero accent background highlight */}
      {card.isHero && (
        <rect
          x={SAFE / 2}
          y={SAFE / 2}
          width={W - SAFE}
          height={H - SAFE}
          fill={colors.heroAccent}
          opacity={0.06}
        />
      )}

      {/* Outer border */}
      {border.outerWidth > 0 && (
        <rect
          x={border.outerWidth / 2}
          y={border.outerWidth / 2}
          width={W - border.outerWidth}
          height={H - border.outerWidth}
          fill="none"
          stroke={colors.border}
          strokeWidth={border.outerWidth}
        />
      )}

      {/* Inner border */}
      {border.innerWidth > 0 && (
        <rect
          x={border.outerWidth + 5 + border.innerWidth / 2}
          y={border.outerWidth + 5 + border.innerWidth / 2}
          width={W - (border.outerWidth + 5) * 2 - border.innerWidth}
          height={H - (border.outerWidth + 5) * 2 - border.innerWidth}
          fill="none"
          stroke={colors.border}
          strokeWidth={border.innerWidth}
          opacity={0.5}
        />
      )}

      {/* Corner decorations */}
      {border.cornerDecorations && (
        <CornerDecorations color={colors.border} outerBorderWidth={border.outerWidth} />
      )}

      {/* Hero frame */}
      {card.isHero && border.heroFrame && (
        <HeroFrame
          color={colors.heroAccent}
          innerBorderWidth={border.innerWidth}
          outerBorderWidth={border.outerWidth}
        />
      )}

      {/* Top-left index */}
      <text
        x={SAFE + 8}
        y={SAFE + 4}
        fontSize={typography.indexSize}
        fontFamily={fontFamily}
        fill={colors.index}
        letterSpacing={typography.tracking}
        dominantBaseline="hanging"
      >
        {card.top}
      </text>
      <text
        x={SAFE + 8}
        y={SAFE + typography.indexSize + 6}
        fontSize={typography.indexSize * 0.7}
        fontFamily={fontFamily}
        fill={colors.index}
        letterSpacing={typography.tracking}
        dominantBaseline="hanging"
        opacity={0.7}
      >
        {card.bottom}
      </text>

      {/* Bottom-right index (rotated 180°) */}
      <g transform={`rotate(180, ${W / 2}, ${H / 2})`}>
        <text
          x={SAFE + 8}
          y={SAFE + 4}
          fontSize={typography.indexSize}
          fontFamily={fontFamily}
          fill={colors.index}
          letterSpacing={typography.tracking}
          dominantBaseline="hanging"
        >
          {card.top}
        </text>
        <text
          x={SAFE + 8}
          y={SAFE + typography.indexSize + 6}
          fontSize={typography.indexSize * 0.7}
          fontFamily={fontFamily}
          fill={colors.index}
          letterSpacing={typography.tracking}
          dominantBaseline="hanging"
          opacity={0.7}
        >
          {card.bottom}
        </text>
      </g>

      {/* Top pip zone */}
      <PipZone
        value={card.top}
        x={PIP_ZONE_X}
        y={TOP_PIP_Y}
        width={PIP_ZONE_W}
        height={topPipHeight}
        tokens={tokens}
        flipped={false}
      />

      {/* Divider */}
      <DividerLine
        type={divider.type}
        thickness={divider.thickness}
        widthFraction={divider.width}
        color={colors.divider}
        ornament={divider.ornament}
        ornamentSize={divider.ornamentSize}
        cardWidth={W}
        y={DIVIDER_Y}
      />

      {/* Bottom pip zone (rotated 180°) */}
      <PipZone
        value={card.bottom}
        x={PIP_ZONE_X}
        y={BOTTOM_PIP_Y}
        width={PIP_ZONE_W}
        height={bottomPipHeight}
        tokens={tokens}
        flipped={true}
      />

      {/* Footer */}
      {footer.visible && (
        <text
          x={W / 2}
          y={H - SAFE - 8}
          fontSize={typography.footerSize}
          fontFamily={footerFontFamily}
          fill={colors.footer}
          letterSpacing={typography.tracking + 2}
          textAnchor="middle"
          dominantBaseline="auto"
        >
          {footer.text}
        </text>
      )}

      {/* Guide overlays (preview only, never in exports) */}
      {showTrimLine && (
        <rect
          x={TRIM}
          y={TRIM}
          width={W - TRIM * 2}
          height={H - TRIM * 2}
          fill="none"
          stroke="#00AAFF"
          strokeWidth={1}
          strokeDasharray="6,4"
        />
      )}
      {showSafeZone && (
        <rect
          x={SAFE}
          y={SAFE}
          width={W - SAFE * 2}
          height={H - SAFE * 2}
          fill="none"
          stroke="#00FF88"
          strokeWidth={1}
          strokeDasharray="4,6"
        />
      )}
      {showGuides && (
        <line
          x1={0}
          y1={DIVIDER_Y}
          x2={W}
          y2={DIVIDER_Y}
          stroke="#FF8800"
          strokeWidth={0.75}
          strokeDasharray="8,4"
          opacity={0.6}
        />
      )}
    </svg>
  );
}
