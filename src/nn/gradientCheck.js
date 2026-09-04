// =============================================================================
// NUMERICAL GRADIENT VERIFICATION (SYLLABUS UNIT II: 4. Backpropagation)
// =============================================================================
// Verifies that the analytical backpropagation gradient matches the numerical
// estimate computed via symmetric (centered) finite-difference:
//
//   ∂L/∂w ≈ [L(w + ε) - L(w - ε)] / (2ε)
//
// This is the standard numerical gradient check used in machine learning
// (e.g. torch.autograd.gradcheck) to validate that chain rule calculations
// are mathematically accurate.
// =============================================================================

import { forwardPass, computeLoss, backprop } from './network.js';
import { XOR_DATA } from './datasets.js';

/**
 * Runs a finite-difference numerical gradient check for weight W[l][j][k].
 * @param {number[][][]} weights - Network weight matrices
 * @param {number[][]} biases - Network bias vectors
 * @param {string[]} hiddenActivationTypes - e.g. ['relu']
 * @param {number} l - Layer index
 * @param {number} j - Output neuron index
 * @param {number} k - Input neuron index
 * @param {number} epsilon - Perturbation delta (default 1e-4)
 * @param {Array<{ input: number[], label: number }>} dataset - Training dataset
 * @returns {{
 *   analyticalGrad: number,
 *   numericalGrad: number,
 *   absError: number,
 *   relError: number,
 *   passed: boolean,
 *   epsilon: number
 * }}
 */
export function runGradientCheck(
  weights,
  biases,
  hiddenActivationTypes = ['relu'],
  l = 0,
  j = 0,
  k = 0,
  epsilon = 1e-4,
  dataset = XOR_DATA,
  checkBias = false
) {
  if (!dataset || dataset.length === 0) {
    return {
      analyticalGrad: 0,
      numericalGrad: 0,
      absError: 0,
      relError: 0,
      passed: false,
      epsilon,
      currentWeight: 0,
      error: 'Empty dataset',
    };
  }

  const N = dataset.length;
  const L = weights.length;

  if (l < 0 || l >= L) {
    return {
      analyticalGrad: 0,
      numericalGrad: 0,
      absError: 0,
      relError: 0,
      passed: false,
      epsilon,
      currentWeight: 0,
      error: `Layer index l=${l} out of bounds [0, ${L - 1}]`,
    };
  }

  if (epsilon <= 0) {
    return {
      analyticalGrad: 0,
      numericalGrad: 0,
      absError: 0,
      relError: 0,
      passed: false,
      epsilon,
      currentWeight: 0,
      error: 'Epsilon must be positive',
    };
  }

  // 1. Analytical gradient via backpropagation (averaged across dataset)
  let totalGrad = 0;
  for (const { input, label } of dataset) {
    const { activations, preActivations } = forwardPass(
      input,
      weights,
      biases,
      hiddenActivationTypes,
      'sigmoid'
    );
    const { dWeights, dBiases } = backprop(
      Array.isArray(label) ? label : [label],
      activations,
      preActivations,
      weights,
      hiddenActivationTypes
    );
    totalGrad += checkBias ? dBiases[l][j] : dWeights[l][j][k];
  }
  const analyticalGrad = totalGrad / N;

  // 2. Numerical gradient via centered finite difference
  const perturbWeights = (sign) =>
    weights.map((layer, li) =>
      layer.map((row, ji) =>
        row.map((w, ki) =>
          !checkBias && li === l && ji === j && ki === k ? w + sign * epsilon : w
        )
      )
    );

  const perturbBiases = (sign) =>
    biases.map((bLayer, li) =>
      bLayer.map((b, ji) =>
        checkBias && li === l && ji === j ? b + sign * epsilon : b
      )
    );

  const evalLoss = (perturbedWeights, perturbedBiases) => {
    const predictions = dataset.map(({ input }) => {
      const { activations } = forwardPass(
        input,
        perturbedWeights,
        perturbedBiases,
        hiddenActivationTypes,
        'sigmoid'
      );
      return activations[L];
    });
    return computeLoss(predictions, dataset.map((d) => d.label));
  };

  const lossPlus = evalLoss(perturbWeights(+1), perturbBiases(+1));
  const lossMinus = evalLoss(perturbWeights(-1), perturbBiases(-1));
  const numericalGrad = (lossPlus - lossMinus) / (2 * epsilon);

  const absError = Math.abs(analyticalGrad - numericalGrad);
  const denom = Math.max(Math.abs(analyticalGrad) + Math.abs(numericalGrad), 1e-10);
  const relError = absError / denom;

  // Gradient check passes if relative error is within standard tolerance 1e-3 or absolute error is tiny
  const passed = relError < 1e-3 || absError < 1e-5;

  return {
    analyticalGrad,
    numericalGrad,
    absError,
    relError,
    passed,
    epsilon,
    currentWeight: checkBias ? biases[l][j] : weights[l][j][k],
  };
}
