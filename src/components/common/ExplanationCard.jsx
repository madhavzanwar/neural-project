import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export function ExplanationCard({
  title = "How It Works & Syllabus Mapping",
  what,
  why,
  how,
  syllabusTopic,
  interactionEffect,
  defaultExpanded = true,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden my-4 text-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200/70 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          <BookOpen className="w-4 h-4 text-blue-700" />
          <span>{title}</span>
          {syllabusTopic && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-normal">
              {syllabusTopic}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="p-4 space-y-3 bg-white">
          {what && (
            <div>
              <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider text-blue-900 mb-0.5">
                1. What is it?
              </span>
              <p className="text-slate-700 leading-relaxed">{what}</p>
            </div>
          )}

          {why && (
            <div>
              <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider text-blue-900 mb-0.5">
                2. Why is it used?
              </span>
              <p className="text-slate-700 leading-relaxed">{why}</p>
            </div>
          )}

          {how && (
            <div>
              <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider text-blue-900 mb-0.5">
                3. How does it work?
              </span>
              <p className="text-slate-700 leading-relaxed">{how}</p>
            </div>
          )}

          {interactionEffect && (
            <div>
              <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider text-emerald-800 mb-0.5">
                4. What happens when you change a value?
              </span>
              <p className="text-slate-700 leading-relaxed">{interactionEffect}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
