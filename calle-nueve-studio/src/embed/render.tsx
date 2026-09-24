// Browser bundle for callenueve.com/design: renders the real card face, back
// and box front from the Studio's own components, as SVG strings.
// Build: npm run build:picker (writes ../callenueve-web/design/c9-render.js).
import { renderToStaticMarkup } from "react-dom/server";
import DominoCardSVG from "../components/CardRenderer/DominoCardSVG";
import CardBack from "../components/CardRenderer/CardBack";
import TuckBoxSVG from "../components/CardRenderer/TuckBoxSVG";
import { DECK } from "../utils/deck";
import { PT, TUCK_PT } from "../constants/tuckbox";
import { tokensFromDesign, type PickerDesign } from "../utils/pickerDesign";

function face(d: PickerDesign, top: number, bottom: number): string {
  const card = DECK.find((c) => c.top === top && c.bottom === bottom) ?? DECK[DECK.length - 1];
  return renderToStaticMarkup(<DominoCardSVG card={card} tokens={tokensFromDesign(d)} />);
}

function back(d: PickerDesign): string {
  return renderToStaticMarkup(<CardBack tokens={tokensFromDesign(d)} />);
}

/** The box net cropped to its front panel. */
function box(d: PickerDesign): string {
  const t = tokensFromDesign(d);
  const svg = renderToStaticMarkup(<TuckBoxSVG tokens={t} showDieline={false} />);
  const x = TUCK_PT.x.front[0] * PT;
  const y = TUCK_PT.body[0] * PT;
  const w = (TUCK_PT.x.front[1] - TUCK_PT.x.front[0]) * PT;
  const h = (TUCK_PT.body[1] - TUCK_PT.body[0]) * PT;
  return svg.replace(/^<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${Math.round(w)}" height="${Math.round(h)}">`);
}

(window as unknown as { C9: unknown }).C9 = { face, back, box };
