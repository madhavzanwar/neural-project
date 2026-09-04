import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { ExplanationCard } from '../common/ExplanationCard.jsx';
import { Slider } from '../common/Slider.jsx';
import { initNetwork } from '../../nn/network.js';
import { Layers, Sliders, Info, CheckCircle2, RotateCcw } from 'lucide-react';

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

  // Generate deterministic network weights & biases for the diagram
  const network = useMemo(() => {
    return initNetwork(layerSizes, 'xavier');
  }, [layerSizes, seed]);

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
        wShape: '[' + outNodes + ' x ' + inNodes + ']',
        bShape: '[' + outNodes + ']',
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
      bias = network.biases[layerIdx - 1][neuronIdx];
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
          A feed-forward neural network processes signals strictly from left (input) to right (output) without cycles or feedback loops.
        </p>
      </div>

      {/* Controls & Metrics */}
      <Card
        title="Architecture Configuration"
        subtitle="Adjust the number of hidden layers and neurons per layer"
        action={
          <button
            onClick={() => {
              setSeed(s => s + 1);
              setSelectedNeuron(null);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-initialize Parameters</span>
          </button>
        }
      >
        {/* Architectural Presets */}
        <div className="mb-4 pb-4 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Quick Architecture Presets:
          </span>
          <button
            onClick={() => { setNumHiddenLayers(1); setHidden1Size(1); setSelectedNeuron(null); }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 1 && hidden1Size === 1
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Single-Neuron Perceptron
          </button>
          <button
            onClick={() => { setNumHiddenLayers(1); setHidden1Size(2); setSelectedNeuron(null); }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 1 && hidden1Size === 2
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            XOR Minimal (2 Hidden)
          </button>
          <button
            onClick={() => { setNumHiddenLayers(1); setHidden1Size(4); setSelectedNeuron(null); }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 1 && hidden1Size === 4
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Standard Lab (4 Hidden)
          </button>
          <button
            onClick={() => { setNumHiddenLayers(2); setHidden1Size(4); setHidden2Size(2); setSelectedNeuron(null); }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-all active:scale-95 ${
              numHiddenLayers === 2 && hidden1Size === 4 && hidden2Size === 2
                ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Deep Classifier (4 → 2)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Hidden Layers: {numHiddenLayers}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setNumHiddenLayers(1)}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md border cursor-pointer transition-all ${
                  numHiddenLayers === 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                1 Layer (Shallow)
              </button>
              <button
                onClick={() => setNumHiddenLayers(2)}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md border cursor-pointer transition-all ${
                  numHiddenLayers === 2
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                2 Layers (Deep)
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Single-layer nets cannot solve XOR; 2+ layers enable hierarchical representation.
            </p>
          </div>

          <div>
            <Slider
              label="Hidden Layer 1 Neurons"
              value={hidden1Size}
              min={1}
              max={6}
              step={1}
              valueDisplay={`${hidden1Size} nodes`}
              ticks={['1', '2', '3', '4', '5', '6']}
              onChange={(val) => setHidden1Size(val)}
            />
          </div>

          {numHiddenLayers === 2 ? (
            <div>
              <Slider
                label="Hidden Layer 2 Neurons"
                value={hidden2Size}
                min={1}
                max={6}
                step={1}
                valueDisplay={`${hidden2Size} nodes`}
                ticks={['1', '2', '3', '4', '5', '6']}
                onChange={(val) => setHidden2Size(val)}
              />
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Select "2 Layers" above to configure a second hidden layer.</span>
            </div>
          )}
        </div>
      </Card>

      {/* Layer Matrix Dimensions & Trainable Parameter Audit */}
      <Card
        title="Layer Matrix Dimensions and Parameter Accounting"
        subtitle="Mathematical tensor dimensions and total learnable parameters"
        badge={<Badge variant="navy">{parameterStats.totalParams} Trainable Parameters</Badge>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Synaptic Weights (W)
            </span>
            <div className="text-lg font-bold font-mono text-blue-900">{parameterStats.totalWeights}</div>
            <span className="text-[11px] text-slate-500">Multiplicative connection parameters</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Neuron Biases (b)
            </span>
            <div className="text-lg font-bold font-mono text-blue-900">{parameterStats.totalBiases}</div>
            <span className="text-[11px] text-slate-500">Threshold shift parameters</span>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-md">
            <span className="text-blue-800 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Total Trainable Parameters
            </span>
            <div className="text-lg font-bold font-mono text-blue-950">{parameterStats.totalParams}</div>
            <span className="text-[11px] text-blue-700">Weights + Biases combined</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Connection Gap</th>
                <th className="py-2 px-3">Weight Matrix Shape [Out x In]</th>
                <th className="py-2 px-3">Bias Vector Shape</th>
                <th className="py-2 px-3">Weights Count</th>
                <th className="py-2 px-3">Biases Count</th>
                <th className="py-2 px-3 font-bold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {parameterStats.layerStats.map((st) => (
                <tr key={st.layerIdx} className="hover:bg-slate-50">
                  <td className="py-1.5 px-3 font-sans font-medium text-slate-800">
                    {st.fromName} → {st.toName}
                  </td>
                  <td className="py-1.5 px-3 text-blue-900 font-semibold">{st.wShape}</td>
                  <td className="py-1.5 px-3 text-slate-700">{st.bShape}</td>
                  <td className="py-1.5 px-3">{st.wCount}</td>
                  <td className="py-1.5 px-3">{st.bCount}</td>
                  <td className="py-1.5 px-3 font-bold text-slate-900">{st.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Interactive 2D Network Diagram */}
      <Card
        title="2D Feed-Forward Architecture Diagram"
        subtitle="Click any neuron to inspect its weights, bias, and connections"
      >
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-4xl mx-auto h-auto bg-gradient-to-b from-slate-50/80 to-slate-100/40 rounded-xl border border-slate-200/90 shadow-2xs"
          >
            <defs>
              <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" floodColor="#0F172A" />
              </filter>
              <linearGradient id="excitatoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="inhibitoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F87171" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Column Swimlanes */}
            {layerCoords.map((coords, lIdx) => {
              const colX = coords[0].x;
              const colWidth = 96;
              const isColActive = selectedNeuron?.layerIdx === lIdx;
              return (
                <rect
                  key={`layer-col-${lIdx}`}
                  x={colX - colWidth / 2}
                  y={12}
                  width={colWidth}
                  height={svgHeight - 24}
                  rx={12}
                  fill={isColActive ? 'rgba(219, 234, 254, 0.4)' : 'rgba(241, 245, 249, 0.5)'}
                  stroke={isColActive ? '#93C5FD' : '#E2E8F0'}
                  strokeWidth={isColActive ? 1.5 : 1}
                  strokeDasharray={isColActive ? 'none' : '4 4'}
                  className="transition-colors duration-200"
                />
              );
            })}

            {/* Background Grid Lines & Layer Header Indicators */}
            {layerCoords.map((coords, lIdx) => (
              <g key={`layer-header-${lIdx}`}>
                <text
                  x={coords[0].x}
                  y={24}
                  textAnchor="middle"
                  className="text-xs font-bold fill-slate-700 font-sans tracking-tight"
                >
                  {layerNames[lIdx]}
                </text>
                <text
                  x={coords[0].x}
                  y={40}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  ({layerSizes[lIdx]} {layerSizes[lIdx] === 1 ? 'neuron' : 'neurons'})
                </text>
              </g>
            ))}

            {/* Synaptic Connections (Weights) */}
            {layerCoords.map((currentLayer, lIdx) => {
              if (lIdx === layerCount - 1) return null;
              const nextLayer = layerCoords[lIdx + 1];
              const W = network.weights[lIdx];

              return currentLayer.flatMap((fromNode, fromIdx) =>
                nextLayer.map((toNode, toIdx) => {
                  const weight = W && W[toIdx] ? W[toIdx][fromIdx] : 0;
                  const isPositive = weight >= 0;
                  const absW = Math.abs(weight);

                  // Connection highlight logic
                  const isHighlighted =
                    selectedNeuron &&
                    ((selectedNeuron.layerIdx === lIdx && selectedNeuron.neuronIdx === fromIdx) ||
                      (selectedNeuron.layerIdx === lIdx + 1 && selectedNeuron.neuronIdx === toIdx));

                  const isDimmed = selectedNeuron && !isHighlighted;

                  const strokeColor = isHighlighted
                    ? isPositive
                      ? '#2563EB' // vivid blue
                      : '#DC2626' // vivid red
                    : isPositive
                    ? '#93C5FD' // soft blue
                    : '#FCA5A5'; // soft red

                  const strokeWidth = isHighlighted
                    ? Math.max(2, Math.min(6, absW * 3.5))
                    : Math.max(1, Math.min(4, absW * 2));

                  return (
                    <line
                      key={`synapse-${lIdx}-${fromIdx}-${toIdx}`}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={isDimmed ? 0.15 : 0.85}
                      className="transition-all duration-200"
                    />
                  );
                })
              );
            })}

            {/* Neurons */}
            {layerCoords.map((layer, lIdx) =>
              layer.map((node, nIdx) => {
                const isInput = lIdx === 0;
                const isOutput = lIdx === layerCount - 1;
                const isSelected =
                  selectedNeuron &&
                  selectedNeuron.layerIdx === lIdx &&
                  selectedNeuron.neuronIdx === nIdx;

                // Color node by layer type
                let fillColor = isInput
                  ? '#E2E8F0' // slate
                  : isOutput
                  ? '#D1FAE5' // emerald
                  : '#DBEAFE'; // blue

                let strokeColor = isInput
                  ? '#64748B'
                  : isOutput
                  ? '#059669'
                  : '#2563EB';

                if (isSelected) {
                  strokeColor = '#0F172A';
                  fillColor = isOutput ? '#A7F3D0' : '#BFDBFE';
                }

                return (
                  <g
                    key={`neuron-${lIdx}-${nIdx}`}
                    onClick={() => setSelectedNeuron({ layerIdx: lIdx, neuronIdx: nIdx })}
                    className="cursor-pointer group"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
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
                    {!isInput && (
                      <text
                        x={node.x}
                        y={node.y - 20}
                        textAnchor="middle"
                        className="text-[9px] font-mono fill-slate-500 font-medium"
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

      {/* Selected Neuron Inspector Card */}
      {selectedDetails ? (
        <Card
          title={`Neuron Inspector: ${selectedDetails.layerType} Neuron #${selectedDetails.neuronIdx + 1}`}
          badge={<Badge variant="primary">Active Selection</Badge>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1">Neuron Parameters</span>
              <p className="text-slate-600">
                Layer: <strong className="text-slate-900">{selectedDetails.layerType}</strong>
              </p>
              {!selectedDetails.isInput && (
                <p className="text-slate-600 mt-1">
                  Bias value: <strong className="font-mono text-blue-900">{selectedDetails.bias?.toFixed(4)}</strong>
                </p>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1">Incoming Connections</span>
              {selectedDetails.isInput ? (
                <p className="text-slate-500 italic">Raw external input (no upstream weights)</p>
              ) : (
                <div className="space-y-1 font-mono">
                  {selectedDetails.incomingWeights.map((w, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-slate-500">From neuron #{idx + 1}:</span>
                      <span className={w >= 0 ? 'text-blue-700 font-medium' : 'text-red-600 font-medium'}>
                        {w >= 0 ? `+${w.toFixed(4)}` : w.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1">Outgoing Synapses</span>
              {selectedDetails.isOutput ? (
                <p className="text-slate-500 italic">Final network output (ŷ)</p>
              ) : (
                <div className="space-y-1 font-mono">
                  {selectedDetails.outgoingWeights.map(({ destIdx, weight }) => (
                    <div key={destIdx} className="flex justify-between">
                      <span className="text-slate-500">To next neuron #{destIdx + 1}:</span>
                      <span className={(typeof weight === 'number' && weight >= 0) ? 'text-blue-700 font-medium' : 'text-red-600 font-medium'}>
                        {typeof weight === 'number' ? (weight >= 0 ? `+${weight.toFixed(4)}` : weight.toFixed(4)) : '0.0000'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
          Click any neuron circle in the diagram above to inspect its incoming weights, bias value, and outgoing synapses.
        </div>
      )}

      {/* Syllabus Explanation Card */}
      <ExplanationCard
        title="Architecture & Bias Explanation"
        syllabusTopic="Unit I: 4. Neural Network Architecture & 5. Bias"
        what="A feed-forward neural network consists of layers of interconnected artificial neurons. Information moves strictly from input to output without loops."
        why="Multi-layer architectures allow the network to compose simple linear operations into complex non-linear decision boundaries capable of solving non-separable tasks."
        how="Every neuron computes z = Σ(w · a) + b, where w represents connection weights that scale inputs, and b is the bias parameter. The sum z is passed through an activation function."
        interactionEffect="Changing hidden layer count or neuron counts dynamically reconfigures the network matrix dimensions and updates the wiring diagram."
      />
    </div>
  );
}
