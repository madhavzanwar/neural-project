import React from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import {
  ArrowRight,
  Brain,
  Cpu,
  Layers,
  Activity,
  Target,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export function OverviewSection({ onStartLearning, onNavigate }) {
  const learningObjectives = [
    {
      title: '1. Understand Network Architecture',
      description: 'Explore how layers, neurons, weights, and biases form the structural foundation of artificial neural networks.',
      icon: Layers,
      section: 'architecture',
    },
    {
      title: '2. Visualize Forward Information Flow',
      description: 'Trace step-by-step how numeric inputs are multiplied by weights, summed with bias, and activated.',
      icon: Activity,
      section: 'forward',
    },
    {
      title: '3. Observe Backpropagation & Learning',
      description: 'See how gradient descent adjusts weights iteratively to minimize loss and classify complex datasets.',
      icon: Target,
      section: 'training',
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
      artificial: 'Weighted Sum + Bias (z = Σ wᵢxᵢ + b)',
      role: 'Combines inputs and shifts the baseline activation threshold',
    },
    {
      biological: 'Axon Hillock Threshold (Fires action potential if threshold exceeded)',
      artificial: 'Activation Function f(z) (Sigmoid, ReLU, Tanh)',
      role: 'Applies non-linearity to map input to output response',
    },
    {
      biological: 'Axon & Synaptic Terminals (Transmits pulse to next neurons)',
      artificial: 'Neuron Output (a = f(z))',
      role: 'Transmits final output to downstream layer or final prediction',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-xl p-8 sm:p-10 shadow-md">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded border border-blue-400/30">
              Academic Lab Platform
            </span>
            <span className="text-slate-400 text-xs">AIML Second Year • Unit I & II</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif-heading mb-3 text-white">
            Neural Network Learning Lab
          </h2>
          <p className="text-lg text-blue-100/90 font-medium mb-4">
            Understand How Artificial Neural Networks Learn
          </p>

          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            An <strong>Artificial Neural Network (ANN)</strong> is a computational model inspired by the biological neural networks in the human brain. It consists of interconnected processing units called <strong>neurons</strong> arranged in layers. By iteratively adjusting the connection strengths (<strong>weights</strong>) and offsets (<strong>biases</strong>) through <strong>backpropagation</strong>, the network learns to approximate complex functions, classify data, and recognize intricate patterns.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartLearning}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('concepts')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-slate-200 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors border border-white/20 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Syllabus Reference</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fundamental 3-Layer Architecture Diagram */}
      <Card
        title="Fundamental Feed-Forward Flow"
        subtitle="Syllabus Unit I: Input Layer → Hidden Layer → Output Layer"
        badge={<Badge variant="unit1">Unit I Architecture</Badge>}
      >
        <div className="py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto p-4 bg-slate-50 border border-slate-200 rounded-lg">
            {/* Input Layer */}
            <div className="flex-1 w-full text-center p-4 bg-white border border-slate-200 rounded-md shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Input Layer
              </div>
              <div className="text-sm font-semibold text-slate-800">Features (x₁, x₂)</div>
              <p className="text-xs text-slate-500 mt-1">Raw incoming measurements or coordinates</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-mono">x₁</span>
                <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-mono">x₂</span>
              </div>
            </div>

            <div className="text-slate-400 font-bold text-lg hidden md:block">→</div>

            {/* Hidden Layer */}
            <div className="flex-1 w-full text-center p-4 bg-blue-50/60 border border-blue-200 rounded-md shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">
                Hidden Layer(s)
              </div>
              <div className="text-sm font-semibold text-blue-950">Features Extraction</div>
              <p className="text-xs text-blue-700/80 mt-1">z = Σ wᵢxᵢ + b, then a = f(z)</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-mono text-blue-900">h₁</span>
                <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-mono text-blue-900">h₂</span>
                <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-mono text-blue-900">h₃</span>
              </div>
            </div>

            <div className="text-slate-400 font-bold text-lg hidden md:block">→</div>

            {/* Output Layer */}
            <div className="flex-1 w-full text-center p-4 bg-emerald-50/60 border border-emerald-200 rounded-md shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Output Layer
              </div>
              <div className="text-sm font-semibold text-emerald-950">Prediction (ŷ)</div>
              <p className="text-xs text-emerald-700/80 mt-1">Probability score or decision class</p>
              <div className="flex justify-center mt-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-mono text-emerald-900">ŷ</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3 Core Learning Objectives */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Core Educational Objectives</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {learningObjectives.map((obj, i) => {
            const Icon = obj.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate(obj.section)}
                className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs p-5 rounded-lg transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1.5 group-hover:text-blue-700 transition-colors">
                  {obj.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {obj.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <span>Explore topic</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
        badge={<Badge variant="unit1">Unit I Core Topic</Badge>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-amber-900 mb-2">
                <Brain className="w-4 h-4" />
                <span>Biological Neuron (Brain)</span>
              </div>
              <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
                <li><strong>Dendrites:</strong> Branching fibers that receive biochemical impulses from thousands of neighbor cells.</li>
                <li><strong>Soma (Cell Body):</strong> Accumulates incoming ionic potentials over time.</li>
                <li><strong>Axon Hillock & Axon:</strong> Fires an all-or-none action potential if the membrane threshold is exceeded.</li>
                <li><strong>Synapse:</strong> Chemical junctions whose neurotransmitter efficiency changes during biological learning.</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                <Cpu className="w-4 h-4" />
                <span>Artificial Neuron (Perceptron Model)</span>
              </div>
              <ul className="text-xs text-blue-950 space-y-1.5 list-disc list-inside">
                <li><strong>Inputs (xᵢ):</strong> Numeric features fed into the node.</li>
                <li><strong>Weights (wᵢ):</strong> Multiplicative parameters adjusted via optimization.</li>
                <li><strong>Bias (b):</strong> Additive constant shifting the activation boundary.</li>
                <li><strong>Activation Function f(z):</strong> Mathematical function introducing non-linearity to bound the output.</li>
              </ul>
            </div>
          </div>

          {/* Side by side mapping table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Biological Element</th>
                  <th className="py-2.5 px-3">Artificial Equivalent</th>
                  <th className="py-2.5 px-3">Mathematical Role in Computation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {neuronComparison.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-2 px-3 font-medium text-slate-800">{row.biological}</td>
                    <td className="py-2 px-3 font-mono text-blue-900">{row.artificial}</td>
                    <td className="py-2 px-3 text-slate-600">{row.role}</td>
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
