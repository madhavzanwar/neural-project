import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Metric } from '../common/Metric.jsx';
import { Slider } from '../common/Slider.jsx';
import { MathView } from '../common/MathView.jsx';
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
  Flame,
  CheckCircle2,
  XCircle,
  Sliders,
  TrendingDown,
  Edit3,
  SlidersHorizontal,
} from 'lucide-react';

const CustomLossTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl p-3 text-xs min-w-[160px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Training Epoch
        </span>
        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
          Epoch {label}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-600 font-medium">BCE Loss</span>
        <span className="font-mono font-bold text-slate-900">
          {Number(payload[0].value).toFixed(5)}
        </span>
      </div>
    </div>
  );
};

export function TrainingSection() {
  // Configuration state
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('xor');
  const [hiddenSize, setHiddenSize] = useState(4);
  const [activationType, setActivationType] = useState('relu');
  const [learningRate, setLearningRate] = useState(0.3);

  // Manual parameter tuning panel toggle
  const [showManualTuning, setShowManualTuning] = useState(false);

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
  const isTrainingRef = useRef(false);
  isTrainingRef.current = isTraining;

  // Re-initialize network when dataset or architecture changes
  const resetNetwork = () => {
    setIsTraining(false);
    isTrainingRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
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

  // Manual weight / bias update handlers
  const handleUpdateWeight = (lIdx, rIdx, cIdx, val) => {
    setIsTraining(false);
    isTrainingRef.current = false;
    setNetwork((prev) => {
      const newW = prev.weights.map((layer, l_i) =>
        l_i === lIdx
          ? layer.map((row, r_i) =>
              r_i === rIdx
                ? row.map((w, c_i) => (c_i === cIdx ? Number(val) : w))
                : [...row]
            )
          : [...layer]
      );
      return { ...prev, weights: newW };
    });
  };

  const handleUpdateBias = (lIdx, nIdx, val) => {
    setIsTraining(false);
    isTrainingRef.current = false;
    setNetwork((prev) => {
      const newB = prev.biases.map((bLayer, l_i) =>
        l_i === lIdx
          ? bLayer.map((b, n_i) => (n_i === nIdx ? Number(val) : b))
          : [...bLayer]
      );
      return { ...prev, biases: newB };
    });
  };

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
      return next.length > 150 ? next.slice(-150) : next;
    });
  };

  // Continuous training loop
  useEffect(() => {
    if (!isTraining) return;

    let localW = network.weights;
    let localB = network.biases;
    let localEpoch = epoch;

    const loop = () => {
      if (!isTrainingRef.current) return;

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
        isTrainingRef.current = false;
        return;
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isTraining, learningRate, activationType, currentDataset]);

  // Draw Decision Boundary on 2D Canvas with retina scaling & diverging color map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const displaySize = 280;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    const gridSize = 35;
    const grid = computeDecisionBoundary(network.weights, network.biases, [activationType], gridSize);

    const cellW = displaySize / gridSize;
    const cellH = displaySize / gridSize;

    // Draw diverging grid cells
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const prob = grid[r][c]; // 0.0 to 1.0

        // Diverging colormap:
        // prob < 0.5: Coral/Rose (#F43F5E) -> White (#FFFFFF)
        // prob >= 0.5: White (#FFFFFF) -> Royal Blue (#3B82F6)
        let red, green, blue;
        if (prob < 0.5) {
          const t = prob * 2; // 0 to 1
          red = Math.round(244 + (255 - 244) * t);
          green = Math.round(63 + (255 - 63) * t);
          blue = Math.round(94 + (255 - 94) * t);
        } else {
          const t = (prob - 0.5) * 2; // 0 to 1
          red = Math.round(255 + (59 - 255) * t);
          green = Math.round(255 + (130 - 255) * t);
          blue = Math.round(255 + (246 - 255) * t);
        }

        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(c * cellW, r * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // Draw decision contour (where probability crosses 0.5)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    for (let r = 0; r < gridSize - 1; r++) {
      for (let c = 0; c < gridSize - 1; c++) {
        const p1 = grid[r][c];
        const p2 = grid[r][c + 1];
        const p3 = grid[r + 1][c];
        if ((p1 < 0.5 && p2 >= 0.5) || (p1 >= 0.5 && p2 < 0.5)) {
          ctx.beginPath();
          ctx.moveTo((c + 0.5) * cellW, r * cellH);
          ctx.lineTo((c + 0.5) * cellW, (r + 1) * cellH);
          ctx.stroke();
        }
        if ((p1 < 0.5 && p3 >= 0.5) || (p1 >= 0.5 && p3 < 0.5)) {
          ctx.beginPath();
          ctx.moveTo(c * cellW, (r + 0.5) * cellH);
          ctx.lineTo((c + 1) * cellW, (r + 0.5) * cellH);
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]); // Reset dash

    // Draw training sample points
    for (const pt of currentDataset) {
      const [x1, x2] = pt.input;
      const px = x1 * displaySize;
      const py = (1 - x2) * displaySize; // Invert y-axis for Cartesian convention

      // Subtle shadow
      ctx.beginPath();
      ctx.arc(px, py + 1.5, 7.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fill();

      // Outer white ring
      ctx.beginPath();
      ctx.arc(px, py, 7.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Colored core
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = pt.label === 1 ? '#2563EB' : '#E11D48';
      ctx.fill();

      // Label text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(pt.label), px, py + 0.5);
    }

    ctx.restore();
  }, [network, activationType, currentDataset]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="unit2">Unit II: Topic 1, 3 & 4</Badge>
          <span className="text-xs text-slate-500 font-medium">Loss Functions, Optimization & Backpropagation</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Training & Backpropagation Workbench
        </h2>
        <p className="text-slate-600 text-sm">
          Observe real mathematical backpropagation in action. The network computes genuine predictions, measures Binary Cross-Entropy loss, and propagates error gradients backward to adjust weights. You can train with gradient descent or <strong>manually tune any weight slider</strong> to observe real-time decision boundary morphing.
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
        badge={
          currentEval.avgLoss < 0.02 && currentEval.accuracy === 100 ? (
            <Badge variant="success">Converged (100% Acc)</Badge>
          ) : epoch > 0 ? (
            <Badge variant="unit2">Epoch {epoch}</Badge>
          ) : (
            <Badge variant="default">Ready</Badge>
          )
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs cursor-pointer transition-all shadow-xs active:scale-[0.98] ${
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 cursor-pointer transition-colors active:scale-[0.98]"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>+1 Epoch</span>
            </button>

            <button
              disabled={isTraining}
              onClick={() => stepTraining(10)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 cursor-pointer transition-colors active:scale-[0.98]"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>+10 Epochs</span>
            </button>

            <button
              onClick={() => setShowManualTuning(!showManualTuning)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer active:scale-[0.98] ${
                showManualTuning
                  ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>{showManualTuning ? 'Hide Weight Tuning' : 'Tune Weights Manually'}</span>
            </button>

            <button
              onClick={resetNetwork}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer transition-colors active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 text-xs">
          {/* Dataset Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Target Dataset:
            </label>
            <select
              value={selectedDatasetKey}
              onChange={(e) => setSelectedDatasetKey(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="xor">XOR Problem (Non-linear)</option>
              <option value="and">AND Gate (Linearly Separable)</option>
              <option value="or">OR Gate (Linearly Separable)</option>
              <option value="circles">Concentric Circles (Radial)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1.5 block">
              {datasetConfig.separable ? 'Linearly separable (single layer can solve)' : 'Non-linear (requires hidden layer)'}
            </span>
          </div>

          {/* Learning Rate Slider */}
          <div>
            <Slider
              label="Learning Rate (η)"
              value={learningRate}
              min={0.05}
              max={1.0}
              step={0.05}
              onChange={setLearningRate}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.05 (Slow)</span>
              <span>1.00 (Fast)</span>
            </div>
          </div>

          {/* Hidden Neurons */}
          <div>
            <Slider
              label="Hidden Neurons"
              value={hiddenSize}
              min={2}
              max={6}
              step={1}
              onChange={setHiddenSize}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>2</span>
              <span>4</span>
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
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="relu">ReLU (Standard)</option>
              <option value="tanh">Tanh (Zero-centered)</option>
              <option value="sigmoid">Sigmoid</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1.5 block">Output layer always uses Sigmoid</span>
          </div>
        </div>

        {/* Dynamic Manual Parameter Tuning Drawer */}
        {showManualTuning && (
          <div className="mt-5 pt-4 border-t border-slate-200 bg-slate-50/70 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 font-serif-heading block">
                  Manual Weight & Bias Tuning Panel
                </span>
                <span className="text-xs text-slate-500">
                  Drag any slider below to manually perturb parameters and observe real-time decision boundary morphing.
                </span>
              </div>
              <Badge variant="navy">Real-time Canvas Update</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Layer 1 Weights & Biases */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
                <span className="font-bold text-xs text-blue-900 block uppercase tracking-wider">
                  Layer 1: Input (2) → Hidden ({hiddenSize})
                </span>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {network.weights[0].map((row, hIdx) => (
                    <div key={hIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <span className="font-mono text-xs font-semibold text-slate-700 block">
                        Neuron h_{hIdx + 1}:
                      </span>
                      <Slider
                        label={`W₁[${hIdx + 1}, 1] (x₁ → h${hIdx + 1})`}
                        value={row[0]}
                        min={-3}
                        max={3}
                        step={0.05}
                        onChange={(v) => handleUpdateWeight(0, hIdx, 0, v)}
                      />
                      <Slider
                        label={`W₁[${hIdx + 1}, 2] (x₂ → h${hIdx + 1})`}
                        value={row[1]}
                        min={-3}
                        max={3}
                        step={0.05}
                        onChange={(v) => handleUpdateWeight(0, hIdx, 1, v)}
                      />
                      <Slider
                        label={`Bias b_h${hIdx + 1}`}
                        value={network.biases[0][hIdx]}
                        min={-2}
                        max={2}
                        step={0.05}
                        onChange={(v) => handleUpdateBias(0, hIdx, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 2 Weights & Output Bias */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
                <span className="font-bold text-xs text-emerald-900 block uppercase tracking-wider">
                  Layer 2: Hidden ({hiddenSize}) → Output ŷ
                </span>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {network.weights[1][0].map((w, hIdx) => (
                    <Slider
                      key={hIdx}
                      label={`W_out[1, ${hIdx + 1}] (h${hIdx + 1} → ŷ)`}
                      value={w}
                      min={-3}
                      max={3}
                      step={0.05}
                      onChange={(v) => handleUpdateWeight(1, 0, hIdx, v)}
                    />
                  ))}
                  <div className="pt-2 border-t border-slate-100">
                    <Slider
                      label="Output Bias (b_out)"
                      value={network.biases[1][0]}
                      min={-2}
                      max={2}
                      step={0.05}
                      onChange={(v) => handleUpdateBias(1, 0, v)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Visualizations: Real Loss Curve + 2D Decision Boundary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Loss vs Epoch Chart */}
        <Card
          title="Training Loss vs Epoch"
          subtitle="Real computed Binary Cross-Entropy loss curve over time"
          badge={<Badge variant="unit2">Empirical Curve</Badge>}
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
                <Tooltip content={<CustomLossTooltip />} />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
            <span>Loss drops as backpropagation steps weights along the negative gradient vector.</span>
          </div>
        </Card>

        {/* 2D Decision Boundary Map */}
        <Card
          title="Learned 2D Decision Boundary"
          subtitle="Real-time forward pass classification field over [0, 1]²"
          badge={<Badge variant="primary">Classification Space</Badge>}
        >
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              className="rounded-xl border border-slate-300/90 shadow-xs"
            />
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                <span className="font-medium">Class 0 Points</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="font-medium">Class 1 Points</span>
              </span>
              <span className="text-[11px] text-slate-400 italic">
                Boundary: p = 0.5 contour line
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Predictions Table with Confidence Bar */}
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
                <th className="py-2.5 px-3">Confidence Meter</th>
                <th className="py-2.5 px-3">Sample Loss</th>
                <th className="py-2.5 px-3">Classification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentEval.results.map((r, idx) => (
                <tr key={idx} className={r.isCorrect ? 'bg-white hover:bg-slate-50/60' : 'bg-rose-50/40 hover:bg-rose-50/70'}>
                  <td className="py-2 px-3 font-mono font-medium text-slate-800">
                    [{r.input[0].toFixed(2)}, {r.input[1].toFixed(2)}]
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">{r.label}</td>
                  <td className="py-2 px-3 font-mono text-blue-900 font-semibold">{r.rawOutput.toFixed(4)}</td>
                  <td className="py-2 px-3 font-mono">{r.predictedClass}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${r.confidence}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-600">{r.confidence.toFixed(1)}%</span>
                    </div>
                  </td>
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

      {/* Backpropagation Step-by-Step Mathematical Explanation (Textbook KaTeX) */}
      <Card
        title="The 5 Steps of the Backpropagation Algorithm"
        subtitle="Syllabus Unit II: 4. Backpropagation algorithm derivation summary"
        badge={<Badge variant="unit2">Algorithm Core</Badge>}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* Step 1 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1.5">
            <span className="font-bold text-blue-900 block font-serif-heading">1. Forward Pass</span>
            <MathView
              math="\mathbf{z}^{(l)} = W^{(l)} \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)}"
              display={true}
            />
            <MathView
              math="\mathbf{a}^{(l)} = f(\mathbf{z}^{(l)})"
              display={true}
            />
            <p className="text-[11px] text-slate-600 leading-snug pt-1">
              Computes intermediate pre-activations and layer states up to final prediction $\hat{y}$.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1.5">
            <span className="font-bold text-blue-900 block font-serif-heading">2. Loss Calculation</span>
            <MathView
              math="\mathcal{L} = -\left[y \ln \hat{y} + (1-y)\ln(1-\hat{y})\right]"
              display={true}
            />
            <p className="text-[11px] text-slate-600 leading-snug pt-1">
              Computes Binary Cross-Entropy loss penalizing divergence from target label <MathView math="y \\in \\{0, 1\\}" inline />.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1.5">
            <span className="font-bold text-blue-900 block font-serif-heading">3. Output Error Signal</span>
            <MathView
              math="\delta^L = \nabla_{\mathbf{z}^L} \mathcal{L} = \hat{\mathbf{y}} - \mathbf{y}"
              display={true}
            />
            <p className="text-[11px] text-slate-600 leading-snug pt-1">
              Analytical cancellation between Sigmoid derivative and Binary Cross-Entropy derivative.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1.5">
            <span className="font-bold text-blue-900 block font-serif-heading">4. Hidden Errors</span>
            <MathView
              math="\delta^l = \left((W^{l+1})^T \delta^{l+1}\right) \odot f'(\mathbf{z}^l)"
              display={true}
            />
            <p className="text-[11px] text-slate-600 leading-snug pt-1">
              Applies calculus Chain Rule backward: transmits error proportionally across weights.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1.5">
            <span className="font-bold text-blue-900 block font-serif-heading">5. Parameter Updates</span>
            <MathView
              math="W^{(l)} \leftarrow W^{(l)} - \eta \cdot (\delta^{(l)} (\mathbf{a}^{(l-1)})^T)"
              display={true}
            />
            <MathView
              math="\mathbf{b}^{(l)} \leftarrow \mathbf{b}^{(l)} - \eta \cdot \delta^{(l)}"
              display={true}
            />
            <p className="text-[11px] text-slate-600 leading-snug pt-1">
              Steps parameters in the direction of steepest descent scaled by learning rate $\eta$.
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
