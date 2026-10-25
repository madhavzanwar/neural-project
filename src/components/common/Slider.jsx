import React from 'react';

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueDisplay,
  ticks = [],
  color = '#2563EB',
}) {
  const range = max - min;
  const numVal = Number(value);
  const percentage = range > 0 && Number.isFinite(numVal)
    ? Math.max(0, Math.min(100, ((numVal - min) / range) * 100))
    : 0;

  return (
    <div className="space-y-1.5">
      {(label || valueDisplay !== undefined) && (
        <div className="flex justify-between items-center text-xs">
          {label && (
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              {label}
            </span>
          )}
          {valueDisplay !== undefined && (
            <span className="font-mono text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
              {valueDisplay}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(numVal) ? numVal : min}
        aria-label={label || 'slider'}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="custom-range"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
        }}
      />
      {ticks.length > 0 && (
        <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
