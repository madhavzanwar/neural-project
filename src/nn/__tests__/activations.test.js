import { describe, it, expect } from 'vitest';
import { ACTIVATIONS, computeActivationCurve } from '../activations.js';

describe('Activation Functions (Syllabus Unit I)', () => {
  describe('Sigmoid Function', () => {
    const { fn, derivative } = ACTIVATIONS.sigmoid;

    it('maps zero input to exactly 0.5', () => {
      expect(fn(0)).toBeCloseTo(0.5, 6);
    });

    it('outputs asymptotic values approaching 1 and 0', () => {
      expect(fn(10)).toBeGreaterThan(0.999);
      expect(fn(-10)).toBeLessThan(0.001);
    });

    it('never produces NaN or Infinity even with extreme inputs', () => {
      expect(fn(1000)).toBeCloseTo(1, 6);
      expect(fn(-1000)).toBeCloseTo(0, 6);
      expect(fn(Infinity)).toBe(1);
      expect(fn(-Infinity)).toBe(0);
      expect(fn(NaN)).toBe(0.5);
      expect(derivative(NaN)).toBe(0);
    });

    it('computes maximum derivative of 0.25 at x = 0', () => {
      expect(derivative(0)).toBeCloseTo(0.25, 6);
    });

    it('matches theoretical derivative formula sigma(x)*(1 - sigma(x))', () => {
      const x = 1.5;
      const s = fn(x);
      expect(derivative(x)).toBeCloseTo(s * (1 - s), 6);
    });
  });

  describe('ReLU Function', () => {
    const { fn, derivative } = ACTIVATIONS.relu;

    it('returns 0 for negative inputs', () => {
      expect(fn(-10)).toBe(0);
      expect(fn(-0.1)).toBe(0);
    });

    it('returns identity for positive inputs', () => {
      expect(fn(0)).toBe(0);
      expect(fn(2.5)).toBe(2.5);
      expect(fn(100)).toBe(100);
    });

    it('computes unit derivative for positive inputs and zero for negative', () => {
      expect(derivative(2)).toBe(1);
      expect(derivative(0.1)).toBe(1);
      expect(derivative(-2)).toBe(0);
    });
  });

  describe('Tanh Function', () => {
    const { fn, derivative } = ACTIVATIONS.tanh;

    it('is zero-centered and passes through (0, 0)', () => {
      expect(fn(0)).toBe(0);
    });

    it('is symmetric: f(-x) = -f(x)', () => {
      expect(fn(-1.5)).toBeCloseTo(-fn(1.5), 6);
    });

    it('approaches +1 and -1 asymptotically', () => {
      expect(fn(5)).toBeCloseTo(1, 3);
      expect(fn(-5)).toBeCloseTo(-1, 3);
    });

    it('computes maximum derivative of 1 at x = 0', () => {
      expect(derivative(0)).toBe(1);
    });

    it('matches analytical derivative 1 - tanh^2(x)', () => {
      const x = 0.8;
      const t = Math.tanh(x);
      expect(derivative(x)).toBeCloseTo(1 - t * t, 6);
    });

    it('derivative remains strictly non-negative and finite across extreme saturation values', () => {
      expect(derivative(100)).toBe(0);
      expect(derivative(-100)).toBe(0);
      expect(derivative(1000)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Linear Function', () => {
    const { fn, derivative } = ACTIVATIONS.linear;

    it('preserves input identity across negative, zero, and positive domain', () => {
      expect(fn(-3.14)).toBe(-3.14);
      expect(fn(0)).toBe(0);
      expect(fn(42)).toBe(42);
    });

    it('has constant derivative of 1 everywhere', () => {
      expect(derivative(-5)).toBe(1);
      expect(derivative(0)).toBe(1);
      expect(derivative(5)).toBe(1);
    });
  });

  describe('computeActivationCurve', () => {
    it('generates expected curve data structure for plotting', () => {
      const curve = computeActivationCurve('sigmoid', -2, 2, 21, 0);
      expect(curve).toHaveLength(21);
      expect(curve[0]).toHaveProperty('x');
      expect(curve[0]).toHaveProperty('y');
      expect(curve[0]).toHaveProperty('derivative');
      expect(curve[0]).toHaveProperty('tangent');
      // At x = 0 (middle element index 10)
      const mid = curve[10];
      expect(mid.x).toBe(0);
      expect(mid.y).toBeCloseTo(0.5, 4);
      expect(mid.tangent).toBeCloseTo(0.5, 4);
    });

    it('handles numPoints = 1 safely without division by zero', () => {
      const curve = computeActivationCurve('sigmoid', -2, 2, 1);
      expect(curve).toHaveLength(1);
      expect(Number.isFinite(curve[0].x)).toBe(true);
      expect(Number.isFinite(curve[0].y)).toBe(true);
      expect(Number.isFinite(curve[0].derivative)).toBe(true);
      expect(curve[0].x).toBe(0);
      expect(curve[0].y).toBeCloseTo(0.5, 4);
    });

    it('handles numPoints <= 0 safely returning empty array', () => {
      expect(computeActivationCurve('sigmoid', -2, 2, 0)).toEqual([]);
      expect(computeActivationCurve('sigmoid', -2, 2, -5)).toEqual([]);
    });

    it('handles uppercase activation types cleanly', () => {
      const curve = computeActivationCurve('Sigmoid', -2, 2, 5);
      expect(curve).toHaveLength(5);
      expect(curve[2].y).toBeCloseTo(0.5, 4);
    });

    it('handles undefined or null currentX gracefully', () => {
      const curveNull = computeActivationCurve('tanh', -2, 2, 5, null);
      expect(curveNull[0].tangent).toBeNull();
      const curveUndef = computeActivationCurve('tanh', -2, 2, 5, undefined);
      expect(curveUndef[0].tangent).toBeNull();
    });
  });
});
