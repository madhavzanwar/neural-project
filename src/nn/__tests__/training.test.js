import { describe, it, expect } from 'vitest';
import { initNetwork } from '../network.js';
import { trainOneEpoch, evaluateDataset } from '../training.js';
import { AND_DATA, XOR_DATA } from '../datasets.js';

describe('Training Loop & Evaluation (Syllabus Unit II)', () => {
  it('trainOneEpoch returns updated weights, biases, real loss, and accuracy', () => {
    const net = initNetwork([2, 4, 1], 'xavier');
    const result = trainOneEpoch(net.weights, net.biases, ['relu'], 0.3, XOR_DATA);

    expect(result).toHaveProperty('weights');
    expect(result).toHaveProperty('biases');
    expect(result).toHaveProperty('loss');
    expect(result).toHaveProperty('accuracy');
    expect(result.accuracy).toBeGreaterThanOrEqual(0);
    expect(result.accuracy).toBeLessThanOrEqual(100);
    expect(Number.isFinite(result.loss)).toBe(true);

    // Verify weights actually updated
    expect(result.weights).not.toEqual(net.weights);
  });

  it('progressively decreases loss when training on linearly separable AND data', () => {
    let { weights, biases } = initNetwork([2, 4, 1], 'xavier');
    const initialLoss = trainOneEpoch(weights, biases, ['relu'], 0.5, AND_DATA).loss;

    // Train 100 epochs
    let currentLoss = initialLoss;
    for (let e = 0; e < 100; e++) {
      const step = trainOneEpoch(weights, biases, ['relu'], 0.5, AND_DATA);
      weights = step.weights;
      biases = step.biases;
      currentLoss = step.loss;
    }

    // Loss must decrease on AND data
    expect(currentLoss).toBeLessThan(initialLoss);
  });

  it('evaluates dataset correctly without mutating weights', () => {
    const net = initNetwork([2, 3, 1], 'xavier');
    const originalWeights = JSON.parse(JSON.stringify(net.weights));

    const evalResult = evaluateDataset(net.weights, net.biases, ['relu'], XOR_DATA);

    expect(net.weights).toEqual(originalWeights);
    expect(evalResult.results).toHaveLength(4);
    expect(evalResult.totalCount).toBe(4);
    expect(evalResult.correctCount).toBeGreaterThanOrEqual(0);
    expect(evalResult.accuracy).toBe((evalResult.correctCount / 4) * 100);
    for (const r of evalResult.results) {
      expect(r).toHaveProperty('input');
      expect(r).toHaveProperty('label');
      expect(r).toHaveProperty('rawOutput');
      expect(r).toHaveProperty('predictedClass');
      expect(r).toHaveProperty('confidence');
      expect(r).toHaveProperty('sampleLoss');
    }
  });
});
