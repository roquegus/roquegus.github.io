import type { DesignTokens } from "../../types";
import { TUCK_PT, TUCK_PX, PT, getTuckBox } from "../../constants/tuckbox";
import { PatternFill, CenterMedallion } from "./CardBack";
import DividerLine from "./DividerLine";
import PipIcon from "./PipIcon";
import DominoCardSVG from "./DominoCardSVG";
import { DECK } from "../../utils/deck";
import { PRINT } from "../../constants/print";

type Props = {
  tokens: DesignTokens;
  showDieline?: boolean;
};

type R = { x: number; y: number; w: number; h: number };

const p = (v: number) => v * PT;
const rect = (x: readonly [number, number], y: readonly [number, number]): R => ({
  x: p(x[0]),
  y: p(y[0]),
  w: p(x[1] - x[0]),
  h: p(y[1] - y[0]),
});

const T = TUCK_PT;
const B = p(T.bleed);
const W = TUCK_PX.w;
const H = TUCK_PX.h;

const R_LEFT = rect(T.x.leftSide, T.body);
const R_FRONT = rect(T.x.front, T.body);
const R_RIGHT = rect(T.x.rightSide, T.body);
const R_BACK = rect(T.x.back, T.body);
const R_GLUE = rect(T.x.glue, T.body);
const R_LID = rect(T.lid.x, T.lid.y);
const R_TL = rect(T.topFlaps.left.x, T.topFlaps.left.y);
const R_TR = rect(T.topFlaps.right.x, T.topFlaps.right.y);
const R_BL = rect(T.bottomFlaps.left.x, T.bottomFlaps.left.y);
const R_BR = rect(T.bottomFlaps.right.x, T.bottomFlaps.right.y);
const R_BB = rect(T.bottomFlaps.back.x, T.bottomFlaps.back.y);

const PANELS = [R_LEFT, R_FRONT, R_RIGHT, R_BACK, R_GLUE, R_LID, R_TL, R_TR, R_BL, R_BR, R_BB];

function lidTongue(inflate: number): string {
  const x0 = p(T.lid.x[0]) - inflate;
  const x1 = p(T.lid.x[1]) + inflate;
  const yb = p(T.lid.y[0]) + 4;
  const ys = p(T.lid.tongueStraight);
  const apex = p(T.lid.tongueTop) - inflate;
  const cx = (x0 + x1) / 2;
  const yc = 2 * apex - ys;
  return `M${x0},${yb} L${x0},${ys} Q${cx},${yc} ${x1},${ys} L${x1},${yb} Z`;
}

function bottomTongue(inflate: number): string {
  const t = T.bottomFlaps.tongue;
  const x0 = p(t.x[0]) - inflate;
  const x1 = p(t.x[1]) + inflate;
  const yt = p(T.bottomFlaps.back.y[1]) - 4;
  const ys = p(t.straight);
  const apex = p(t.bottom) + inflate;
  const cx = (x0 + x1) / 2;
  const yc = 2 * apex - ys;
  return `M${x0},${yt} L${x0},${ys} Q${cx},${yc} ${x1},${ys} L${x1},${yt} Z`;
}

function wrap(text: string, max: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = (line + " " + word).trim();
      if (next.length > max && line) {
        out.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    out.push(line);
  }
  return out;
}

const fam = (f: string) => (f === "system" ? "system-ui, sans-serif" : `'${f}', serif`);

function Brackets({ r, inset, color }: { r: R; inset: number; color: string }) {
  const L = 34;
  const corners: [number, number, number, number][] = [
    [r.x + inset, r.y + inset, 1, 1],
    [r.x + r.w - inset, r.y + inset, -1, 1],
    [r.x + inset, r.y + r.h - inset, 1, -1],
    [r.x + r.w - inset, r.y + r.h - inset, -1, -1],
  ];
  return (
    <g fill="none" stroke={color}>
      {corners.map(([x, y, sx, sy], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${sx},${sy})`}>
          <path d={`M0,${L} L0,0 L${L},0`} strokeWidth={2.5} />
          <polygon points="5,5 20,5 5,20" fill={color} stroke="none" opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

function Dieline() {
  const red = "#E31C24";
  const blue = "#1476BC";
  const sw = 3;
  const label = (x: number, y: number, text: string, rot = 0) => (
    <text
      x={x}
      y={y}
      transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="system-ui, sans-serif"
      fontSize={40}
      fontWeight={700}
      fill={red}
      opacity={0.45}
      letterSpacing={3}
    >
      {text}
    </text>
  );
  const n = T.notch;
  return (
    <g pointerEvents="none">
      <g fill="none" stroke={red} strokeWidth={sw}>
        {PANELS.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} />
        ))}
        <path d={lidTongue(0)} />
        <path d={bottomTongue(0)} />
        <path d={`M${p(n.cx - n.r)},${p(n.cy)} A${p(n.r)},${p(n.r)} 0 0 0 ${p(n.cx + n.r)},${p(n.cy)}`} />
      </g>
      <g stroke={blue} strokeWidth={sw} strokeDasharray="14,10">
        {[R_FRONT, R_RIGHT, R_BACK, R_GLUE].map((r, i) => (
          <line key={i} x1={r.x} y1={r.y} x2={r.x} y2={r.y + r.h} />
        ))}
        <line x1={R_LID.x} y1={R_LID.y} x2={R_LID.x + R_LID.w} y2={R_LID.y} />
        <line x1={R_FRONT.x} y1={R_FRONT.y} x2={R_FRONT.x + R_FRONT.w} y2={R_FRONT.y} />
        <line x1={R_TL.x} y1={R_TL.y + R_TL.h} x2={R_TL.x + R_TL.w} y2={R_TL.y + R_TL.h} />
        <line x1={R_TR.x} y1={R_TR.y + R_TR.h} x2={R_TR.x + R_TR.w} y2={R_TR.y + R_TR.h} />
        {[R_BL, R_BR, R_BB].map((r, i) => (
          <line key={`b${i}`} x1={r.x} y1={r.y} x2={r.x + r.w} y2={r.y} />
        ))}
        <line x1={p(T.bottomFlaps.tongue.x[0])} y1={R_BB.y + R_BB.h} x2={p(T.bottomFlaps.tongue.x[1])} y2={R_BB.y + R_BB.h} />
      </g>
      {label(R_FRONT.x + R_FRONT.w / 2, R_FRONT.y + R_FRONT.h - 30, "FRONT")}
      {label(R_BACK.x + R_BACK.w / 2, R_BACK.y + R_BACK.h - 30, "BACK")}
      {label(R_LEFT.x + R_LEFT.w / 2, R_LEFT.y + R_LEFT.h - 200, "LEFT SIDE", -90)}
      {label(R_RIGHT.x + R_RIGHT.w / 2, R_RIGHT.y + 200, "RIGHT SIDE", 90)}
      {label(R_LID.x + R_LID.w / 2, R_LID.y + 40, "LID")}
      {label(R_GLUE.x + R_GLUE.w / 2, R_GLUE.y + R_GLUE.h / 2, "GLUE", 90)}
      <rect x={1.5} y={1.5} width={W - 3} height={H - 3} fill="none" stroke="#888" strokeWidth={2} strokeDasharray="6,6" opacity={0.5} />
    </g>
  );
}

export default function TuckBoxSVG({ tokens, showDieline = false }: Props) {
  const { colors, background, typography, divider, pips, back } = tokens;
  const box = getTuckBox(tokens);
  const accent = colors.backAccent;
  const backBg = colors.backBackground;
  const titleFont = fam(typography.indexFont);
  const bodyFont = fam(typography.footerFont);
  const hero = DECK.find((c) => c.top === 9 && c.bottom === 9) ?? DECK[0];

  const f = R_FRONT;
  const fcx = f.x + f.w / 2;
  const titleSize = Math.min(76, Math.floor((f.w - 110) / (0.42 * Math.max(box.title.length, 4))));
  const bk = R_BACK;
  const bcx = bk.x + bk.w / 2;
  const backLines = wrap(box.backText, 38);
  const iconRows = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 0],
  ];

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="tuckClip">
          {PANELS.map((r, i) => (
            <rect key={i} x={r.x - B} y={r.y - B} width={r.w + B * 2} height={r.h + B * 2} />
          ))}
          <path d={lidTongue(B)} />
          <path d={bottomTongue(B)} />
        </clipPath>
        <clipPath id="tuckFrontClip">
          <rect x={f.x} y={f.y} width={f.w} height={f.h + B} />
        </clipPath>
      </defs>

      <g clipPath="url(#tuckClip)">
        {/* Whole sheet carries the card-back pattern so sides, back and flaps wrap seamlessly */}
        <rect x={0} y={0} width={W} height={H} fill={backBg} />
        <PatternFill
          pattern={back.pattern === "custom" ? "mosaic" : back.pattern}
          scale={back.scale}
          rotation={back.rotation}
          color={backBg}
          accent={accent}
          w={W}
          h={H}
          centerX={bcx}
          centerY={bk.y + bk.h / 2}
        />

        {/* FRONT */}
        <g clipPath="url(#tuckFrontClip)">
          <rect x={f.x} y={f.y} width={f.w} height={f.h + B} fill={background.color} />
          {box.frontStyle === "custom" && box.customImage ? (
            <image href={box.customImage} x={f.x} y={f.y} width={f.w} height={f.h + B} preserveAspectRatio="xMidYMid slice" />
          ) : (
            <>
              <rect x={f.x + 18} y={f.y + 18} width={f.w - 36} height={f.h - 36} fill="none" stroke={colors.border} strokeWidth={4} />
              <rect x={f.x + 26} y={f.y + 26} width={f.w - 52} height={f.h - 52} fill="none" stroke={colors.border} strokeWidth={1.5} opacity={0.6} />
              <Brackets r={f} inset={36} color={colors.border} />

              <text
                x={fcx}
                y={f.y + 150}
                textAnchor="middle"
                fontFamily={titleFont}
                fontSize={titleSize}
                fill={colors.index}
                letterSpacing={5}
                textLength={Math.min(f.w - 110, box.title.length * titleSize * 0.62)}
                lengthAdjust="spacing"
              >
                {box.title}
              </text>
              <text x={fcx} y={f.y + 186} textAnchor="middle" fontFamily={bodyFont} fontSize={17} fill={colors.footer} letterSpacing={4}>
                {box.subtitle}
              </text>
              <g transform={`translate(${f.x},0)`}>
                <DividerLine
                  type={divider.type}
                  thickness={divider.thickness}
                  widthFraction={0.7}
                  color={colors.divider}
                  ornament={divider.ornament}
                  ornamentSize={Math.min(divider.ornamentSize, 56)}
                  cardWidth={f.w}
                  y={f.y + 226}
                />
              </g>

              {box.frontStyle === "hero-card" ? (
                <g transform={`translate(${fcx - PRINT.width * 0.26},${f.y + 262}) scale(0.52)`}>
                  <rect x={-10} y={-10} width={PRINT.width + 20} height={PRINT.height + 20} rx={14} fill="#000" opacity={0.18} />
                  <DominoCardSVG card={hero} tokens={tokens} />
                </g>
              ) : (
                <>
                  <CenterMedallion cx={fcx} cy={f.y + 440} color={backBg} accent={accent} />
                  {box.showIcons &&
                    iconRows.map((row, ri) =>
                      row.map((v, ci) => (
                        <g key={`${ri}-${ci}`} transform={`translate(${fcx - 180 + ci * 90 - 26},${f.y + 640 + ri * 84})`}>
                          <PipIcon
                            value={v}
                            style={pips.style}
                            size={52}
                            color={colors.pip}
                            secondaryColor={colors.pipSecondary}
                            strokeWidth={pips.strokeWidth}
                            fillMode={pips.fillMode}
                          />
                        </g>
                      ))
                    )}
                </>
              )}

              <text x={fcx} y={f.y + f.h - 92} textAnchor="middle" fontFamily={titleFont} fontSize={22} fill={colors.footer} letterSpacing={4}>
                {box.tagline}
              </text>
              <text x={fcx} y={f.y + f.h - 58} textAnchor="middle" fontFamily={bodyFont} fontSize={14} fill={colors.footer} letterSpacing={3} opacity={0.85}>
                {box.edition}
              </text>
            </>
          )}
        </g>

        {/* LID */}
        <text x={R_LID.x + R_LID.w / 2} y={R_LID.y + R_LID.h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={titleFont} fontSize={48} fill={accent} letterSpacing={4}>
          {box.title}
        </text>

        {/* BACK */}
        <text x={bcx} y={bk.y + 190} textAnchor="middle" fontFamily={titleFont} fontSize={46} fill={accent} letterSpacing={4}>
          {box.title}
        </text>
        <text x={bcx} y={bk.y + 224} textAnchor="middle" fontFamily={bodyFont} fontSize={14} fill={accent} letterSpacing={3} opacity={0.85}>
          {box.subtitle}
        </text>
        <g transform={`translate(${bcx},${bk.y + 400}) scale(0.62)`}>
          <CenterMedallion cx={0} cy={0} color={backBg} accent={accent} />
        </g>
        {backLines.map((line, i) => (
          <text key={i} x={bcx} y={bk.y + 560 + i * 28} textAnchor="middle" fontFamily={bodyFont} fontSize={17} fill={accent}>
            {line}
          </text>
        ))}
        <text x={bcx} y={bk.y + bk.h - 110} textAnchor="middle" fontFamily={titleFont} fontSize={20} fill={accent} letterSpacing={4} opacity={0.9}>
          {box.tagline}
        </text>
        <text x={bcx} y={bk.y + bk.h - 70} textAnchor="middle" fontFamily={titleFont} fontSize={24} fill={accent} letterSpacing={5}>
          {box.url}
        </text>

        {/* SIDES */}
        <text
          transform={`translate(${R_LEFT.x + R_LEFT.w / 2},${R_LEFT.y + R_LEFT.h / 2}) rotate(-90)`}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={titleFont}
          fontSize={64}
          fill={accent}
          letterSpacing={8}
        >
          {box.title}
        </text>
        <text
          transform={`translate(${R_RIGHT.x + R_RIGHT.w / 2},${R_RIGHT.y + R_RIGHT.h / 2}) rotate(90)`}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={titleFont}
          fontSize={34}
          fill={accent}
          letterSpacing={5}
        >
          {`${box.edition}  ·  ${box.tagline}`}
        </text>

        {/* BOTTOM FLAP */}
        <text x={R_BB.x + R_BB.w / 2} y={R_BB.y + R_BB.h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={titleFont} fontSize={28} fill={accent} letterSpacing={5}>
          {box.url}
        </text>
      </g>

      {showDieline && <Dieline />}
    </svg>
  );
}
