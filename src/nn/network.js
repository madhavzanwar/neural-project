// =============================================================================
// NEURAL NETWORK MATHEMATICAL ENGINE
// Syllabus Alignment:
// - UNIT I: 4. Architecture, 5. Bias, 9. Single-layer, 10. Multilayer, 11. Feed-forward
// - UNIT II: 1. Loss functions, 2. Weight initialization, 3. Optimization, 4. Backpropagation
// =============================================================================

import { ACTIVATIONS } from './activations.js';

// -----------------------------------------------------------------------------
// 1. WEIGHT INITIALIZATION STRATEGIES
// Demonstrates how network initial state affects convergence and symmetry breaking
// -----------------------------------------------------------------------------
export const INIT_STRATEGIES = {
  xavier: {
    label: 'Xavier / Glorot (Uniform)',
    formula: 'W \\sim \\mathcal{U}\\left(-\\sqrt{\\frac{6}{n_{\\text{in}} + n_{\\text{out}}}}, +\\sqrt{\\frac{6}{n_{\\text{in}} + n_{\\text{out}}}}\\right)',
    scaleFormula: '\\text{limit} = \\pm\\sqrt{\\frac{6}{n_{\\text{in}} + n_{\\text{out}}}}',
    description: 'Balances activation variance across layers. Ideal for Sigmoid and Tanh activations.',
    generate: (fanIn, fanOut) => {
      const limit = Math.sqrt(6.0 / Math.max(1, fanIn + fanOut));
      return (Math.random() * 2 - 1) * limit;
    },
  },
  he: {
    label: 'He / Kaiming (Normal)',
    formula: 'W \\sim \\mathcal{N}\\left(0, \\sqrt{\\frac{2}{n_{\\text{in}}}}\\right)',
    scaleFormula: '\\sigma = \\sqrt{\\frac{2}{n_{\\text{in}}}}',
    description: 'Prevents dying neurons and exploding activations. Specifically designed for ReLU activations.',
    generate: (fanIn) => {
      // Box-Muller transform for standard normal distribution
      const u1 = Math.max(1e-10, Math.random());
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const std = Math.sqrt(2.0 / Math.max(1, fanIn));
      return z0 * std;
    },
  },
  uniform: {
    label: 'Random Uniform [-1, 1]',
    formula: 'W \\sim \\mathcal{U}(-1, 1)',
    scaleFormula: 'W_{ij} \\in [-1, 1]',
    description: 'Uniform random values without variance scaling. Simple baseline to observe saturation.',
    generate: () => Math.random() * 2 - 1,
  },
  zeros: {
    label: 'Zero Initialization (Symmetry Demo)',
    formula: 'W = 0, \\quad \\mathbf{b} = \\mathbf{0}',
    scaleFormula: 'W_{ij} = 0, \\quad b_i = 0',
    description: 'Initializes all weights and biases to 0. Proves why symmetry breaking is required for learning.',
    generate: () => 0,
  },
};

/**
 * Initializes network weights and biases according to layer architecture and strategy.
 * @param {number[]} layerSizes - Array of layer sizes, e.g. [2, 4, 1]
 * @param {string} strategy - 'xavier' | 'he' | 'uniform' | 'zeros'
 * @returns {{ weights: number[][][], biases: number[][] }}
 */
export function initNetwork(layerSizes, strategy = 'xavier') {
  const stratKey = typeof strategy === 'string' ? strategy.toLowerCase().trim() : 'xavier';
  const initConfig = INIT_STRATEGIES[stratKey] || INIT_STRATEGIES.xavier;
  if (!Array.isArray(layerSizes) || layerSizes.length < 2 || layerSizes.some(s => !Number.isInteger(s) || s <= 0)) {
    return { weights: [], biases: [], strategy: stratKey };
  }
  const weights = [];
  const biases = [];

  for (let l = 0; l < layerSizes.length - 1; l++) {
    const fanIn = layerSizes[l];
    const fanOut = layerSizes[l + 1];

    const W = Array.from({ length: fanOut }, () =>
      Array.from({ length: fanIn }, () => initConfig.generate(fanIn, fanOut))
    );

    // Biases initialized to zero (or small constants if needed)
    const b = new Array(fanOut).fill(0);

    weights.push(W);
    biases.push(b);
  }

  return { weights, biases, strategy: stratKey };
}

// -----------------------------------------------------------------------------
// 2. FORWARD PROPAGATION
// Computes pre-activations: z[l] = W[l] · a[l-1] + b[l]
// Computes post-activations: a[l] = activation(z[l])
// -----------------------------------------------------------------------------
export function getHiddenActivationType(hiddenActivationTypes, layerIdx = 0) {
  let raw = 'relu';
  if (typeof hiddenActivationTypes === 'string') {
    raw = hiddenActivationTypes;
  } else if (Array.isArray(hiddenActivationTypes) && hiddenActivationTypes.length > 0) {
    raw = hiddenActivationTypes[layerIdx] ?? hiddenActivationTypes[hiddenActivationTypes.length - 1] ?? 'relu';
  }
  const key = typeof raw === 'string' ? raw.toLowerCase().trim() : 'relu';
  return ACTIVATIONS[key] ? key : 'relu';
}

/**
 * Propagates one input through all layers, recording intermediate z and a vectors.
 * @param {number[]} input - Input vector, e.g. [x1, x2]
 * @param {number[][][]} weights - List of weight matrices [fanOut x fanIn]
 * @param {number[][]} biases - List of bias vectors [fanOut]
 * @param {string[]} hiddenActivationTypes - e.g. ['relu', 'relu']
 * @param {string} outputActivationType - e.g. 'sigmoid'
 * @returns {{ activations: number[][], preActivations: (number[]|null)[] }}
 */
export function forwardPass(
  input,
  weights,
  biases,
  hiddenActivationTypes = ['relu'],
  outputActivationType = 'sigmoid'
) {
  if (!weights || !Array.isArray(weights) || weights.length === 0) {
    return { activations: [input], preActivations: [null] };
  }
  const activations = [input];
  const preActivations = [null]; // Input layer has no pre-activation
  const L = weights.length;

  for (let l = 0; l < L; l++) {
    const W = weights[l] || [];
    const b = biases?.[l] || [];
    const prevA = activations[l] || [];

    // Compute pre-activation z: sum(weight * input) + bias for each neuron
    const z = W.map((row, j) => {
      let sum = (b && Number.isFinite(b[j])) ? b[j] : 0;
      for (let k = 0; k < prevA.length; k++) {
        const wVal = Number.isFinite(row[k]) ? row[k] : 0;
        const aVal = Number.isFinite(prevA[k]) ? prevA[k] : 0;
        sum += wVal * aVal;
      }
      return sum;
    });

    const isOutput = l === L - 1;
    let activType;
    if (isOutput) {
      const outKey = typeof outputActivationType === 'string' ? outputActivationType.toLowerCase().trim() : 'sigmoid';
      activType = ACTIVATIONS[outKey] ? outKey : 'sigmoid';
    } else {
      activType = getHiddenActivationType(hiddenActivationTypes, l);
    }
    const activationFn = (ACTIVATIONS[activType] || ACTIVATIONS.relu).fn;

    preActivations.push(z);
    activations.push(z.map(activationFn));
  }

  return { activations, preActivations };
}

// -----------------------------------------------------------------------------
// 3. LOSS FUNCTIONS
// Binary Cross-Entropy (BCE) and Mean Squared Error (MSE)
// -----------------------------------------------------------------------------
/**
 * Binary Cross-Entropy Loss: L = -(1/N) * sum( y*log(p) + (1-y)*log(1-p) )
 * Used for binary classification with sigmoid output.
 * Uses 1e-15 epsilon clamping to prevent log(0) and log(1-1) in IEEE 754 float64.
 */
export function computeLoss(predictions, targets) {
  if (!predictions || !targets || predictions.length === 0) return 0;
  const eps = 1e-15; // Prevent log(0) and log(1-1) in IEEE 754 float64
  let total = 0;
  const N = predictions.length;
  for (let i = 0; i < N; i++) {
    const pArr = Array.isArray(predictions[i]) ? predictions[i] : [predictions[i]];
    const yArr = Array.isArray(targets[i]) ? targets[i] : [targets[i]];
    for (let j = 0; j < pArr.length; j++) {
      const rawP = pArr[j];
      const p = Number.isFinite(rawP) ? Math.max(eps, Math.min(1 - eps, rawP)) : 0.5;
      const rawY = yArr[j];
      const y = Number.isFinite(rawY) ? rawY : 0;
      total -= y * Math.log(p) + (1 - y) * Math.log(1 - p);
    }
  }
  return total / N;
}

/**
 * Mean Squared Error Loss: MSE = (1 / 2N) * sum( (p - y)^2 )
 * Fundamental educational loss function for regression and baseline perceptrons.
 */
export function computeMSE(predictions, targets) {
  if (!predictions || !targets || predictions.length === 0) return 0;
  let total = 0;
  const N = predictions.length;
  for (let i = 0; i < N; i++) {
    const pArr = Array.isArray(predictions[i]) ? predictions[i] : [predictions[i]];
    const yArr = Array.isArray(targets[i]) ? targets[i] : [targets[i]];
    for (let j = 0; j < pArr.length; j++) {
      const rawP = pArr[j];
      const rawY = yArr[j];
      const p = Number.isFinite(rawP) ? rawP : 0;
      const y = Number.isFinite(rawY) ? rawY : 0;
      const diff = p - y;
      total += diff * diff;
    }
  }
  return total / (2 * N);
}

// -----------------------------------------------------------------------------
// 4. BACKPROPAGATION ALGORITHM
// Computes error signals (deltas) via Chain Rule and partial derivatives:
// δ[L] = a[L] - y  (for BCE with sigmoid output)
// δ[l] = (W[l]ᵀ · δ[l+1]) ⊙ activation'(z[l])
// ∂L/∂W[l] = δ[l+1] · a[l]ᵀ
// ∂L/∂b[l] = δ[l+1]
// -----------------------------------------------------------------------------
export function backprop(
  targets,
  activations,
  preActivations,
  weights,
  hiddenActivationTypes = ['relu'],
  outputActivationType = 'sigmoid'
) {
  if (!weights || !Array.isArray(weights) || weights.length === 0) {
    return { dWeights: [], dBiases: [], deltas: [] };
  }
  const L = weights.length;
  const dWeights = weights.map(W => W.map(row => row.map(() => 0)));
  const dBiases = weights.map(W => new Array(W.length).fill(0));
  const deltas = new Array(L + 1).fill(null);

  // 1. Output layer error delta: (a[L] - y) for sigmoid + BCE
  const targetArr = Array.isArray(targets) ? targets : [targets];
  deltas[L] = activations[L].map((val, j) => {
    const yVal = Number.isFinite(targetArr[j]) ? targetArr[j] : 0;
    const aVal = Number.isFinite(val) ? val : 0;
    return aVal - yVal;
  });

  // 2. Backward propagation through hidden layers
  for (let l = L - 1; l >= 1; l--) {
    const activType = getHiddenActivationType(hiddenActivationTypes, l - 1);
    const actDeriv = (ACTIVATIONS[activType] || ACTIVATIONS.relu).derivative;
    const z = preActivations[l];
    const nextDelta = deltas[l + 1];
    const nextW = weights[l];

    deltas[l] = z.map((zVal, j) => {
      let sum = 0;
      for (let k = 0; k < nextDelta.length; k++) {
        sum += (nextW?.[k]?.[j] ?? 0) * (nextDelta[k] ?? 0);
      }
      return sum * actDeriv(zVal);
    });
  }

  // 3. Accumulate parameter gradients
  for (let l = 0; l < L; l++) {
    const delta = deltas[l + 1];
    const prevA = activations[l];

    for (let j = 0; j < delta.length; j++) {
      for (let k = 0; k < prevA.length; k++) {
        dWeights[l][j][k] += delta[j] * prevA[k];
      }
      dBiases[l][j] += delta[j];
    }
  }

  return { dWeights, dBiases, deltas };
}

// -----------------------------------------------------------------------------
// 5. GRADIENT DESCENT PARAMETER UPDATES
// W = W - learningRate * dW
// b = b - learningRate * db
// -----------------------------------------------------------------------------
export function updateWeights(weights, biases, dWeights, dBiases, lr) {
  const validLr = Number.isFinite(lr) ? lr : 0.01;
  return {
    weights: weights.map((W, l) =>
      W.map((row, j) =>
        row.map((w, k) => {
          const dw = dWeights?.[l]?.[j]?.[k] ?? 0;
          return w - validLr * (Number.isFinite(dw) ? dw : 0);
        })
      )
    ),
    biases: biases.map((b, l) =>
      b.map((val, j) => {
        const db = dBiases?.[l]?.[j] ?? 0;
        return val - validLr * (Number.isFinite(db) ? db : 0);
      })
    ),
  };
}

// -----------------------------------------------------------------------------
// 6. DECISION BOUNDARY GRID COMPUTATION
// Samples a gridSize x gridSize 2D lattice over [0,1]² to visualize learned boundary.
// -----------------------------------------------------------------------------
export function computeDecisionBoundary(
  weights,
  biases,
  hiddenActivationTypes = ['relu'],
  gridSize = 40
) {
  if (!weights || !Array.isArray(weights) || weights.length === 0 || gridSize <= 0) return [];
  const L = weights.length;
  const grid = [];

  for (let row = 0; row < gridSize; row++) {
    const gridRow = [];
    for (let col = 0; col < gridSize; col++) {
      const x1 = gridSize === 1 ? 0.5 : col / (gridSize - 1);
      const x2 = gridSize === 1 ? 0.5 : 1 - row / (gridSize - 1); // Flip row so row=0 is top (x2 = 1)
      const { activations } = forwardPass([x1, x2], weights, biases, hiddenActivationTypes);
      const outVal = activations?.[L]?.[0];
      gridRow.push(Number.isFinite(outVal) ? outVal : 0.5);
    }
    grid.push(gridRow);
  }

  return grid;
}
