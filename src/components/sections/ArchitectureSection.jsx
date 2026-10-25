import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { ExplanationCard } from '../common/ExplanationCard.jsx';
import { Slider } from '../common/Slider.jsx';
import { MathView } from '../common/MathView.jsx';
import { initNetwork } from '../../nn/network.js';
import { Layers, Sliders, Info, CheckCircle2, RotateCcw, Edit3 } from 'lucide-react';

export function ArchitectureSection() {
  const [numHiddenLayers, setNumHiddenLayers] = useState(1);
  const [hidden1Size, setHidden1Size] = useState(3);
  const [hidden2Size, setHidden2Size] = useState(2);
  const [selectedNeuron, setSelectedNeuron] = useState(null); // { layerIdx, neuronIdx }
  const [seed, setSeed] = useState(1);

  // Architecture layer sizes: [input, ...hidden, output]
  const layerSizes = useMemo(() => {
    if (numHiddenLayers === 1) {
      return [2, hidden1Size, 1];
    }
    return [2, hidden1Size, hidden2Size, 1];
  }, [numHiddenLayers, hidden1Size, hidden2Size]);

  // Dynamic stateful network weights & biases for the diagram and user editing
  const [network, setNetwork] = useState(() => initNetwork(layerSizes, 'xavier'));

  useEffect(() => {
    setNetwork(initNetwork(layerSizes, 'xavier'));
  }, [layerSizes, seed]);

  // Handler to update incoming weight of selected neuron
  const handleEditIncomingWeight = (upstreamIdx, newVal) => {
    if (!selectedNeuron || selectedNeuron.layerIdx === 0) return;
    const val = Number(newVal);
    if (!Number.isFinite(val)) return;
    const { layerIdx, neuronIdx } = selectedNeuron;
    setNetwork((prev) => {
      const newWeights = prev.weights.map((l, lIdx) => {
        if (lIdx !== layerIdx - 1) return l;
        return l.map((row, rIdx) => {
          if (rIdx !== neuronIdx) return row;
          return row.map((w, cIdx) => (cIdx === upstreamIdx ? val : w));
        });
      });
      return { ...prev, weights: newWeights };
    });
  };

  // Handler to update bias of selected neuron
  const handleEditBias = (newVal) => {
    if (!selectedNeuron || selectedNeuron.layerIdx === 0) return;
    const val = Number(newVal);
    if (!Number.isFinite(val)) return;
    const { layerIdx, neuronIdx } = selectedNeuron;
    setNetwork((prev) => {
      const newBiases = prev.biases.map((bLayer, lIdx) => {
        if (lIdx !== layerIdx - 1) return bLayer;
        return bLayer.map((b, nIdx) => (nIdx === neuronIdx ? val : b));
      });
      return { ...prev, biases: newBiases };
    });
  };

  // Compute exact matrix dimensions and parameter count
  const parameterStats = useMemo(() => {
    let totalWeights = 0;
    let totalBiases = 0;
    const layerStats = [];

    for (let l = 0; l < layerSizes.length - 1; l++) {
      const inNodes = layerSizes[l];
      const outNodes = layerSizes[l + 1];
      const wCount = inNodes * outNodes;
      const bCount = outNodes;
      totalWeights += wCount;
      totalBiases += bCount;
      layerStats.push({
        layerIdx: l,
        fromName: l === 0 ? 'Input' : 'Hidden ' + l,
        toName: l === layerSizes.length - 2 ? 'Output' : 'Hidden ' + (l + 1),
        wShape: `[${outNodes} \\times ${inNodes}]`,
        bShape: `[${outNodes}]`,
        wCount,
        bCount,
        total: wCount + bCount,
      });
    }

    return { totalWeights, totalBiases, totalParams: totalWeights + totalBiases, layerStats };
  }, [layerSizes]);

  // Calculate neuron coordinates in SVG space
  const svgWidth = 720;
  const svgHeight = 360;
  const layerCount = layerSizes.length;

  const layerCoords = useMemo(() => {
    return layerSizes.map((count, lIdx) => {
      const x = (svgWidth / (layerCount + 1)) * (lIdx + 1);
      const step = svgHeight / (count + 1);
      const neurons = [];
      for (let nIdx = 0; nIdx < count; nIdx++) {
        const y = step * (nIdx + 1);
        neurons.push({ x, y, layerIdx: lIdx, neuronIdx: nIdx });
      }
      return neurons;
    });
  }, [layerSizes, layerCount, svgWidth, svgHeight]);

  const layerNames = useMemo(() => {
    if (numHiddenLayers === 1) {
      return ['Input Layer', 'Hidden Layer', 'Output Layer'];
    }
    return ['Input Layer', 'Hidden Layer 1', 'Hidden Layer 2', 'Output Layer'];
  }, [numHiddenLayers]);

  // Handle selected neuron details
  const selectedDetails = useMemo(() => {
    if (!selectedNeuron) return null;
    const { layerIdx, neuronIdx } = selectedNeuron;

    // Safety guard against out-of-bounds indices when architecture changes
    if (layerIdx >= layerSizes.length || neuronIdx >= layerSizes[layerIdx]) {
      return null;
    }

    const isInput = layerIdx === 0;
    const isOutput = layerIdx === layerSizes.length - 1;
    const layerType = isInput ? 'Input' : isOutput ? 'Output' : `Hidden ${layerIdx}`;

    let bias = null;
    let incomingWeights = [];
    let outgoingWeights = [];

    // Incoming weights & bias exist if not input layer
    if (!isInput) {
      const W = network.weights[layerIdx - 1];
      if (network.biases && network.biases[layerIdx - 1]) {
        bias = network.biases[layerIdx - 1][neuronIdx];
      }
      if (W && W[neuronIdx]) {
        incomingWeights = W[neuronIdx];
      }
    }

    // Outgoing weights exist if not output layer
    if (!isOutput) {
      const nextW = network.weights[layerIdx];
      if (nextW) {
        outgoingWeights = nextW.map((row, destIdx) => ({
          destIdx,
          weight: row[neuronIdx],
        }));
      }
    }

    return {
      layerIdx,
      neuronIdx,
      layerType,
      isInput,
      isOutput,
      bias,
      incomingWeights,
      outgoingWeights,
    };
  }, [selectedNeuron, network, layerSizes]);

  // Clear invalid selection when layers shrink
  useEffect(() => {
    if (selectedNeuron) {
      if (
        selectedNeuron.layerIdx >= layerSizes.length ||
        selectedNeuron.neuronIdx >= layerSizes[selectedNeuron.layerIdx]
      ) {
        setSelectedNeuron(null);
      }
    }
  }, [layerSizes, selectedNeuron]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="unit1">Unit I: Topic 4 & 5</Badge>
          <span className="text-xs text-slate-500">Architecture of Neural Networks & Bias</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Feed-Forward Network Architecture
        </h2>
        <p className="text-slate-600 text-sm">
          A feed-forward neural network processes signals strictly from left (input) to right (output) without cycles or feedback loops. Click any neuron to inspect and <strong>dynamically edit its incoming weights and bias</strong>.
        </p>
      </div>

      {/* Controls & Metrics */}
      <Card
        title="Architecture Configuration"
        subtitle="Adjust the number of hidden layers and neurons per layer"
        action={
          <button
            onClick={() => {
              setSeed((s) => s + 1);
              setSelectedNeuron(null);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset / Re-initialize</span>
          </button>
        }
      >
        {/* Architectural Presets */}
        <div className="mb-4 pb-4 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Quick Architecture Presets:
          </span>
          <button
            onClick={() => {
              setNumHiddenLayers(1);
              setHidden1Size(1);
              setSelectedNeuron(null);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 1 && hidden1Size === 1
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Single-Neuron Perceptron
          </button>
          <button
            onClick={() => {
              setNumHiddenLayers(1);
              setHidden1Size(2);
              setSelectedNeuron(null);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 1 && hidden1Size === 2
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            XOR Minimal (2 Hidden)
          </button>
          <button
            onClick={() => {
              setNumHiddenLayers(1);
              setHidden1Size(4);
              setSelectedNeuron(null);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 1 && hidden1Size === 4
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Standard Lab (4 Hidden)
          </button>
          <button
            onClick={() => {
              setNumHiddenLayers(2);
              setHidden1Size(4);
              setHidden2Size(2);
              setSelectedNeuron(null);
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 2 && hidden1Size === 4 && hidden2Size === 2
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Deep Classifier (4 → 2)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hidden Layers Count */}
          <div>
            <Slider
              label="Hidden Layers Count"
              value={numHiddenLayers}
              min={1}
              max={2}
              step={1}
              ticks={['1 Layer', '2 Layers']}
              onChange={(val) => {
                setNumHiddenLayers(val);
                setSelectedNeuron(null);
              }}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              {numHiddenLayers === 1 ? 'Shallow representation' : 'Deep hierarchical feature extractor'}
            </p>
          </div>

          {/* Hidden Layer 1 Neurons */}
          <div>
            <Slider
              label="Hidden Layer 1 Neurons"
              value={hidden1Size}
              min={1}
              max={6}
              step={1}
              ticks={['1', '2', '3', '4', '5', '6']}
              onChange={(val) => {
                setHidden1Size(val);
                setSelectedNeuron(null);
              }}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Incoming weights: {2 * hidden1Size} + Biases: {hidden1Size}
            </p>
          </div>

          {/* Hidden Layer 2 Neurons (Conditional) */}
          <div>
            {numHiddenLayers === 2 ? (
              <>
                <Slider
                  label="Hidden Layer 2 Neurons"
                  value={hidden2Size}
                  min={1}
                  max={4}
                  step={1}
                  ticks={['1', '2', '3', '4']}
                  onChange={(val) => {
                    setHidden2Size(val);
                    setSelectedNeuron(null);
                  }}
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Incoming weights: {hidden1Size * hidden2Size} + Biases: {hidden2Size}
                </p>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center text-xs text-slate-400 bg-slate-50 p-3 rounded border border-dashed border-slate-200">
                <span>Single hidden layer active.</span>
                <span className="text-[10px] text-slate-400">Increase hidden layer count to 2 to configure layer 2.</span>
              </div>
            )}
          </div>
        </div>

        {/* Global Parameter Stats Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">Architecture Vector:</span>
            <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              [{layerSizes.join(' → ')}]
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span className="text-slate-600">Total Weights: <strong className="text-slate-900">{parameterStats.totalWeights}</strong></span>
            <span className="text-slate-600">Total Biases: <strong className="text-slate-900">{parameterStats.totalBiases}</strong></span>
            <span className="text-slate-600">Total Parameters: <strong className="text-blue-900 font-bold">{parameterStats.totalParams}</strong></span>
          </div>
        </div>
      </Card>

      {/* 2D SVG Network Visualizer */}
      <Card
        title="Interactive 2D Architecture Diagram"
        subtitle="Click any neuron circle to inspect and dynamically modify its incoming weights and bias"
        badge={<Badge variant="navy">{layerSizes.length} Layers Total</Badge>}
      >
        <div className="w-full overflow-x-auto bg-slate-50/60 rounded-xl border border-slate-200 p-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[580px] select-none"
          >
            {/* Draw layer swimlanes */}
            {layerNames.map((name, lIdx) => {
              const xCenter = (svgWidth / (layerCount + 1)) * (lIdx + 1);
              return (
                <g key={`swimlane-${lIdx}`}>
                  <rect
                    x={xCenter - 48}
                    y={15}
                    width={96}
                    height={svgHeight - 30}
                    rx={8}
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={xCenter}
                    y={32}
                    textAnchor="middle"
                    className="text-[10px] font-sans font-bold fill-slate-400 uppercase tracking-wider"
                  >
                    {name}
                  </text>
                  <text
                    x={xCenter}
                    y={svgHeight - 20}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {layerSizes[lIdx]} {layerSizes[lIdx] === 1 ? 'Node' : 'Nodes'}
                  </text>
                </g>
              );
            })}

            {/* Draw Synapses (Connections) */}
            {layerCoords.slice(0, -1).map((currentLayer, lIdx) => {
              const nextLayer = layerCoords[lIdx + 1];
              const weightsMatrix = network.weights[lIdx];

              return currentLayer.map((srcNode, srcIdx) =>
                nextLayer.map((dstNode, dstIdx) => {
                  const weight = weightsMatrix?.[dstIdx]?.[srcIdx] ?? 0;
                  const isHighlighted =
                    selectedNeuron &&
                    ((selectedNeuron.layerIdx === lIdx && selectedNeuron.neuronIdx === srcIdx) ||
                      (selectedNeuron.layerIdx === lIdx + 1 && selectedNeuron.neuronIdx === dstIdx));

                  const isPositive = weight >= 0;
                  const strokeColor = isHighlighted
                    ? isPositive
                      ? '#2563EB'
                      : '#DC2626'
                    : isPositive
                    ? '#93C5FD'
                    : '#FCA5A5';

                  const strokeWidth = isHighlighted
                    ? Math.max(2, Math.min(6, Math.abs(weight) * 3 + 1))
                    : Math.max(1, Math.min(4, Math.abs(weight) * 2 + 0.5));

                  return (
                    <line
                      key={`synapse-${lIdx}-${srcIdx}-${dstIdx}`}
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={dstNode.x}
                      y2={dstNode.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={selectedNeuron && !isHighlighted ? 0.25 : 0.85}
                      className="transition-all duration-200"
                    />
                  );
                })
              );
            })}

            {/* Draw Neurons (Circles) */}
            {layerCoords.map((layer, lIdx) =>
              layer.map((node, nIdx) => {
                const isSelected =
                  selectedNeuron &&
                  selectedNeuron.layerIdx === lIdx &&
                  selectedNeuron.neuronIdx === nIdx;

                const isInput = lIdx === 0;
                const isOutput = lIdx === layerCount - 1;

                const fillColor = isSelected
                  ? '#FEF08A'
                  : isInput
                  ? '#DBEAFE'
                  : isOutput
                  ? '#D1FAE5'
                  : '#E0E7FF';

                const strokeColor = isSelected
                  ? '#CA8A04'
                  : isInput
                  ? '#2563EB'
                  : isOutput
                  ? '#059669'
                  : '#4F46E5';

                return (
                  <g
                    key={`neuron-${lIdx}-${nIdx}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select neuron ${isInput ? `x${nIdx + 1}` : isOutput ? 'ŷ' : `h${nIdx + 1}`} in ${layerNames[lIdx]}`}
                    onClick={() => setSelectedNeuron({ layerIdx: lIdx, neuronIdx: nIdx })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNeuron({ layerIdx: lIdx, neuronIdx: nIdx });
                      }
                    }}
                    className="cursor-pointer group focus:outline-none"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    {/* Extended invisible touch target for mobile devices */}
                    <circle cx={node.x} cy={node.y} r={24} fill="transparent" />
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={22}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={16}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-transform duration-150 group-hover:scale-110"
                    />

                    {/* Neuron label text inside circle */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      className="text-[11px] font-mono font-bold fill-slate-800 pointer-events-none"
                    >
                      {isInput ? `x${nIdx + 1}` : isOutput ? 'ŷ' : `h${nIdx + 1}`}
                    </text>

                    {/* Bias indicator pill above hidden/output neurons */}
                    {!isInput && network.biases?.[lIdx - 1]?.[nIdx] !== undefined && (
                      <text
                        x={node.x}
                        y={node.y - 20}
                        textAnchor="middle"
                        className="text-[9px] font-mono fill-slate-600 font-semibold"
                      >
                        b={network.biases[lIdx - 1][nIdx].toFixed(2)}
                      </text>
                    )}
                  </g>
                );
              })
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">Synapse Weights:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-1 bg-blue-500 rounded-xs"></span>
              <span>Positive Weight (Excitatory)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-1 bg-red-400 rounded-xs"></span>
              <span>Negative Weight (Inhibitory)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 italic">Stroke thickness represents weight magnitude |w|</span>
          </div>
        </div>
      </Card>

      {/* Selected Neuron Inspector Card with Dynamic Weight & Bias Tuning */}
      {selectedDetails ? (
        <Card
          title={`Neuron Inspector & Parameter Tuning: ${selectedDetails.layerType} Node #${selectedDetails.neuronIdx + 1}`}
          badge={<Badge variant="primary">Dynamic Parameters</Badge>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Column 1: Bias & Equation */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 block text-xs font-serif-heading">Neuron Parameters</span>
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedDetails.layerType}
                </span>
              </div>

              {!selectedDetails.isInput ? (
                <div className="space-y-3 pt-1">
                  <Slider
                    label="Adjust Bias (b)"
                    value={selectedDetails.bias ?? 0}
                    min={-2}
                    max={2}
                    step={0.05}
                    onChange={handleEditBias}
                  />
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                      Textbook Summation Equation
                    </span>
                    <MathView
                      math={`z = \\sum_{i=1}^{k} w_i a_i + (${(selectedDetails.bias ?? 0).toFixed(2)})`}
                      display={true}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 italic py-2">
                  Input layer neurons ingest external features directly without bias or incoming weights.
                </div>
              )}
            </div>

            {/* Column 2: Incoming Weights (Editable Sliders) */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 block text-xs font-serif-heading">Incoming Synapses (Editable)</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedDetails.incomingWeights.length} inputs
                </span>
              </div>

              {selectedDetails.isInput ? (
                <p className="text-slate-500 italic py-2">Raw external feature input (no upstream weights).</p>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {selectedDetails.incomingWeights.map((w, idx) => (
                    <Slider
                      key={idx}
                      label={`Weight w_${idx + 1} (From Node ${idx + 1})`}
                      value={w}
                      min={-3}
                      max={3}
                      step={0.05}
                      onChange={(val) => handleEditIncomingWeight(idx, val)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Outgoing Synapses */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 block text-xs font-serif-heading">Outgoing Synapses</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedDetails.outgoingWeights.length} targets
                </span>
              </div>

              {selectedDetails.isOutput ? (
                <p className="text-slate-500 italic py-2">Final network output ŷ (no downstream layers).</p>
              ) : (
                <div className="space-y-2 font-mono">
                  {selectedDetails.outgoingWeights.map(({ destIdx, weight }) => (
                    <div
                      key={destIdx}
                      className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs"
                    >
                      <span className="text-slate-600 font-sans text-xs">To Next Node #{destIdx + 1}:</span>
                      <span
                        className={`font-bold ${
                          typeof weight === 'number' && weight >= 0 ? 'text-blue-700' : 'text-rose-600'
                        }`}
                      >
                        {typeof weight === 'number'
                          ? weight >= 0
                            ? `+${weight.toFixed(4)}`
                            : weight.toFixed(4)
                          : '0.0000'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
          Click any neuron circle in the diagram above to inspect and dynamically tune its incoming weights and bias.
        </div>
      )}

      {/* Matrix Shapes & Parameter Equations Card with KaTeX */}
      <Card
        title="Layer-by-Layer Matrix Dimensions & Formulas"
        subtitle="Textbook algebraic dimensions for weight matrices and bias vectors"
        badge={<Badge variant="navy">Linear Algebra</Badge>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-serif-heading">
              General Layer Transformation
            </span>
            <MathView
              math="\mathbf{z}^{(l)} = W^{(l)} \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)}, \quad \mathbf{a}^{(l)} = f(\mathbf{z}^{(l)})"
              display={true}
            />
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Where <MathView math="W^{(l)}" inline /> maps activation vector <MathView math="\mathbf{a}^{(l-1)}" inline /> to pre-activation vector <MathView math="\mathbf{z}^{(l)}" inline />, and <MathView math="\mathbf{b}^{(l)}" inline /> provides translational threshold shifts.
            </p>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-serif-heading">
              Current Architecture Dimensions
            </span>
            <div className="space-y-1.5 pt-1">
              {parameterStats.layerStats.map((st, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="font-medium text-slate-700">{st.fromName} → {st.toName}:</span>
                  <MathView math={`W \\in \\mathbb{R}^{${st.wShape.replace('[', '').replace(']', '')}}, \\quad \\mathbf{b} \\in \\mathbb{R}^{${st.bShape.replace('[', '').replace(']', '')}}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Syllabus Explanation Card */}
      <ExplanationCard
        title="Architecture & Bias Explanation"
        syllabusTopic="Unit I: 4. Neural Network Architecture & 5. Bias"
        what="A feed-forward neural network consists of layers of interconnected artificial neurons. Information moves strictly from input to output without loops."
        why="Multi-layer architectures allow the network to compose simple linear operations into complex non-linear decision boundaries capable of solving non-separable tasks."
        how={
          <span>
            Every neuron computes <MathView math="z = \sum_{i=1}^n w_i a_i + b" inline />, where weights <MathView math="w_i" inline /> scale incoming activations and <MathView math="b" inline /> translates the decision threshold. The sum is then evaluated by activation function <MathView math="a = f(z)" inline />.
          </span>
        }
        interactionEffect="Changing hidden layer count or neuron counts dynamically reconfigures the network matrix dimensions and updates the wiring diagram."
      />
    </div>
  );
}
