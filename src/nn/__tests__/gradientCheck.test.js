import { describe, it, expect } from 'vitest';
import { initNetwork } from '../network.js';
import { runGradientCheck } from '../gradientCheck.js';
import { XOR_DATA, AND_DATA } from '../datasets.js';

describe('Numerical Gradient Verification (Syllabus Unit II)', () => {
  it('confirms backpropagation matches finite-difference gradient on XOR data', () => {
    // 2 inputs -> 3 hidden neurons (tanh) -> 1 output
    const net = initNetwork([2, 3, 1], 'xavier');
    const result = runGradientCheck(net.weights, net.biases, ['tanh'], 0, 0, 0, 1e-4, XOR_DATA);

    expect(result.passed).toBe(true);
    expect(result.relError).toBeLessThan(1e-3);
    expect(Number.isFinite(result.analyticalGrad)).toBe(true);
    expect(Number.isFinite(result.numericalGrad)).toBe(true);
  });

  it('confirms backpropagation matches finite-difference gradient on output layer', () => {
    const net = initNetwork([2, 4, 1], 'xavier');
    // Layer 1 is output layer
    const result = runGradientCheck(net.weights, net.biases, ['tanh'], 1, 0, 0, 1e-4, AND_DATA);

    expect(result.passed).toBe(true);
    expect(result.absError).toBeLessThan(1e-4);
  });

  it('verifies analytical gradients for all 4 syllabus activations (sigmoid, relu, tanh, linear)', () => {
    for (const act of ['sigmoid', 'tanh', 'relu', 'linear']) {
      const net = initNetwork([2, 4, 1], 'xavier');
      const res = runGradientCheck(net.weights, net.biases, [act], 0, 0, 0, 1e-4, XOR_DATA);
      expect(res.passed).toBe(true);
      expect(Number.isFinite(res.analyticalGrad)).toBe(true);
      expect(Number.isFinite(res.numericalGrad)).toBe(true);
    }
  });

  it('verifies backpropagation when activation is passed as a string or uppercase', () => {
    const net = initNetwork([2, 3, 1], 'xavier');
    const resString = runGradientCheck(net.weights, net.biases, 'tanh', 0, 0, 0, 1e-4, XOR_DATA);
    expect(resString.passed).toBe(true);

    const resUpper = runGradientCheck(net.weights, net.biases, ['Tanh'], 0, 0, 0, 1e-4, XOR_DATA);
    expect(resUpper.passed).toBe(true);
  });

  it('verifies backpropagation across multiple hidden layers [2, 3, 3, 1]', () => {
    const net = initNetwork([2, 3, 3, 1], 'xavier');
    for (let l = 0; l < net.weights.length; l++) {
      const res = runGradientCheck(net.weights, net.biases, ['tanh'], l, 0, 0, 1e-4, XOR_DATA);
      expect(res.passed).toBe(true);
    }
  });

  it('verifies bias gradients numerically using checkBias: true', () => {
    const net = initNetwork([2, 3, 1], 'xavier');
    const resBias = runGradientCheck(net.weights, net.biases, ['tanh'], 0, 0, 0, 1e-4, XOR_DATA, true);
    expect(resBias.passed).toBe(true);
    expect(Number.isFinite(resBias.analyticalGrad)).toBe(true);
    expect(Number.isFinite(resBias.numericalGrad)).toBe(true);
  });

  it('gracefully handles edge cases: empty dataset, non-positive epsilon, out-of-bounds layer', () => {
    const net = initNetwork([2, 3, 1], 'xavier');
    const resEmpty = runGradientCheck(net.weights, net.biases, ['relu'], 0, 0, 0, 1e-4, []);
    expect(resEmpty.passed).toBe(false);
    expect(resEmpty.error).toBe('Empty dataset');

    const resEps = runGradientCheck(net.weights, net.biases, ['relu'], 0, 0, 0, 0, XOR_DATA);
    expect(resEps.passed).toBe(false);
    expect(resEps.error).toBe('Epsilon must be positive');

    const resOOB = runGradientCheck(net.weights, net.biases, ['relu'], 10, 0, 0, 1e-4, XOR_DATA);
    expect(resOOB.passed).toBe(false);
    expect(resOOB.error).toContain('out of bounds');
  });
});
