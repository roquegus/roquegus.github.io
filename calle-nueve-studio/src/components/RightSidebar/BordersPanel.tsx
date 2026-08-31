
import Accordion from "../ui/Accordion";
import ControlRow, { Slider, Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";

export default function BordersPanel() {
  const { state, updateBorder } = useApp();
  const b = state.tokens.border;

  return (
    <Accordion title="Borders">
      <ControlRow label="Outer Width">
        <Slider value={b.outerWidth} min={0} max={20} onChange={(v) => updateBorder({ outerWidth: v })} />
      </ControlRow>
      <ControlRow label="Inner Width">
        <Slider value={b.innerWidth} min={0} max={10} onChange={(v) => updateBorder({ innerWidth: v })} />
      </ControlRow>
      <ControlRow label="Corner Decorations">
        <Toggle value={b.cornerDecorations} onChange={(v) => updateBorder({ cornerDecorations: v })} />
      </ControlRow>
      <ControlRow label="Hero Frame">
        <Toggle value={b.heroFrame} onChange={(v) => updateBorder({ heroFrame: v })} />
      </ControlRow>
    </Accordion>
  );
}
