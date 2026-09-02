import React from 'react';

export function Formula({ formula, note, label }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 my-2 font-mono text-sm text-slate-800">
      {label && <div className="text-xs uppercase tracking-wider text-slate-500 font-sans font-medium mb-1">{label}</div>}
      <div className="text-blue-900 font-semibold tracking-wide overflow-x-auto py-0.5">{formula}</div>
      {note && <div className="text-xs text-slate-500 font-sans mt-1.5">{note}</div>}
    </div>
  );
}
