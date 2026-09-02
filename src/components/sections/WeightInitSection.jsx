import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Metric } from '../common/Metric.jsx';
import { ExplanationCard } from '../common/ExplanationCard.jsx';
import { initNetwork, INIT_STRATEGIES } from '../../nn/network.js';
import { trainOneEpoch, evaluateDataset } from '../../nn/training.js';
import { XOR_DATA } from '../../nn/datasets.js';
import {
  RotateCcw,
  Play,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Sliders,
} from 'lucide-react';

export function WeightInitSection() {
  const [selectedStrategy, setSelectedStrategy] = useState('xavier');
  const [seed, setSeed] = useState(1);
  const [epochsTrained, setEpochsTrained] = useState(0);

  // Layer sizes for demonstration: 2 inputs, 3 hidden neurons, 1 output
  const layerSizes = useMemo(() => [2, 3, 1], []);

  // Initial network state (saved copy)
  const initialNet = useMemo(() => {
    return initNetwork(layerSizes, selectedStrategy);
  }, [selectedStrategy, layerSizes, seed]);

  // Current network state (mutated by training)
  const [currentNet, setCurrentNet] = useState(() => initialNet);

  // Sync currentNet when initialNet resets
  useMemo(() => {
    setCurrentNet(initialNet);
    setEpochsTrained(0);
  }, [initialNet]);

  // Evaluate before and current
  const initialEval = useMemo(() => {
    return evaluateDataset(initialNet.weights, initialNet.biases, ['relu'], XOR_DATA);
  }, [initialNet]);

  const currentEval = useMemo(() => {
    return evaluateDataset(currentNet.weights, currentNet.biases, ['relu'], XOR_DATA);
  }, [currentNet]);

  // Train a batch of epochs
  const handleTrainStep = (steps = 50) => {
    let w = currentNet.weights;
    let b = currentNet.biases;
    for (let i = 0; i < steps; i++) {
      const step = trainOneEpoch(w, b, ['relu'], 0.4, XOR_DATA);
      w = step.weights;
      b = step.biases;
    }
    setCurrentNet({ weights: w, biases: b, strategy: selectedStrategy });
    setEpochsTrained((e) => e + steps);
  };

  const handleReset = () => {
    setSeed((s) => s + 1);
  };

  const strategyConfig = INIT_STRATEGIES[selectedStrategy] || INIT_STRATEGIES.xavier;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="unit2">Unit II: Topic 2</Badge>
          <span className="text-xs text-slate-500">Weight Initialization & Symmetry Breaking</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Weight Initialization Laboratory
        </h2>
        <p className="text-slate-600 text-sm">
          Explore how initial connection weights determine training dynamics, convergence speed, and prevent the symmetry problem.
        </p>
      </div>

      {/* Strategy Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(INIT_STRATEGIES).map(([key, item]) => {
          const isSelected = selectedStrategy === key;
          const isZero = key === 'zeros';
          return (
            <button
              key={key}
              onClick={() => setSelectedStrategy(key)}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? isZero
                    ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900">{item.label}</span>
                {isSelected && (
                  <span
                    className={`w-2 h-2 rounded-full ${isZero ? 'bg-amber-500' : 'bg-blue-600'}`}
                  ></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Symmetry Warning Alert if Zero Initialization is Selected */}
      {selectedStrategy === 'zeros' && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">The Symmetry Problem Demonstration:</span>
            <p className="leading-relaxed">
              When all weights and biases are initialized to 0, every hidden neuron receives the exact same input, computes the exact same pre-activation (z = 0), and produces identical activations. During backpropagation, every hidden neuron receives the exact same gradient. Consequently, they update identically and remain identical forever! The network completely fails to learn non-linear patterns like XOR.
            </p>
          </div>
        </div>
      )}

      {/* Main Interactive Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Parameter Matrices */}
        <div className="space-y-4">
          <Card
            title="Initial Weight Matrices (W)"
            subtitle={`Strategy: ${strategyConfig.label}`}
            action={
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-sample</span>
              </button>
            }
          >
            <div className="space-y-4 text-xs font-mono">
              {/* Layer 1: Input (2) -> Hidden (3) */}
              <div>
                <div className="text-slate-500 font-sans font-semibold mb-1 text-[11px] uppercase tracking-wider">
                  W₁: Layer 1 Weights [3 x 2]
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                  {currentNet.weights[0].map((row, rIdx) => (
                    <div key={rIdx} className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400 font-sans text-[10px]">h{rIdx + 1}:</span>
                      <div className="flex gap-2">
                        {row.map((w, cIdx) => (
                          <span
                            key={cIdx}
                            className={`w-14 text-right font-medium ${
                              w > 0 ? 'text-blue-700' : w < 0 ? 'text-red-600' : 'text-slate-500'
                            }`}
                          >
                            {w.toFixed(4)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 2: Hidden (3) -> Output (1) */}
              <div>
                <div className="text-slate-500 font-sans font-semibold mb-1 text-[11px] uppercase tracking-wider">
                  W₂: Layer 2 Weights [1 x 3]
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                  {currentNet.weights[1].map((row, rIdx) => (
                    <div key={rIdx} className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400 font-sans text-[10px]">out:</span>
                      <div className="flex gap-2">
                        {row.map((w, cIdx) => (
                          <span
                            key={cIdx}
                            className={`w-14 text-right font-medium ${
                              w > 0 ? 'text-blue-700' : w < 0 ? 'text-red-600' : 'text-slate-500'
                            }`}
                          >
                            {w.toFixed(4)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Experiment Control Card */}
          <Card
            title="Training Dynamics Test"
            subtitle="Train on XOR dataset to observe parameter changes"
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleTrainStep(50)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Train +50 Epochs</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium border border-slate-200 cursor-pointer transition-colors"
                >
                  <span>Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <Metric label="Epochs Trained" value={epochsTrained} subtext="Gradient updates" />
                <Metric
                  label="Current Loss"
                  value={currentEval.avgLoss.toFixed(4)}
                  subtext={epochsTrained > 0 ? `Initial: ${initialEval.avgLoss.toFixed(3)}` : 'Pre-training'}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Columns: Comparison Before Training vs Current */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Pre-Training vs Post-Training Predictions on XOR"
            subtitle="Demonstrates how weight initialization dictates the starting hypothesis"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pre-Training Card */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Before Training (Initial)
                  </span>
                  <Badge variant="default">Loss: {initialEval.avgLoss.toFixed(4)}</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Initial output distribution before backpropagation adjusts weights.
                </p>

                <div className="space-y-2 text-xs font-mono">
                  {initialEval.results.map((r, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 bg-white rounded border border-slate-200"
                    >
                      <span className="text-slate-600">[{r.input.join(', ')}] → y={r.label}</span>
                      <span className="font-bold text-blue-900">ŷ = {r.rawOutput.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Post-Training Card */}
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-blue-900">
                    After {epochsTrained} Epochs
                  </span>
                  <Badge variant={epochsTrained > 0 ? 'success' : 'default'}>
                    Loss: {currentEval.avgLoss.toFixed(4)}
                  </Badge>
                </div>
                <p className="text-xs text-blue-950 mb-3">
                  Updated model predictions after gradient descent iterations.
                </p>

                <div className="space-y-2 text-xs font-mono">
                  {currentEval.results.map((r, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center p-2 rounded border ${
                        r.isCorrect
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <span className="text-slate-700">[{r.input.join(', ')}] → y={r.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-900">ŷ = {r.rawOutput.toFixed(4)}</span>
                        {r.isCorrect ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="text-[10px] text-amber-600 font-sans font-medium">wrong</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Academic Comparative Analysis Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Xavier / Glorot Strategy:</span>
              <p className="text-slate-600 leading-relaxed mb-2">
                Designed by Xavier Glorot & Yoshua Bengio (2010). Samples from a uniform distribution scaled by <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-800">±√(6 / (n_in + n_out))</code>.
              </p>
              <span className="text-[11px] font-medium text-blue-700 block">
                Best suited for: Sigmoid and Tanh activations.
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">He / Kaiming Strategy:</span>
              <p className="text-slate-600 leading-relaxed mb-2">
                Designed by Kaiming He et al. (2015). Scales variance by <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-800">√(2 / n_in)</code> to account for the fact that ReLU zeroes out half the activations.
              </p>
              <span className="text-[11px] font-medium text-emerald-700 block">
                Best suited for: Deep ReLU networks.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Card */}
      <ExplanationCard
        title="Weight Initialization Syllabus Summary"
        syllabusTopic="Unit II: 2. Weight initialization"
        what="Weight initialization is the algorithm used to set the starting numerical parameters (W and b) of a neural network before training commences."
        why="Proper initialization prevents activations and gradients from exponentially exploding or vanishing to zero across layers. It also breaks symmetry between hidden units."
        how="Variance scaling methods (Xavier and He) calculate the number of incoming connections (fan_in) and outgoing connections (fan_out) and scale standard deviation so variance remains constant layer to layer."
        interactionEffect="Switching to 'Zero Initialization' demonstrates the complete breakdown of backpropagation symmetry, whereas Xavier converges rapidly."
      />
    </div>
  );
}
