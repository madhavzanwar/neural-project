import { describe, it, expect } from 'vitest';
import {
  initNetwork,
  INIT_STRATEGIES,
  forwardPass,
  computeLoss,
  computeMSE,
  backprop,
  updateWeights,
  computeDecisionBoundary,
} from '../network.js';

describe('Neural Network Mathematical Core', () => {
  describe('Weight Initialization (Syllabus Unit II)', () => {
    it('creates correct weight matrix and bias vector dimensions', () => {
      const { weights, biases } = initNetwork([2, 4, 1]);
      // Layer 0 -> Layer 1
      expect(weights[0]).toHaveLength(4); // 4 output neurons
      expect(weights[0][0]).toHaveLength(2); // 2 inputs
      expect(biases[0]).toHaveLength(4);

      // Layer 1 -> Layer 2
      expect(weights[1]).toHaveLength(1); // 1 output neuron
      expect(weights[1][0]).toHaveLength(4); // 4 inputs from hidden layer
      expect(biases[1]).toHaveLength(1);
    });

    it('initializes zero weights and biases when zeros strategy is selected', () => {
      const { weights, biases } = initNetwork([2, 3, 1], 'zeros');
      for (const layer of weights) {
        for (const row of layer) {
          for (const w of row) {
            expect(w).toBe(0);
          }
        }
      }
      for (const bLayer of biases) {
        for (const b of bLayer) {
          expect(b).toBe(0);
        }
      }
    });

    it('respects Xavier uniform variance bounds: limit = sqrt(6 / (fan_in + fan_out))', () => {
      const { weights } = initNetwork([2, 4, 1], 'xavier');
      const limit = Math.sqrt(6.0 / (2 + 4));
      for (const row of weights[0]) {
        for (const w of row) {
          expect(Math.abs(w)).toBeLessThanOrEqual(limit);
        }
      }
    });

    it('supports He initialization strategy with non-zero variance', () => {
      const { weights } = initNetwork([4, 8, 1], 'he');
      let nonZeroCount = 0;
      for (const row of weights[0]) {
        for (const w of row) {
          if (w !== 0) nonZeroCount++;
        }
      }
      expect(nonZeroCount).toBe(4 * 8);
    });
  });

  describe('Forward Propagation (Syllabus Unit I)', () => {
    it('accurately computes z = sum(w*x) + b and a = f(z) numerically', () => {
      // Deterministic small network: 2 inputs -> 1 output
      // w = [[0.5, -0.5]], b = [0.2], input = [1.0, 2.0]
      // z = 0.5*1.0 + (-0.5)*2.0 + 0.2 = 0.5 - 1.0 + 0.2 = -0.3
      // a = sigmoid(-0.3) = 1 / (1 + exp(0.3)) ≈ 0.425557
      const weights = [[[0.5, -0.5]]];
      const biases = [[0.2]];
      const input = [1.0, 2.0];

      const { activations, preActivations } = forwardPass(input, weights, biases, [], 'sigmoid');

      expect(preActivations[1][0]).toBeCloseTo(-0.3, 5);
      const expectedSigmoid = 1 / (1 + Math.exp(0.3));
      expect(activations[1][0]).toBeCloseTo(expectedSigmoid, 5);
    });

    it('records preActivations and activations for all layers', () => {
      const { weights, biases } = initNetwork([2, 3, 1], 'xavier');
      const input = [0.5, 0.8];
      const { activations, preActivations } = forwardPass(input, weights, biases, ['relu'], 'sigmoid');

      expect(activations).toHaveLength(3); // input, hidden, output
      expect(preActivations).toHaveLength(3);
      expect(preActivations[0]).toBeNull(); // No pre-activation for raw input
      expect(preActivations[1]).toHaveLength(3);
      expect(preActivations[2]).toHaveLength(1);
      expect(activations[1]).toHaveLength(3);
      expect(activations[2]).toHaveLength(1);
    });
  });

  describe('Loss Functions (Syllabus Unit II)', () => {
    it('computes binary cross-entropy (BCE) correctly for exact probabilities', () => {
      const predictions = [[0.9], [0.1]];
      const targets = [1, 0];
      // Sample 1: -log(0.9) ≈ 0.10536
      // Sample 2: -log(1 - 0.1) = -log(0.9) ≈ 0.10536
      // Average: 0.10536
      const loss = computeLoss(predictions, targets);
      expect(loss).toBeCloseTo(-Math.log(0.9), 5);
    });

    it('computes mean squared error (MSE) correctly', () => {
      const predictions = [[0.8], [0.4]];
      const targets = [1.0, 0.0];
      // ( (0.8 - 1)^2 + (0.4 - 0)^2 ) / (2 * 2) = (0.04 + 0.16) / 4 = 0.20 / 4 = 0.05
      const mse = computeMSE(predictions, targets);
      expect(mse).toBeCloseTo(0.05, 5);
    });

    it('clamps BCE predictions safely to avoid NaN or Infinity when p = 0 or p = 1', () => {
      const predictions = [[0.0], [1.0]];
      const targets = [1, 0];
      const loss = computeLoss(predictions, targets);
      expect(Number.isFinite(loss)).toBe(true);
      expect(loss).toBeGreaterThan(0);
    });
  });

  describe('Backpropagation & Parameter Updates (Syllabus Unit II)', () => {
    it('computes correct gradient shapes matching weights and biases', () => {
      const { weights, biases } = initNetwork([2, 4, 1], 'xavier');
      const input = [1, 0];
      const target = [1];
      const { activations, preActivations } = forwardPass(input, weights, biases, ['relu'], 'sigmoid');
      const { dWeights, dBiases, deltas } = backprop(target, activations, preActivations, weights, ['relu']);

      expect(dWeights).toHaveLength(2);
      expect(dWeights[0]).toHaveLength(4);
      expect(dWeights[0][0]).toHaveLength(2);
      expect(dWeights[1]).toHaveLength(1);
      expect(dWeights[1][0]).toHaveLength(4);

      expect(dBiases[0]).toHaveLength(4);
      expect(dBiases[1]).toHaveLength(1);
      expect(deltas).toHaveLength(3);
    });

    it('updates parameters in opposite direction of gradient according to learning rate', () => {
      const weights = [[[1.0, 2.0]]];
      const biases = [[0.5]];
      const dWeights = [[[0.2, -0.4]]];
      const dBiases = [[0.1]];
      const lr = 0.5;

      const updated = updateWeights(weights, biases, dWeights, dBiases, lr);

      // W_new = W - lr * dW
      // w0 = 1.0 - 0.5 * 0.2 = 0.9
      // w1 = 2.0 - 0.5 * (-0.4) = 2.2
      // b = 0.5 - 0.5 * 0.1 = 0.45
      expect(updated.weights[0][0][0]).toBeCloseTo(0.9, 5);
      expect(updated.weights[0][0][1]).toBeCloseTo(2.2, 5);
      expect(updated.biases[0][0]).toBeCloseTo(0.45, 5);
    });
  });

  describe('Decision Boundary Sampling', () => {
    it('produces a square grid of probability outputs bounded in [0, 1]', () => {
      const { weights, biases } = initNetwork([2, 3, 1], 'xavier');
      const grid = computeDecisionBoundary(weights, biases, ['relu'], 10);
      expect(grid).toHaveLength(10);
      expect(grid[0]).toHaveLength(10);
      for (const row of grid) {
        for (const val of row) {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(1);
        }
      }
    });
  });
});
