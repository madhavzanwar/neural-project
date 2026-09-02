import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Formula } from '../common/Formula.jsx';
import { Metric } from '../common/Metric.jsx';
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

export function ActivationsSection() {
  const [selectedFunction, setSelectedFunction] = useState('sigmoid');
  const [inputValue, setInputValue] = useState(1.0);

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
                <span className="text-slate-500 block font-medium mb-1">Mathematical Formula:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono font-semibold text-blue-900">
                  {activeActivation.formula}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block font-medium mb-1">First Derivative:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-slate-800">
                  {activeActivation.derivativeFormula}
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
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Input Value (x):</span>
                  <span className="font-mono text-blue-900 text-sm font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {inputValue.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.05"
                  value={inputValue}
                  onChange={(e) => setInputValue(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>-4.0</span>
                  <span>-2.0</span>
                  <span>0.0</span>
                  <span>+2.0</span>
                  <span>+4.0</span>
                </div>
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
                  subtext="Gradient transmission rate"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[11px] font-medium text-slate-500 block mb-1.5">Quick Presets:</span>
                <div className="flex gap-1.5">
                  {[-3.0, -1.0, 0.0, 1.0, 3.0].map((val) => (
                    <button
                      key={val}
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
                  <Tooltip
                    formatter={(val, name) => [
                      typeof val === 'number' ? val.toFixed(4) : val,
                      name === 'y' ? 'f(x) Output' : name === 'derivative' ? "f'(x) Gradient" : name,
                    ]}
                    labelFormatter={(label) => `Input x = ${Number(label).toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
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

                  {/* Active Point on curve */}
                  <ReferenceDot
                    x={Number(inputValue.toFixed(2))}
                    y={outputValue}
                    r={6}
                    fill={activeActivation.color}
                    stroke="#ffffff"
                    strokeWidth={2}
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
        how="During forward propagation, each neuron computes a = f(z). During backpropagation, the chain rule multiplies incoming errors by the derivative f'(z)."
        interactionEffect="Adjusting the input slider moves the active reference dot along the mathematical curve and updates the derivative value."
      />
    </div>
  );
}
