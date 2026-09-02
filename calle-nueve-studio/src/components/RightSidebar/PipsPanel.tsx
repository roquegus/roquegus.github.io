
import Accordion from "../ui/Accordion";
import ControlRow, { Select, Slider, Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";
import type { PipStyle, FillMode } from "../../types";

const PIP_STYLE_OPTIONS: { value: PipStyle; label: string }[] = [
  { value: "cuban-icons", label: "Cuban Cultural Icons" },
  { value: "classic-dots", label: "Classic Domino Dots" },
  { value: "rings", label: "Rings" },
  { value: "numbers", label: "Numbers" },
  { value: "diamonds", label: "Minimal Diamonds" },
];

const FILL_MODE_OPTIONS: { value: FillMode; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "two-tone", label: "Two-Tone" },
];

export default function PipsPanel() {
  const { state, updatePips } = useApp();
  const p = state.tokens.pips;

  return (
    <Accordion title="Pips" defaultOpen>
      <ControlRow label="Style">
        <Select
          value={p.style}
          options={PIP_STYLE_OPTIONS}
          onChange={(v) => updatePips({ style: v as PipStyle })}
        />
      </ControlRow>
      <ControlRow label="Size">
        <Slider value={p.size} min={24} max={120} onChange={(v) => updatePips({ size: v })} />
      </ControlRow>
      <ControlRow label="Spacing">
        <Slider value={p.spacing} min={0} max={20} onChange={(v) => updatePips({ spacing: v })} />
      </ControlRow>
      <ControlRow label="Stroke Width">
        <Slider value={p.strokeWidth} min={0} max={6} step={0.5} onChange={(v) => updatePips({ strokeWidth: v })} />
      </ControlRow>
      <ControlRow label="Fill Mode">
        <Select
          value={p.fillMode}
          options={FILL_MODE_OPTIONS}
          onChange={(v) => updatePips({ fillMode: v as FillMode })}
        />
      </ControlRow>
      <ControlRow label="Symmetry Lock">
        <Toggle value={p.symmetryLock} onChange={(v) => updatePips({ symmetryLock: v })} />
      </ControlRow>
    </Accordion>
  );
}
