// =============================================================================
// EDUCATIONAL DATASETS FOR NEURAL NETWORK TRAINING
// Syllabus Alignment:
// - UNIT I: 9. Single-layer neural networks (Perceptron linear separability)
// - UNIT I: 10. Multilayer neural networks (XOR problem & non-linear separation)
// =============================================================================

/**
 * Standard XOR truth table:
 * x1 = 0, x2 = 0 -> y = 0
 * x1 = 0, x2 = 1 -> y = 1
 * x1 = 1, x2 = 0 -> y = 1
 * x1 = 1, x2 = 1 -> y = 0
 * Non-linearly separable: Single-layer perceptron CANNOT solve this (Minsky & Papert, 1969).
 * Requires at least 1 hidden layer with non-linear activation.
 */
export const XOR_DATA = [
  { input: [0, 0], label: 0 },
  { input: [0, 1], label: 1 },
  { input: [1, 0], label: 1 },
  { input: [1, 1], label: 0 },
];

/**
 * AND logic gate:
 * Linearly separable: Can be solved by a single-layer perceptron.
 */
export const AND_DATA = [
  { input: [0, 0], label: 0 },
  { input: [0, 1], label: 0 },
  { input: [1, 0], label: 0 },
  { input: [1, 1], label: 1 },
];

/**
 * OR logic gate:
 * Linearly separable: Can be solved by a single-layer perceptron.
 */
export const OR_DATA = [
  { input: [0, 0], label: 0 },
  { input: [0, 1], label: 1 },
  { input: [1, 0], label: 1 },
  { input: [1, 1], label: 1 },
];

/**
 * Mulberry32 seeded pseudo-random number generator for deterministic dataset generation.
 */
function seededPRNG(seed = 42) {
  let a = (seed !== undefined && seed !== null && seed !== 0 ? seed : 123456789) >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Concentric Circles dataset:
 * Inner circle (Class 0) surrounded by Outer ring (Class 1).
 * Highly non-linear, demonstrates how multilayer networks learn radial decision boundaries.
 * @param {number} points - Total points (half per class)
 * @param {number} noise - Jitter amount
 * @param {number} seed - Deterministic PRNG seed
 */
export function generateCirclesData(points = 60, noise = 0.04, seed = 1337) {
  const rng = seededPRNG(seed);
  const data = [];
  const half = Math.floor(points / 2);

  for (let cls = 0; cls < 2; cls++) {
    const baseR = cls === 0 ? 0.08 : 0.38;
    const spanR = cls === 0 ? 0.14 : 0.08;

    for (let i = 0; i < half; i++) {
      const angle = rng() * 2 * Math.PI;
      const r = baseR + rng() * spanR;
      const jitterX = (rng() * 2 - 1) * noise;
      const jitterY = (rng() * 2 - 1) * noise;
      const x = Math.max(0.05, Math.min(0.95, 0.5 + r * Math.cos(angle) + jitterX));
      const y = Math.max(0.05, Math.min(0.95, 0.5 + r * Math.sin(angle) + jitterY));
      data.push({ input: [Number(x.toFixed(3)), Number(y.toFixed(3))], label: cls });
    }
  }

  return data;
}

export const DATASETS = {
  xor: {
    id: 'xor',
    name: 'XOR Problem',
    description: 'Exclusive-OR. Non-linearly separable. Demonstrates why hidden layers and non-linear activations are essential.',
    separable: false,
    getData: () => XOR_DATA,
  },
  and: {
    id: 'and',
    name: 'AND Gate',
    description: 'Logical AND. Linearly separable. Solvable by a single-layer perceptron.',
    separable: true,
    getData: () => AND_DATA,
  },
  or: {
    id: 'or',
    name: 'OR Gate',
    description: 'Logical OR. Linearly separable. Solvable by a single-layer perceptron.',
    separable: true,
    getData: () => OR_DATA,
  },
  circles: {
    id: 'circles',
    name: 'Concentric Circles',
    description: 'Radial non-linear pattern. Requires multiple hidden neurons to enclose the inner cluster.',
    separable: false,
    getData: () => generateCirclesData(60, 0.03, 101),
  },
};
