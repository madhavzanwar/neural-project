import React from 'react';
import {
  BookOpen,
  Network,
  Activity,
  ArrowRightCircle,
  PlayCircle,
  Sliders,
  GraduationCap,
  Github,
  Sparkles,
} from 'lucide-react';

export const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: BookOpen, tag: 'Intro' },
  { id: 'architecture', label: 'Architecture', icon: Network, tag: 'Unit I' },
  { id: 'activations', label: 'Activation Functions', icon: Activity, tag: 'Unit I' },
  { id: 'forward', label: 'Forward Propagation', icon: ArrowRightCircle, tag: 'Unit I' },
  { id: 'training', label: 'Training & Backprop', icon: PlayCircle, tag: 'Unit II' },
  { id: 'weight-init', label: 'Weight Initialization', icon: Sliders, tag: 'Unit II' },
  { id: 'concepts', label: 'Concepts & Syllabus', icon: GraduationCap, tag: 'Reference' },
];

export function Navbar({ activeSection, onSelectSection }) {
  return (
    <header className="backdrop-blur-md bg-white/95 border-b border-slate-200/90 sticky top-0 z-40 shadow-xs transition-colors">
      {/* Top Academic Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-900 to-blue-950 text-white flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-slate-800/10">
            NN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Neural Network Learning Lab
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span>B.Tech AIML (Unit I & II)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              An Interactive Learning Platform for Artificial Neural Networks • Madhav Zanwar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/madhavzanwar/neural-project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          >
            <Github className="w-3.5 h-3.5 text-slate-700" />
            <span className="font-medium">GitHub Repository</span>
          </a>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-t border-slate-100 bg-slate-50/60 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 min-w-max">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-white text-blue-950 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{sec.label}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 font-semibold'
                      : 'bg-slate-200/60 text-slate-500'
                  }`}
                >
                  {sec.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
