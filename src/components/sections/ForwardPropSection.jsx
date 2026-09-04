import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Metric } from '../common/Metric.jsx';
import { ExplanationCard } from '../common/ExplanationCard.jsx';
import { forwardPass } from '../../nn/network.js';
import { ACTIVATIONS } from '../../nn/activations.js';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  CheckCircle2,
  Sliders,
  Calculator,
} from 'lucide-react';

export function ForwardPropSection() {
  // Inputs
  const [x1, setX1] = useState(0.5);
  const [x2, setX2] = useState(0.8);
  const [hiddenActivation, setHiddenActivation] = useState('relu');

  // Step state: 0 = Input, 1 = Hidden Neuron 1, 2 = Hidden Neuron 2, 3 = Output Layer
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1500);

  // Small, transparent educational network: 2 -> 2 -> 1
  const weights = useMemo(
    () => [
      // W1: [2 hidden x 2 input]
      [
        [0.6, -0.4], // h1
        [-0.5, 0.7], // h2
      ],
      // W2: [1 output x 2 hidden]
      [
        [0.8, -0.9], // out
      ],
    ],
    []
  );

  const biases = useMemo(
    () => [
      [0.2, -0.1], // b_h1, b_h2
      [0.1],       // b_out
    ],
    []
  );

  // Exact forward calculation
  const forwardResult = useMemo(() => {
    return forwardPass([x1, x2], weights, biases, [hiddenActivation], 'sigmoid');
  }, [x1, x2, weights, biases, hiddenActivation]);

  const { activations, preActivations } = forwardResult;

  // Neuron intermediates
  const h1_z = preActivations[1][0];
  const h1_a = activations[1][0];
  const h2_z = preActivations[1][1];
  const h2_a = activations[1][1];
  const out_z = preActivations[2][0];
  const out_a = activations[2][0];

  const steps = [
    {
      title: 'Step 1: Input Vector Ingestion',
      layer: 'input',
      description: 'External numerical features x₁ and x₂ enter the input layer. No weights, biases, or activations apply at the input layer.',
      details: [
        { label: 'Input Feature x₁', val: x1.toFixed(2) },
        { label: 'Input Feature x₂', val: x2.toFixed(2) },
      ],
    },
    {
      title: 'Step 2: Hidden Neuron h₁ Pre-Activation & Activation',
      layer: 'h1',
      description: 'h₁ computes weighted sum of inputs plus bias, followed by the activation function.',
      formula: `z_h1 = (w₁₁ · x₁) + (w₂₁ · x₂) + b_h1`,
      substitution: `z_h1 = (${weights[0][0][0]} · ${x1.toFixed(2)}) + (${weights[0][0][1]} · ${x2.toFixed(2)}) + ${biases[0][0]}`,
      evaluatedZ: `z_h1 = ${(weights[0][0][0] * x1).toFixed(3)} + ${(weights[0][0][1] * x2).toFixed(3)} + ${biases[0][0]} = ${h1_z.toFixed(4)}`,
      activationFormula: `a_h1 = ${hiddenActivation.toUpperCase()}(z_h1) = ${h1_a.toFixed(4)}`,
    },
    {
      title: 'Step 3: Hidden Neuron h₂ Pre-Activation & Activation',
      layer: 'h2',
      description: 'h₂ independently combines the inputs with its own dedicated weights and bias.',
      formula: `z_h2 = (w₁₂ · x₁) + (w₂₂ · x₂) + b_h2`,
      substitution: `z_h2 = (${weights[0][1][0]} · ${x1.toFixed(2)}) + (${weights[0][1][1]} · ${x2.toFixed(2)}) + (${biases[0][1]})`,
      evaluatedZ: `z_h2 = ${(weights[0][1][0] * x1).toFixed(3)} + ${(weights[0][1][1] * x2).toFixed(3)} + (${biases[0][1]}) = ${h2_z.toFixed(4)}`,
      activationFormula: `a_h2 = ${hiddenActivation.toUpperCase()}(z_h2) = ${h2_a.toFixed(4)}`,
    },
    {
      title: 'Step 4: Output Layer Pre-Activation & Sigmoid Prediction',
      layer: 'output',
      description: 'The output neuron takes activations from h₁ and h₂, multiplies by output weights, adds bias, and applies Sigmoid.',
      formula: `z_out = (w_out1 · a_h1) + (w_out2 · a_h2) + b_out`,
      substitution: `z_out = (${weights[1][0][0]} · ${h1_a.toFixed(3)}) + (${weights[1][0][1]} · ${h2_a.toFixed(3)}) + ${biases[1][0]}`,
      evaluatedZ: `z_out = ${(weights[1][0][0] * h1_a).toFixed(3)} + ${(weights[1][0][1] * h2_a).toFixed(3)} + ${biases[1][0]} = ${out_z.toFixed(4)}`,
      activationFormula: `ŷ = σ(z_out) = 1 / (1 + e^(-${out_z.toFixed(4)})) = ${out_a.toFixed(4)}`,
    },
  ];

  // Auto-play interval timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, playSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, steps.length]);

  const currentStepData = steps[activeStep];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="unit1">Unit I: Topic 11</Badge>
          <span className="text-xs text-slate-500">Feed-Forward Information Flow</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Numerical Forward Propagation Walkthrough
        </h2>
        <p className="text-slate-600 text-sm">
          Follow each numeric operation layer by layer as signals move from inputs, through hidden neurons, to the output prediction.
        </p>
      </div>

      {/* Input Configuration & Step Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Input Features (x)"
          subtitle="Adjust inputs to see how signals propagate"
        >
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Input x₁:</span>
                <span className="font-mono text-blue-900 font-bold">{x1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={x1}
                onChange={(e) => setX1(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Input x₂:</span>
                <span className="font-mono text-blue-900 font-bold">{x2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={x2}
                onChange={(e) => setX2(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hidden Activation Function:
              </label>
              <select
                value={hiddenActivation}
                onChange={(e) => setHiddenActivation(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md cursor-pointer font-medium text-slate-800"
              >
                <option value="relu">ReLU: max(0, z)</option>
                <option value="sigmoid">Sigmoid: 1 / (1 + e^-z)</option>
                <option value="tanh">Tanh: tanh(z)</option>
                <option value="linear">Linear: z</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Step Navigation Controls Card */}
        <div className="md:col-span-2">
          <Card
            title="Step-by-Step Controller"
            subtitle={`Step ${activeStep + 1} of ${steps.length}: ${currentStepData.title}`}
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded cursor-pointer transition-colors font-medium ${
                    isPlaying
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-amber-700' : ''}`} />
                  <span>{isPlaying ? 'Pause Auto-Play' : 'Auto-Play Walkthrough'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(0);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Step Progress Pills */}
              <div className="grid grid-cols-4 gap-2">
                {steps.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`py-2 px-1 text-center rounded text-xs font-medium cursor-pointer transition-all ${
                      activeStep === idx
                        ? 'bg-blue-600 text-white shadow-xs font-semibold'
                        : activeStep > idx
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70'
                    }`}
                  >
                    <span>{idx + 1}. {idx === 0 ? 'Inputs' : idx === 1 ? 'Neuron h₁' : idx === 2 ? 'Neuron h₂' : 'Output ŷ'}</span>
                  </button>
                ))}
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Numerical Calculation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: SVG Diagram Highlighting Active Step */}
        <Card title="Active Signal Propagation">
          <svg viewBox="0 0 460 260" className="w-full h-auto bg-slate-50/60 rounded-lg border border-slate-200">
            {/* Input Nodes: x1, x2 */}
            <g>
              <circle
                cx="60"
                cy="80"
                r="18"
                fill={activeStep >= 0 ? '#DBEAFE' : '#F1F5F9'}
                stroke={activeStep >= 0 ? '#2563EB' : '#94A3B8'}
                strokeWidth={activeStep === 0 ? 3 : 1.5}
              />
              <text x="60" y="84" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-800">
                x₁
              </text>
              <text x="60" y="112" textAnchor="middle" className="text-[10px] font-mono fill-slate-600">
                {x1.toFixed(2)}
              </text>

              <circle
                cx="60"
                cy="180"
                r="18"
                fill={activeStep >= 0 ? '#DBEAFE' : '#F1F5F9'}
                stroke={activeStep >= 0 ? '#2563EB' : '#94A3B8'}
                strokeWidth={activeStep === 0 ? 3 : 1.5}
              />
              <text x="60" y="184" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-800">
                x₂
              </text>
              <text x="60" y="212" textAnchor="middle" className="text-[10px] font-mono fill-slate-600">
                {x2.toFixed(2)}
              </text>
            </g>

            {/* Synapses to h1 */}
            <line
              x1="78"
              y1="80"
              x2="212"
              y2="80"
              stroke={activeStep === 1 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 1 ? 3 : 1.5}
              strokeDasharray={activeStep === 1 ? 'none' : '2 2'}
            />
            <line
              x1="78"
              y1="180"
              x2="212"
              y2="80"
              stroke={activeStep === 1 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 1 ? 3 : 1.5}
              strokeDasharray={activeStep === 1 ? 'none' : '2 2'}
            />

            {/* Synapses to h2 */}
            <line
              x1="78"
              y1="80"
              x2="212"
              y2="180"
              stroke={activeStep === 2 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 2 ? 3 : 1.5}
              strokeDasharray={activeStep === 2 ? 'none' : '2 2'}
            />
            <line
              x1="78"
              y1="180"
              x2="212"
              y2="180"
              stroke={activeStep === 2 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 2 ? 3 : 1.5}
              strokeDasharray={activeStep === 2 ? 'none' : '2 2'}
            />

            {/* Hidden Nodes: h1, h2 */}
            <g>
              <circle
                cx="230"
                cy="80"
                r="18"
                fill={activeStep >= 1 ? '#E0E7FF' : '#F1F5F9'}
                stroke={activeStep === 1 ? '#4F46E5' : activeStep > 1 ? '#6366F1' : '#94A3B8'}
                strokeWidth={activeStep === 1 ? 3 : 1.5}
              />
              <text x="230" y="84" textAnchor="middle" className="text-xs font-mono font-bold fill-indigo-950">
                h₁
              </text>
              <text x="230" y="112" textAnchor="middle" className="text-[10px] font-mono fill-indigo-800 font-semibold">
                a₁={h1_a.toFixed(2)}
              </text>

              <circle
                cx="230"
                cy="180"
                r="18"
                fill={activeStep >= 2 ? '#E0E7FF' : '#F1F5F9'}
                stroke={activeStep === 2 ? '#4F46E5' : activeStep > 2 ? '#6366F1' : '#94A3B8'}
                strokeWidth={activeStep === 2 ? 3 : 1.5}
              />
              <text x="230" y="184" textAnchor="middle" className="text-xs font-mono font-bold fill-indigo-950">
                h₂
              </text>
              <text x="230" y="212" textAnchor="middle" className="text-[10px] font-mono fill-indigo-800 font-semibold">
                a₂={h2_a.toFixed(2)}
              </text>
            </g>

            {/* Synapses to Output */}
            <line
              x1="248"
              y1="80"
              x2="382"
              y2="130"
              stroke={activeStep === 3 ? '#059669' : '#CBD5E1'}
              strokeWidth={activeStep === 3 ? 3 : 1.5}
            />
            <line
              x1="248"
              y1="180"
              x2="382"
              y2="130"
              stroke={activeStep === 3 ? '#059669' : '#CBD5E1'}
              strokeWidth={activeStep === 3 ? 3 : 1.5}
            />

            {/* Output Node: ŷ */}
            <g>
              <circle
                cx="400"
                cy="130"
                r="20"
                fill={activeStep === 3 ? '#D1FAE5' : '#F1F5F9'}
                stroke={activeStep === 3 ? '#059669' : '#94A3B8'}
                strokeWidth={activeStep === 3 ? 3 : 1.5}
              />
              <text x="400" y="134" textAnchor="middle" className="text-xs font-mono font-bold fill-emerald-950">
                ŷ
              </text>
              <text x="400" y="165" textAnchor="middle" className="text-[10px] font-mono fill-emerald-800 font-bold">
                {out_a.toFixed(3)}
              </text>
            </g>
          </svg>
        </Card>

        {/* Right: Exact Equations and Value Substitutions */}
        <Card
          title={currentStepData.title}
          badge={<Badge variant="navy">Live Computation</Badge>}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">{currentStepData.description}</p>

            {activeStep === 0 ? (
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-md font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Feature 1 (x₁):</span>
                  <span className="text-blue-900 font-bold">{x1.toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Feature 2 (x₂):</span>
                  <span className="text-blue-900 font-bold">{x2.toFixed(4)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 block font-medium mb-1">1. Mathematical Formula:</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-blue-900 font-medium">
                    {currentStepData.formula}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium mb-1">2. Numeric Substitution:</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-slate-800">
                    {currentStepData.substitution}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium mb-1">3. Weighted Sum (z):</span>
                  <div className="p-2.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                    {currentStepData.evaluatedZ}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium mb-1">4. Post-Activation Result (a):</span>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded font-mono font-bold text-emerald-900">
                    {currentStepData.activationFormula}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Syllabus Card */}
      <ExplanationCard
        title="Forward Propagation Mathematical Rules"
        syllabusTopic="Unit I: 11. Feed-forward neural networks"
        what="Forward propagation is the calculation process that maps network inputs to intermediate activations and final outputs layer by layer."
        why="It computes the model's actual prediction for a given set of inputs without mutating any parameters. The resulting prediction is then compared to target y to compute loss."
        how="For each layer l: z = W[l] · a[l-1] + b[l], followed by a[l] = activation(z). All intermediate z and a vectors are stored in memory for reuse by backpropagation."
        interactionEffect="Modifying inputs x₁ or x₂ instantly recalculates the entire algebraic chain down to the exact output prediction ŷ."
      />
    </div>
  );
}
