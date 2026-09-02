import React from 'react';

export function Metric({ label, value, subtext, icon: Icon, color = 'blue' }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500 mb-1">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>
      <div className="text-xl font-bold text-slate-900 font-mono tracking-tight">{value}</div>
      {subtext && <div className="text-[11px] text-slate-500 mt-1">{subtext}</div>}
    </div>
  );
}
