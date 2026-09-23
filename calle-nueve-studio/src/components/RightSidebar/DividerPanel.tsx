
import { useRef } from "react";
import Accordion from "../ui/Accordion";
import ControlRow, { ColorPicker, Select, Slider } from "../ui/ControlRow";
import { useApp } from "../../store";
import type { DividerType, OrnamentType } from "../../types";

const DIVIDER_OPTIONS: { value: DividerType; label: string }[] = [
  { value: "straight", label: "Straight" },
  { value: "bar", label: "Bar (round ends)" },
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
  { value: "spinner", label: "Spinner (rivet)" },
  { value: "custom", label: "Custom picture" },
];

export default function DividerPanel() {
  const imgRef = useRef<HTMLInputElement>(null);
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
        <Slider value={d.thickness} min={0.5} max={24} step={0.5} onChange={(v) => updateDivider({ thickness: v })} />
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
      {d.ornament === "custom" && (
        <div style={{ padding: "6px 0" }}>
          <button className="btn-secondary" style={{ width: "100%" }} onClick={() => imgRef.current?.click()}>
            {d.ornamentImage ? "Replace Picture" : "Upload Picture"}
          </button>
          <input
            ref={imgRef}
            type="file"
            accept="image/png,image/svg+xml,image/webp"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => updateDivider({ ornamentImage: ev.target?.result as string });
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />
          <p className="panel-hint">A small mark for the middle of the bar (a client's icon). Square, transparent SVG or PNG. It sits on a white disk; 50 to 70 is a good size.</p>
          {d.ornamentImage && (
            <button className="btn-ghost" style={{ width: "100%", marginTop: 4, fontSize: 11, color: "var(--red-text)" }} onClick={() => updateDivider({ ornamentImage: undefined })}>
              Remove Picture
            </button>
          )}
        </div>
      )}
      <ControlRow label="Ornament Size">
        <Slider value={d.ornamentSize} min={0} max={140} onChange={(v) => updateDivider({ ornamentSize: v })} />
      </ControlRow>
    </Accordion>
  );
}
