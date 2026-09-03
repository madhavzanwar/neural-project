# Academic Syllabus Alignment & Verification Matrix

**Course:** Neural Networks / Deep Learning  
**Target Academic Context:** Second-Year B.Tech, Artificial Intelligence and Machine Learning  
**Project Title:** Neural Network Learning Lab  
**Student & Project Owner:** Madhav Zanwar  
**Original Upstream Reference:** Adapted from [MrZoller/neural-viz](https://github.com/MrZoller/neural-viz) (MIT License)

---

## Executive Summary

The **Neural Network Learning Lab** was developed to bridge the gap between classroom machine learning theory and practical comprehension. Rather than overwhelming students with industrial SaaS complexity, calculus dashboards, or export scripts, this application focuses strictly on the university **Neural Networks Syllabus (Unit I and Unit II)**.

Every interactive visualization runs genuine, local JavaScript mathematics from scratch:
- No fabricated loss values or mock metrics.
- All forward passes evaluate explicit algebraic equations ($z = \sum w \cdot x + b$, $a = f(z)$).
- All backpropagation operations evaluate genuine partial derivatives via the Chain Rule.
- Gradient updates apply exact parameter changes via gradient descent.

---

## Detailed Syllabus Topic Mapping

### UNIT I: ARCHITECTURE OF NEURAL NETWORKS

| # | Syllabus Topic | Academic Status | Location in Application | Code Module |
|---|---|---|---|---|
| **1** | **Introduction to neural networks** | Fully Covered | Overview & Concepts Tab | `src/components/sections/OverviewSection.jsx`, `ConceptsSection.jsx` |
| **2** | **Biological neural networks** | Fully Covered | Overview Tab (Comparison Card & Table) | `src/components/sections/OverviewSection.jsx` |
| **3** | **Artificial neural networks** | Fully Covered | Overview & Architecture Tabs | `src/components/sections/ArchitectureSection.jsx` |
| **4** | **Neural network architecture** | Interactive Demo | Architecture Tab (Layer Customization) | `src/components/sections/ArchitectureSection.jsx`, `src/nn/network.js` |
| **5** | **Bias** | Interactive Demo | Architecture & Forward Prop Tabs | `src/components/sections/ArchitectureSection.jsx`, `src/components/sections/ForwardPropSection.jsx` |
| **6** | **Activation functions** | Interactive Demo | Activation Functions Tab (4 functions + curves + tangents) | `src/components/sections/ActivationsSection.jsx`, `src/nn/activations.js` |
| **7** | **Learning methods** | Theoretical Detail | Concepts Reference Tab | `src/components/sections/ConceptsSection.jsx` |
| **8** | **Learning rules** | Theoretical Detail | Concepts Reference Tab (Hebb, Perceptron, Delta, Correlation) | `src/components/sections/ConceptsSection.jsx` |
| **9** | **Single-layer neural networks** | Interactive Demo | Training Workbench (AND & OR Gate tests) | `src/components/sections/TrainingSection.jsx`, `src/nn/datasets.js` |
| **10** | **Multilayer neural networks** | Interactive Demo | Training Workbench (XOR & Circles solving) | `src/components/sections/TrainingSection.jsx`, `src/nn/network.js` |
| **11** | **Feed-forward neural networks** | Interactive Walkthrough | Forward Propagation Tab (Step-by-step) | `src/components/sections/ForwardPropSection.jsx`, `src/nn/network.js` |
| **12** | **Recurrent neural networks** | Theoretical Detail | Concepts Reference Tab (State transition & memory) | `src/components/sections/ConceptsSection.jsx` |

---

### UNIT II: NEURAL NETWORKS FOR CONTROL

| # | Syllabus Topic | Academic Status | Location in Application | Code Module |
|---|---|---|---|---|
| **1** | **Loss functions** | Interactive & Mathematical | Training Workbench & Concepts Tab (BCE & MSE) | `src/nn/network.js`, `src/components/sections/TrainingSection.jsx` |
| **2** | **Weight initialization** | Interactive Lab | Weight Initialization Tab (Xavier, He, Uniform, Zeros) | `src/components/sections/WeightInitSection.jsx`, `src/nn/network.js` |
| **3** | **Optimization algorithms** | Interactive Demo | Training Workbench (Batch GD, Learning Rate η) | `src/components/sections/TrainingSection.jsx`, `src/nn/training.js` |
| **4** | **Backpropagation algorithm** | Interactive & Verified | Training Workbench & Numerical Gradient Check | `src/nn/network.js`, `src/nn/training.js`, `src/nn/gradientCheck.js` |
| **5** | **Associative memory networks & types** | Theoretical Detail | Concepts Reference Tab (Autoassociative vs Heteroassociative) | `src/components/sections/ConceptsSection.jsx` |
| **6** | **Discrete-time Hopfield networks** | Theoretical Detail | Concepts Reference Tab (Lyapunov Energy & Convergence) | `src/components/sections/ConceptsSection.jsx` |

---

## Distinguishing Interactive Implementations from Theoretical Explanations

In accordance with academic integrity requirements:
1. **Interactive Implementations:**
   - Architecture Customizer (1-2 hidden layers, 1-6 neurons per layer).
   - 4 Activation Functions with real-time numeric response, derivatives, and tangent lines.
   - Step-by-step Numerical Forward Propagation walkthrough.
   - Full-batch Backpropagation Training Workbench with live loss chart and decision boundary canvas.
   - Weight Initialization Lab with symmetry breakdown demonstration.
   - Finite-difference gradient check verifying backpropagation gradients against numerical derivatives.
2. **Theoretical Concepts:**
   - Recurrent Neural Networks (RNNs) are documented with equations and diagrams, but are **not** claimed to be interactively trained in this feed-forward workbench.
   - Hopfield Networks and Associative Memory are documented with Lyapunov energy formulations and storage capacity laws, without fabricated simulated outcomes.

---

## Unit Testing & Verification

The mathematical core is backed by 42 automated tests in Vitest:
- `src/nn/__tests__/activations.test.js`: Validates all 4 activation functions, boundary conditions, derivatives, and curve computations.
- `src/nn/__tests__/network.test.js`: Tests layer matrix shapes, Xavier/He variance limits, forward pass outputs, BCE/MSE loss, and parameter updates.
- `src/nn/__tests__/datasets.test.js`: Tests XOR, AND, OR, and Concentric Circles generation.
- `src/nn/__tests__/training.test.js`: Verifies weight updates, epoch transitions, and non-decreasing accuracy on separable data.
- `src/nn/__tests__/gradientCheck.test.js`: Validates analytical backpropagation gradients against numerical centered finite-differences ($|\text{error}| < 10^{-4}$).
- `src/__tests__/ui_integrity.test.jsx`: Verifies syllabus navigation integrity and component contracts.
