
import Accordion from "../ui/Accordion";
import ControlRow, { ColorPicker, Select, Slider } from "../ui/ControlRow";
import { useApp } from "../../store";
import type { TextureType } from "../../types";

const TEXTURE_OPTIONS: { value: TextureType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "paper", label: "Paper" },
  { value: "grain", label: "Grain" },
  { value: "mosaic", label: "Mosaic" },
];

export default function BackgroundPanel() {
  const { state, updateBackground } = useApp();
  const bg = state.tokens.background;

  return (
    <Accordion title="Background">
      <ControlRow label="Color">
        <ColorPicker
          value={bg.color}
          onChange={(v) => updateBackground({ color: v })}
        />
      </ControlRow>
      <ControlRow label="Texture">
        <Select
          value={bg.texture}
          options={TEXTURE_OPTIONS}
          onChange={(v) => updateBackground({ texture: v as TextureType })}
        />
      </ControlRow>
      <ControlRow label="Texture Opacity">
        <Slider
          value={Math.round(bg.opacity * 100)}
          min={0}
          max={100}
          onChange={(v) => updateBackground({ opacity: v / 100 })}
        />
      </ControlRow>
    </Accordion>
  );
}
