import type { DesignTokens, BackPattern } from "../../types";
import { PRINT } from "../../constants/print";

type CardBackProps = {
  tokens: DesignTokens;
  showTrim?: boolean;
  showSafe?: boolean;
};

const W = PRINT.width;
const H = PRINT.height;

const diamondPts = (cx: number, cy: number, r: number) =>
  `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;

const patternId = (name: string, scale: number, color: string, accent: string) =>
  `${name}-${Math.round(scale * 100)}-${color.replace("#", "")}-${accent.replace("#", "")}`;

type PatternProps = { scale: number; rotation: number; color: string; accent: string; fillW?: number; fillH?: number };

function AzulejoPattern({ scale, rotation, color, accent, fillW = W, fillH = H }: PatternProps) {
  const s = 64 * scale;
  const h = s / 2;
  const id = patternId("azulejo", scale, color, accent);
  return (
    <g>
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
          <rect width={s} height={s} fill={color} />
          {[[0, 0], [s, 0], [0, s], [s, s]].map(([x, y], i) => (
            <polygon key={i} points={diamondPts(x, y, h * 0.55)} fill={accent} opacity={0.35} />
          ))}
          <g stroke={accent} strokeWidth={1} opacity={0.5}>
            <line x1={0} y1={h} x2={h} y2={0} />
            <line x1={h} y1={0} x2={s} y2={h} />
            <line x1={s} y1={h} x2={h} y2={s} />
            <line x1={h} y1={s} x2={0} y2={h} />
          </g>
          <polygon points={diamondPts(h, h, h * 0.78)} fill={accent} opacity={0.9} />
          <polygon points={diamondPts(h, h, h * 0.5)} fill={color} opacity={0.9} />
          <polygon points={diamondPts(h, h, h * 0.22)} fill={accent} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={fillW} height={fillH} fill={`url(#${id})`} />
    </g>
  );
}

function DiamondsPattern({ scale, rotation, color, accent, fillW = W, fillH = H }: PatternProps) {
  const s = 50 * scale;
  const h = s / 2;
  const id = patternId("diamonds", scale, color, accent);
  return (
    <g>
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
          <rect width={s} height={s} fill={color} />
          <polygon points={diamondPts(h, h, h - 2)} fill={accent} opacity={0.85} />
          <polygon points={diamondPts(h, h, h * 0.55)} fill={color} opacity={0.8} />
          <polygon points={diamondPts(h, h, h * 0.2)} fill={accent} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={fillW} height={fillH} fill={`url(#${id})`} />
    </g>
  );
}

function SunburstPattern({
  color,
  accent,
  centerX,
  centerY,
  fillW = W,
  fillH = H,
}: { color: string; accent: string; centerX: number; centerY: number; fillW?: number; fillH?: number }) {
  const rays = 24;
  const r = Math.max(fillW, fillH) * 1.2;
  return (
    <g>
      <rect x={0} y={0} width={fillW} height={fillH} fill={color} />
      {Array.from({ length: rays }).map((_, i) => {
        const a1 = (i * Math.PI * 2) / rays;
        const a2 = ((i + 0.5) * Math.PI * 2) / rays;
        return (
          <polygon
            key={i}
            points={`${centerX},${centerY} ${centerX + Math.cos(a1) * r},${centerY + Math.sin(a1) * r} ${centerX + Math.cos(a2) * r},${centerY + Math.sin(a2) * r}`}
            fill={accent}
            opacity={i % 2 === 0 ? 0.28 : 0.14}
          />
        );
      })}
      {[180, 290, 420].map((rr) => (
        <circle key={rr} cx={centerX} cy={centerY} r={rr} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.3} />
      ))}
    </g>
  );
}

function ArtDecoPattern({ scale, rotation, color, accent, fillW = W, fillH = H }: PatternProps) {
  const s = 60 * scale;
  const h = s / 2;
  const id = patternId("artdeco", scale, color, accent);
  return (
    <g>
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
          <rect width={s} height={s} fill={color} />
          <g stroke={accent}>
            <line x1={0} y1={h} x2={s} y2={h} strokeWidth={2} opacity={0.6} />
            <line x1={h} y1={0} x2={h} y2={s} strokeWidth={2} opacity={0.6} />
            <line x1={0} y1={h - s * 0.12} x2={s} y2={h - s * 0.12} strokeWidth={0.5} strokeDasharray={`${s * 0.1},${s * 0.05}`} opacity={0.4} />
            <line x1={0} y1={h + s * 0.12} x2={s} y2={h + s * 0.12} strokeWidth={0.5} strokeDasharray={`${s * 0.1},${s * 0.05}`} opacity={0.4} />
          </g>
          <polygon points={diamondPts(h, h, s * 0.35)} fill="none" stroke={accent} strokeWidth={1} opacity={0.5} />
          <polygon points={diamondPts(h, h, s * 0.12)} fill={accent} opacity={0.5} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={fillW} height={fillH} fill={`url(#${id})`} />
    </g>
  );
}

// Inset frame with corner brackets; fully 180°-symmetric
function BackFrame({ accent }: { accent: string }) {
  const inset = 54;
  const w = W - inset * 2;
  const h = H - inset * 2;
  const L = 44;
  const corners: [number, number, number, number][] = [
    [inset + 16, inset + 16, 1, 1],
    [inset + w - 16, inset + 16, -1, 1],
    [inset + 16, inset + h - 16, 1, -1],
    [inset + w - 16, inset + h - 16, -1, -1],
  ];
  return (
    <g fill="none" stroke={accent}>
      <rect x={inset} y={inset} width={w} height={h} strokeWidth={2.5} />
      <rect x={inset + 8} y={inset + 8} width={w - 16} height={h - 16} strokeWidth={1} opacity={0.6} />
      {corners.map(([x, y, sx, sy], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${sx},${sy})`}>
          <path d={`M0,${L} L0,0 L${L},0`} strokeWidth={3} />
          <polygon points="6,6 24,6 6,24" fill={accent} stroke="none" opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

// Fills a w×h area with one of the back patterns. Used by the card back and the tuck box.
export function PatternFill({
  pattern,
  scale,
  rotation,
  color,
  accent,
  w,
  h,
  centerX,
  centerY,
}: {
  pattern: BackPattern;
  scale: number;
  rotation: number;
  color: string;
  accent: string;
  w: number;
  h: number;
  centerX: number;
  centerY: number;
}) {
  switch (pattern) {
    case "diamonds":
      return <DiamondsPattern scale={scale} rotation={rotation} color={color} accent={accent} fillW={w} fillH={h} />;
    case "sunburst":
      return <SunburstPattern color={color} accent={accent} centerX={centerX} centerY={centerY} fillW={w} fillH={h} />;
    case "art-deco":
      return <ArtDecoPattern scale={scale} rotation={rotation} color={color} accent={accent} fillW={w} fillH={h} />;
    case "plain":
    case "custom":
      return <rect x={0} y={0} width={w} height={h} fill={color} />;
    default:
      return <AzulejoPattern scale={scale} rotation={rotation} color={color} accent={accent} fillW={w} fillH={h} />;
  }
}

// Medallion with a domino emblem instead of text so the back stays non-directional
export function CenterMedallion({ cx, cy, color, accent }: { cx: number; cy: number; color: string; accent: string }) {
  const r = 120;
  const tw = r * 0.52;
  const th = r * 1.0;
  const pr = tw * 0.1;
  const dx = tw * 0.24;
  const dy = th * 0.12;
  const pips = [
    [-dx, -th / 4 - dy], [0, -th / 4], [dx, -th / 4 + dy],
    [-dx, th / 4 - dy], [0, th / 4], [dx, th / 4 + dy],
  ];
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 34} fill={accent} opacity={0.12} />
      <circle cx={cx} cy={cy} r={r + 18} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={accent} strokeWidth={4} />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 24;
        return <circle key={i} cx={cx + Math.cos(a) * r * 0.86} cy={cy + Math.sin(a) * r * 0.86} r={3.5} fill={accent} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke={accent} strokeWidth={1.5} />
      <g transform={`translate(${cx},${cy})`}>
        <rect x={-tw / 2} y={-th / 2} width={tw} height={th} rx={8} fill={accent} />
        <line x1={-tw / 2 + 6} y1={0} x2={tw / 2 - 6} y2={0} stroke={color} strokeWidth={2.5} />
        {pips.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={pr} fill={color} />
        ))}
      </g>
    </g>
  );
}

export default function CardBack({ tokens, showTrim = false, showSafe = false }: CardBackProps) {
  const { back, colors, border } = tokens;
  const cx = W / 2;
  const cy = H / 2;

  const renderPattern = () => {
    switch (back.pattern) {
      case "diamonds":
        return <DiamondsPattern scale={back.scale} rotation={back.rotation} color={colors.backBackground} accent={colors.backAccent} />;
      case "sunburst":
        return <SunburstPattern color={colors.backBackground} accent={colors.backAccent} centerX={cx} centerY={cy} />;
      case "art-deco":
        return <ArtDecoPattern scale={back.scale} rotation={back.rotation} color={colors.backBackground} accent={colors.backAccent} />;
      case "plain":
        return <rect x={0} y={0} width={W} height={H} fill={colors.backBackground} />;
      case "custom":
        return back.customImage ? (
          <image href={back.customImage} x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid slice" />
        ) : (
          <rect x={0} y={0} width={W} height={H} fill={colors.backBackground} />
        );
      default:
        return <AzulejoPattern scale={back.scale} rotation={back.rotation} color={colors.backBackground} accent={colors.backAccent} />;
    }
  };

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      {renderPattern()}
      {back.pattern !== "custom" && <BackFrame accent={colors.backAccent} />}
      {back.centerMedallion && <CenterMedallion cx={cx} cy={cy} color={colors.backBackground} accent={colors.backAccent} />}

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
      {border.innerWidth > 0 && (
        <rect
          x={border.outerWidth + 4 + border.innerWidth / 2}
          y={border.outerWidth + 4 + border.innerWidth / 2}
          width={W - (border.outerWidth + 4) * 2 - border.innerWidth}
          height={H - (border.outerWidth + 4) * 2 - border.innerWidth}
          fill="none"
          stroke={colors.border}
          strokeWidth={border.innerWidth}
          opacity={0.6}
        />
      )}

      {showTrim && (
        <rect x={PRINT.trimInset} y={PRINT.trimInset} width={W - PRINT.trimInset * 2} height={H - PRINT.trimInset * 2} fill="none" stroke="#00AAFF" strokeWidth={1} strokeDasharray="6,4" />
      )}
      {showSafe && (
        <rect x={PRINT.safeInset} y={PRINT.safeInset} width={W - PRINT.safeInset * 2} height={H - PRINT.safeInset * 2} fill="none" stroke="#00FF88" strokeWidth={1} strokeDasharray="4,6" />
      )}
    </svg>
  );
}
