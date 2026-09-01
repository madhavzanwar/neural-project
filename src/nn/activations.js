// =============================================================================
// ACTIVATION FUNCTIONS (SYLLABUS UNIT I: 6. Activation functions)
// =============================================================================
// Mathematically rigorous activation functions and their analytical derivatives.
// Covers the 4 core activation functions specified in the course syllabus:
// 1. Sigmoid: σ(x) = 1 / (1 + e^(-x))
// 2. ReLU: f(x) = max(0, x)
// 3. Tanh: tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
// 4. Linear: f(x) = x
// =============================================================================

export const ACTIVATIONS = {
  sigmoid: {
    id: 'sigmoid',
    label: 'Sigmoid',
    formula: 'σ(x) = 1 / (1 + e^(-x))',
    derivativeFormula: "σ'(x) = σ(x) · (1 - σ(x))",
    range: '(0, 1)',
    color: '#2563EB',
    description: 'S-shaped curve mapping any real input to probabilities between 0 and 1. Commonly used in binary classification output layers.',
    useCases: 'Output layer for binary classification, gating mechanisms in RNNs/LSTMs.',
    pros: 'Smooth gradient, probabilistic interpretation bounded strictly between 0 and 1.',
    cons: 'Vanishing gradient problem for |x| > 3 (maximum derivative is only 0.25). Not zero-centered.',
    fn: (x) => {
      // Numerical clamp to prevent Math.exp overflow/underflow
      const clamped = Math.max(-500, Math.min(500, x));
      return 1 / (1 + Math.exp(-clamped));
    },
    derivative: (x) => {
      const clamped = Math.max(-500, Math.min(500, x));
      const s = 1 / (1 + Math.exp(-clamped));
      return s * (1 - s);
    },
  },
  relu: {
    id: 'relu',
    label: 'ReLU (Rectified Linear Unit)',
    formula: 'f(x) = max(0, x)',
    derivativeFormula: "f'(x) = 1 if x > 0 else 0",
    range: '[0, ∞)',
    color: '#0D9488',
    description: 'Outputs the input directly if positive; outputs zero otherwise. The standard activation function for modern deep neural networks.',
    useCases: 'Hidden layers in deep feed-forward networks and convolutional networks.',
    pros: 'Computationally efficient, avoids vanishing gradient for positive activations, promotes sparse representations.',
    cons: '"Dying ReLU" problem: neurons with negative inputs can permanently stop updating if weights make pre-activation always negative.',
    fn: (x) => Math.max(0, x),
    derivative: (x) => (x > 0 ? 1 : 0),
  },
  tanh: {
    id: 'tanh',
    label: 'Tanh (Hyperbolic Tangent)',
    formula: 'tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))',
    derivativeFormula: "tanh'(x) = 1 - tanh²(x)",
    range: '(-1, 1)',
    color: '#7C3AED',
    description: 'Zero-centered S-shaped curve mapping real inputs to values between -1 and 1. Often preferred over Sigmoid in hidden layers.',
    useCases: 'Hidden layers in feed-forward networks, recurrent neural networks (RNNs).',
    pros: 'Zero-centered output (mean close to 0 accelerates gradient descent convergence compared to Sigmoid).',
    cons: 'Still suffers from vanishing gradients when saturating (|x| > 2.5).',
    fn: (x) => Math.tanh(x),
    derivative: (x) => 1 - Math.tanh(x) ** 2,
  },
  linear: {
    id: 'linear',
    label: 'Linear (Identity)',
    formula: 'f(x) = x',
    derivativeFormula: "f'(x) = 1",
    range: '(-∞, ∞)',
    color: '#D97706',
    description: 'Passes the weighted sum directly to the output without non-linear transformation. Derivatives are constant.',
    useCases: 'Regression output layer, single-layer perceptron baseline.',
    pros: 'Preserves scale and sign of real-valued outputs.',
    cons: 'Cannot solve non-linear problems (a multi-layer network with linear activations collapses mathematically to a single linear layer).',
    fn: (x) => x,
    derivative: () => 1,
  },
};

/**
 * Computes points along the activation curve and its derivative for chart rendering.
 * @param {string} activType - 'sigmoid' | 'relu' | 'tanh' | 'linear'
 * @param {number} xMin - Minimum input domain value
 * @param {number} xMax - Maximum input domain value
 * @param {number} numPoints - Sample density
 * @param {number|null} currentX - Active input point to draw tangent line for
 * @returns {Array<{ x: number, y: number, derivative: number, tangent: number|null }>}
 */
export function computeActivationCurve(activType, xMin = -4, xMax = 4, numPoints = 81, currentX = null) {
  const activ = ACTIVATIONS[activType] || ACTIVATIONS.sigmoid;
  const fn = activ.fn;
  const deriv = activ.derivative;

  return Array.from({ length: numPoints }, (_, i) => {
    const x = xMin + (i / (numPoints - 1)) * (xMax - xMin);
    const y = fn(x);
    const d = deriv(x);
    const tangent = (currentX !== null && Math.abs(x - currentX) <= 1.2)
      ? fn(currentX) + deriv(currentX) * (x - currentX)
      : null;
    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(4)),
      derivative: Number(d.toFixed(4)),
      tangent: tangent !== null ? Number(tangent.toFixed(4)) : null,
    };
  });
}
