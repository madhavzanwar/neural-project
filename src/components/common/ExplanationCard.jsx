import React, { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';

export function ExplanationCard({
  title = 'How It Works & Syllabus Mapping',
  what,
  why,
  how,
  syllabusTopic,
  interactionEffect,
  defaultExpanded = true,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl overflow-hidden my-4 text-sm shadow-xs transition-all duration-200">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-slate-100/80 hover:bg-slate-200/60 border-b border-slate-200/70 flex items-center justify-between text-left transition-colors cursor-pointer group"
        aria-expanded={expanded}
      >
        <div className="flex flex-wrap items-center gap-2 text-slate-800 font-semibold text-xs md:text-sm flex-1 min-w-0 pr-2">
          <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
          <span className="font-serif-heading">{title}</span>
          {syllabusTopic && (
            <span className="text-[11px] bg-blue-100/90 text-blue-900 border border-blue-200/70 px-2.5 py-0.5 rounded-full font-mono font-medium">
              {syllabusTopic}
            </span>
          )}
        </div>
        <div
          className={`p-1 rounded-full text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-200/80 shrink-0 transition-transform duration-200 ${
            expanded ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {expanded && (
        <div className="p-4 sm:p-5 space-y-3.5 bg-white divide-y divide-slate-100">
          {what && (
            <div className="pt-2 first:pt-0">
              <span className="font-bold text-[11px] uppercase tracking-wider text-blue-950 block mb-1">
                1. What is it?
              </span>
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{what}</p>
            </div>
          )}

          {why && (
            <div className="pt-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-blue-950 block mb-1">
                2. Why is it used?
              </span>
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{why}</p>
            </div>
          )}

          {how && (
            <div className="pt-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-blue-950 block mb-1">
                3. How does it work mathematically?
              </span>
              <div className="text-slate-700 leading-relaxed text-xs sm:text-sm bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                {how}
              </div>
            </div>
          )}

          {interactionEffect && (
            <div className="pt-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 block mb-1">
                4. What to observe in this demo
              </span>
              <p className="text-emerald-950 leading-relaxed text-xs sm:text-sm bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/80">
                {interactionEffect}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
