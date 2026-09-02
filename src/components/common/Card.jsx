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
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 ${className}`}>
      {(title || subtitle || badge || action) && (
        <div className={`px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 ${headerClassName}`}>
          <div>
            <div className="flex items-center gap-2">
              {title && <h3 className="font-semibold text-slate-900 text-base tracking-tight">{title}</h3>}
              {badge && <span>{badge}</span>}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
