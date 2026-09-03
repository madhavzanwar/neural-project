import { describe, it, expect } from 'vitest';
import React from 'react';
import { SECTIONS } from '../components/layout/Navbar.jsx';
import { ACTIVATIONS } from '../nn/activations.js';
import { DATASETS } from '../nn/datasets.js';
import { INIT_STRATEGIES } from '../nn/network.js';

describe('UI Integrity & Syllabus Navigation Contract', () => {
  it('defines the 7 required syllabus navigation sections', () => {
    const sectionIds = SECTIONS.map(s => s.id);
    expect(sectionIds).toEqual([
      'overview',
      'architecture',
      'activations',
      'forward',
      'training',
      'weight-init',
      'concepts',
    ]);
  });

  it('provides all 4 syllabus activation functions with formula and valid range', () => {
    const required = ['sigmoid', 'relu', 'tanh', 'linear'];
    for (const key of required) {
      expect(ACTIVATIONS).toHaveProperty(key);
      expect(ACTIVATIONS[key]).toHaveProperty('formula');
      expect(ACTIVATIONS[key]).toHaveProperty('derivativeFormula');
      expect(ACTIVATIONS[key]).toHaveProperty('range');
      expect(typeof ACTIVATIONS[key].fn).toBe('function');
      expect(typeof ACTIVATIONS[key].derivative).toBe('function');
    }
  });

  it('contains classification datasets for both linearly separable and non-separable tasks', () => {
    expect(DATASETS.xor.separable).toBe(false);
    expect(DATASETS.and.separable).toBe(true);
    expect(DATASETS.or.separable).toBe(true);
    expect(DATASETS.circles.separable).toBe(false);
  });

  it('includes 4 distinct weight initialization strategies including symmetry breakdown demo', () => {
    expect(INIT_STRATEGIES).toHaveProperty('xavier');
    expect(INIT_STRATEGIES).toHaveProperty('he');
    expect(INIT_STRATEGIES).toHaveProperty('uniform');
    expect(INIT_STRATEGIES).toHaveProperty('zeros');
    expect(INIT_STRATEGIES.zeros.generate()).toBe(0);
  });
});
