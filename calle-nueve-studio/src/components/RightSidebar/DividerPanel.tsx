
import Accordion from "../ui/Accordion";
import ControlRow, { ColorPicker, Select, Slider } from "../ui/ControlRow";
import { useApp } from "../../store";
import type { DividerType, OrnamentType } from "../../types";

const DIVIDER_OPTIONS: { value: DividerType; label: string }[] = [
  { value: "straight", label: "Straight" },
  { value: "double-line", label: "Double Line" },
  { value: "tobacco-leaf", label: "Tobacco Leaf" },
  { value: "rope", label: "Rope" },
  { value: "art-deco", label: "Art Deco" },
  { value: "mosaic", label: "Mosaic" },
  { value: "ornamental", label: "Ornamental" },
];

const ORNAMENT_OPTIONS: { value: OrnamentType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "leaf", label: "Leaf" },
  { value: "diamond", label: "Diamond" },
  { value: "sun", label: "Sun" },
  { value: "tile", label: "Tile" },
  { value: "flourish", label: "Flourish" },
];

export default function DividerPanel() {
  const { state, updateDivider, updateColors } = useApp();
  const d = state.tokens.divider;
  const c = state.tokens.colors;

  return (
    <Accordion title="Divider">
      <ControlRow label="Type">
        <Select
          value={d.type}
          options={DIVIDER_OPTIONS}
          onChange={(v) => updateDivider({ type: v as DividerType })}
        />
      </ControlRow>
      <ControlRow label="Thickness">
        <Slider value={d.thickness} min={0.5} max={8} step={0.5} onChange={(v) => updateDivider({ thickness: v })} />
      </ControlRow>
      <ControlRow label="Width">
        <Slider value={Math.round(d.width * 100)} min={40} max={100} onChange={(v) => updateDivider({ width: v / 100 })} />
      </ControlRow>
      <ControlRow label="Color">
        <ColorPicker value={c.divider} onChange={(v) => updateColors({ divider: v })} />
      </ControlRow>
      <ControlRow label="Ornament">
        <Select
          value={d.ornament}
          options={ORNAMENT_OPTIONS}
          onChange={(v) => updateDivider({ ornament: v as OrnamentType })}
        />
      </ControlRow>
      <ControlRow label="Ornament Size">
        <Slider value={d.ornamentSize} min={0} max={140} onChange={(v) => updateDivider({ ornamentSize: v })} />
      </ControlRow>
    </Accordion>
  );
}
