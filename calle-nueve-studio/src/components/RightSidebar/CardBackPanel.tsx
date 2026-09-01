
import { useRef } from "react";
import Accordion from "../ui/Accordion";
import ControlRow, { ColorPicker, Select, Slider, Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";
import type { BackPattern } from "../../types";

const PATTERN_OPTIONS: { value: BackPattern; label: string }[] = [
  { value: "mosaic", label: "Cuban Mosaico" },
  { value: "diamonds", label: "Diamonds" },
  { value: "sunburst", label: "Sunburst" },
  { value: "art-deco", label: "Art Deco" },
  { value: "plain", label: "Plain" },
  { value: "custom", label: "Custom Image" },
];

export default function CardBackPanel() {
  const { state, updateBack, updateColors } = useApp();
  const b = state.tokens.back;
  const c = state.tokens.colors;
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateBack({ pattern: "custom", customImage: dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <Accordion title="Card Back">
      <ControlRow label="Pattern">
        <Select
          value={b.pattern}
          options={PATTERN_OPTIONS}
          onChange={(v) => updateBack({ pattern: v as BackPattern })}
        />
      </ControlRow>
      {b.pattern === "custom" ? (
        <div style={{ padding: "6px 0" }}>
          <button className="btn-secondary" style={{ width: "100%" }} onClick={() => uploadRef.current?.click()}>
            {b.customImage ? "Replace Image" : "Upload Image"}
          </button>
          <input
            ref={uploadRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          {b.customImage && (
            <button
              className="btn-ghost"
              style={{ width: "100%", marginTop: 4, fontSize: 11, color: "var(--red-text)" }}
              onClick={() => updateBack({ customImage: undefined })}
            >
              Remove Image
            </button>
          )}
        </div>
      ) : (
        <>
          <ControlRow label="Scale">
            <Slider
              value={Math.round(b.scale * 100)}
              min={50}
              max={200}
              onChange={(v) => updateBack({ scale: v / 100 })}
            />
          </ControlRow>
          <ControlRow label="Rotation">
            <Slider value={b.rotation} min={0} max={90} onChange={(v) => updateBack({ rotation: v })} />
          </ControlRow>
          <ControlRow label="Back Background">
            <ColorPicker value={c.backBackground} onChange={(v) => updateColors({ backBackground: v })} />
          </ControlRow>
          <ControlRow label="Back Accent">
            <ColorPicker value={c.backAccent} onChange={(v) => updateColors({ backAccent: v })} />
          </ControlRow>
        </>
      )}
      <ControlRow label="Center Medallion">
        <Toggle value={b.centerMedallion} onChange={(v) => updateBack({ centerMedallion: v })} />
      </ControlRow>
      <ControlRow label="Non-Directional">
        <Toggle value={b.nonDirectionalCheck} onChange={(v) => updateBack({ nonDirectionalCheck: v })} />
      </ControlRow>
    </Accordion>
  );
}
