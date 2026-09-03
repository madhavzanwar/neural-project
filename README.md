# Neural Network Learning Lab
**An Interactive Learning Platform for Artificial Neural Networks**

> **Academic Project**  
> **Student & Project Owner:** Madhav Zanwar  
> **Academic Context:** Second-Year B.Tech, Artificial Intelligence and Machine Learning  
> **Subject:** Neural Networks & Deep Learning (Unit I & Unit II Syllabus)  
> **Repository:** [https://github.com/madhavzanwar/neural-project](https://github.com/madhavzanwar/neural-project)  
> **Adapted from Upstream Reference:** [MrZoller/neural-viz](https://github.com/MrZoller/neural-viz) by MrZoller (MIT License)

---

## 1. Project Purpose & Academic Context

The **Neural Network Learning Lab** is an interactive, browser-based educational laboratory designed to teach the fundamental principles of artificial neural networks to undergraduate engineering students.

Unlike commercial dashboards or advanced research utilities that overwhelm students with complex optimizer benchmarks and 3D surface meshes, this application is tailored specifically for the university **Neural Networks Syllabus**. It provides an intuitive, mathematically rigorous platform that an engineering student can understand, demonstrate, and explain during a viva voce examination.

Every calculation in this application runs locally from scratch in JavaScript without external tensor libraries or simulated mock data:
- Pre-activations ($z$) and post-activations ($a$) are calculated using exact matrix-vector operations.
- Loss values are computed directly from real model outputs and ground truth targets.
- Gradients and parameter updates follow genuine analytical backpropagation derived via the calculus Chain Rule.
- Backpropagation accuracy is mathematically verified against numerical centered finite-differences ($|\text{error}| < 10^{-4}$).

---

## 2. University Syllabus Coverage

This project directly aligns with **Unit I (Architecture of Neural Networks)** and **Unit II (Neural Networks for Control)**:

### UNIT I: ARCHITECTURE OF NEURAL NETWORKS
1. **Introduction to neural networks:** Historical progression from McCulloch-Pitts (1943) and Rosenblatt's Perceptron (1958) to modern deep learning.
2. **Biological neural networks:** Anatomical structure of biological neurons (dendrites, soma, axon, synapses, action potentials).
3. **Artificial neural networks:** Computational neuron model (inputs, connection weights, additive bias, activation functions, output).
4. **Neural network architecture:** Input layer, hidden layer representations, output layer, width vs. depth.
5. **Bias:** Mathematical purpose of the affine bias parameter $b$ in translating decision hyperplanes away from the origin $(0, 0)$.
6. **Activation functions:** Mathematical formulas, derivatives, and range boundaries for **Sigmoid**, **ReLU**, **Tanh**, and **Linear**.
7. **Learning methods:** Supervised learning (input-target pairs), Unsupervised learning (clustering/representations), Reinforcement learning (reward maximization).
8. **Learning rules:** Detailed theoretical coverage of Hebbian Learning, Perceptron Learning Rule, Delta Rule (Widrow-Hoff), and Correlation Learning.
9. **Single-layer neural networks:** Linear decision boundaries, solvability of AND/OR logic gates, and Minsky-Papert perceptron limitations.
10. **Multilayer neural networks:** Non-linear decision regions, solving the XOR problem, and the Universal Approximation Theorem (Cybenko, 1989).
11. **Feed-forward neural networks:** Directed acyclic signal flow, layer-by-layer forward propagation without cycles.
12. **Recurrent neural networks (RNNs):** Internal state transitions ($h_t$), feedback loops, and sequential temporal memory.

### UNIT II: NEURAL NETWORKS FOR CONTROL
1. **Loss functions:** Mathematical formulations and applications of **Binary Cross-Entropy (BCE)** and **Mean Squared Error (MSE)**.
2. **Weight initialization:** Impact of starting parameters, Xavier/Glorot variance scaling, He/Kaiming scaling, Uniform random, and an interactive demonstration of the **Symmetry Breakdown Problem** when weights are initialized to zero.
3. **Optimization algorithms:** Gradient Descent formulation ($\theta \leftarrow \theta - \eta \nabla L$), Batch GD vs. Stochastic GD (SGD) vs. Mini-batch GD, and the role of learning rate ($\eta$).
4. **Backpropagation algorithm:** Step-by-step calculus Chain Rule derivation, output layer error ($\delta^{(L)}$), hidden layer error propagation ($\delta^{(l)}$), and parameter gradient accumulation.
5. **Associative memory networks:** Content-addressable memory, Autoassociative vs. Heteroassociative architectures, and memory storage capacity limits ($P_{max} \approx 0.14N$).
6. **Discrete-time Hopfield networks:** Fully recurrent single-layer associative memory, symmetric weight matrix ($W_{ij} = W_{ji}$ with $W_{ii} = 0$), discrete bipolar states ($\pm 1$), and proof of monotonic Lyapunov energy convergence ($\Delta E \le 0$).

---

## 3. Interactive Application Modules

The application is organized into 7 structured learning sections:

1. **Overview & Introduction:**
   - Concise explanation of artificial neural networks.
   - Interactive Input Layer $\to$ Hidden Layer $\to$ Output Layer diagram.
   - Three core learning objectives.
   - Biological vs. Artificial Neuron comparison cards and mapping table.
2. **Network Architecture:**
   - 2D SVG feed-forward network visualizer.
   - Dynamic controls to toggle 1 or 2 hidden layers and configure 1 to 6 neurons per layer.
   - Synapses colored by weight (blue for positive/excitatory, red for negative/inhibitory) with line thickness proportional to magnitude.
   - Interactive neuron inspector displaying incoming weights, bias value, and outgoing connections upon click.
   - Trainable parameter accounting table showing matrix dimensions and total parameter count ($W + b$).
3. **Activation Functions:**
   - Dedicated tabs for Sigmoid, ReLU, Tanh, and Linear.
   - Recharts curves plotting the function and its first derivative.
   - Interactive input slider ($x \in [-4, +4]$) with live point inspector, real-time derivative readout, and tangent slope angle ($\theta = \arctan(f'(x))$).
4. **Forward Propagation Walkthrough:**
   - Step-by-step numerical breakdown on a transparent $2 \to 2 \to 1$ network.
   - Explicit evaluation of $z = \sum w \cdot x + b$ and $a = f(z)$ with concrete numbers substituted at each step.
   - Next Step, Previous Step, Reset, and Auto-Play walkthrough animation controller.
5. **Training & Backpropagation Workbench:**
   - Interactive trainer on classification datasets: XOR Problem, AND Gate, OR Gate, and Concentric Circles.
   - Real-time controls: Train (Play/Pause), +1 Epoch step, +10 Epochs step, Reset, and Learning Rate slider ($\eta \in [0.05, 1.00]$).
   - Real computed Loss vs. Epoch line chart (Recharts).
   - 2D Decision Boundary canvas mapping model probability contours across the unit square $[0, 1]^2$.
   - Live sample predictions table displaying targets, model outputs, confidence, sample loss, and classification status.
   - Summary of the 5 fundamental steps of the backpropagation algorithm.
6. **Weight Initialization Laboratory:**
   - Comparison of 4 initialization strategies: **Xavier / Glorot**, **He / Kaiming**, **Uniform Random**, and **Zero Initialization**.
   - Live demonstration of the **Symmetry Problem**: proves that zero initialization causes hidden neurons to produce identical outputs and gradients, preventing the network from learning XOR.
   - Weight distribution histogram displaying parameter spread across 5 bins.
   - Pre-training vs. post-training prediction comparison.
7. **Concepts, Syllabus Reference & Viva Guide:**
   - Complete Unit I and Unit II curriculum notes with real-time keyword search filter.
   - 5-minute structured presentation script for college professor demonstration.
   - Top 6 Frequently Asked Viva Voce Questions with comprehensive engineering answers.
   - Interactive 5-question Viva Voce Self-Assessment Quiz with instant feedback.

---

## 4. Key Modifications from Upstream

This project was adapted from the open-source repository [MrZoller/neural-viz](https://github.com/MrZoller/neural-viz) (MIT License). While the upstream repository is an impressive playground, it contains extensive features extraneous to a second-year engineering syllabus.

### Features Removed:
- Advanced calculus exploration dashboards and numerical finite-difference verification tabs.
- 3D/2D loss-landscape surface mesh explorers.
- Optimizer racing and multi-optimizer benchmarking utilities.
- PyTorch code export generators.
- Jupyter / Google Colab notebook export utilities.
- Parameter JSON export and import tools.
- Overly complex guided lesson overlays.
- Unused visual effects, dark mode toggles, and unnecessary dependencies.

### Features Added / Transformed:
- Tailored Swiss Modernism 2.0 academic visual design system (slate/navy palette, Atkinson Hyperlegible & Crimson Pro typography, high-contrast accessible layouts).
- Structured navigation aligned directly to the university Neural Networks syllabus.
- Biological vs. Artificial Neuron comparison module with mapping table.
- Interactive Numerical Forward Propagation walkthrough with variable substitution.
- Weight Initialization comparison lab featuring the Zero-Initialization Symmetry Breakdown demo.
- Complete Unit I & Unit II syllabus reference with keyword search.
- College Professor Demonstration Guide & Viva Voce preparation script.
- Interactive Viva Voce Self-Assessment Quiz with educational answer rationales.
- Unit test suite (42 tests) covering activations, matrix math, datasets, training, and gradient verification.

---

## 5. Technology Stack & Architecture

- **Frontend Framework:** React 18 (Vite 5)
- **Styling:** Tailwind CSS 3 (configured with academic design tokens)
- **Data Visualization:** Recharts 2 & HTML5 2D Canvas
- **Iconography:** Lucide React
- **Unit Testing:** Vitest 2
- **Backend / Server:** None (100% client-side execution; runs locally in any modern browser)

---

## 6. Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
Clone your target repository and install dependencies:
```bash
git clone https://github.com/madhavzanwar/neural-project.git
cd neural-project
npm install
```

### Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Run Automated Tests
```bash
npm test
```
Runs the 42 automated tests across all 6 mathematical test suites.

### Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

---

## 7. License & Attribution

This project is licensed under the **MIT License**.

- Original core mathematical logic adapted from [neural-viz](https://github.com/MrZoller/neural-viz) by **MrZoller** (Copyright &copy; 2026 MrZoller).
- Educational adaptations, syllabus alignment, UI/UX redesign, and viva modules developed by **Madhav Zanwar** (Copyright &copy; 2026 Madhav Zanwar).

See the [LICENSE](file:///LICENSE) file for complete license text.
