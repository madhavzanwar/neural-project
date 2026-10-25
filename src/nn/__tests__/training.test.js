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

  it('handles empty datasets safely without division by zero or NaN propagation', () => {
    const net = initNetwork([2, 3, 1], 'xavier');
    const trainRes = trainOneEpoch(net.weights, net.biases, ['relu'], 0.1, []);
    expect(trainRes.loss).toBe(0);
    expect(trainRes.accuracy).toBe(0);
    expect(trainRes.weights).toEqual(net.weights);

    const evalRes = evaluateDataset(net.weights, net.biases, ['relu'], []);
    expect(evalRes.accuracy).toBe(0);
    expect(evalRes.avgLoss).toBe(0);
    expect(evalRes.totalCount).toBe(0);
  });

  it('supports string activation types and multi-layer networks in training', () => {
    const net = initNetwork([2, 3, 3, 1], 'xavier');
    const res = trainOneEpoch(net.weights, net.biases, 'tanh', 0.2, XOR_DATA);
    expect(Number.isFinite(res.loss)).toBe(true);
    expect(Number.isFinite(res.accuracy)).toBe(true);
  });

  it('safely handles corrupted sample labels without NaN propagation', () => {
    const net = initNetwork([2, 3, 1], 'xavier');
    const dirtyData = [
      { input: [0, 1], label: NaN },
      { input: [1, 0], label: undefined },
      { input: [1, 1], label: 1 },
    ];
    const trainRes = trainOneEpoch(net.weights, net.biases, ['relu'], 0.1, dirtyData);
    expect(Number.isFinite(trainRes.loss)).toBe(true);
    expect(Number.isFinite(trainRes.accuracy)).toBe(true);

    const evalRes = evaluateDataset(net.weights, net.biases, ['relu'], dirtyData);
    expect(Number.isFinite(evalRes.avgLoss)).toBe(true);
    expect(Number.isFinite(evalRes.accuracy)).toBe(true);
  });
});
