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
    description: 'Scale = sqrt(6 / (fan_in + fan_out)). Balances activation variance across layers. Ideal for Sigmoid and Tanh activations.',
    generate: (fanIn, fanOut) => {
      const limit = Math.sqrt(6.0 / (fanIn + fanOut));
      return (Math.random() * 2 - 1) * limit;
    },
  },
  he: {
    label: 'He / Kaiming (Normal)',
    description: 'Scale = sqrt(2 / fan_in). Prevents dying neurons and exploding activations. Specifically designed for ReLU activations.',
    generate: (fanIn) => {
      // Box-Muller transform for standard normal distribution
      const u1 = Math.max(1e-10, Math.random());
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const std = Math.sqrt(2.0 / fanIn);
      return z0 * std;
    },
  },
  uniform: {
    label: 'Random Uniform [-1, 1]',
    description: 'Uniform random values between -1 and 1 without variance scaling. Simple baseline to observe saturation or slow convergence.',
    generate: () => Math.random() * 2 - 1,
  },
  zeros: {
    label: 'Zero Initialization (Symmetry Breakdown Demo)',
    description: 'Initializes all weights and biases to 0. Proves why symmetry breaking is required: all hidden neurons compute identical outputs and gradients, preventing the network from learning complex features.',
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
  const initConfig = INIT_STRATEGIES[strategy] || INIT_STRATEGIES.xavier;
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

  return { weights, biases, strategy };
}

// -----------------------------------------------------------------------------
// 2. FORWARD PROPAGATION
// Computes pre-activations: z[l] = W[l] · a[l-1] + b[l]
// Computes post-activations: a[l] = activation(z[l])
// -----------------------------------------------------------------------------
export function getHiddenActivationType(hiddenActivationTypes, layerIdx = 0) {
  if (typeof hiddenActivationTypes === 'string') {
    return hiddenActivationTypes;
  }
  if (Array.isArray(hiddenActivationTypes)) {
    return hiddenActivationTypes[layerIdx] || hiddenActivationTypes[0] || 'relu';
  }
  return 'relu';
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
  const activations = [input];
  const preActivations = [null]; // Input layer has no pre-activation
  const L = weights.length;

  for (let l = 0; l < L; l++) {
    const W = weights[l];
    const b = biases[l];
    const prevA = activations[l];

    // Compute pre-activation z: sum(weight * input) + bias for each neuron
    const z = W.map((row, j) => {
      let sum = b[j];
      for (let k = 0; k < prevA.length; k++) {
        sum += row[k] * prevA[k];
      }
      return sum;
    });

    const isOutput = l === L - 1;
    const activType = isOutput ? outputActivationType : getHiddenActivationType(hiddenActivationTypes, l);
    const activationFn = (ACTIVATIONS[activType] || ACTIVATIONS.sigmoid).fn;

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
 */
export function computeLoss(predictions, targets) {
  const eps = 1e-12; // Prevent log(0)
  let total = 0;
  for (let i = 0; i < predictions.length; i++) {
    const rawP = Array.isArray(predictions[i]) ? predictions[i][0] : predictions[i];
    const p = Math.max(eps, Math.min(1 - eps, rawP));
    const rawY = Array.isArray(targets[i]) ? targets[i][0] : targets[i];
    total -= rawY * Math.log(p) + (1 - rawY) * Math.log(1 - p);
  }
  return total / predictions.length;
}

/**
 * Mean Squared Error Loss: MSE = (1 / 2N) * sum( (p - y)^2 )
 * Fundamental educational loss function for regression and baseline perceptrons.
 */
export function computeMSE(predictions, targets) {
  let total = 0;
  for (let i = 0; i < predictions.length; i++) {
    const p = Array.isArray(predictions[i]) ? predictions[i][0] : predictions[i];
    const y = Array.isArray(targets[i]) ? targets[i][0] : targets[i];
    const diff = p - y;
    total += diff * diff;
  }
  return total / (2 * predictions.length);
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
  hiddenActivationTypes = ['relu']
) {
  const L = weights.length;
  const dWeights = weights.map(W => W.map(row => row.map(() => 0)));
  const dBiases = weights.map(W => new Array(W.length).fill(0));
  const deltas = new Array(L + 1).fill(null);

  // 1. Output layer error delta: (a[L] - y) for sigmoid + BCE
  const targetArr = Array.isArray(targets) ? targets : [targets];
  deltas[L] = activations[L].map((val, j) => val - targetArr[j]);

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
        sum += nextW[k][j] * nextDelta[k];
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
  return {
    weights: weights.map((W, l) =>
      W.map((row, j) => row.map((w, k) => w - lr * dWeights[l][j][k]))
    ),
    biases: biases.map((b, l) =>
      b.map((val, j) => val - lr * dBiases[l][j])
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
  const L = weights.length;
  const grid = [];

  for (let row = 0; row < gridSize; row++) {
    const gridRow = [];
    for (let col = 0; col < gridSize; col++) {
      const x1 = col / (gridSize - 1);
      const x2 = 1 - row / (gridSize - 1); // Flip row so row=0 is top (x2 = 1)
      const { activations } = forwardPass([x1, x2], weights, biases, hiddenActivationTypes);
      gridRow.push(activations[L][0]);
    }
    grid.push(gridRow);
  }

  return grid;
}
