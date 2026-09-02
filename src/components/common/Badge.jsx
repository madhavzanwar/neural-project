import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    navy: 'bg-slate-800 text-slate-100 border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    unit1: 'bg-sky-50 text-sky-800 border-sky-200',
    unit2: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm}`}
    >
      {children}
    </span>
  );
}
