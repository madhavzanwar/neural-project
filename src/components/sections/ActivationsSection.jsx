import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Formula } from '../common/Formula.jsx';
import { MathView } from '../common/MathView.jsx';
import { Metric } from '../common/Metric.jsx';
import { Slider } from '../common/Slider.jsx';
import { ExplanationCard } from '../common/ExplanationCard.jsx';
import { ACTIVATIONS, computeActivationCurve } from '../../nn/activations.js';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import { Activity, Sliders, Check, HelpCircle } from 'lucide-react';

const CustomActivationTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-xl p-3 text-xs min-w-[190px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase">Input Domain</span>
        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
          x = {Number(label).toFixed(2)}
        </span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry, idx) => (
          <div key={`item-${idx}`} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600 font-medium">
                {entry.name === 'y' ? 'f(x) Output' : entry.name === 'derivative' ? "f'(x) Gradient" : 'Tangent Slope'}
              </span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function ActivationsSection() {
  const [selectedFunction, setSelectedFunction] = useState('sigmoid');
  const [inputValue, setInputValue] = useState(1.0);
  const [showTangent, setShowTangent] = useState(true);

  const activeActivation = ACTIVATIONS[selectedFunction] || ACTIVATIONS.sigmoid;

  // Real-time calculated values
  const outputValue = useMemo(() => {
    return activeActivation.fn(inputValue);
  }, [activeActivation, inputValue]);

  const derivativeValue = useMemo(() => {
    return activeActivation.derivative(inputValue);
  }, [activeActivation, inputValue]);

  // Curve data points for Recharts
  const curveData = useMemo(() => {
    return computeActivationCurve(selectedFunction, -4, 4, 81, inputValue);
  }, [selectedFunction, inputValue]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Section Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="unit1">Unit I: Topic 6</Badge>
          <span className="text-xs text-slate-500">Activation Functions & Non-Linearity</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Activation Functions Explorer
        </h2>
        <p className="text-slate-600 text-sm">
          Activation functions introduce non-linearity into neural networks, enabling them to learn arbitrary complex decision boundaries beyond simple linear hyperplanes.
        </p>
      </div>

      {/* Function Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.values(ACTIVATIONS).map((act) => {
          const isSelected = selectedFunction === act.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => setSelectedFunction(act.id)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600'
                  : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-slate-900">{act.label}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
              </div>
              <span className="text-[11px] font-mono text-slate-500 block truncate">
                Range: {act.range}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Properties & Dynamic Input Slider */}
        <div className="space-y-4">
          <Card
            title={`${activeActivation.label} Specification`}
            badge={<Badge variant="primary">{activeActivation.range}</Badge>}
          >
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">Mathematical Formula:</span>
                <div className="p-3 bg-slate-50/90 border border-slate-200/90 rounded-xl shadow-2xs">
                  <MathView math={activeActivation.latexFormula || activeActivation.formula} display={true} />
                </div>
              </div>

              <div>
                <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[10px] mb-1">First Derivative:</span>
                <div className="p-3 bg-slate-50/90 border border-slate-200/90 rounded-xl shadow-2xs">
                  <MathView math={activeActivation.latexDerivative || activeActivation.derivativeFormula} display={true} />
                </div>
              </div>

              <div>
                <span className="text-slate-500 block font-medium mb-1">Typical College Use Cases:</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {activeActivation.useCases}
                </p>
              </div>
            </div>
          </Card>

          {/* Real-time Input Slider & Value Tester */}
          <Card
            title="Real-Time Input Tester"
            subtitle="Change input value x to observe instantaneous response"
          >
            <div className="space-y-4">
              <div>
                <Slider
                  label="Input Value (x)"
                  value={inputValue}
                  min={-4}
                  max={4}
                  step={0.05}
                  valueDisplay={`x = ${inputValue.toFixed(2)}`}
                  ticks={['-4.0', '-2.0', '0.0', '+2.0', '+4.0']}
                  color={activeActivation.color}
                  onChange={(val) => setInputValue(val)}
                />
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <Metric
                  label="Output f(x)"
                  value={outputValue.toFixed(4)}
                  subtext={`Bounded in ${activeActivation.range}`}
                />
                <Metric
                  label="Derivative f'(x)"
                  value={derivativeValue.toFixed(4)}
                  subtext={`Slope: ${(Math.atan(derivativeValue) * 180 / Math.PI).toFixed(1)}°`}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="showTangentCheck"
                  checked={showTangent}
                  onChange={(e) => setShowTangent(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="showTangentCheck" className="text-xs text-slate-700 cursor-pointer font-medium">
                  Show Tangent Slope Line on Curve
                </label>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[11px] font-medium text-slate-500 block mb-1.5">Quick Presets:</span>
                <div className="flex gap-1.5">
                  {[-3.0, -1.0, 0.0, 1.0, 3.0].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setInputValue(val)}
                      className={`flex-1 py-1 text-[11px] font-mono rounded border cursor-pointer transition-colors ${
                        inputValue === val
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val > 0 ? `+${val}` : val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Recharts Graph */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title={`${activeActivation.label} Curve & Derivative`}
            subtitle="Solid line: Activation function f(x) • Dashed line: Derivative f'(x)"
          >
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[-4, 4]}
                    tickCount={9}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={
                      selectedFunction === 'relu'
                        ? [-0.5, 4.5]
                        : selectedFunction === 'linear'
                        ? [-4, 4]
                        : selectedFunction === 'tanh'
                        ? [-1.2, 1.2]
                        : [-0.1, 1.1]
                    }
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomActivationTooltip />} />
                  {/* Origin zero reference line */}
                  <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="2 2" />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />

                  {/* Activation function curve */}
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke={activeActivation.color}
                    strokeWidth={2.5}
                    dot={false}
                    name="y"
                    isAnimationActive={false}
                  />

                  {/* Analytical derivative curve */}
                  <Line
                    type="monotone"
                    dataKey="derivative"
                    stroke="#64748B"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="derivative"
                    isAnimationActive={false}
                  />

                  {/* Tangent slope line */}
                  {showTangent && (
                    <Line
                      type="monotone"
                      dataKey="tangent"
                      stroke="#D97706"
                      strokeWidth={2.5}
                      dot={false}
                      name="tangent"
                      isAnimationActive={false}
                      connectNulls={false}
                    />
                  )}

                  {/* Projected Crosshairs */}
                  <ReferenceLine x={Number(inputValue.toFixed(2))} stroke={activeActivation.color} strokeDasharray="3 3" strokeWidth={1.5} strokeOpacity={0.65} />
                  <ReferenceLine y={outputValue} stroke={activeActivation.color} strokeDasharray="3 3" strokeWidth={1.5} strokeOpacity={0.65} />

                  {/* Active Point on curve with Outer Pulsing Halo */}
                  <ReferenceDot
                    x={Number(inputValue.toFixed(2))}
                    y={outputValue}
                    r={12}
                    fill={activeActivation.color}
                    fillOpacity={0.2}
                    stroke="none"
                  />
                  <ReferenceDot
                    x={Number(inputValue.toFixed(2))}
                    y={outputValue}
                    r={5.5}
                    fill={activeActivation.color}
                    stroke="#ffffff"
                    strokeWidth={2.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Graph Legend & Explanation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 rounded-xs" style={{ backgroundColor: activeActivation.color }}></span>
                  <span className="font-medium text-slate-800">f(x) Output</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 bg-slate-500 rounded-xs border-b border-dashed border-slate-700"></span>
                  <span className="font-medium text-slate-800">f'(x) Derivative</span>
                </span>
                {showTangent && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-1 bg-amber-600 rounded-xs"></span>
                    <span className="font-medium text-amber-800">Tangent Slope m={derivativeValue.toFixed(2)}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeActivation.color }}></span>
                  <span>Active Point (x={inputValue.toFixed(2)}, y={outputValue.toFixed(2)})</span>
                </span>
              </div>
            </div>
          </Card>

          {/* Academic Comparison & Pros/Cons Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Key Advantages:</span>
              <p className="text-emerald-950 leading-relaxed">{activeActivation.pros}</p>
            </div>
            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-lg text-xs">
              <span className="font-bold text-rose-900 block mb-1">Limitations / Considerations:</span>
              <p className="text-rose-950 leading-relaxed">{activeActivation.cons}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Card */}
      <ExplanationCard
        title="Activation Functions & Vanishing Gradients"
        syllabusTopic="Unit I: 6. Activation functions"
        what="An activation function maps the weighted sum (z = W·x + b) to an output activation value. Without non-linear activations, stacking multiple layers collapses mathematically to a single linear transformation."
        why="Different functions serve different layer roles: Sigmoid bounds probabilities to (0,1) for binary classification; Tanh provides zero-centered outputs (-1,1); ReLU prevents gradient saturation in deep networks."
        how={
          <span>
            During forward propagation, each neuron evaluates <MathView math="a = f(z)" inline />. During backpropagation, the multivariate chain rule multiplies incoming upstream error signals by the local analytical derivative <MathView math="f'(z)" inline />.
          </span>
        }
        interactionEffect="Adjusting the input slider moves the active reference dot along the mathematical curve and updates the derivative value."
      />
    </div>
  );
}
