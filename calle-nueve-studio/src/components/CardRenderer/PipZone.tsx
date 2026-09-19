import type { DesignTokens } from "../../types";
import { getPipPositions } from "../../utils/pips";
import PipIcon from "./PipIcon";

type PipZoneProps = {
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  tokens: DesignTokens;
  flipped?: boolean;
};

export default function PipZone({
  value,
  x,
  y,
  width,
  height,
  tokens,
  flipped = false,
}: PipZoneProps) {
  const positions = getPipPositions(value);
  const { pips, colors } = tokens;
  // Pips are always the same size regardless of count, like a real domino tile
  const size = pips.size;
  // Optional extra column spread, measured from the zone's center line
  const spread = 1 + (pips.spread ?? 0) / 100;
  const flat = pips.flat === true;

  const content = (
    <g>
      {positions.map((pos, i) => {
        const fx = 0.5 + (pos.x - 0.5) * spread;
        const px = x + fx * width - size / 2;
        const py = y + pos.y * height - size / 2;
        return (
          <g key={i} transform={`translate(${px},${py})`} filter={flat ? undefined : "url(#pipShadow)"}>
            <PipIcon
              value={value}
              style={pips.style}
              size={size}
              color={colors.pip}
              secondaryColor={colors.pipSecondary}
              strokeWidth={pips.strokeWidth}
              fillMode={pips.fillMode}
              flat={flat}
            />
          </g>
        );
      })}
    </g>
  );

  if (flipped) {
    const cx = x + width / 2;
    const cy = y + height / 2;
    return (
      <g transform={`rotate(180, ${cx}, ${cy})`}>{content}</g>
    );
  }

  return content;
}
