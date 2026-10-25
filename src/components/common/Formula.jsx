import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { MathView } from './MathView.jsx';

export function Formula({ formula, latex, note, label }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);
  const mathText = latex || formula || '';

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(mathText)
        .then(() => {
          setCopied(true);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setCopied(false), 1500);
        })
        .catch((err) => {
          console.warn('Clipboard write error:', err);
        });
    }
  };

  return (
    <div className="group relative bg-slate-50/90 hover:bg-slate-50 border border-slate-200/90 hover:border-blue-200 rounded-xl p-3.5 my-2.5 transition-all duration-200 shadow-xs hover:shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        {label && (
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-sans font-bold">
            {label}
          </span>
        )}
        <button
          onClick={handleCopy}
          type="button"
          title="Copy formula text"
          className="ml-auto inline-flex items-center gap-1 text-[11px] font-sans font-medium text-slate-500 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-md px-2 py-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="text-blue-900 font-medium py-0.5 overflow-x-auto scrollbar-thin">
        {latex ? (
          <MathView math={latex} display={true} />
        ) : (
          <MathView math={formula} display={true} />
        )}
      </div>
      {note && (
        <div className="text-xs text-slate-600 font-sans mt-2 pt-2 border-t border-slate-200/60 leading-relaxed">
          {note}
        </div>
      )}
    </div>
  );
}
