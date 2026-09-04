import React from 'react';

export function Card({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
  headerClassName = '',
}) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden ${className}`}
    >
      {(title || subtitle || badge || action) && (
        <div
          className={`px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/40 ${headerClassName}`}
        >
          <div>
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="font-semibold text-slate-900 text-sm md:text-base tracking-tight font-serif-heading">
                  {title}
                </h3>
              )}
              {badge && <span>{badge}</span>}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
