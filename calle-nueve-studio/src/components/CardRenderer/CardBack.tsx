
import type { DesignTokens } from "../../types";
import { PRINT } from "../../constants/print";

type CardBackProps = {
  tokens: DesignTokens;
  showTrim?: boolean;
  showSafe?: boolean;
};

function MosaicPattern({
  scale,
  rotation,
  color,
  accent,
}: {
  scale: number;
  rotation: number;
  color: string;
  accent: string;
}) {
  const s = 40 * scale;
  const id = `mosaic-${Math.round(scale * 100)}-${color.replace("#", "")}`;
  return (
    <g>
      <defs>
        <pattern id={id} x={0} y={0} width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
          <rect width={s} height={s} fill={color} />
          <rect x={1} y={1} width={s / 2 - 2} height={s / 2 - 2} fill={accent} opacity={0.7} />
          <rect x={s / 2 + 1} y={s / 2 + 1} width={s / 2 - 2} height={s / 2 - 2} fill={accent} opacity={0.7} />
          <rect x={s / 2 + 1} y={1} width={s / 2 - 2} height={s / 2 - 2} fill={accent} opacity={0.35} />
          <rect x={1} y={s / 2 + 1} width={s / 2 - 2} height={s / 2 - 2} fill={accent} opacity={0.35} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={PRINT.width} height={PRINT.height} fill={`url(#${id})`} />
    </g>
  );
}

function DiamondsPattern({
  scale,
  rotation,
  color,
  accent,
}: {
  scale: number;
  rotation: number;
  color: string;
  accent: string;
}) {
  const s = 50 * scale;
  const id = `diamonds-${Math.round(scale * 100)}-${color.replace("#", "")}`;
  return (
    <g>
      <defs>
        <pattern id={id} x={0} y={0} width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
          <rect width={s} height={s} fill={color} />
          <polygon
            points={`${s / 2},2 ${s - 2},${s / 2} ${s / 2},${s - 2} 2,${s / 2}`}
            fill={accent}
            opacity={0.8}
          />
        </pattern>
      </defs>
      <rect x={0} y={0} width={PRINT.width} height={PRINT.height} fill={`url(#${id})`} />
    </g>
  );
}

function SunburstPattern({
  color,
  accent,
  centerX,
  centerY,
}: {
  color: string;
  accent: string;
  centerX: number;
  centerY: number;
}) {
  const rays = 24;
  return (
    <g>
      <rect x={0} y={0} width={PRINT.width} height={PRINT.height} fill={color} />
      {Array.from({ length: rays }).map((_, i) => {
        const a1 = (i * Math.PI * 2) / rays;
        const a2 = ((i + 0.5) * Math.PI * 2) / rays;
        const r = Math.max(PRINT.width, PRINT.height) * 1.2;
        const x1 = centerX + Math.cos(a1) * r;
        const y1 = centerY + Math.sin(a1) * r;
        const x2 = centerX + Math.cos(a2) * r;
        const y2 = centerY + Math.sin(a2) * r;
        return (
          <polygon
            key={i}
            points={`${centerX},${centerY} ${x1},${y1} ${x2},${y2}`}
            fill={accent}
            opacity={0.25}
          />
        );
      })}
    </g>
  );
}

function ArtDecoPattern({
  scale,
  rotation,
  color,
  accent,
}: {
  scale: number;
  rotation: number;
  color: string;
  accent: string;
}) {
  const s = 60 * scale;
  const id = `artdeco-${Math.round(scale * 100)}-${color.replace("#", "")}`;
  return (
    <g>
      <defs>
        <pattern id={id} x={0} y={0} width={s} height={s} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
          <rect width={s} height={s} fill={color} />
          <line x1={0} y1={s / 2} x2={s} y2={s / 2} stroke={accent} strokeWidth={2} opacity={0.6} />
          <line x1={s / 2} y1={0} x2={s / 2} y2={s} stroke={accent} strokeWidth={2} opacity={0.6} />
          <line x1={0} y1={s / 2} x2={s} y2={s / 2} stroke={accent} strokeWidth={0.5} strokeDasharray={`${s * 0.1},${s * 0.05}`} opacity={0.4} transform={`translate(0,-${s * 0.12})`} />
          <line x1={0} y1={s / 2} x2={s} y2={s / 2} stroke={accent} strokeWidth={0.5} strokeDasharray={`${s * 0.1},${s * 0.05}`} opacity={0.4} transform={`translate(0,${s * 0.12})`} />
          <polygon
            points={`${s / 2},${s * 0.15} ${s * 0.85},${s / 2} ${s / 2},${s * 0.85} ${s * 0.15},${s / 2}`}
            fill="none"
            stroke={accent}
            strokeWidth={1}
            opacity={0.5}
          />
        </pattern>
      </defs>
      <rect x={0} y={0} width={PRINT.width} height={PRINT.height} fill={`url(#${id})`} />
    </g>
  );
}

function CenterMedallion({
  cx,
  cy,
  color,
  accent,
}: {
  cx: number;
  cy: number;
  color: string;
  accent: string;
}) {
  const r = 100;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 20} fill={accent} opacity={0.15} />
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={accent} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r * 0.75} fill="none" stroke={accent} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke={accent} strokeWidth={1} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 12;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r * 0.52}
            y1={cy + Math.sin(a) * r * 0.52}
            x2={cx + Math.cos(a) * r * 0.73}
            y2={cy + Math.sin(a) * r * 0.73}
            stroke={accent}
            strokeWidth={1.5}
          />
        );
      })}
      <polygon
        points={`${cx},${cy - r * 0.35} ${cx + r * 0.25},${cy} ${cx},${cy + r * 0.35} ${cx - r * 0.25},${cy}`}
        fill={accent}
        opacity={0.9}
      />
      <text x={cx} y={cy + r * 0.15} textAnchor="middle" fontSize={14} fill={accent} fontFamily="serif" letterSpacing={2}>
        C9
      </text>
    </g>
  );
}

export default function CardBack({
  tokens,
  showTrim = false,
  showSafe = false,
}: CardBackProps) {
  const { back, colors } = tokens;
  const cx = PRINT.width / 2;
  const cy = PRINT.height / 2;

  const renderPattern = () => {
    switch (back.pattern) {
      case "diamonds":
        return (
          <DiamondsPattern
            scale={back.scale}
            rotation={back.rotation}
            color={colors.backBackground}
            accent={colors.backAccent}
          />
        );
      case "sunburst":
        return (
          <SunburstPattern
            color={colors.backBackground}
            accent={colors.backAccent}
            centerX={cx}
            centerY={cy}
          />
        );
      case "art-deco":
        return (
          <ArtDecoPattern
            scale={back.scale}
            rotation={back.rotation}
            color={colors.backBackground}
            accent={colors.backAccent}
          />
        );
      case "plain":
        return (
          <rect x={0} y={0} width={PRINT.width} height={PRINT.height} fill={colors.backBackground} />
        );
      default:
        return (
          <MosaicPattern
            scale={back.scale}
            rotation={back.rotation}
            color={colors.backBackground}
            accent={colors.backAccent}
          />
        );
    }
  };

  const { border, colors: c } = tokens;

  return (
    <svg
      width={PRINT.width}
      height={PRINT.height}
      viewBox={`0 0 ${PRINT.width} ${PRINT.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderPattern()}
      {back.centerMedallion && (
        <CenterMedallion cx={cx} cy={cy} color={colors.backBackground} accent={colors.backAccent} />
      )}

      {/* Border */}
      {border.outerWidth > 0 && (
        <rect
          x={border.outerWidth / 2}
          y={border.outerWidth / 2}
          width={PRINT.width - border.outerWidth}
          height={PRINT.height - border.outerWidth}
          fill="none"
          stroke={c.border}
          strokeWidth={border.outerWidth}
        />
      )}
      {border.innerWidth > 0 && (
        <rect
          x={border.outerWidth + 4 + border.innerWidth / 2}
          y={border.outerWidth + 4 + border.innerWidth / 2}
          width={PRINT.width - (border.outerWidth + 4) * 2 - border.innerWidth}
          height={PRINT.height - (border.outerWidth + 4) * 2 - border.innerWidth}
          fill="none"
          stroke={c.border}
          strokeWidth={border.innerWidth}
          opacity={0.6}
        />
      )}

      {/* Guides (preview only) */}
      {showTrim && (
        <rect
          x={PRINT.trimInset}
          y={PRINT.trimInset}
          width={PRINT.width - PRINT.trimInset * 2}
          height={PRINT.height - PRINT.trimInset * 2}
          fill="none"
          stroke="#00AAFF"
          strokeWidth={1}
          strokeDasharray="6,4"
        />
      )}
      {showSafe && (
        <rect
          x={PRINT.safeInset}
          y={PRINT.safeInset}
          width={PRINT.width - PRINT.safeInset * 2}
          height={PRINT.height - PRINT.safeInset * 2}
          fill="none"
          stroke="#00FF88"
          strokeWidth={1}
          strokeDasharray="4,6"
        />
      )}
    </svg>
  );
}
