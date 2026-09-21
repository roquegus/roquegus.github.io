import { useRef } from "react";
import Accordion from "../ui/Accordion";
import ControlRow, { ColorPicker, Select, Slider, Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";
import type { BackPattern, MedallionStyle } from "../../types";

const PATTERN_OPTIONS: { value: BackPattern; label: string }[] = [
  { value: "mosaic", label: "Cuban Mosaico" },
  { value: "cuban-tile", label: "Cuban Floor Tile" },
  { value: "deco-rays", label: "Deco Sunburst" },
  { value: "miami-sunset", label: "Miami Sunset (palms)" },
  { value: "flamingo-card", label: "Flamingo Card (one-way)" },
  { value: "diamonds", label: "Diamonds" },
  { value: "sunburst", label: "Sunburst" },
  { value: "art-deco", label: "Art Deco" },
  { value: "plain", label: "Plain" },
  { value: "custom", label: "Custom Image" },
];

// The logo box prints 300 px wide at 300 DPI (1 in). Rasters smaller than that get upscaled.
const LOGO_MIN_PX = 300;

function readImageSize(dataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(Math.min(img.naturalWidth, img.naturalHeight));
    img.onerror = () => resolve(0);
    img.src = dataUrl;
  });
}

export default function CardBackPanel() {
  const { state, updateBack, updateColors } = useApp();
  const b = state.tokens.back;
  const c = state.tokens.colors;
  const uploadRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const isVector = file.type === "image/svg+xml";
      const minPx = isVector ? undefined : await readImageSize(dataUrl);
      updateBack({ logo: dataUrl, logoMinPx: minPx });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const lowRes = b.logo && b.logoMinPx !== undefined && b.logoMinPx > 0 && b.logoMinPx < LOGO_MIN_PX;

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
          <ControlRow label="Back Color 3">
            <ColorPicker value={c.backSecondary ?? c.backAccent} onChange={(v) => updateColors({ backSecondary: v })} />
          </ControlRow>
          <ControlRow label="Back Color 4">
            <ColorPicker value={c.backTertiary ?? c.backBackground} onChange={(v) => updateColors({ backTertiary: v })} />
          </ControlRow>
          {(b.pattern === "cuban-tile" || b.pattern === "deco-rays" || b.pattern === "miami-sunset" || b.pattern === "flamingo-card") && (
            <p className="panel-hint">
              {b.pattern === "cuban-tile"
                ? "Tile: Background is the cream, Accent the diamond and frame, Color 3 the grid, Color 4 the small dots."
                : b.pattern === "deco-rays"
                  ? "Sunburst: Background is the ground, Accent the lines and frame, Color 3 the rays, Color 4 the inner ray and porthole."
                  : b.pattern === "miami-sunset"
                    ? "Sunset: Background is the sky at the edges, Accent the palms, Color 3 the sunset band and sun, Color 4 the sun core and frame."
                    : "Flamingo Card: Background is the cream border, Accent the gold reeds and caption, Color 3 the flamingo, Color 4 the teal field. This back is one-way."}
            </p>
          )}
          {b.pattern === "flamingo-card" && (
            <ControlRow label="Caption">
              <input className="control-text" value={b.label ?? ""} onChange={(e) => updateBack({ label: e.target.value })} />
            </ControlRow>
          )}
          <ControlRow label="Frame">
            <Toggle value={b.frame !== false} onChange={(v) => updateBack({ frame: v })} />
          </ControlRow>
        </>
      )}
      <ControlRow label="Center Medallion">
        <Toggle value={b.centerMedallion} onChange={(v) => updateBack({ centerMedallion: v })} />
      </ControlRow>
      {b.centerMedallion && (
        <ControlRow label="Medallion">
          <Select
            value={b.medallionStyle ?? "domino"}
            options={[
              { value: "domino", label: "Domino Ring" },
              { value: "tile", label: "Tile Disk" },
              { value: "porthole", label: "Porthole" },
            ]}
            onChange={(v) => updateBack({ medallionStyle: v as MedallionStyle })}
          />
        </ControlRow>
      )}

      <div style={{ padding: "6px 0" }}>
        <button className="btn-secondary" style={{ width: "100%" }} onClick={() => logoRef.current?.click()}>
          {b.logo ? "Replace Client Logo" : "Upload Client Logo"}
        </button>
        <input
          ref={logoRef}
          type="file"
          accept="image/png,image/svg+xml,image/webp,image/jpeg"
          style={{ display: "none" }}
          onChange={handleLogoUpload}
        />
        <p className="panel-hint">
          Centered on the back in a 1 in box. SVG is best. PNG needs at least {LOGO_MIN_PX} px on its short side.
        </p>
        {lowRes && (
          <p className="panel-hint" style={{ color: "var(--yellow-text)" }}>
            This logo is {b.logoMinPx} px on its short side and will print soft. Ask the client for an SVG or a larger PNG.
          </p>
        )}
        {b.logo && (
          <button
            className="btn-ghost"
            style={{ width: "100%", marginTop: 4, fontSize: 11, color: "var(--red-text)" }}
            onClick={() => updateBack({ logo: undefined, logoMinPx: undefined })}
          >
            Remove Logo
          </button>
        )}
      </div>
      {b.logo && (
        <>
          <ControlRow label="Logo Orientation">
            <Select
              value={b.logoOrientation ?? "portrait"}
              options={[
                { value: "portrait", label: "Portrait (upright)" },
                { value: "landscape", label: "Landscape (sideways)" },
              ]}
              onChange={(v) => updateBack({ logoOrientation: v as "portrait" | "landscape" })}
            />
          </ControlRow>
          <ControlRow label="Logo Size">
            <Slider
              value={Math.round((b.logoScale ?? 0.75) * 100)}
              min={40}
              max={100}
              onChange={(v) => updateBack({ logoScale: v / 100 })}
            />
          </ControlRow>
          <ControlRow label="Mirror Logo">
            <Toggle value={b.logoMirrored === true} onChange={(v) => updateBack({ logoMirrored: v })} />
          </ControlRow>
          <ControlRow label="White Back">
            <Toggle value={b.logoWhiteBack === true} onChange={(v) => updateBack({ logoWhiteBack: v })} />
          </ControlRow>
          {b.logoOrientation === "landscape" && (
            <p className="panel-hint">Landscape turns the logo so it reads when the card is held sideways. The Card Back preview turns with it.</p>
          )}
        </>
      )}

      <ControlRow label="Non-Directional">
        <Toggle value={b.nonDirectionalCheck} onChange={(v) => updateBack({ nonDirectionalCheck: v })} />
      </ControlRow>
    </Accordion>
  );
}
