import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Metric } from '../common/Metric.jsx';
import { Slider } from '../common/Slider.jsx';
import { MathView } from '../common/MathView.jsx';
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
  SlidersHorizontal,
  Sparkles,
  Edit3,
} from 'lucide-react';

const DEFAULT_WEIGHTS = {
  w11: 0.6,
  w21: -0.4,
  bh1: 0.2,
  w12: -0.5,
  w22: 0.7,
  bh2: -0.1,
  w_out1: 0.8,
  w_out2: -0.9,
  b_out: 0.1,
};

export function ForwardPropSection() {
  // Inputs
  const [x1, setX1] = useState(0.5);
  const [x2, setX2] = useState(0.8);
  const [hiddenActivation, setHiddenActivation] = useState('relu');

  // Dynamic user-editable weights & biases
  const [params, setParams] = useState(DEFAULT_WEIGHTS);
  const [controlTab, setControlTab] = useState('inputs'); // 'inputs' | 'weights'

  // Step state: 0 = Input, 1 = Hidden Neuron 1, 2 = Hidden Neuron 2, 3 = Output Layer
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1500);

  const updateParam = (key, val) => {
    setParams((prev) => ({ ...prev, [key]: Number(val) }));
  };

  const applyPreset = (presetKey) => {
    switch (presetKey) {
      case 'default':
        setParams(DEFAULT_WEIGHTS);
        break;
      case 'excitatory':
        setParams({
          w11: 1.2,
          w21: 0.8,
          bh1: 0.3,
          w12: 0.9,
          w22: 1.1,
          bh2: 0.2,
          w_out1: 1.2,
          w_out2: 1.0,
          b_out: 0.2,
        });
        break;
      case 'inhibitory':
        setParams({
          w11: -0.8,
          w21: -0.5,
          bh1: -0.1,
          w12: -0.7,
          w22: -0.9,
          bh2: -0.2,
          w_out1: -0.6,
          w_out2: -0.8,
          b_out: -0.1,
        });
        break;
      case 'random':
        setParams({
          w11: Number((Math.random() * 3 - 1.5).toFixed(2)),
          w21: Number((Math.random() * 3 - 1.5).toFixed(2)),
          bh1: Number((Math.random() * 2 - 1).toFixed(2)),
          w12: Number((Math.random() * 3 - 1.5).toFixed(2)),
          w22: Number((Math.random() * 3 - 1.5).toFixed(2)),
          bh2: Number((Math.random() * 2 - 1).toFixed(2)),
          w_out1: Number((Math.random() * 3 - 1.5).toFixed(2)),
          w_out2: Number((Math.random() * 3 - 1.5).toFixed(2)),
          b_out: Number((Math.random() * 2 - 1).toFixed(2)),
        });
        break;
      case 'zeros':
        setParams({
          w11: 0,
          w21: 0,
          bh1: 0,
          w12: 0,
          w22: 0,
          bh2: 0,
          w_out1: 0,
          w_out2: 0,
          b_out: 0,
        });
        break;
      default:
        break;
    }
  };

  // Dynamic 2 -> 2 -> 1 weights formatted for forwardPass
  const weights = useMemo(
    () => [
      [
        [params.w11, params.w21],
        [params.w12, params.w22],
      ],
      [
        [params.w_out1, params.w_out2],
      ],
    ],
    [params]
  );

  const biases = useMemo(
    () => [
      [params.bh1, params.bh2],
      [params.b_out],
    ],
    [params]
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
      subtitle: 'Layer 0: Feature Input Vector x',
      layer: 'input',
      description: 'External numerical features enter the input layer. Input nodes distribute features directly without applying weights, biases, or activation functions.',
      latexFormula: '\\mathbf{x} = \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix}',
      latexSubstitution: `\\mathbf{x} = \\begin{bmatrix} ${x1.toFixed(3)} \\\\ ${x2.toFixed(3)} \\end{bmatrix}`,
      latexEvaluatedZ: `x_1 = ${x1.toFixed(3)}, \\quad x_2 = ${x2.toFixed(3)}`,
      latexActivation: '\\text{Identity distribution across forward synapses}',
    },
    {
      title: 'Step 2: Hidden Neuron h₁ Pre-Activation & Activation',
      subtitle: 'Layer 1: First Hidden Unit',
      layer: 'h1',
      description: 'Neuron h₁ computes the linear combination (weighted sum + bias) of all incoming inputs, then evaluates the non-linear activation function.',
      latexFormula: 'z_{h1} = w_{11} x_1 + w_{21} x_2 + b_{h1}',
      latexSubstitution: `z_{h1} = (${params.w11.toFixed(2)} \\cdot ${x1.toFixed(2)}) + (${params.w21.toFixed(2)} \\cdot ${x2.toFixed(2)}) + (${params.bh1.toFixed(2)})`,
      latexEvaluatedZ: `z_{h1} = ${(params.w11 * x1).toFixed(3)} + (${(params.w21 * x2).toFixed(3)}) + (${params.bh1.toFixed(2)}) = ${h1_z.toFixed(4)}`,
      latexActivation: `a_{h1} = \\text{${hiddenActivation.toUpperCase()}}(${h1_z.toFixed(4)}) = ${h1_a.toFixed(4)}`,
    },
    {
      title: 'Step 3: Hidden Neuron h₂ Pre-Activation & Activation',
      subtitle: 'Layer 1: Second Hidden Unit',
      layer: 'h2',
      description: 'Neuron h₂ independently combines the same inputs with its own dedicated weights and bias, generating a complementary feature transformation.',
      latexFormula: 'z_{h2} = w_{12} x_1 + w_{22} x_2 + b_{h2}',
      latexSubstitution: `z_{h2} = (${params.w12.toFixed(2)} \\cdot ${x1.toFixed(2)}) + (${params.w22.toFixed(2)} \\cdot ${x2.toFixed(2)}) + (${params.bh2.toFixed(2)})`,
      latexEvaluatedZ: `z_{h2} = ${(params.w12 * x1).toFixed(3)} + (${(params.w22 * x2).toFixed(3)}) + (${params.bh2.toFixed(2)}) = ${h2_z.toFixed(4)}`,
      latexActivation: `a_{h2} = \\text{${hiddenActivation.toUpperCase()}}(${h2_z.toFixed(4)}) = ${h2_a.toFixed(4)}`,
    },
    {
      title: 'Step 4: Output Layer Pre-Activation & Sigmoid Prediction',
      subtitle: 'Layer 2: Output Probability ŷ',
      layer: 'output',
      description: 'The output neuron takes activations from h₁ and h₂, computes the linear sum using output weights and bias, and applies Sigmoid to squash the output into [0, 1].',
      latexFormula: 'z_{\\text{out}} = w_{\\text{out}1} a_{h1} + w_{\\text{out}2} a_{h2} + b_{\\text{out}}',
      latexSubstitution: `z_{\\text{out}} = (${params.w_out1.toFixed(2)} \\cdot ${h1_a.toFixed(3)}) + (${params.w_out2.toFixed(2)} \\cdot ${h2_a.toFixed(3)}) + (${params.b_out.toFixed(2)})`,
      latexEvaluatedZ: `z_{\\text{out}} = ${(params.w_out1 * h1_a).toFixed(3)} + (${(params.w_out2 * h2_a).toFixed(3)}) + (${params.b_out.toFixed(2)}) = ${out_z.toFixed(4)}`,
      latexActivation: `\\hat{y} = \\sigma(z_{\\text{out}}) = \\frac{1}{1 + e^{-(${out_z.toFixed(4)})}} = ${out_a.toFixed(4)}`,
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

  // Helper for dynamic synapse visual styling
  const getSynapseStyle = (weight, stepActive) => {
    const isBlue = weight >= 0;
    const stroke = stepActive
      ? isBlue
        ? '#2563EB'
        : '#E11D48'
      : isBlue
      ? '#93C5FD'
      : '#FDA4AF';
    const strokeWidth = stepActive
      ? Math.max(2, Math.min(6, Math.abs(weight) * 3 + 1))
      : Math.max(1, Math.min(4, Math.abs(weight) * 2 + 0.5));
    return { stroke, strokeWidth };
  };

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
          Follow each numeric operation layer by layer as signals move from inputs, through hidden neurons, to the output prediction. You can adjust inputs and <strong>dynamically edit all connection weights and biases</strong> below to see their exact importance on the final output.
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

      {/* Control Panel: Switch between Inputs and Dynamic Weight Editing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Interactive Parameters"
          subtitle="Adjust inputs or manually tune connection weights & biases"
          action={
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setControlTab('inputs')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  controlTab === 'inputs'
                    ? 'bg-white text-blue-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inputs & Activation
              </button>
              <button
                onClick={() => setControlTab('weights')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  controlTab === 'weights'
                    ? 'bg-white text-blue-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3 h-3 text-blue-600" />
                <span>Edit Weights</span>
              </button>
            </div>
          }
        >
          {controlTab === 'inputs' ? (
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

              {/* Live Output Preview */}
              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-800 block">
                    Current Output Prediction
                  </span>
                  <span className="text-xs text-slate-500 font-sans">Sigmoid output probability ŷ</span>
                </div>
                <span className="font-mono text-base font-bold text-blue-950 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {out_a.toFixed(4)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {/* Presets Row */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Weight Presets
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => applyPreset('default')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium cursor-pointer"
                  >
                    Default Balanced
                  </button>
                  <button
                    onClick={() => applyPreset('excitatory')}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded text-[11px] font-medium cursor-pointer"
                  >
                    Strong Positive (+)
                  </button>
                  <button
                    onClick={() => applyPreset('inhibitory')}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded text-[11px] font-medium cursor-pointer"
                  >
                    Inhibitory (-)
                  </button>
                  <button
                    onClick={() => applyPreset('random')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium cursor-pointer"
                  >
                    Randomize
                  </button>
                </div>
              </div>

              {/* Layer 1 Weights: To h1 */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-800 block font-serif-heading">
                  Layer 1: Synapses to Hidden Neuron h₁
                </span>
                <Slider
                  label="w₁₁ (x₁ → h₁)"
                  value={params.w11}
                  min={-2}
                  max={2}
                  step={0.05}
                  onChange={(v) => updateParam('w11', v)}
                />
                <Slider
                  label="w₂₁ (x₂ → h₁)"
                  value={params.w21}
                  min={-2}
                  max={2}
                  step={0.05}
                  onChange={(v) => updateParam('w21', v)}
                />
                <Slider
                  label="b_h1 (Bias h₁)"
                  value={params.bh1}
                  min={-1}
                  max={1}
                  step={0.05}
                  onChange={(v) => updateParam('bh1', v)}
                />
              </div>

              {/* Layer 1 Weights: To h2 */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-800 block font-serif-heading">
                  Layer 1: Synapses to Hidden Neuron h₂
                </span>
                <Slider
                  label="w₁₂ (x₁ → h₂)"
                  value={params.w12}
                  min={-2}
                  max={2}
                  step={0.05}
                  onChange={(v) => updateParam('w12', v)}
                />
                <Slider
                  label="w₂₂ (x₂ → h₂)"
                  value={params.w22}
                  min={-2}
                  max={2}
                  step={0.05}
                  onChange={(v) => updateParam('w22', v)}
                />
                <Slider
                  label="b_h2 (Bias h₂)"
                  value={params.bh2}
                  min={-1}
                  max={1}
                  step={0.05}
                  onChange={(v) => updateParam('bh2', v)}
                />
              </div>

              {/* Layer 2 Weights: To Output */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-800 block font-serif-heading">
                  Layer 2: Synapses to Output Neuron ŷ
                </span>
                <Slider
                  label="w_out1 (h₁ → ŷ)"
                  value={params.w_out1}
                  min={-2}
                  max={2}
                  step={0.05}
                  onChange={(v) => updateParam('w_out1', v)}
                />
                <Slider
                  label="w_out2 (h₂ → ŷ)"
                  value={params.w_out2}
                  min={-2}
                  max={2}
                  step={0.05}
                  onChange={(v) => updateParam('w_out2', v)}
                />
                <Slider
                  label="b_out (Bias ŷ)"
                  value={params.b_out}
                  min={-1}
                  max={1}
                  step={0.05}
                  onChange={(v) => updateParam('b_out', v)}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Step Navigation Controls Card */}
        <div className="lg:col-span-2">
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
                  Step {activeStep + 1} of {steps.length}
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
        {/* Left: SVG Diagram Highlighting Active Step and Dynamic Weights */}
        <Card
          title="Active Signal Propagation & Dynamic Weights"
          subtitle="Connection thickness and colors dynamically reflect your weight values"
          badge={
            <Badge variant="navy">
              ŷ = {out_a.toFixed(4)}
            </Badge>
          }
        >
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
            {(() => {
              const s1 = getSynapseStyle(params.w11, activeStep === 1);
              return (
                <>
                  <line
                    x1="86"
                    y1="85"
                    x2="210"
                    y2="85"
                    stroke={s1.stroke}
                    strokeWidth={s1.strokeWidth}
                  />
                  <text x="145" y="80" textAnchor="middle" className="text-[9px] font-mono fill-slate-700 bg-white font-semibold">
                    w₁₁={params.w11 > 0 ? `+${params.w11.toFixed(2)}` : params.w11.toFixed(2)}
                  </text>
                </>
              );
            })()}

            {(() => {
              const s2 = getSynapseStyle(params.w21, activeStep === 1);
              return (
                <>
                  <line
                    x1="86"
                    y1="175"
                    x2="210"
                    y2="85"
                    stroke={s2.stroke}
                    strokeWidth={s2.strokeWidth}
                  />
                  <text x="135" y="125" textAnchor="middle" className="text-[9px] font-mono fill-slate-700 font-semibold">
                    w₂₁={params.w21 > 0 ? `+${params.w21.toFixed(2)}` : params.w21.toFixed(2)}
                  </text>
                </>
              );
            })()}

            {/* Synapses to h2 */}
            {(() => {
              const s3 = getSynapseStyle(params.w12, activeStep === 2);
              return (
                <>
                  <line
                    x1="86"
                    y1="85"
                    x2="210"
                    y2="175"
                    stroke={s3.stroke}
                    strokeWidth={s3.strokeWidth}
                  />
                  <text x="135" y="145" textAnchor="middle" className="text-[9px] font-mono fill-slate-700 font-semibold">
                    w₁₂={params.w12 > 0 ? `+${params.w12.toFixed(2)}` : params.w12.toFixed(2)}
                  </text>
                </>
              );
            })()}

            {(() => {
              const s4 = getSynapseStyle(params.w22, activeStep === 2);
              return (
                <>
                  <line
                    x1="86"
                    y1="175"
                    x2="210"
                    y2="175"
                    stroke={s4.stroke}
                    strokeWidth={s4.strokeWidth}
                  />
                  <text x="145" y="195" textAnchor="middle" className="text-[9px] font-mono fill-slate-700 font-semibold">
                    w₂₂={params.w22 > 0 ? `+${params.w22.toFixed(2)}` : params.w22.toFixed(2)}
                  </text>
                </>
              );
            })()}

            {/* Synapses to Output */}
            {(() => {
              const sOut1 = getSynapseStyle(params.w_out1, activeStep === 3);
              return (
                <>
                  <line
                    x1="250"
                    y1="85"
                    x2="370"
                    y2="130"
                    stroke={sOut1.stroke}
                    strokeWidth={sOut1.strokeWidth}
                  />
                  <text x="305" y="100" textAnchor="middle" className="text-[9px] font-mono fill-slate-700 font-semibold">
                    w_o1={params.w_out1 > 0 ? `+${params.w_out1.toFixed(2)}` : params.w_out1.toFixed(2)}
                  </text>
                </>
              );
            })()}

            {(() => {
              const sOut2 = getSynapseStyle(params.w_out2, activeStep === 3);
              return (
                <>
                  <line
                    x1="250"
                    y1="175"
                    x2="370"
                    y2="130"
                    stroke={sOut2.stroke}
                    strokeWidth={sOut2.strokeWidth}
                  />
                  <text x="305" y="165" textAnchor="middle" className="text-[9px] font-mono fill-slate-700 font-semibold">
                    w_o2={params.w_out2 > 0 ? `+${params.w_out2.toFixed(2)}` : params.w_out2.toFixed(2)}
                  </text>
                </>
              );
            })()}

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

        {/* Right: Textbook-Grade Mathematical Equations (KaTeX) */}
        <Card
          title={currentStepData.title}
          subtitle={currentStepData.subtitle}
          badge={<Badge variant="navy">Textbook LaTeX Math</Badge>}
        >
          <div className="space-y-4 text-xs">
            {activeStep === 0 ? (
              <div className="space-y-3 p-4 bg-slate-50/80 border border-slate-200/90 rounded-xl">
                <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px]">
                  1. Input Vector Specification
                </span>
                <MathView math={currentStepData.latexFormula} display={true} />
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    2. Feature Magnitudes
                  </span>
                  <MathView math={currentStepData.latexSubstitution} display={true} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* 1. Mathematical Formula */}
                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    1. Mathematical Expression (Textbook Standard)
                  </span>
                  <div className="p-3 bg-slate-50/90 border border-slate-200/90 rounded-xl shadow-2xs">
                    <MathView math={currentStepData.latexFormula} display={true} />
                  </div>
                </div>

                {/* 2. Value Substitution */}
                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    2. Numeric Parameter Substitution
                  </span>
                  <div className="p-3 bg-slate-50/90 border border-slate-200/90 rounded-xl shadow-2xs">
                    <MathView math={currentStepData.latexSubstitution} display={true} />
                  </div>
                </div>

                {/* 3. Weighted Sum */}
                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    3. Linear Pre-Activation Sum (z)
                  </span>
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl shadow-2xs text-indigo-950 font-semibold">
                    <MathView math={currentStepData.latexEvaluatedZ} display={true} />
                  </div>
                </div>

                {/* 4. Activation Result */}
                <div>
                  <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">
                    4. Post-Activation State (a)
                  </span>
                  <div className="p-3 bg-emerald-50/80 border border-emerald-300/80 rounded-xl shadow-2xs text-emerald-950 font-semibold">
                    <MathView math={currentStepData.latexActivation} display={true} />
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
        what="Forward propagation is the algebraic calculation process that maps network inputs to intermediate activations and final outputs layer by layer."
        why="It computes the model's actual prediction for a given set of inputs without mutating any parameters. The resulting prediction is then compared to target y to compute loss."
        how="For each layer l: z = W[l] · a[l-1] + b[l], followed by a[l] = activation(z). All intermediate z and a vectors are stored in memory for reuse by backpropagation."
        interactionEffect="Modifying any weight, bias, or input instantly recalculates the entire algebraic chain down to the exact output prediction ŷ."
      />
    </div>
  );
}
