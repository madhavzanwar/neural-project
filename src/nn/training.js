// =============================================================================
// TRAINING LOOP & EVALUATION (SYLLABUS UNIT II: 3 & 4)
// =============================================================================
// Implements genuine epoch training using full-batch gradient descent.
// Strictly computes real forward passes, real analytical backpropagation,
// real parameter updates, and real accuracy calculated from model outputs.
// No simulated or fabricated numbers.
// =============================================================================

import { XOR_DATA } from './datasets.js';
import { forwardPass, computeLoss, backprop, updateWeights } from './network.js';

/**
 * Runs one complete training epoch over the given dataset.
 * 1. Computes forward pass for each sample.
 * 2. Computes loss and accumulates gradients via backpropagation.
 * 3. Averages gradients across all N samples (full-batch gradient descent).
 * 4. Updates weights and biases using the learning rate.
 *
 * @param {number[][][]} weights - Network weight matrices
 * @param {number[][]} biases - Network bias vectors
 * @param {string[]} hiddenActivationTypes - e.g. ['relu']
 * @param {number} lr - Learning rate (e.g. 0.3)
 * @param {Array<{ input: number[], label: number }>} dataset - Training dataset
 * @returns {{
 *   weights: number[][][],
 *   biases: number[][],
 *   loss: number,
 *   accuracy: number,
 *   predictions: number[][],
 *   avgDW: number[][][],
 *   avgDB: number[][]
 * }}
 */
export function trainOneEpoch(
  weights,
  biases,
  hiddenActivationTypes = ['relu'],
  lr = 0.3,
  dataset = XOR_DATA
) {
  if (!dataset || dataset.length === 0) {
    return {
      weights,
      biases,
      loss: 0,
      accuracy: 0,
      predictions: [],
      avgDW: weights.map(W => W.map(row => row.map(() => 0))),
      avgDB: biases.map(b => b.map(() => 0)),
    };
  }

  const L = weights.length;
  const N = dataset.length;

  // Initialize gradient accumulators to zero
  const totalDW = weights.map(W => W.map(row => row.map(() => 0)));
  const totalDB = weights.map(W => new Array(W.length).fill(0));

  const allPredictions = [];
  const allTargets = [];
  let correctCount = 0;

  for (const { input, label } of dataset) {
    // 1. Forward propagation
    const { activations, preActivations } = forwardPass(
      input,
      weights,
      biases,
      hiddenActivationTypes,
      'sigmoid'
    );

    const outputProb = activations[L][0];
    allPredictions.push(activations[L]);
    const targetVal = Array.isArray(label) ? label[0] : label;
    allTargets.push(targetVal);

    // Calculate real classification accuracy (threshold = 0.5)
    // Guard against NaN so invalid predictions are never counted as correct
    const isFiniteOutput = Number.isFinite(outputProb);
    const predictedClass = isFiniteOutput ? (outputProb >= 0.5 ? 1 : 0) : -1;
    if (isFiniteOutput && predictedClass === targetVal) {
      correctCount++;
    }

    // 2. Analytical backpropagation (Chain Rule)
    const { dWeights, dBiases } = backprop(
      Array.isArray(label) ? label : [label],
      activations,
      preActivations,
      weights,
      hiddenActivationTypes
    );

    // 3. Accumulate gradients across all samples
    for (let l = 0; l < L; l++) {
      for (let j = 0; j < dWeights[l].length; j++) {
        for (let k = 0; k < dWeights[l][j].length; k++) {
          totalDW[l][j][k] += dWeights[l][j][k];
        }
        totalDB[l][j] += dBiases[l][j];
      }
    }
  }

  // 4. Compute average gradient (Batch Gradient Descent)
  const avgDW = totalDW.map(W => W.map(row => row.map(v => v / N)));
  const avgDB = totalDB.map(b => b.map(v => v / N));

  // 5. Update weights: W = W - lr * dW
  const { weights: newWeights, biases: newBiases } = updateWeights(
    weights,
    biases,
    avgDW,
    avgDB,
    lr
  );

  // 6. Compute genuine loss and accuracy
  const loss = computeLoss(allPredictions, allTargets);
  const accuracy = N > 0 ? (correctCount / N) * 100 : 0;

  return {
    weights: newWeights,
    biases: newBiases,
    loss,
    accuracy,
    predictions: allPredictions,
    avgDW,
    avgDB,
  };
}

/**
 * Evaluates the network on a dataset without updating weights.
 * Returns per-point details: inputs, target, prediction, confidence, sample loss.
 */
export function evaluateDataset(
  weights,
  biases,
  hiddenActivationTypes = ['relu'],
  dataset = XOR_DATA
) {
  if (!dataset || dataset.length === 0) {
    return {
      results: [],
      accuracy: 0,
      avgLoss: 0,
      correctCount: 0,
      totalCount: 0,
    };
  }

  const L = weights.length;
  let correctCount = 0;
  const eps = 1e-12;

  const results = dataset.map(({ input, label }) => {
    const { activations, preActivations } = forwardPass(
      input,
      weights,
      biases,
      hiddenActivationTypes,
      'sigmoid'
    );

    const rawOutput = activations[L][0];
    const isFiniteOutput = Number.isFinite(rawOutput);
    const targetVal = Array.isArray(label) ? label[0] : label;
    const predictedClass = isFiniteOutput ? (rawOutput >= 0.5 ? 1 : 0) : -1;
    const isCorrect = isFiniteOutput && predictedClass === targetVal;
    if (isCorrect) correctCount++;

    // Distance from decision boundary (0.5), scaled from 0% to 100%
    const confidence = isFiniteOutput
      ? Math.min(100, Math.max(0, Math.abs(rawOutput - 0.5) * 2 * 100))
      : 0;

    // Per-sample binary cross-entropy loss
    const p = isFiniteOutput ? Math.max(eps, Math.min(1 - eps, rawOutput)) : 0.5;
    const sampleLoss = -(targetVal * Math.log(p) + (1 - targetVal) * Math.log(1 - p));

    return {
      input,
      label,
      rawOutput,
      predictedClass,
      confidence,
      isCorrect,
      sampleLoss,
      activations,
      preActivations,
    };
  });

  const accuracy = (correctCount / dataset.length) * 100;
  const avgLoss = results.reduce((acc, r) => acc + r.sampleLoss, 0) / dataset.length;

  return {
    results,
    accuracy,
    avgLoss,
    correctCount,
    totalCount: dataset.length,
  };
}
