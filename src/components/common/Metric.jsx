import React from 'react';

export function Metric({ label, value, subtext, icon: Icon, color = 'blue' }) {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 hover:border-slate-300 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between text-slate-500 mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-blue-50/80 border border-blue-100 text-blue-700">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight my-0.5">
        {value}
      </div>
      {subtext && <div className="text-[11px] text-slate-500 font-medium truncate">{subtext}</div>}
    </div>
  );
}
