import React from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { MathView } from '../common/MathView.jsx';
import {
  ArrowRight,
  Brain,
  Cpu,
  Layers,
  Activity,
  Target,
  Sparkles,
  BookOpen,
  GraduationCap,
  Network,
} from 'lucide-react';

export function OverviewSection({ onStartLearning, onNavigate }) {
  const learningObjectives = [
    {
      title: '1. Understand Network Architecture',
      subtitle: 'Feed-forward topology & parameter connectivity',
      description: 'Explore how layers, neurons, weights, and biases form the structural foundation of artificial neural networks.',
      icon: Layers,
      section: 'architecture',
      badge: 'Unit I: Topics 4 & 9-11',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: '2. Visualize Forward Information Flow',
      subtitle: 'Step-by-step numeric algebraic evaluation',
      description: 'Trace step-by-step how numeric inputs are multiplied by weights, summed with bias, and non-linearly activated.',
      icon: Activity,
      section: 'forward',
      badge: 'Unit I: Topic 11',
      color: 'from-indigo-600 to-sky-600',
    },
    {
      title: '3. Observe Backpropagation & Learning',
      subtitle: 'Gradient descent on real empirical loss',
      description: 'See how gradient descent calculates partial derivatives backward to minimize loss and classify complex non-linear datasets.',
      icon: Target,
      section: 'training',
      badge: 'Unit II: Topics 1-4',
      color: 'from-sky-600 to-emerald-600',
    },
  ];

  const neuronComparison = [
    {
      biological: 'Dendrites (Receive input signals from other neurons)',
      artificial: 'Input Vector (x₁, x₂, ..., xₙ)',
      role: 'Receives signals / features from data or previous layer',
    },
    {
      biological: 'Synaptic Strengths (Modulates signal transmission efficiency)',
      artificial: 'Weights (w₁, w₂, ..., wₙ)',
      role: 'Determines the importance and amplification of each input',
    },
    {
      biological: 'Cell Body / Soma (Sums incoming electrical potentials)',
      artificial: 'Weighted Sum + Bias', math: 'z = \\sum_{i=1}^n w_i x_i + b',
      role: 'Combines inputs and shifts the baseline activation threshold',
    },
    {
      biological: 'Axon Hillock Threshold (Fires action potential if threshold exceeded)',
      artificial: 'Activation Function f(z) (Sigmoid, ReLU, Tanh)',
      role: 'Applies non-linearity to map input to output response',
    },
    {
      biological: 'Axon & Synaptic Terminals (Transmits pulse to next neurons)',
      artificial: 'Neuron Output', math: 'a = f(z)',
      role: 'Transmits final output to downstream layer or final prediction',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Laboratory Project</span>
            </span>
            <span className="text-slate-400 text-xs font-medium">
              Second-Year B.Tech AIML • Neural Networks Syllabus (Units I & II)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-serif-heading mb-3 text-white leading-tight">
            Neural Network Learning Lab
          </h1>
          <p className="text-lg sm:text-xl text-blue-200/90 font-medium mb-5">
            Understand How Artificial Neural Networks Learn
          </p>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8 max-w-2xl">
            An <strong>Artificial Neural Network (ANN)</strong> is a computational framework inspired by biological neural circuits in the nervous system. By systematically adjusting internal connection parameters (<strong>weights</strong>) and thresholds (<strong>biases</strong>) through <strong>gradient backpropagation</strong>, the network learns to approximate non-linear decision boundaries, perform classification, and generalize across data points.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartLearning}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('concepts')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all border border-white/20 active:scale-[0.98] cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Syllabus Reference Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fundamental 3-Layer Architecture Flow */}
      <Card
        title="Fundamental Feed-Forward Topology"
        subtitle="Syllabus Unit I: Input Layer → Hidden Layer → Output Layer"
        badge={<Badge variant="unit1">Unit I Architecture</Badge>}
      >
        <div className="py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto p-4 bg-slate-50/70 border border-slate-200/90 rounded-xl">
            {/* Input Layer */}
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Input Layer (Layer 0)
              </div>
              <div className="text-sm font-semibold text-slate-900 font-serif-heading">Features (x₁, x₂)</div>
              <p className="text-xs text-slate-500 mt-1">Raw external features and coordinates</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-mono font-bold text-blue-900 shadow-2xs">
                  x₁
                </span>
                <span className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-mono font-bold text-blue-900 shadow-2xs">
                  x₂
                </span>
              </div>
            </div>

            {/* Hidden Layer */}
            <div className="text-center p-4 bg-blue-50/50 rounded-xl border border-blue-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1">
                Hidden Layer(s) (Layer 1)
              </div>
              <div className="text-sm font-semibold text-blue-950 font-serif-heading">Non-linear Transform</div>
              <div className="mt-1 flex justify-center">
                <MathView math="z = \sum w_i x_i + b, \; a = f(z)" inline className="text-xs text-blue-900 bg-white/80 px-2 py-0.5 rounded border border-blue-200" />
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <span className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-xs font-mono font-bold text-indigo-950 shadow-2xs">
                  h₁
                </span>
                <span className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-xs font-mono font-bold text-indigo-950 shadow-2xs">
                  h₂
                </span>
                <span className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-xs font-mono font-bold text-indigo-950 shadow-2xs">
                  h₃
                </span>
              </div>
            </div>

            {/* Output Layer */}
            <div className="text-center p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Output Layer (Layer 2)
              </div>
              <div className="text-sm font-semibold text-emerald-950 font-serif-heading">Target Prediction (ŷ)</div>
              <p className="text-xs text-emerald-800/80 mt-1">Probability score or binary decision</p>
              <div className="flex justify-center mt-3">
                <span className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-mono font-bold text-emerald-950 shadow-2xs">
                  ŷ
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3 Core Learning Objectives (Bento Grid) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight font-serif-heading">
            Three Core Educational Objectives
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {learningObjectives.map((obj, i) => {
            const Icon = obj.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate(obj.section)}
                className="group relative bg-white/95 backdrop-blur-xs border border-slate-200/90 hover:border-blue-300 hover:shadow-md p-6 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="navy" size="xs">{obj.badge}</Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-700 transition-colors font-serif-heading">
                    {obj.title}
                  </h4>
                  <p className="text-[11px] text-blue-700 font-medium mb-2">
                    {obj.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Interactive Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biological vs Artificial Neurons (Syllabus Unit I: 2 & 3) */}
      <Card
        title="Biological vs Artificial Neurons Comparison"
        subtitle="Syllabus Unit I: 2. Biological neural networks & 3. Artificial neural networks"
        badge={<Badge variant="unit1">Unit I Core Concept</Badge>}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/60 border border-amber-200/90 rounded-xl shadow-xs">
              <div className="flex items-center gap-2 font-bold text-amber-950 mb-2 font-serif-heading text-xs sm:text-sm">
                <Brain className="w-4 h-4 text-amber-700" />
                <span>Biological Neuron (Brain Biology)</span>
              </div>
              <ul className="text-xs text-amber-950/90 space-y-2 list-disc list-inside leading-relaxed">
                <li><strong>Dendrites:</strong> Branching tree-like fibers that ingest biochemical neurotransmitters from neighboring cells.</li>
                <li><strong>Soma (Cell Body):</strong> Spatially and temporally integrates incoming electrical potentials.</li>
                <li><strong>Axon Hillock & Axon:</strong> Generates an all-or-none electrical spike (action potential) when threshold voltage is crossed.</li>
                <li><strong>Synapse:</strong> Adaptive junction where synaptic plasticity (learning) modifies signal transmission strength.</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200/90 rounded-xl shadow-xs">
              <div className="flex items-center gap-2 font-bold text-blue-950 mb-2 font-serif-heading text-xs sm:text-sm">
                <Cpu className="w-4 h-4 text-blue-700" />
                <span>Artificial Neuron (Perceptron Model)</span>
              </div>
              <ul className="text-xs text-blue-950/90 space-y-2 list-disc list-inside leading-relaxed">
                <li><strong>Inputs (xᵢ):</strong> Numerical feature vectors fed into the neuron from data or preceding layers.</li>
                <li><strong>Weights (wᵢ):</strong> Scalable algebraic parameters modified by backpropagation gradient descent.</li>
                <li><strong>Bias (b):</strong> Independent threshold parameter shifting the hyperplane away from the origin.</li>
                <li><strong>Activation Function f(z):</strong> Non-linear squashing function (Sigmoid, ReLU, Tanh) determining output state.</li>
              </ul>
            </div>
          </div>

          {/* Mapping Table */}
          <div className="overflow-x-auto border border-slate-200/90 rounded-xl shadow-xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Biological Element</th>
                  <th className="py-3 px-3.5">Artificial ANN Equivalent</th>
                  <th className="py-3 px-3.5">Mathematical Computational Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {neuronComparison.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/50' : 'bg-slate-50/40 hover:bg-slate-50/70'}>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">{row.biological}</td>
                    <td className="py-2.5 px-3.5 text-blue-900 font-semibold">
                      <span className="font-medium text-slate-800">{row.artificial}</span>
                      {row.math && (
                        <div className="mt-0.5">
                          <MathView math={row.math} inline className="text-blue-900 bg-blue-50 px-1 py-0.5 rounded border border-blue-200 text-[11px]" />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 leading-relaxed">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
