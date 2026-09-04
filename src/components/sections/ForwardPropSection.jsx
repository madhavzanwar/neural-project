import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Metric } from '../common/Metric.jsx';
import { Slider } from '../common/Slider.jsx';
import { ExplanationCard } from '../common/ExplanationCard.jsx';
import { forwardPass } from '../../nn/network.js';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Sliders,
  Sparkles,
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
        [0.6, -0.4], // h1: w11, w21
        [-0.5, 0.7], // h2: w12, w22
      ],
      // W2: [1 output x 2 hidden]
      [
        [0.8, -0.9], // out: w_out1, w_out2
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
      subtitle: 'Layer 0: Feature Input',
      layer: 'input',
      description: 'External numerical features enter the input layer. Input nodes perform no summation, bias addition, or activation—they merely distribute features to the network.',
      details: [
        { label: 'Input Feature x₁', val: x1.toFixed(2) },
        { label: 'Input Feature x₂', val: x2.toFixed(2) },
      ],
    },
    {
      title: 'Step 2: Hidden Neuron h₁ Pre-Activation & Activation',
      subtitle: 'Layer 1: First Hidden Unit',
      layer: 'h1',
      description: 'Neuron h₁ calculates the linear combination (weighted sum + bias) of all incoming inputs, then passes the scalar through the non-linear activation function.',
      formula: 'z_h1 = (w₁₁ · x₁) + (w₂₁ · x₂) + b_h1',
      substitution: `z_h1 = (${weights[0][0][0]} · ${x1.toFixed(2)}) + (${weights[0][0][1]} · ${x2.toFixed(2)}) + ${biases[0][0]}`,
      evaluatedZ: `z_h1 = ${(weights[0][0][0] * x1).toFixed(3)} + (${(weights[0][0][1] * x2).toFixed(3)}) + ${biases[0][0]} = ${h1_z.toFixed(4)}`,
      activationFormula: `a_h1 = ${hiddenActivation.toUpperCase()}(z_h1) = ${h1_a.toFixed(4)}`,
    },
    {
      title: 'Step 3: Hidden Neuron h₂ Pre-Activation & Activation',
      subtitle: 'Layer 1: Second Hidden Unit',
      layer: 'h2',
      description: 'Neuron h₂ independently combines the same inputs with its own dedicated weights and bias, generating a complementary feature transformation.',
      formula: 'z_h2 = (w₁₂ · x₁) + (w₂₂ · x₂) + b_h2',
      substitution: `z_h2 = (${weights[0][1][0]} · ${x1.toFixed(2)}) + (${weights[0][1][1]} · ${x2.toFixed(2)}) + (${biases[0][1]})`,
      evaluatedZ: `z_h2 = ${(weights[0][1][0] * x1).toFixed(3)} + (${(weights[0][1][1] * x2).toFixed(3)}) + (${biases[0][1]}) = ${h2_z.toFixed(4)}`,
      activationFormula: `a_h2 = ${hiddenActivation.toUpperCase()}(z_h2) = ${h2_a.toFixed(4)}`,
    },
    {
      title: 'Step 4: Output Layer Pre-Activation & Sigmoid Prediction',
      subtitle: 'Layer 2: Output Probability',
      layer: 'output',
      description: 'The output neuron takes activations from h₁ and h₂, computes the linear sum using output weights and bias, and applies Sigmoid to squash the output into [0, 1].',
      formula: 'z_out = (w_out1 · a_h1) + (w_out2 · a_h2) + b_out',
      substitution: `z_out = (${weights[1][0][0]} · ${h1_a.toFixed(3)}) + (${weights[1][0][1]} · ${h2_a.toFixed(3)}) + ${biases[1][0]}`,
      evaluatedZ: `z_out = ${(weights[1][0][0] * h1_a).toFixed(3)} + (${(weights[1][0][1] * h2_a).toFixed(3)}) + ${biases[1][0]} = ${out_z.toFixed(4)}`,
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
          <span className="text-xs text-slate-500 font-medium">Feed-Forward Information Flow</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Numerical Forward Propagation Walkthrough
        </h2>
        <p className="text-slate-600 text-sm">
          Follow each numeric operation layer by layer as signals move from inputs, through hidden neurons, to the output prediction.
        </p>
      </div>

      {/* Stepper Timeline Progress Bar */}
      <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 relative z-10">
            {steps.map((st, idx) => {
              const isPassed = activeStep > idx;
              const isCurrent = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className="flex flex-col items-center text-center cursor-pointer group focus:outline-none"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 border-2 ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 scale-110 shadow-sm'
                        : isPassed
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-400 border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium tracking-tight ${
                      isCurrent ? 'text-blue-900 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {idx === 0 ? 'Inputs' : idx === 1 ? 'Hidden h₁' : idx === 2 ? 'Hidden h₂' : 'Output ŷ'}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    {idx === 0 ? 'x₁, x₂' : idx === 1 ? 'z₁, a₁' : idx === 2 ? 'z₂, a₂' : 'Prediction'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Configuration & Step Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Input Features & Activation"
          subtitle="Adjust inputs to see how signals propagate"
        >
          <div className="space-y-4">
            <Slider
              label="Input Feature x₁"
              value={x1}
              min={0}
              max={1}
              step={0.05}
              onChange={setX1}
            />

            <Slider
              label="Input Feature x₂"
              value={x2}
              min={0}
              max={1}
              step={0.05}
              onChange={setX2}
            />

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Hidden Activation Function:
              </label>
              <select
                value={hiddenActivation}
                onChange={(e) => setHiddenActivation(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
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
            title="Step-by-Step Walkthrough Controller"
            subtitle={`Step ${activeStep + 1} of ${steps.length}: ${currentStepData.title}`}
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all font-medium active:scale-[0.98] ${
                    isPlaying
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                      : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-amber-800" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-blue-800" />
                      <span>Auto-Play</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(0);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors active:scale-[0.98]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {currentStepData.description}
              </p>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors shadow-xs active:scale-[0.98]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>

                <div className="text-xs font-mono font-medium text-slate-400">
                  {activeStep + 1} / {steps.length}
                </div>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors active:scale-[0.98]"
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
        <Card title="Active Signal Propagation" subtitle="Visual data path across network layers">
          <svg
            viewBox="0 0 460 260"
            className="w-full h-auto bg-slate-50/70 rounded-xl border border-slate-200/90 shadow-inner"
          >
            <defs>
              <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Swimlanes for layers */}
            <rect x="25" y="20" width="85" height="220" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="3 3" />
            <text x="67" y="38" textAnchor="middle" className="text-[9px] font-sans font-bold fill-slate-400 uppercase tracking-wider">
              Input Layer
            </text>

            <rect x="180" y="20" width="100" height="220" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="3 3" />
            <text x="230" y="38" textAnchor="middle" className="text-[9px] font-sans font-bold fill-slate-400 uppercase tracking-wider">
              Hidden Layer
            </text>

            <rect x="345" y="20" width="95" height="220" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="3 3" />
            <text x="392" y="38" textAnchor="middle" className="text-[9px] font-sans font-bold fill-slate-400 uppercase tracking-wider">
              Output Layer
            </text>

            {/* Synapses to h1 */}
            <line
              x1="86"
              y1="85"
              x2="210"
              y2="85"
              stroke={activeStep === 1 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 1 ? 3 : 1.5}
              strokeDasharray={activeStep === 1 ? 'none' : '3 3'}
            />
            <text x="145" y="80" textAnchor="middle" className="text-[9px] font-mono fill-slate-500 bg-white">
              w₁₁=0.6
            </text>

            <line
              x1="86"
              y1="175"
              x2="210"
              y2="85"
              stroke={activeStep === 1 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 1 ? 3 : 1.5}
              strokeDasharray={activeStep === 1 ? 'none' : '3 3'}
            />
            <text x="135" y="125" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              w₂₁=-0.4
            </text>

            {/* Synapses to h2 */}
            <line
              x1="86"
              y1="85"
              x2="210"
              y2="175"
              stroke={activeStep === 2 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 2 ? 3 : 1.5}
              strokeDasharray={activeStep === 2 ? 'none' : '3 3'}
            />
            <text x="135" y="145" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              w₁₂=-0.5
            </text>

            <line
              x1="86"
              y1="175"
              x2="210"
              y2="175"
              stroke={activeStep === 2 ? '#2563EB' : '#CBD5E1'}
              strokeWidth={activeStep === 2 ? 3 : 1.5}
              strokeDasharray={activeStep === 2 ? 'none' : '3 3'}
            />
            <text x="145" y="190" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              w₂₂=0.7
            </text>

            {/* Synapses to Output */}
            <line
              x1="250"
              y1="85"
              x2="370"
              y2="130"
              stroke={activeStep === 3 ? '#059669' : '#CBD5E1'}
              strokeWidth={activeStep === 3 ? 3 : 1.5}
            />
            <text x="305" y="100" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              w_out1=0.8
            </text>

            <line
              x1="250"
              y1="175"
              x2="370"
              y2="130"
              stroke={activeStep === 3 ? '#059669' : '#CBD5E1'}
              strokeWidth={activeStep === 3 ? 3 : 1.5}
            />
            <text x="305" y="165" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              w_out2=-0.9
            </text>

            {/* Animated signal packets */}
            {activeStep === 1 && (
              <>
                <circle cx="148" cy="85" r="4" fill="#2563EB">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="148" cy="130" r="4" fill="#2563EB">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            {activeStep === 2 && (
              <>
                <circle cx="148" cy="130" r="4" fill="#2563EB">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="148" cy="175" r="4" fill="#2563EB">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            {activeStep === 3 && (
              <>
                <circle cx="310" cy="108" r="4" fill="#059669">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="310" cy="152" r="4" fill="#059669">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            {/* Input Nodes: x1, x2 */}
            <g>
              <circle
                cx="68"
                cy="85"
                r="18"
                fill={activeStep >= 0 ? '#DBEAFE' : '#F1F5F9'}
                stroke={activeStep === 0 ? '#2563EB' : '#94A3B8'}
                strokeWidth={activeStep === 0 ? 3 : 1.5}
                filter={activeStep === 0 ? 'url(#activeGlow)' : 'none'}
              />
              <text x="68" y="89" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-800">
                x₁
              </text>
              <text x="68" y="116" textAnchor="middle" className="text-[10px] font-mono fill-blue-900 font-bold">
                {x1.toFixed(2)}
              </text>

              <circle
                cx="68"
                cy="175"
                r="18"
                fill={activeStep >= 0 ? '#DBEAFE' : '#F1F5F9'}
                stroke={activeStep === 0 ? '#2563EB' : '#94A3B8'}
                strokeWidth={activeStep === 0 ? 3 : 1.5}
                filter={activeStep === 0 ? 'url(#activeGlow)' : 'none'}
              />
              <text x="68" y="179" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-800">
                x₂
              </text>
              <text x="68" y="206" textAnchor="middle" className="text-[10px] font-mono fill-blue-900 font-bold">
                {x2.toFixed(2)}
              </text>
            </g>

            {/* Hidden Nodes: h1, h2 */}
            <g>
              <circle
                cx="230"
                cy="85"
                r="18"
                fill={activeStep >= 1 ? '#E0E7FF' : '#F1F5F9'}
                stroke={activeStep === 1 ? '#4F46E5' : activeStep > 1 ? '#6366F1' : '#94A3B8'}
                strokeWidth={activeStep === 1 ? 3 : 1.5}
                filter={activeStep === 1 ? 'url(#activeGlow)' : 'none'}
              />
              <text x="230" y="89" textAnchor="middle" className="text-xs font-mono font-bold fill-indigo-950">
                h₁
              </text>
              <text x="230" y="116" textAnchor="middle" className="text-[10px] font-mono fill-indigo-900 font-semibold">
                a₁={h1_a.toFixed(2)}
              </text>

              <circle
                cx="230"
                cy="175"
                r="18"
                fill={activeStep >= 2 ? '#E0E7FF' : '#F1F5F9'}
                stroke={activeStep === 2 ? '#4F46E5' : activeStep > 2 ? '#6366F1' : '#94A3B8'}
                strokeWidth={activeStep === 2 ? 3 : 1.5}
                filter={activeStep === 2 ? 'url(#activeGlow)' : 'none'}
              />
              <text x="230" y="179" textAnchor="middle" className="text-xs font-mono font-bold fill-indigo-950">
                h₂
              </text>
              <text x="230" y="206" textAnchor="middle" className="text-[10px] font-mono fill-indigo-900 font-semibold">
                a₂={h2_a.toFixed(2)}
              </text>
            </g>

            {/* Output Node: ŷ */}
            <g>
              <circle
                cx="390"
                cy="130"
                r="20"
                fill={activeStep === 3 ? '#D1FAE5' : '#F1F5F9'}
                stroke={activeStep === 3 ? '#059669' : '#94A3B8'}
                strokeWidth={activeStep === 3 ? 3 : 1.5}
                filter={activeStep === 3 ? 'url(#activeGlow)' : 'none'}
              />
              <text x="390" y="134" textAnchor="middle" className="text-xs font-mono font-bold fill-emerald-950">
                ŷ
              </text>
              <text x="390" y="165" textAnchor="middle" className="text-[10px] font-mono fill-emerald-800 font-bold">
                {out_a.toFixed(3)}
              </text>
            </g>
          </svg>
        </Card>

        {/* Right: Exact Equations and Value Substitutions */}
        <Card
          title={currentStepData.title}
          subtitle={currentStepData.subtitle}
          badge={<Badge variant="navy">Live Numeric Computation</Badge>}
        >
          <div className="space-y-4 text-xs">
            {activeStep === 0 ? (
              <div className="space-y-3 p-4 bg-slate-50/80 border border-slate-200/90 rounded-xl font-mono">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-sans text-xs">Feature 1 (x₁):</span>
                  <span className="text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {x1.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-500 font-sans text-xs">Feature 2 (x₂):</span>
                  <span className="text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {x2.toFixed(4)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    1. Mathematical Formula:
                  </span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-lg font-mono text-blue-900 font-medium">
                    {currentStepData.formula}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    2. Numeric Value Substitution:
                  </span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-lg font-mono text-slate-800">
                    {currentStepData.substitution}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    3. Weighted Sum (z):
                  </span>
                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg font-mono font-bold text-indigo-950">
                    {currentStepData.evaluatedZ}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    4. Post-Activation Result (a):
                  </span>
                  <div className="p-2.5 bg-emerald-50/90 border border-emerald-300 rounded-lg font-mono font-bold text-emerald-950">
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
