import { type ReactNode } from "react";

type ControlRowProps = {
  label: string;
  children: ReactNode;
};

export default function ControlRow({ label, children }: ControlRowProps) {
  return (
    <div className="control-row">
      <label className="control-label">{label}</label>
      <div className="control-input">{children}</div>
    </div>
  );
}

type ColorPickerProps = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
};

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="color-picker-wrap">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="color-swatch"
        title={label}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="color-hex"
        maxLength={7}
      />
    </div>
  );
}

type SliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
};

export function Slider({ value, min, max, step = 1, onChange }: SliderProps) {
  return (
    <div className="slider-wrap">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
      <span className="slider-value">{value}</span>
    </div>
  );
}

type SelectProps = {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
};

export function Select({ value, options, onChange }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

type ToggleProps = {
  value: boolean;
  onChange: (v: boolean) => void;
};

export function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      className={`toggle ${value ? "toggle-on" : "toggle-off"}`}
      onClick={() => onChange(!value)}
      type="button"
    >
      <span className="toggle-knob" />
    </button>
  );
}
