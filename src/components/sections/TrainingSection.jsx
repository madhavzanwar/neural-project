import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Metric } from '../common/Metric.jsx';
import { ExplanationCard } from '../common/ExplanationCard.jsx';
import { DATASETS } from '../../nn/datasets.js';
import { initNetwork, computeDecisionBoundary } from '../../nn/network.js';
import { trainOneEpoch, evaluateDataset } from '../../nn/training.js';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Activity,
  Layers,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
} from 'lucide-react';

export function TrainingSection() {
  // Configuration state
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('xor');
  const [hiddenSize, setHiddenSize] = useState(4);
  const [activationType, setActivationType] = useState('relu');
  const [learningRate, setLearningRate] = useState(0.3);

  // Training execution state
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState([]); // [{ epoch, loss }]

  // Network weights & biases
  const [network, setNetwork] = useState(() => initNetwork([2, 4, 1], 'xavier'));

  const datasetConfig = DATASETS[selectedDatasetKey];
  const currentDataset = useMemo(() => datasetConfig.getData(), [selectedDatasetKey]);

  // Canvas ref for decision boundary drawing
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Re-initialize network when dataset or architecture changes
  const resetNetwork = () => {
    setIsTraining(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const newNet = initNetwork([2, hiddenSize, 1], 'xavier');
    setNetwork(newNet);
    setEpoch(0);

    // Initial evaluation
    const initialEval = evaluateDataset(newNet.weights, newNet.biases, [activationType], currentDataset);
    setLossHistory([{ epoch: 0, loss: Number(initialEval.avgLoss.toFixed(5)) }]);
  };

  useEffect(() => {
    resetNetwork();
  }, [selectedDatasetKey, hiddenSize, activationType]);

  // Current evaluation on dataset
  const currentEval = useMemo(() => {
    return evaluateDataset(network.weights, network.biases, [activationType], currentDataset);
  }, [network, activationType, currentDataset]);

  // Train one step
  const stepTraining = (stepCount = 1) => {
    let currentW = network.weights;
    let currentB = network.biases;
    let lastLoss = 0;
    let newEpoch = epoch;

    for (let i = 0; i < stepCount; i++) {
      const result = trainOneEpoch(currentW, currentB, [activationType], learningRate, currentDataset);
      currentW = result.weights;
      currentB = result.biases;
      lastLoss = result.loss;
      newEpoch++;
    }

    setNetwork({ weights: currentW, biases: currentB });
    setEpoch(newEpoch);

    setLossHistory((prev) => {
      const next = [...prev, { epoch: newEpoch, loss: Number(lastLoss.toFixed(5)) }];
      // Cap history to last 150 points for smooth charting
      return next.length > 150 ? next.slice(-150) : next;
    });
  };

  // Continuous training loop
  useEffect(() => {
    if (!isTraining) return;

    let localW = network.weights;
    let localB = network.biases;
    let localEpoch = epoch;
    let frameId;

    const loop = () => {
      // Run 5 epochs per animation frame for responsive training speed
      let lastLoss = 0;
      for (let i = 0; i < 5; i++) {
        const step = trainOneEpoch(localW, localB, [activationType], learningRate, currentDataset);
        localW = step.weights;
        localB = step.biases;
        lastLoss = step.loss;
        localEpoch++;
      }

      setNetwork({ weights: localW, biases: localB });
      setEpoch(localEpoch);

      setLossHistory((prev) => {
        const next = [...prev, { epoch: localEpoch, loss: Number(lastLoss.toFixed(5)) }];
        return next.length > 150 ? next.slice(-150) : next;
      });

      // Stop automatically if loss becomes very low (convergence)
      if (lastLoss < 0.005) {
        setIsTraining(false);
        return;
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    animationRef.current = frameId;

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isTraining, learningRate, activationType, currentDataset]);

  // Draw Decision Boundary on 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const gridSize = 32;
    const grid = computeDecisionBoundary(network.weights, network.biases, [activationType], gridSize);

    const cellW = width / gridSize;
    const cellH = height / gridSize;

    // Draw grid pixels
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const prob = grid[r][c]; // 0.0 to 1.0
        // Interpolate between light red (Class 0) and light blue (Class 1)
        const red = Math.round(240 * (1 - prob) + 219 * prob);
        const green = Math.round(230 * (1 - prob) + 234 * prob);
        const blue = Math.round(230 * (1 - prob) + 254 * prob);

        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
      }
    }

    // Draw decision contour threshold line (0.5)
    // Draw data points on top
    for (const pt of currentDataset) {
      const [x1, x2] = pt.input;
      const px = x1 * width;
      const py = (1 - x2) * height; // Invert y-axis to match Cartesian convention

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = pt.label === 1 ? '#1D4ED8' : '#DC2626';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Label inside point
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(pt.label), px, py);
    }
  }, [network, activationType, currentDataset]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="unit2">Unit II: Topic 1, 3 & 4</Badge>
          <span className="text-xs text-slate-500">Loss Functions, Optimization & Backpropagation</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Training & Backpropagation Workbench
        </h2>
        <p className="text-slate-600 text-sm">
          Observe real mathematical backpropagation in action. The network computes genuine predictions, measures Binary Cross-Entropy loss, and propagates error gradients backward to adjust weights.
        </p>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Metric
          label="Training Epochs"
          value={epoch}
          subtext="Full-batch passes"
          icon={Activity}
        />
        <Metric
          label="Current BCE Loss"
          value={currentEval.avgLoss.toFixed(4)}
          subtext="Binary Cross-Entropy"
          icon={Flame}
        />
        <Metric
          label="Real Accuracy"
          value={`${currentEval.accuracy.toFixed(1)}%`}
          subtext={`${currentEval.correctCount} / ${currentEval.totalCount} samples correct`}
          icon={CheckCircle2}
        />
        <Metric
          label="Learning Rate (η)"
          value={learningRate.toFixed(2)}
          subtext="Gradient update step size"
          icon={Sliders}
        />
      </div>

      {/* Control Panel */}
      <Card
        title="Training Controls & Hyperparameters"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold text-xs cursor-pointer transition-colors shadow-xs ${
                isTraining
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isTraining ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTraining ? 'Pause Training' : 'Train Network'}</span>
            </button>

            <button
              disabled={isTraining}
              onClick={() => stepTraining(1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>+1 Epoch</span>
            </button>

            <button
              onClick={resetNetwork}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {/* Dataset Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Target Dataset:
            </label>
            <select
              value={selectedDatasetKey}
              onChange={(e) => setSelectedDatasetKey(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 cursor-pointer"
            >
              <option value="xor">XOR Problem (Non-linear)</option>
              <option value="and">AND Gate (Linearly Separable)</option>
              <option value="or">OR Gate (Linearly Separable)</option>
              <option value="circles">Concentric Circles (Radial)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {datasetConfig.separable ? 'Solvable by single layer' : 'Requires hidden non-linear layer'}
            </span>
          </div>

          {/* Learning Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Learning Rate (η):
              </label>
              <span className="font-mono font-bold text-blue-900">{learningRate.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.05 (Slow)</span>
              <span>0.50</span>
              <span>1.00 (Fast)</span>
            </div>
          </div>

          {/* Hidden Neurons */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Hidden Neurons:
              </label>
              <span className="font-mono font-bold text-blue-900">{hiddenSize}</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              value={hiddenSize}
              onChange={(e) => setHiddenSize(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
          </div>

          {/* Hidden Activation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Hidden Activation:
            </label>
            <select
              value={activationType}
              onChange={(e) => setActivationType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 cursor-pointer"
            >
              <option value="relu">ReLU (Standard)</option>
              <option value="tanh">Tanh (Zero-centered)</option>
              <option value="sigmoid">Sigmoid</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">Output layer always uses Sigmoid</span>
          </div>
        </div>
      </Card>

      {/* Visualizations: Real Loss Curve + 2D Decision Boundary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Loss vs Epoch Chart */}
        <Card
          title="Training Loss vs Epoch"
          subtitle="Real computed Binary Cross-Entropy loss curve over time"
          badge={<Badge variant="unit2">Real Computed Data</Badge>}
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="epoch"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 'auto']}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Loss', angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val) => [Number(val).toFixed(5), 'BCE Loss']}
                  labelFormatter={(lab) => `Epoch ${lab}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 text-center">
            Notice how loss drops as backpropagation adjusts weights along the negative gradient.
          </div>
        </Card>

        {/* 2D Decision Boundary Map */}
        <Card
          title="Learned 2D Decision Boundary"
          subtitle="Real-time forward pass grid over [0, 1]² domain"
          badge={<Badge variant="primary">Classification Field</Badge>}
        >
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={260}
              height={260}
              className="rounded-lg border border-slate-300 shadow-xs"
            />
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span>Class 0 Points</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-700"></span>
                <span>Class 1 Points</span>
              </span>
              <span className="text-[11px] text-slate-400 italic">
                Shading represents output probability ŷ
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card
        title="Live Sample Predictions & Error Analysis"
        subtitle="Genuine per-sample outputs, target comparison, and sample BCE loss"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Input [x₁, x₂]</th>
                <th className="py-2.5 px-3">Target (y)</th>
                <th className="py-2.5 px-3">Model Output (ŷ)</th>
                <th className="py-2.5 px-3">Predicted Class</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Sample Loss</th>
                <th className="py-2.5 px-3">Classification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentEval.results.map((r, idx) => (
                <tr key={idx} className={r.isCorrect ? 'bg-white' : 'bg-rose-50/40'}>
                  <td className="py-2 px-3 font-mono font-medium text-slate-800">
                    [{r.input[0].toFixed(2)}, {r.input[1].toFixed(2)}]
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">{r.label}</td>
                  <td className="py-2 px-3 font-mono text-blue-900 font-semibold">{r.rawOutput.toFixed(4)}</td>
                  <td className="py-2 px-3 font-mono">{r.predictedClass}</td>
                  <td className="py-2 px-3 font-mono text-slate-600">{r.confidence.toFixed(1)}%</td>
                  <td className="py-2 px-3 font-mono text-slate-600">{r.sampleLoss.toFixed(4)}</td>
                  <td className="py-2 px-3">
                    {r.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Misclassified</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Backpropagation Step-by-Step Mathematical Explanation */}
      <Card
        title="The 5 Steps of the Backpropagation Algorithm"
        subtitle="Syllabus Unit II: 4. Backpropagation algorithm derivation summary"
        badge={<Badge variant="unit2">Algorithm Core</Badge>}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="font-bold text-blue-900 block mb-1">1. Forward Pass</span>
            <p className="text-slate-600">
              Compute z = W·a + b and activation a = f(z) for all layers to produce prediction ŷ.
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="font-bold text-blue-900 block mb-1">2. Loss Calculation</span>
            <p className="text-slate-600">
              Compute Binary Cross-Entropy: L = -[y·log(ŷ) + (1-y)·log(1-ŷ)] between prediction and target.
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="font-bold text-blue-900 block mb-1">3. Output Error (δᴸ)</span>
            <p className="text-slate-600">
              Compute output error signal: δᴸ = ŷ - y (simplification of BCE derivative with Sigmoid).
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="font-bold text-blue-900 block mb-1">4. Hidden Errors (δˡ)</span>
            <p className="text-slate-600">
              Propagate error backward: δˡ = (Wˡ⁺¹ᵀ · δˡ⁺¹) ⊙ f'(zˡ) using the calculus Chain Rule.
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="font-bold text-blue-900 block mb-1">5. Weight Update</span>
            <p className="text-slate-600">
              Update weights along negative gradient: W ← W - η · (δ · aᵀ) using learning rate η.
            </p>
          </div>
        </div>
      </Card>

      {/* Syllabus Card */}
      <ExplanationCard
        title="Training & Optimization Explanation"
        syllabusTopic="Unit II: 3. Optimization algorithms & 4. Backpropagation"
        what="Backpropagation is the supervised learning algorithm that computes the partial derivative (gradient) of the loss function with respect to every weight and bias in the network."
        why="Without backpropagation, optimizing thousands of parameters would be intractable. Backpropagation computes exact analytical gradients in a single backward sweep."
        how="It applies the chain rule of calculus starting from the output error and distributes credit/blame for errors backward through hidden layers."
        interactionEffect="Adjusting the learning rate alters how aggressively weights jump in parameter space. High learning rates may oscillate; low learning rates converge slowly."
      />
    </div>
  );
}
