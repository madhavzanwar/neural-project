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
  CheckCircle,
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Academic Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            NN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Neural Network Learning Lab
              </h1>
              <span className="hidden sm:inline-block bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-200">
                B.Tech AIML (Unit I & II)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              An Interactive Learning Platform for Artificial Neural Networks • Madhav Zanwar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/madhavzanwar/neural-project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 min-w-max">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-blue-900 shadow-xs border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{sec.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200/60 text-slate-600'
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
