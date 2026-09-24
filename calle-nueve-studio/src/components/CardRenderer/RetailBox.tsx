import type { DesignTokens, TuckBoxDesign } from "../../types";
import DominoCardSVG from "./DominoCardSVG";
import { qrPath } from "./RulesCardSVG";
import { DECK } from "../../utils/deck";
import { PRINT } from "../../constants/print";
import { getRulesCard } from "../../constants/rulescard";

// Retail box: the shelf layout from docs/RESEARCH_box_shelf.md. One flat color
// like "simple" (the sheet background is drawn by TuckBoxSVG), and on top of it:
// DOMINOES as the biggest word, the cards shown, a four-fact strip, and how to
// play with a QR on the back. Every panel is laid out from its own rectangle.

type R = { x: number; y: number; w: number; h: number };

type Props = {
  tokens: DesignTokens;
  box: TuckBoxDesign;
  front: R;
  back: R;
  left: R;
  right: R;
  lid: { x: number; w: number; cy: number };
  bottom: R;
};

// Big shelf words are always Bebas Neue: condensed, so DOMINOES can be huge.
const BEBAS = "'Bebas Neue', sans-serif";
const fam = (f: string) => (f === "system" ? "system-ui, sans-serif" : `'${f}', serif`);

function wrap(text: string, max: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = (line + " " + word).trim();
    if (next.length > max && line) {
      out.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) out.push(line);
  return out;
}

const card = (top: number, bottom: number) => DECK.find((c) => c.top === top && c.bottom === bottom) ?? DECK[0];

/** A card at `scale`, centered on (cx, cy), turned `rot` degrees, clipped to its trim with a soft shadow. */
function ShownCard({ tokens, top, bottom, cx, cy, scale, rot }: { tokens: DesignTokens; top: number; bottom: number; cx: number; cy: number; scale: number; rot: number }) {
  const t = PRINT.trimInset;
  const w = PRINT.width - t * 2;
  const h = PRINT.height - t * 2;
  return (
    <g transform={`translate(${cx},${cy}) rotate(${rot}) scale(${scale}) translate(${-PRINT.width / 2},${-PRINT.height / 2})`}>
      <rect x={t + 10} y={t + 16} width={w} height={h} rx={40} fill="#000" opacity={0.28} />
      <g clipPath="url(#retailCardClip)">
        <DominoCardSVG card={card(top, bottom)} tokens={tokens} />
      </g>
      <rect x={t} y={t} width={w} height={h} rx={40} fill="none" stroke="#000" strokeOpacity={0.15} strokeWidth={3} />
    </g>
  );
}

export default function RetailBox({ tokens, box, front: f, back: bk, left, right, lid, bottom }: Props) {
  const accent = tokens.colors.backAccent;
  const bg = tokens.colors.backBackground;
  const hi = box.highlight ?? "#FFD24A";
  const category = (box.category ?? "DOMINOES").toUpperCase();
  const players = box.players ?? "2-4";
  const ages = box.ages ?? "13+";
  const minutes = box.minutes ?? "20";
  const body = fam(tokens.typography.footerFont === "Bebas Neue" ? "Playfair Display" : tokens.typography.footerFont);
  // The brand already sits above DOMINOES, so a title of CALLE NUEVE shows the edition instead
  const deckName = box.title.trim().toUpperCase() === "CALLE NUEVE" ? box.edition : box.title;
  const rulesUrl = getRulesCard(tokens).url || "https://callenueve.com/play";
  const qr = qrPath(rulesUrl);
  const shortUrl = rulesUrl.replace(/^https?:\/\//, "").replace(/\/$/, "").toUpperCase();

  const fcx = f.x + f.w / 2;
  const bcx = bk.x + bk.w / 2;
  const M = 40; // side margin inside the fold lines

  // Picture window on the front
  const pic = { x: f.x + M, y: f.y + 336, w: f.w - M * 2, h: 494 };

  const facts: [string, string][] = [
    [players, "PLAYERS"],
    [ages, "AGES"],
    [minutes, "MINUTES"],
    ["55", "CARDS"],
  ];
  const gap = 12;
  const fw = (f.w - M * 2 - gap * 3) / 4;
  const fy = f.y + 870;
  const fh = 140;

  const steps: [string, string][] = [
    ["DEAL 10 CARDS EACH", "Each card is one domino tile. The rest stay face down to draw from."],
    ["MATCH THE ENDS", "Play a card that matches an open end of the line. Can't play? Draw or pass."],
    ["GO OUT FIRST", "Play your last card and call “me pegué.” If the game locks, the lowest hand wins."],
  ];
  const spanish = wrap(box.spanishLine ?? "El dominó cubano, en cartas. Para la playa, el viaje y la ventanita.", 40);
  const qrSize = 176;
  const qrX = bk.x + M + 6;
  const qrY = bk.y + bk.h - 300;

  return (
    <g>
      <defs>
        <clipPath id="retailCardClip">
          <rect x={PRINT.trimInset} y={PRINT.trimInset} width={PRINT.width - PRINT.trimInset * 2} height={PRINT.height - PRINT.trimInset * 2} rx={40} />
        </clipPath>
        <clipPath id="retailPicClip">
          <rect x={pic.x} y={pic.y} width={pic.w} height={pic.h} />
        </clipPath>
      </defs>

      {/* FRONT */}
      <text x={fcx} y={f.y + 74} textAnchor="middle" fontFamily={BEBAS} fontSize={30} fill={accent} letterSpacing={12}>
        CALLE NUEVE
      </text>
      <text x={fcx} y={f.y + 226} textAnchor="middle" fontFamily={BEBAS} fontSize={164} fill={hi} textLength={f.w - M * 2} lengthAdjust="spacingAndGlyphs">
        {category}
      </text>
      <text x={fcx} y={f.y + 278} textAnchor="middle" fontFamily={BEBAS} fontSize={deckName.length > 16 ? 38 : 46} fill={accent} letterSpacing={4}>
        {deckName}
      </text>
      <text x={fcx} y={f.y + 312} textAnchor="middle" fontFamily={BEBAS} fontSize={22} fill={accent} letterSpacing={2.5} opacity={0.92}>
        THE CUBAN DOMINO GAME IN A DECK OF CARDS
      </text>

      {box.customImage && (box.customImageAspect ?? 0) > 1.1 ? (
        // Landscape picture (a big-letter postcard): shown whole at the top, two cards fanned under it
        (() => {
          const ph = Math.round(pic.w / (box.customImageAspect as number));
          return (
            <>
              <image href={box.customImage} x={pic.x} y={pic.y} width={pic.w} height={ph} preserveAspectRatio="xMidYMid slice" />
              <rect x={pic.x} y={pic.y} width={pic.w} height={ph} fill="none" stroke={accent} strokeWidth={4} />
              <ShownCard tokens={tokens} top={8} bottom={4} cx={fcx - 128} cy={pic.y + pic.h - 114} scale={0.23} rot={-12} />
              <ShownCard tokens={tokens} top={9} bottom={9} cx={fcx + 128} cy={pic.y + pic.h - 114} scale={0.23} rot={12} />
            </>
          );
        })()
      ) : box.customImage ? (
        <>
          <image href={box.customImage} x={pic.x} y={pic.y} width={pic.w} height={pic.h} preserveAspectRatio="xMidYMid slice" clipPath="url(#retailPicClip)" />
          <rect x={pic.x} y={pic.y} width={pic.w} height={pic.h} fill="none" stroke={accent} strokeWidth={4} />
          <ShownCard tokens={tokens} top={9} bottom={9} cx={f.x + f.w - 142} cy={pic.y + pic.h - 120} scale={0.27} rot={8} />
        </>
      ) : (
        <>
          <ShownCard tokens={tokens} top={8} bottom={4} cx={fcx - 78} cy={pic.y + pic.h / 2 + 6} scale={0.385} rot={-10} />
          <ShownCard tokens={tokens} top={9} bottom={9} cx={fcx + 78} cy={pic.y + pic.h / 2 - 6} scale={0.385} rot={9} />
        </>
      )}

      {facts.map(([n, label], i) => {
        const x = f.x + M + i * (fw + gap);
        return (
          <g key={label}>
            <rect x={x} y={fy} width={fw} height={fh} rx={10} fill="none" stroke={accent} strokeWidth={3} opacity={0.75} />
            <text x={x + fw / 2} y={fy + 78} textAnchor="middle" fontFamily={BEBAS} fontSize={62} fill={hi}>
              {n}
            </text>
            <text x={x + fw / 2} y={fy + 116} textAnchor="middle" fontFamily={BEBAS} fontSize={21} fill={accent} letterSpacing={2}>
              {label}
            </text>
          </g>
        );
      })}

      {/* LID */}
      <text x={lid.x + lid.w / 2} y={lid.cy} textAnchor="middle" dominantBaseline="central" fontFamily={BEBAS} fontSize={104} fill={hi} letterSpacing={10}>
        {category}
      </text>

      {/* BACK: how to play */}
      <text x={bcx} y={bk.y + 180} textAnchor="middle" fontFamily={BEBAS} fontSize={72} fill={hi} letterSpacing={4}>
        HOW TO PLAY
      </text>
      <text x={bcx} y={bk.y + 222} textAnchor="middle" fontFamily={BEBAS} fontSize={23} fill={accent} letterSpacing={2}>
        IF YOU KNOW DOMINOES, YOU ALREADY KNOW THIS GAME.
      </text>
      {steps.map(([head, text], i) => {
        const y = bk.y + 300 + i * 132;
        const lines = wrap(text, 34);
        return (
          <g key={head}>
            <circle cx={bk.x + M + 32} cy={y + 2} r={30} fill={hi} />
            <text x={bk.x + M + 32} y={y + 16} textAnchor="middle" fontFamily={BEBAS} fontSize={42} fill={bg}>
              {i + 1}
            </text>
            <text x={bk.x + M + 84} y={y + 12} fontFamily={BEBAS} fontSize={34} fill={accent} letterSpacing={2}>
              {head}
            </text>
            {lines.map((l, j) => (
              <text key={j} x={bk.x + M + 84} y={y + 44 + j * 25} fontFamily={body} fontSize={19} fill={accent}>
                {l}
              </text>
            ))}
          </g>
        );
      })}
      {spanish.map((l, i) => (
        <text key={i} x={bcx} y={bk.y + 716 + i * 28} textAnchor="middle" fontFamily={body} fontStyle="italic" fontSize={20} fill={accent} opacity={0.95}>
          {l}
        </text>
      ))}

      <rect x={qrX - 12} y={qrY - 12} width={qrSize + 24} height={qrSize + 24} rx={10} fill="#FFFFFF" />
      <path d={qr.d} transform={`translate(${qrX},${qrY}) scale(${qrSize / qr.n})`} fill="#111111" />
      <text x={qrX + qrSize + 34} y={qrY + 34} fontFamily={BEBAS} fontSize={34} fill={hi} letterSpacing={1.5}>
        SCAN: FULL RULES
      </text>
      <text x={qrX + qrSize + 34} y={qrY + 64} fontFamily={BEBAS} fontSize={24} fill={accent} letterSpacing={1.5}>
        IN 2 MINUTES
      </text>
      <text x={qrX + qrSize + 34} y={qrY + 94} fontFamily={BEBAS} fontSize={20} fill={accent} letterSpacing={1.5}>
        {shortUrl}
      </text>
      <text x={qrX + qrSize + 34} y={qrY + 140} fontFamily={BEBAS} fontSize={18} fill={accent} letterSpacing={1.5} opacity={0.9}>
        INSIDE: 55 DOMINO CARDS,
      </text>
      <text x={qrX + qrSize + 34} y={qrY + 164} fontFamily={BEBAS} fontSize={18} fill={accent} letterSpacing={1.5} opacity={0.9}>
        RULES CARD, 2 TABLE-TALK CARDS
      </text>
      <text x={bcx} y={bk.y + bk.h - 58} textAnchor="middle" fontFamily={BEBAS} fontSize={22} fill={accent} letterSpacing={3}>
        {`${players} PLAYERS · AGES ${ages} · MADE IN MIAMI`}
      </text>

      {/* LEFT SIDE (spine) */}
      <g transform={`translate(${left.x + left.w / 2},${left.y + left.h / 2}) rotate(-90)`}>
        <text x={0} y={10} textAnchor="middle" fontFamily={BEBAS} fontSize={100} fill={hi} letterSpacing={8}>
          {category}
        </text>
        <text x={0} y={60} textAnchor="middle" fontFamily={BEBAS} fontSize={34} fill={accent} letterSpacing={6}>
          THE CARD GAME · CALLE NUEVE
        </text>
      </g>

      {/* RIGHT SIDE */}
      <g transform={`translate(${right.x + right.w / 2},${right.y + right.h / 2}) rotate(90)`}>
        <text x={0} y={-8} textAnchor="middle" fontFamily={BEBAS} fontSize={deckName.length > 16 ? 48 : 60} fill={accent} letterSpacing={5}>
          {deckName}
        </text>
        <text x={0} y={36} textAnchor="middle" fontFamily={BEBAS} fontSize={28} fill={hi} letterSpacing={4}>
          {`55 CARDS · ${players} PLAYERS · ${minutes} MIN`}
        </text>
      </g>

      {/* BOTTOM FLAP */}
      <text x={bottom.x + bottom.w / 2} y={bottom.y + bottom.h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={BEBAS} fontSize={28} fill={accent} letterSpacing={5}>
        {box.url}
      </text>
    </g>
  );
}
