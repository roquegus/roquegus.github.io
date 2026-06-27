// Ornamental divider rendered at y=0; caller wraps with translate(0, MID_Y).

const LeafOrnament = ({ color }) => (
  <g>
    <path d="M-68,0 Q-44,-14 -18,0 Q-44,14 -68,0 Z" fill={color} opacity={0.8} />
    <path d="M68,0  Q44,-14  18,0 Q44,14  68,0  Z" fill={color} opacity={0.8} />
    <line x1={-68} y1={0} x2={-18} y2={0} stroke={color} strokeWidth={0.8} opacity={0.5} />
    <line x1={18}  y1={0} x2={68}  y2={0} stroke={color} strokeWidth={0.8} opacity={0.5} />
    <path d="M0,-14 L14,0 L0,14 L-14,0 Z" fill={color} />
    <path d="M0,-8  L8,0  L0,8  L-8,0  Z" fill="rgba(0,0,0,0.35)" />
  </g>
);

const DiamondOrnament = ({ color }) => (
  <g>
    <path d="M0,-18 L22,0 L0,18 L-22,0 Z" fill={color} />
    <path d="M0,-10 L12,0 L0,10 L-12,0 Z" fill="rgba(0,0,0,0.3)" />
    <circle cx={-34} cy={0} r={5} fill={color} />
    <circle cx={34}  cy={0} r={5} fill={color} />
  </g>
);

const StarOrnament = ({ color }) => {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a   = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r   = i % 2 === 0 ? 18 : 8;
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
  return (
    <g>
      <polygon points={pts} fill={color} />
      <circle cx={0} cy={0} r={5} fill="rgba(0,0,0,0.3)" />
      <circle cx={-32} cy={0} r={4} fill={color} />
      <circle cx={32}  cy={0} r={4} fill={color} />
    </g>
  );
};

const ORNAMENTS = { leaf: LeafOrnament, diamond: DiamondOrnament, star: StarOrnament };

const DividerLine = ({
  cardWidth,
  dividerColor,
  lineStyle    = 'solid',
  ornamentType = 'leaf',
  thickness    = 2,
}) => {
  const W   = cardWidth;
  const cx  = W / 2;
  const OrnComp = ORNAMENTS[ornamentType] ?? null;
  const gap = OrnComp ? 80 : 0;

  const dash = lineStyle === 'dashed' ? '14,10' : undefined;

  const lineAttr = {
    stroke: dividerColor,
    strokeWidth: thickness,
    strokeDasharray: dash,
  };

  if (lineStyle === 'none' && !OrnComp) return null;

  return (
    <g>
      {/* Left rule */}
      {lineStyle !== 'none' && (
        <line x1={0} y1={0} x2={cx - gap} y2={0} {...lineAttr} />
      )}

      {/* Double second rule */}
      {lineStyle === 'double' && (
        <>
          <line x1={0} y1={-thickness * 3} x2={cx - gap} y2={-thickness * 3}
            stroke={dividerColor} strokeWidth={thickness * 0.6} opacity={0.45} />
          <line x1={cx + gap} y1={-thickness * 3} x2={W} y2={-thickness * 3}
            stroke={dividerColor} strokeWidth={thickness * 0.6} opacity={0.45} />
        </>
      )}

      {/* Right rule */}
      {lineStyle !== 'none' && (
        <line x1={cx + gap} y1={0} x2={W} y2={0} {...lineAttr} />
      )}

      {/* Centre ornament */}
      {OrnComp && (
        <g transform={`translate(${cx},0)`}>
          <OrnComp color={dividerColor} />
        </g>
      )}
    </g>
  );
};

export default DividerLine;
