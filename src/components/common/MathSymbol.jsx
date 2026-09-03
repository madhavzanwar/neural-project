import React from 'react';

const NOTATIONS = {
  W: { symbol: 'W', name: 'Weights', definition: 'Multiplicative connection parameters that scale incoming signals.' },
  b: { symbol: 'b', name: 'Bias', definition: 'Additive threshold parameter allowing activation functions to shift along the axis.' },
  z: { symbol: 'z', name: 'Pre-Activation', definition: 'Linear weighted sum: z = Σ(w · a) + b before applying the activation function.' },
  a: { symbol: 'a', name: 'Post-Activation', definition: 'Neuron output: a = f(z) after applying non-linear activation function.' },
  delta: { symbol: 'δ', name: 'Error Delta', definition: 'Gradient of loss with respect to pre-activation: δ = ∂L/∂z.' },
  eta: { symbol: 'η', name: 'Learning Rate', definition: 'Hyperparameter scaling the gradient step size during parameter updates.' },
  sigma: { symbol: 'σ', name: 'Sigmoid', definition: 'Activation function mapping inputs to (0, 1): σ(x) = 1 / (1 + e^-x).' },
  loss: { symbol: 'L', name: 'Loss', definition: 'Scalar metric measuring error between predicted output ŷ and true target y.' },
};

export function MathSymbol({ symbolKey, className = '' }) {
  const item = NOTATIONS[symbolKey] || { symbol: symbolKey, name: symbolKey, definition: '' };

  return (
    <span
      title={`${item.name}: ${item.definition}`}
      className={`inline-flex items-center gap-1 font-mono font-bold bg-slate-100 hover:bg-blue-50 text-blue-900 border border-slate-200 hover:border-blue-300 rounded px-1.5 py-0.5 text-xs transition-colors cursor-help ${className}`}
    >
      <span>{item.symbol}</span>
      <span className="text-[10px] font-sans text-slate-500 font-normal">({item.name})</span>
    </span>
  );
}
