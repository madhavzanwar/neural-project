import { describe, it, expect } from 'vitest';
import { XOR_DATA, AND_DATA, OR_DATA, generateCirclesData, DATASETS } from '../datasets.js';

describe('Educational Datasets (Syllabus Unit I)', () => {
  it('defines valid XOR truth table with 4 samples', () => {
    expect(XOR_DATA).toHaveLength(4);
    expect(XOR_DATA).toEqual([
      { input: [0, 0], label: 0 },
      { input: [0, 1], label: 1 },
      { input: [1, 0], label: 1 },
      { input: [1, 1], label: 0 },
    ]);
  });

  it('defines valid AND gate data with correct binary labels', () => {
    expect(AND_DATA).toHaveLength(4);
    const ones = AND_DATA.filter(d => d.label === 1);
    expect(ones).toHaveLength(1);
    expect(ones[0].input).toEqual([1, 1]);
  });

  it('defines valid OR gate data with correct binary labels', () => {
    expect(OR_DATA).toHaveLength(4);
    const zeros = OR_DATA.filter(d => d.label === 0);
    expect(zeros).toHaveLength(1);
    expect(zeros[0].input).toEqual([0, 0]);
  });

  it('generates concentric circles within [0, 1] unit square', () => {
    const circles = generateCirclesData(40, 0.02, 42);
    expect(circles).toHaveLength(40);
    const class0 = circles.filter(d => d.label === 0);
    const class1 = circles.filter(d => d.label === 1);
    expect(class0).toHaveLength(20);
    expect(class1).toHaveLength(20);

    for (const pt of circles) {
      expect(pt.input[0]).toBeGreaterThanOrEqual(0);
      expect(pt.input[0]).toBeLessThanOrEqual(1);
      expect(pt.input[1]).toBeGreaterThanOrEqual(0);
      expect(pt.input[1]).toBeLessThanOrEqual(1);
    }
  });

  it('provides dataset catalog metadata for user selection', () => {
    expect(DATASETS.xor.separable).toBe(false);
    expect(DATASETS.and.separable).toBe(true);
    expect(DATASETS.or.separable).toBe(true);
    expect(DATASETS.circles.separable).toBe(false);
  });
});
