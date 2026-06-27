// Two-number stacked index (top / bottom), positioned at (x, y) top-left anchor.
const CornerIndex = ({ top, bottom, x, y, color }) => (
  <g
    fontFamily="'Bebas Neue', sans-serif"
    fill={color}
    textAnchor="middle"
  >
    <text x={x} y={y + 48} fontSize={52} fontWeight="700">{top}</text>
    <line x1={x - 16} y1={y + 56} x2={x + 16} y2={y + 56} stroke={color} strokeWidth={2} opacity={0.6} />
    <text x={x} y={y + 108} fontSize={52} fontWeight="700">{bottom}</text>
  </g>
);

export default CornerIndex;
