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
  dataset = XOR_DATA
) {
  const N = dataset.length;
  const L = weights.length;

  // 1. Analytical gradient via backpropagation (averaged across dataset)
  let totalDW = 0;
  for (const { input, label } of dataset) {
    const { activations, preActivations } = forwardPass(
      input,
      weights,
      biases,
      hiddenActivationTypes,
      'sigmoid'
    );
    const { dWeights } = backprop(
      [label],
      activations,
      preActivations,
      weights,
      hiddenActivationTypes
    );
    totalDW += dWeights[l][j][k];
  }
  const analyticalGrad = totalDW / N;

  // 2. Numerical gradient via centered finite difference
  const perturb = (sign) =>
    weights.map((layer, li) =>
      layer.map((row, ji) =>
        row.map((w, ki) =>
          li === l && ji === j && ki === k ? w + sign * epsilon : w
        )
      )
    );

  const evalLoss = (perturbedWeights) => {
    const predictions = dataset.map(({ input }) => {
      const { activations } = forwardPass(
        input,
        perturbedWeights,
        biases,
        hiddenActivationTypes,
        'sigmoid'
      );
      return activations[L];
    });
    return computeLoss(predictions, dataset.map((d) => d.label));
  };

  const lossPlus = evalLoss(perturb(+1));
  const lossMinus = evalLoss(perturb(-1));
  const numericalGrad = (lossPlus - lossMinus) / (2 * epsilon);

  const absError = Math.abs(analyticalGrad - numericalGrad);
  const relError =
    absError / Math.max(Math.abs(analyticalGrad) + Math.abs(numericalGrad), 1e-10);

  // Gradient check passes if relative error is within standard tolerance 1e-3
  const passed = relError < 1e-3 || absError < 1e-5;

  return {
    analyticalGrad,
    numericalGrad,
    absError,
    relError,
    passed,
    epsilon,
    currentWeight: weights[l][j][k],
  };
}
