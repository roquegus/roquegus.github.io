import { useEffect, useState } from "react";
import Accordion from "../ui/Accordion";
import ControlRow, { Select, Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";
import { getSayingsCards, sayingsToText, textToSayings, DEFAULT_SAYINGS_1, DEFAULT_SAYINGS_2 } from "../../constants/sayings";

/** Textarea that keeps its own text while typing and commits parsed sayings on blur. */
function SayingsEditor({ value, onCommit }: { value: string; onCommit: (text: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return (
    <textarea
      className="control-textarea"
      rows={9}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onCommit(text)}
      spellCheck={false}
    />
  );
}

export default function SayingsCardsPanel() {
  const { state, dispatch, updateSayingsCards } = useApp();
  const sc = getSayingsCards(state.tokens);

  return (
    <Accordion title="Chucho Cards (57th, 58th)">
      <p className="panel-hint">
        Extra cards of Cuban table talk, phrase on top and the meaning under it. The box holds up to 65 cards, so they fit. They follow the theme's colors and fonts.
      </p>
      <ControlRow label="Include in Export">
        <Toggle value={sc.enabled} onChange={(v) => updateSayingsCards({ enabled: v })} />
      </ControlRow>
      <ControlRow label="How Many">
        <Select
          value={String(sc.count)}
          options={[
            { value: "1", label: "One card" },
            { value: "2", label: "Two cards" },
          ]}
          onChange={(v) => updateSayingsCards({ count: v === "2" ? 2 : 1 })}
        />
      </ControlRow>
      {state.previewMode !== "sayings" && (
        <button
          className="btn-secondary"
          style={{ width: "100%", marginBottom: 8 }}
          onClick={() => dispatch({ type: "SET_PREVIEW_MODE", payload: "sayings" })}
        >
          Preview Chucho Cards
        </button>
      )}
      <ControlRow label="Headline">
        <input className="control-text" value={sc.headline} onChange={(e) => updateSayingsCards({ headline: e.target.value })} />
      </ControlRow>
      <ControlRow label="Subhead">
        <input className="control-text" value={sc.subhead} onChange={(e) => updateSayingsCards({ subhead: e.target.value })} />
      </ControlRow>
      <ControlRow label={sc.count === 2 ? "Card 1 Sayings" : "Sayings"}>
        <SayingsEditor value={sayingsToText(sc.sayings)} onCommit={(t) => updateSayingsCards({ sayings: textToSayings(t) })} />
      </ControlRow>
      {sc.count === 2 && (
        <ControlRow label="Card 2 Sayings">
          <SayingsEditor value={sayingsToText(sc.sayings2)} onCommit={(t) => updateSayingsCards({ sayings2: textToSayings(t) })} />
        </ControlRow>
      )}
      <p className="panel-hint">One saying per line: phrase, a vertical bar, then the meaning. Seven per card fits; eight is the most.</p>
      <button
        className="btn-ghost"
        style={{ width: "100%" }}
        onClick={() => updateSayingsCards({ sayings: DEFAULT_SAYINGS_1, sayings2: DEFAULT_SAYINGS_2 })}
      >
        Reset to the standard sayings
      </button>
    </Accordion>
  );
}
