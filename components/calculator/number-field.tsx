type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  help?: string;
};

export function NumberField({ label, value, onChange, min = 0, max, step = 1, prefix, suffix, help }: NumberFieldProps) {
  return (
    <label className="number-field">
      <span className="field-label">{label}</span>
      {help ? <small>{help}</small> : null}
      <span className="number-control">
        {prefix ? <b>{prefix}</b> : null}
        <input type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(event) => onChange(event.currentTarget.valueAsNumber || 0)} />
        {suffix ? <b>{suffix}</b> : null}
      </span>
    </label>
  );
}
