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
});
