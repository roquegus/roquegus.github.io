import type { DesignTokens, BackPattern, MedallionStyle } from "../../types";
import { PRINT } from "../../constants/print";

type CardBackProps = {
  tokens: DesignTokens;
  showTrim?: boolean;
  showSafe?: boolean;
};

const W = PRINT.width;
const H = PRINT.height;
// MPC cuts the outer 36 px off; frames must sit inside that line
const FRAME = PRINT.trimInset + 16;

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

// Cuban hydraulic floor tile (Domino Park deck): a cream ground, a rotated square
// in the accent color, a grid in the secondary color with a dot at each tile
// center, and a small tertiary dot where four tiles meet. Corner shapes are drawn
// at all four corners of the pattern cell so neighbours complete them.
function CubanTilePattern({
  scale,
  rotation,
  color,
  accent,
  secondary,
  tertiary,
  fillW = W,
  fillH = H,
  centerX = W / 2,
  centerY = H / 2,
}: PatternProps & { secondary: string; tertiary: string; centerX?: number; centerY?: number }) {
  const s = 150 * scale;
  const h = s / 2;
  const id = patternId("cubantile", scale, color, accent) + secondary.replace("#", "");
  // Put a tile center on the card center so the back is point-symmetric
  const ox = ((centerX - h) % s + s) % s;
  const oy = ((centerY - h) % s + s) % s;
  return (
    <g>
      <defs>
        <pattern id={id} x={ox} y={oy} width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation} ${centerX} ${centerY})`}>
          <rect width={s} height={s} fill={color} />
          <polygon points={diamondPts(h, h, h * 0.86)} fill={accent} />
          <polygon points={diamondPts(h, h, h * 0.62)} fill="none" stroke={color} strokeWidth={s * 0.02} opacity={0.7} />
          <rect x={0} y={0} width={s} height={s} fill="none" stroke={secondary} strokeWidth={s * 0.066} />
          <circle cx={h} cy={h} r={s * 0.15} fill={secondary} />
          <circle cx={h} cy={h} r={s * 0.062} fill={color} />
          {[[0, 0], [s, 0], [0, s], [s, s]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={s * 0.095} fill={tertiary} />
          ))}
        </pattern>
      </defs>
      <rect x={0} y={0} width={fillW} height={fillH} fill={`url(#${id})`} />
    </g>
  );
}

// Miami Beach Art Deco stepped sunburst (Deco Beach deck): a fan of rays from the
// top and bottom edge in the secondary and tertiary colors over the ground, and
// three lines across the middle. Both halves are the same, turned 180 degrees.
function DecoRaysPattern({
  color,
  secondary,
  tertiary,
  accent,
  fillW = W,
  fillH = H,
  centerX = W / 2,
  centerY = H / 2,
}: { color: string; secondary: string; tertiary: string; accent: string; fillW?: number; fillH?: number; centerX?: number; centerY?: number }) {
  const id = `decorays-${Math.round(centerX)}-${Math.round(centerY)}-${Math.round(fillH)}`;
  const r = Math.max(fillW, fillH) * 1.3;
  const wedges = 7; // across 180 degrees; odd count keeps the middle ray on the axis
  const halfH = fillH / 2;
  const fan = (apexY: number, up: boolean) => {
    const out = [];
    for (let i = 0; i < wedges; i++) {
      const a1 = Math.PI + (i * Math.PI) / wedges;
      const a2 = Math.PI + ((i + 1) * Math.PI) / wedges;
      const s = up ? 1 : -1;
      const fill = i % 2 === 0 ? secondary : i === 3 ? tertiary : color;
      out.push(
        <polygon
          key={i}
          points={`${centerX},${apexY} ${centerX + Math.cos(a1) * r},${apexY + s * Math.sin(a1) * r} ${centerX + Math.cos(a2) * r},${apexY + s * Math.sin(a2) * r}`}
          fill={fill}
        />
      );
    }
    return out;
  };
  const arcs = (apexY: number) =>
    [0.28, 0.4, 0.52].map((k) => (
      <circle key={k} cx={centerX} cy={apexY} r={fillH * k} fill="none" stroke={tertiary} strokeWidth={6} opacity={0.55} />
    ));
  return (
    <g>
      <defs>
        <clipPath id={`${id}-top`}>
          <rect x={0} y={0} width={fillW} height={centerY} />
        </clipPath>
        <clipPath id={`${id}-bottom`}>
          <rect x={0} y={centerY} width={fillW} height={fillH - centerY} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={fillW} height={fillH} fill={color} />
      <g clipPath={`url(#${id}-top)`}>
        {fan(centerY - halfH, false)}
        {arcs(centerY - halfH)}
      </g>
      <g clipPath={`url(#${id}-bottom)`}>
        {fan(centerY + halfH, true)}
        {arcs(centerY + halfH)}
      </g>
      <g stroke={accent} strokeWidth={10}>
        <line x1={FRAME} y1={centerY - 61} x2={fillW - FRAME} y2={centerY - 61} />
        <line x1={FRAME} y1={centerY} x2={fillW - FRAME} y2={centerY} />
        <line x1={FRAME} y1={centerY + 61} x2={fillW - FRAME} y2={centerY + 61} />
      </g>
    </g>
  );
}

// Blend two hex colors; t = 0 gives a, t = 1 gives b.
function mixHex(a: string, b: string, t: number): string {
  const pa = a.replace("#", "");
  const pb = b.replace("#", "");
  const out = [0, 2, 4].map((i) => {
    const va = parseInt(pa.slice(i, i + 2), 16);
    const vb = parseInt(pb.slice(i, i + 2), 16);
    return Math.round(va + (vb - va) * t).toString(16).padStart(2, "0");
  });
  return `#${out.join("")}`;
}

// A palm silhouette, crown at the origin, trunk running down to (70, 660). Drawn
// once here and reused for the Miami Sunset back and the tuck box.
const PALM_FRONDS = [
  "M 0 0 Q -134 -108 -320 -125 Q -186 -17 0 0 Z",
  "M 0 0 Q -43 -184 -188 -313 Q -145 -129 0 0 Z",
  "M 0 0 Q 47 -177 -13 -350 Q -61 -173 0 0 Z",
  "M 0 0 Q 145 -129 188 -313 Q 43 -184 0 0 Z",
  "M 0 0 Q 186 -17 320 -125 Q 134 -108 0 0 Z",
  "M 0 0 Q -142 -21 -297 48 Q -155 70 0 0 Z",
  "M 0 0 Q 155 70 297 48 Q 142 -21 0 0 Z",
  "M 0 0 Q -131 60 -235 196 Q -104 135 0 0 Z",
  "M 0 0 Q 104 135 235 196 Q 131 60 0 0 Z",
];
export function Palm({ x, y, scale, color, flip = false }: { x: number; y: number; scale: number; color: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`} fill={color} stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 70 660 C 10 490, -40 310, 0 10" fill="none" strokeWidth={46} />
      <path d="M 90 660 C 50 540, 20 450, 25 330" fill="none" strokeWidth={32} />
      <g strokeWidth={6}>
        {PALM_FRONDS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <circle cx={-20} cy={34} r={26} />
      <circle cx={26} cy={36} r={26} />
      <circle cx={4} cy={66} r={24} />
    </g>
  );
}

// Miami Sunset (souvenir deck): a sky that runs from the ground color at the top
// and bottom edges to the secondary color in the middle, a banded sun in the
// center, and palms in the lower-left corner with a 180-degree copy in the
// upper right, so the back reads the same either way up.
function MiamiSunsetPattern({
  color,
  accent,
  secondary,
  tertiary,
  fillW = W,
  fillH = H,
  centerX = W / 2,
  centerY = H / 2,
}: { color: string; accent: string; secondary: string; tertiary: string; fillW?: number; fillH?: number; centerX?: number; centerY?: number }) {
  const id = `sunset-${Math.round(centerX)}-${Math.round(centerY)}-${Math.round(fillH)}-${secondary.replace("#", "")}`;
  const sunR = 200;
  const halfH = fillH / 2;
  // A warm pale stop between the sky color and the sunset keeps the blend from going grey
  const mint = mixHex(color, "#FFF3D6", 0.55);
  const palms = (rot: number) => (
    <g transform={rot ? `rotate(180 ${centerX} ${centerY})` : undefined}>
      <Palm x={centerX - 235} y={centerY + halfH - 300} scale={0.6} color={accent} />
      <Palm x={centerX + 110} y={centerY + halfH - 200} scale={0.4} color={accent} flip />
    </g>
  );
  const sunPale = mixHex(tertiary, "#FFF8E1", 0.55);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="0.2" stopColor={mint} />
          <stop offset="0.38" stopColor={tertiary} />
          <stop offset="0.5" stopColor={secondary} />
          <stop offset="0.62" stopColor={tertiary} />
          <stop offset="0.8" stopColor={mint} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sunPale} />
          <stop offset="0.5" stopColor={tertiary} />
          <stop offset="1" stopColor={sunPale} />
        </linearGradient>
        <clipPath id={`${id}-sunclip`}>
          <circle cx={centerX} cy={centerY} r={sunR} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={fillW} height={fillH} fill={`url(#${id}-sky)`} />
      <circle cx={centerX} cy={centerY} r={sunR + 30} fill={sunPale} opacity={0.3} />
      <circle cx={centerX} cy={centerY} r={sunR} fill={`url(#${id}-sun)`} />
      <g clipPath={`url(#${id}-sunclip)`} fill={secondary} opacity={0.7}>
        {[-150, -96, -48, 48, 96, 150].map((dy, i) => (
          <rect key={i} x={centerX - sunR} y={centerY + dy - (i % 3 === 0 ? 5 : i % 3 === 1 ? 8 : 11)} width={sunR * 2} height={i % 3 === 0 ? 10 : i % 3 === 1 ? 16 : 22} />
        ))}
      </g>
      {palms(0)}
      {palms(180)}
    </g>
  );
}

// Heavy frame for the tile back: a wide accent band at the trim-safe line and a
// thin tertiary line inside it.
function TileFrame({ accent, tertiary }: { accent: string; tertiary: string }) {
  return (
    <g fill="none">
      <rect x={FRAME + 7} y={FRAME + 7} width={W - FRAME * 2 - 14} height={H - FRAME * 2 - 14} stroke={accent} strokeWidth={14} />
      <rect x={FRAME + 24} y={FRAME + 24} width={W - FRAME * 2 - 48} height={H - FRAME * 2 - 48} stroke={tertiary} strokeWidth={4} />
    </g>
  );
}

// Rounded streamline frame for the Deco back.
function DecoFrame({ accent }: { accent: string }) {
  return (
    <rect x={FRAME + 6} y={FRAME + 6} width={W - FRAME * 2 - 12} height={H - FRAME * 2 - 12} rx={30} fill="none" stroke={accent} strokeWidth={12} />
  );
}

// Inset frame with corner brackets; fully 180°-symmetric. Sits on the safe line.
function BackFrame({ accent }: { accent: string }) {
  const inset = PRINT.safeInset;
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
  secondary,
  tertiary,
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
  secondary?: string;
  tertiary?: string;
  w: number;
  h: number;
  centerX: number;
  centerY: number;
}) {
  const sec = secondary ?? accent;
  const ter = tertiary ?? color;
  switch (pattern) {
    case "cuban-tile":
      return <CubanTilePattern scale={scale} rotation={rotation} color={color} accent={accent} secondary={sec} tertiary={ter} fillW={w} fillH={h} centerX={centerX} centerY={centerY} />;
    case "deco-rays":
      return <DecoRaysPattern color={color} accent={accent} secondary={sec} tertiary={ter} fillW={w} fillH={h} centerX={centerX} centerY={centerY} />;
    case "miami-sunset":
      return <MiamiSunsetPattern color={color} accent={accent} secondary={sec} tertiary={ter} fillW={w} fillH={h} centerX={centerX} centerY={centerY} />;
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

// A double-nine domino tile, point-symmetric, centered at the origin.
function DominoTile({ w, h, fill, pip, line }: { w: number; h: number; fill: string; pip: string; line: string }) {
  const pr = w * 0.085;
  const cx = [-w * 0.29, 0, w * 0.29];
  const rows = [0.12, 0.25, 0.38].map((k) => h * k);
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.11} fill={fill} />
      <line x1={-w / 2 + w * 0.1} y1={0} x2={w / 2 - w * 0.1} y2={0} stroke={line} strokeWidth={Math.max(2, w * 0.05)} />
      {rows.map((ry) =>
        cx.map((px) => (
          <g key={`${ry}-${px}`}>
            <circle cx={px} cy={-ry} r={pr} fill={pip} />
            <circle cx={px} cy={ry} r={pr} fill={pip} />
          </g>
        ))
      )}
    </g>
  );
}

// Domino Park medallion: a dark disk with a thin tertiary ring and a light 9|9 tile.
function TileMedallion({ cx, cy, color, accent, secondary, tertiary }: { cx: number; cy: number; color: string; accent: string; secondary: string; tertiary: string }) {
  const r = 150;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 10} fill={color} />
      <circle cx={cx} cy={cy} r={r} fill={accent} />
      <circle cx={cx} cy={cy} r={r - 14} fill="none" stroke={tertiary} strokeWidth={5} />
      <g transform={`translate(${cx},${cy})`}>
        <DominoTile w={92} h={200} fill={color} pip={accent} line={secondary} />
      </g>
    </g>
  );
}

// Deco Beach medallion: a porthole. Light disk, heavy accent ring with rivets,
// a thin secondary ring, and a small accent 9|9 tile.
function PortholeMedallion({ cx, cy, color, accent, secondary, tertiary }: { cx: number; cy: number; color: string; accent: string; secondary: string; tertiary: string }) {
  const r = 150;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={tertiary} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth={18} />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 16;
        return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={4} fill={color} />;
      })}
      <circle cx={cx} cy={cy} r={r - 32} fill="none" stroke={secondary} strokeWidth={8} />
      <g transform={`translate(${cx},${cy})`}>
        <DominoTile w={64} h={140} fill={accent} pip={tertiary} line={tertiary} />
      </g>
    </g>
  );
}

export function Medallion({
  style = "domino",
  cx,
  cy,
  color,
  accent,
  secondary,
  tertiary,
}: {
  style?: MedallionStyle;
  cx: number;
  cy: number;
  color: string;
  accent: string;
  secondary?: string;
  tertiary?: string;
}) {
  const sec = secondary ?? accent;
  const ter = tertiary ?? color;
  if (style === "tile") return <TileMedallion cx={cx} cy={cy} color={color} accent={accent} secondary={sec} tertiary={ter} />;
  if (style === "porthole") return <PortholeMedallion cx={cx} cy={cy} color={color} accent={accent} secondary={sec} tertiary={ter} />;
  return <CenterMedallion cx={cx} cy={cy} color={color} accent={accent} />;
}

// One logo image in a w×h box centered at (cx, cy), turned by `rotate` degrees.
function LogoImage({ href, cx, cy, w, h, rotate = 0 }: { href: string; cx: number; cy: number; w: number; h: number; rotate?: number }) {
  return (
    <image
      href={href}
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
      transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : undefined}
    />
  );
}

// Client logo centered in the safe area.
// Portrait: an upright square box. Landscape: a wide box turned 90° (top of the
// logo toward the card's left edge) so it reads when the card is held sideways.
// Mirrored prints it twice, the lower copy rotated 180°, so a face-down card
// reads the same either way up.
export function BackLogo({
  href,
  mirrored,
  orientation = "portrait",
  scale = 0.75,
  cx,
  cy,
  box = 400,
}: {
  href: string;
  mirrored?: boolean;
  orientation?: "portrait" | "landscape";
  scale?: number;
  cx: number;
  cy: number;
  /** Largest square box (portrait) that fits at scale 1. */
  box?: number;
}) {
  const s = Math.min(1, Math.max(0.4, scale));

  if (orientation === "landscape") {
    if (mirrored) {
      // Two wide boxes stacked; in the rotated frame each is w×h, so on the card
      // each occupies h wide by w tall. Gap sits on the midline.
      const w = 430 * s;
      const h = 400 * s;
      const gap = 40;
      const off = w / 2 + gap / 2;
      return (
        <g>
          <LogoImage href={href} cx={cx} cy={cy - off} w={w} h={h} rotate={-90} />
          <LogoImage href={href} cx={cx} cy={cy + off} w={w} h={h} rotate={90} />
        </g>
      );
    }
    return <LogoImage href={href} cx={cx} cy={cy} w={880 * s} h={420 * s} rotate={-90} />;
  }

  const b = box * s;
  if (mirrored) {
    const bb = b * 0.8;
    const gap = b * 0.2;
    return (
      <g>
        <LogoImage href={href} cx={cx} cy={cy - gap / 2 - bb / 2} w={bb} h={bb} />
        <LogoImage href={href} cx={cx} cy={cy + gap / 2 + bb / 2} w={bb} h={bb} rotate={180} />
      </g>
    );
  }
  return <LogoImage href={href} cx={cx} cy={cy} w={b} h={b} />;
}

export default function CardBack({ tokens, showTrim = false, showSafe = false }: CardBackProps) {
  const { back, colors, border } = tokens;
  const cx = W / 2;
  const cy = H / 2;
  const showFrame = back.frame !== false && back.pattern !== "custom";
  const secondary = colors.backSecondary ?? colors.backAccent;
  const tertiary = colors.backTertiary ?? colors.backBackground;

  const renderPattern = () => {
    switch (back.pattern) {
      case "cuban-tile":
        return <CubanTilePattern scale={back.scale} rotation={back.rotation} color={colors.backBackground} accent={colors.backAccent} secondary={secondary} tertiary={tertiary} />;
      case "deco-rays":
        return <DecoRaysPattern color={colors.backBackground} accent={colors.backAccent} secondary={secondary} tertiary={tertiary} />;
      case "miami-sunset":
        return <MiamiSunsetPattern color={colors.backBackground} accent={colors.backAccent} secondary={secondary} tertiary={tertiary} />;
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
      {back.logo && back.logoWhiteBack && (
        <rect x={0} y={0} width={W} height={H} fill="#FFFFFF" />
      )}
      {showFrame && back.pattern === "cuban-tile" && <TileFrame accent={colors.backAccent} tertiary={tertiary} />}
      {showFrame && back.pattern === "deco-rays" && <DecoFrame accent={colors.backAccent} />}
      {showFrame && back.pattern === "miami-sunset" && <DecoFrame accent={tertiary} />}
      {showFrame && back.pattern !== "cuban-tile" && back.pattern !== "deco-rays" && back.pattern !== "miami-sunset" && <BackFrame accent={colors.backAccent} />}
      {back.centerMedallion && (
        <Medallion style={back.medallionStyle} cx={cx} cy={cy} color={colors.backBackground} accent={colors.backAccent} secondary={secondary} tertiary={tertiary} />
      )}
      {back.logo && (
        <BackLogo
          href={back.logo}
          mirrored={back.logoMirrored}
          orientation={back.logoOrientation}
          scale={back.logoScale}
          cx={cx}
          cy={cy}
        />
      )}

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
      {border.innerWidth > 0 && (
        <rect
          x={FRAME + border.outerWidth + 4 + border.innerWidth / 2}
          y={FRAME + border.outerWidth + 4 + border.innerWidth / 2}
          width={W - (FRAME + border.outerWidth + 4) * 2 - border.innerWidth}
          height={H - (FRAME + border.outerWidth + 4) * 2 - border.innerWidth}
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
