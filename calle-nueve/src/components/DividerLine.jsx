// Ornamental tobacco-leaf divider spanning the full card width.
// Rendered at y=0; caller wraps with translate(0, MID_Y).
const DividerLine = ({ cardWidth, palette }) => {
  const W = cardWidth;
  const cx = W / 2;
  const gold = palette.gold;

  return (
    <g>
      {/* Left rule */}
      <line x1={0} y1={0} x2={cx - 68} y2={0} stroke={gold} strokeWidth={1.5} />
      {/* Right rule */}
      <line x1={cx + 68} y1={0} x2={W} y2={0} stroke={gold} strokeWidth={1.5} />

      {/* Center ornament group */}
      <g transform={`translate(${cx}, 0)`}>
        {/* Left leaf */}
        <path
          d={`M-68,0 Q-44,-14 -18,0 Q-44,14 -68,0 Z`}
          fill={gold} opacity={0.75}
        />
        {/* Right leaf */}
        <path
          d={`M68,0 Q44,-14 18,0 Q44,14 68,0 Z`}
          fill={gold} opacity={0.75}
        />
        {/* Leaf veins */}
        <line x1={-68} y1={0} x2={-18} y2={0} stroke={gold} strokeWidth={0.8} opacity={0.5} />
        <line x1={18} y1={0} x2={68} y2={0} stroke={gold} strokeWidth={0.8} opacity={0.5} />
        {/* Center diamond */}
        <path d={`M0,-14 L14,0 L0,14 L-14,0 Z`} fill={gold} />
        <path d={`M0,-8 L8,0 L0,8 L-8,0 Z`} fill={palette.mahogany} />
        {/* Accent dots */}
        <circle cx={-78} cy={0} r={3.5} fill={gold} />
        <circle cx={78} cy={0} r={3.5} fill={gold} />
      </g>
    </g>
  );
};

export default DividerLine;
