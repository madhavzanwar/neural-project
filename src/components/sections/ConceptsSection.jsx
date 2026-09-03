import React, { useState } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Formula } from '../common/Formula.jsx';
import {
  BookOpen,
  GraduationCap,
  Layers,
  Repeat,
  Network,
  Cpu,
  Brain,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export function ConceptsSection() {
  const [activeTab, setActiveTab] = useState('unit1');
  const [expandedTopics, setExpandedTopics] = useState({
    'unit1-1': true,
    'unit1-8': true,
    'unit1-12': true,
    'unit2-4': true,
    'unit2-5': true,
    'unit2-6': true,
    'viva-1': true,
  });

  const toggleTopic = (id) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="navy">Complete Academic Syllabus</Badge>
          <span className="text-xs text-slate-500">B.Tech Artificial Intelligence & Machine Learning</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-heading">
          Neural Networks Theory & Syllabus Reference
        </h2>
        <p className="text-slate-600 text-sm">
          Comprehensive curriculum coverage mapped directly to Unit I and Unit II, complete with college viva and professor presentation notes.
        </p>
      </div>

      {/* Syllabus Tab Selector */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('unit1')}
          className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'unit1'
              ? 'border-blue-600 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unit I: Architecture of Neural Networks (12 Topics)
        </button>
        <button
          onClick={() => setActiveTab('unit2')}
          className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'unit2'
              ? 'border-blue-600 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unit II: Neural Networks for Control (6 Topics)
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'viva'
              ? 'border-blue-600 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Professor Demonstration & Viva Guide
        </button>
      </div>

      {/* UNIT I CONTENT */}
      {activeTab === 'unit1' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-950 flex items-center justify-between">
            <span className="font-medium">
              Unit I covers biological inspiration, artificial architectures, activation functions, learning rules, feed-forward, and recurrent networks.
            </span>
            <Badge variant="unit1">12 Topics</Badge>
          </div>

          {/* Topics Accordion */}
          <div className="space-y-3">
            {/* 1. Introduction to Neural Networks */}
            <TopicItem
              id="unit1-1"
              title="1. Introduction to Neural Networks & History"
              tag="Implemented & Demonstrated"
              isInteractive={true}
              expanded={expandedTopics['unit1-1']}
              onToggle={() => toggleTopic('unit1-1')}
            >
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                An Artificial Neural Network (ANN) is an information processing paradigm inspired by the biological nervous systems of the human brain. The field originated with McCulloch and Pitts (1943), who introduced a simplified mathematical model of a binary neuron. In 1958, Frank Rosenblatt created the <strong>Perceptron</strong>, demonstrating that connection weights could be learned automatically from training data.
              </p>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                <strong>Historical Milestone:</strong> In 1969, Marvin Minsky and Seymour Papert proved that single-layer perceptrons could not compute the simple exclusive-OR (XOR) function, leading to the "AI Winter" until the backpropagation algorithm for multi-layer networks was popularized by Rumelhart, Hinton, and Williams (1986).
              </div>
            </TopicItem>

            {/* 2 & 3. Biological vs Artificial Neurons */}
            <TopicItem
              id="unit1-2"
              title="2 & 3. Biological Neurons vs. Artificial Neural Networks"
              tag="Demonstrated in Overview"
              isInteractive={true}
              expanded={expandedTopics['unit1-2']}
              onToggle={() => toggleTopic('unit1-2')}
            >
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                Biological neurons transmit electro-chemical signals via action potentials across synapses. Artificial neurons abstract this into mathematical operations:
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside mb-2">
                <li><strong>Dendrites → Inputs (x):</strong> Receive signals from upstream sources.</li>
                <li><strong>Synapse Strength → Weights (w):</strong> Scale input importance. Positive w is excitatory; negative w is inhibitory.</li>
                <li><strong>Soma / Cell Body → Summation + Bias (z = Σ wx + b):</strong> Accumulates weighted potentials.</li>
                <li><strong>Axon Hillock → Activation Function f(z):</strong> Determines whether and how strongly the neuron activates.</li>
                <li><strong>Axon → Output (a):</strong> Transmits activation to downstream layers.</li>
              </ul>
            </TopicItem>

            {/* 4. Neural Network Architecture */}
            <TopicItem
              id="unit1-4"
              title="4. Neural Network Architecture"
              tag="Interactive Lab in Architecture Tab"
              isInteractive={true}
              expanded={expandedTopics['unit1-4']}
              onToggle={() => toggleTopic('unit1-4')}
            >
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                A neural network architecture is defined by its topological arrangement:
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li><strong>Input Layer:</strong> Passive nodes holding feature attributes (no computation performed here).</li>
                <li><strong>Hidden Layers:</strong> Intermediate computational layers that extract internal feature representations.</li>
                <li><strong>Output Layer:</strong> Final processing units generating target predictions, classification probabilities, or regression values.</li>
                <li><strong>Depth vs Width:</strong> Depth refers to the number of hidden layers; width refers to the number of neurons per layer.</li>
              </ul>
            </TopicItem>

            {/* 5. Bias */}
            <TopicItem
              id="unit1-5"
              title="5. The Role of Bias in Artificial Neurons"
              tag="Interactive Control in Architecture & Forward"
              isInteractive={true}
              expanded={expandedTopics['unit1-5']}
              onToggle={() => toggleTopic('unit1-5')}
            >
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                Bias is an independent trainable scalar parameter added to the weighted sum before activation: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-800">z = Σ wᵢxᵢ + b</code>.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Why Bias is Essential:</strong> Without bias (<code className="font-mono">b = 0</code>), the neuron's decision boundary is mathematically forced to pass through the origin <code className="font-mono">(0, 0)</code>. If all input features are zero (<code className="font-mono">x = 0</code>), <code className="font-mono">z</code> would always be zero regardless of weights. Adding bias allows the hyperplane to shift freely along the axis to fit arbitrary data clusters.
              </p>
            </TopicItem>

            {/* 6. Activation Functions */}
            <TopicItem
              id="unit1-6"
              title="6. Activation Functions (Sigmoid, ReLU, Tanh, Linear)"
              tag="Interactive Explorer in Activation Tab"
              isInteractive={true}
              expanded={expandedTopics['unit1-6']}
              onToggle={() => toggleTopic('unit1-6')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-blue-900 block">Sigmoid: σ(x) = 1 / (1 + e^-x)</span>
                  <p className="text-slate-600 mt-0.5">Range (0, 1). Smooth probabilistic curve. Used for binary classification output layers. Suffers from vanishing gradient for large |x|.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-teal-800 block">ReLU: f(x) = max(0, x)</span>
                  <p className="text-slate-600 mt-0.5">Range [0, ∞). Piecewise linear. Avoids saturation for positive values. Standard choice for deep hidden layers.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-purple-800 block">Tanh: tanh(x) = (e^x - e^-x) / (e^x + e^-x)</span>
                  <p className="text-slate-600 mt-0.5">Range (-1, 1). Zero-centered, which accelerates gradient descent compared to Sigmoid in hidden layers.</p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-amber-800 block">Linear: f(x) = x</span>
                  <p className="text-slate-600 mt-0.5">Range (-∞, ∞). Constant derivative of 1. Used in regression output layers. Cannot model non-linear boundaries.</p>
                </div>
              </div>
            </TopicItem>

            {/* 7. Learning Methods */}
            <TopicItem
              id="unit1-7"
              title="7. Learning Methods in Neural Networks"
              tag="Theory Reference"
              isInteractive={false}
              expanded={expandedTopics['unit1-7']}
              onToggle={() => toggleTopic('unit1-7')}
            >
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>Supervised Learning:</strong> The network is provided with pairs of inputs and corresponding ground-truth targets (x, y). The network computes error (loss) and updates weights using backpropagation (as demonstrated in our lab).</li>
                <li><strong>Unsupervised Learning:</strong> The network receives unlabeled inputs x and identifies underlying cluster structures, patterns, or principal dimensions (e.g. Self-Organizing Maps, Autoencoders, K-Means).</li>
                <li><strong>Reinforcement Learning:</strong> An autonomous agent interacts with an environment, receiving scalar rewards or penalties based on trial-and-error actions (e.g. Q-learning, Policy Gradients).</li>
              </ul>
            </TopicItem>

            {/* 8. Learning Rules */}
            <TopicItem
              id="unit1-8"
              title="8. Fundamental Learning Rules"
              tag="Core Syllabus Topic"
              isInteractive={false}
              expanded={expandedTopics['unit1-8']}
              onToggle={() => toggleTopic('unit1-8')}
            >
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-0.5">1. Hebbian Learning Rule (1949):</span>
                  <p className="italic text-slate-600 mb-1">"Neurons that fire together, wire together."</p>
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900">Δwᵢ = η · xᵢ · y</code>
                  <p className="mt-1">If neuron i and output neuron y are simultaneously active, the synaptic weight between them increases.</p>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-0.5">2. Perceptron Learning Rule (Rosenblatt, 1958):</span>
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900">w_new = w_old + η · (y - ŷ) · x</code>
                  <p className="mt-1">Updates weights only when a misclassification occurs. Guaranteed to converge if and only if the dataset is linearly separable.</p>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-0.5">3. Delta Rule / Widrow-Hoff Rule (1960):</span>
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900">Δwᵢ = η · (target - actual_output) · f'(z) · xᵢ</code>
                  <p className="mt-1">Minimizes Mean Squared Error via gradient descent. The direct mathematical ancestor of generalized backpropagation.</p>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-0.5">4. Correlation Learning Rule:</span>
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900">Δwᵢ = η · xᵢ · target</code>
                  <p className="mt-1">A supervised variation of Hebbian learning where synaptic adjustment is directly proportional to the cross-correlation between input and desired output.</p>
                </div>
              </div>
            </TopicItem>

            {/* 9 & 10. Single-layer vs Multilayer Neural Networks */}
            <TopicItem
              id="unit1-9"
              title="9 & 10. Single-Layer vs. Multilayer Neural Networks"
              tag="Demonstrated on XOR vs AND in Workbench"
              isInteractive={true}
              expanded={expandedTopics['unit1-9']}
              onToggle={() => toggleTopic('unit1-9')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">Single-Layer Networks:</span>
                  <p className="text-slate-600 leading-relaxed mb-2">
                    Direct input-to-output mapping without intermediate processing units.
                  </p>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside">
                    <li>Forms a single linear hyperplane boundary: <code className="font-mono">w₁x₁ + w₂x₂ + b = 0</code>.</li>
                    <li>Can solve AND and OR gates (linearly separable).</li>
                    <li><strong>Fundamental limitation:</strong> Incapable of solving XOR (Minsky & Papert, 1969).</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">Multilayer Networks (MLP):</span>
                  <p className="text-slate-600 leading-relaxed mb-2">
                    Contains one or more hidden layers with non-linear activation functions.
                  </p>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside">
                    <li>Combines multiple linear hyperplanes into convex polygons and smooth non-linear regions.</li>
                    <li>Can solve XOR, Concentric Circles, and arbitrary non-linear problems.</li>
                    <li><strong>Universal Approximation Theorem (Cybenko, 1989):</strong> An MLP with one hidden layer containing sufficient non-linear neurons can approximate any continuous function on a compact subset of ℝⁿ.</li>
                  </ul>
                </div>
              </div>
            </TopicItem>

            {/* 11. Feed-forward Neural Networks */}
            <TopicItem
              id="unit1-11"
              title="11. Feed-Forward Neural Networks"
              tag="Interactive Walkthrough in Forward Tab"
              isInteractive={true}
              expanded={expandedTopics['unit1-11']}
              onToggle={() => toggleTopic('unit1-11')}
            >
              <p className="text-xs text-slate-700 leading-relaxed">
                In a feed-forward network, connections between nodes form a directed acyclic graph (DAG). Information flows strictly unidirectionally from input units, through hidden layers, to output units. There are no cycles, memory delay elements, or feedback loops. Feed-forward networks are memoryless: the prediction for input x(t) depends strictly on current x(t), independent of past inputs x(t-1).
              </p>
            </TopicItem>

            {/* 12. Recurrent Neural Networks */}
            <TopicItem
              id="unit1-12"
              title="12. Recurrent Neural Networks (RNNs)"
              tag="Theoretical Syllabus Topic"
              isInteractive={false}
              expanded={expandedTopics['unit1-12']}
              onToggle={() => toggleTopic('unit1-12')}
            >
              <div className="space-y-3 text-xs text-slate-700">
                <p className="leading-relaxed">
                  Unlike feed-forward networks, <strong>Recurrent Neural Networks (RNNs)</strong> contain feedback loops where the output or hidden state at time step t is fed back into the network as input at time step t+1. This recurrence provides the network with <strong>internal memory</strong>, making it suited for sequential and temporal data (time series, audio, speech, natural language).
                </p>

                {/* Conceptual RNN Diagram */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Recurrent Neuron State Transition:
                  </div>
                  <div className="font-mono text-blue-900 bg-white p-2 rounded border border-slate-200 mb-2">
                    h(t) = tanh( W_hh · h(t-1) + W_xh · x(t) + b_h )<br />
                    y(t) = softmax( W_hy · h(t) + b_y )
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Where <code className="font-mono">h(t)</code> is the hidden state vector at time step t, <code className="font-mono">h(t-1)</code> is the previous hidden state (memory), and <code className="font-mono">W_hh</code> is the recurrent weight matrix.
                  </p>
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px]">
                  <strong>Academic Note for Professor:</strong> Our interactive browser workbench focuses on feed-forward backpropagation (as required for Unit I & II core practical demonstrations). RNNs are covered theoretically here to satisfy Unit I Topic 12 without fabricating a misleading sequential simulator.
                </div>
              </div>
            </TopicItem>
          </div>
        </div>
      )}

      {/* UNIT II CONTENT */}
      {activeTab === 'unit2' && (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-lg text-xs text-indigo-950 flex items-center justify-between">
            <span className="font-medium">
              Unit II covers loss functions, weight initialization strategies, optimization algorithms, backpropagation derivation, associative memory, and discrete Hopfield networks.
            </span>
            <Badge variant="unit2">6 Topics</Badge>
          </div>

          <div className="space-y-3">
            {/* 1. Loss Functions */}
            <TopicItem
              id="unit2-1"
              title="1. Loss Functions in Neural Networks"
              tag="Implemented in Training Core"
              isInteractive={true}
              expanded={expandedTopics['unit2-1']}
              onToggle={() => toggleTopic('unit2-1')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">Binary Cross-Entropy (BCE) / Log Loss:</span>
                  <div className="font-mono text-blue-900 bg-white p-1.5 rounded border border-slate-200 my-1">
                    L = - (1/N) · Σ [y · log(ŷ) + (1-y) · log(1-ŷ)]
                  </div>
                  <p className="text-slate-600 mt-1">
                    The standard loss for binary classification with Sigmoid output. Heavily penalizes confident incorrect predictions (e.g. predicting ŷ=0.99 when true label is 0).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">Mean Squared Error (MSE):</span>
                  <div className="font-mono text-blue-900 bg-white p-1.5 rounded border border-slate-200 my-1">
                    MSE = (1 / 2N) · Σ (ŷ - y)²
                  </div>
                  <p className="text-slate-600 mt-1">
                    Measures average squared difference between predictions and targets. Common for continuous regression tasks and classical Delta Rule derivations.
                  </p>
                </div>
              </div>
            </TopicItem>

            {/* 2. Weight Initialization */}
            <TopicItem
              id="unit2-2"
              title="2. Weight Initialization"
              tag="Interactive Lab in Weight Init Tab"
              isInteractive={true}
              expanded={expandedTopics['unit2-2']}
              onToggle={() => toggleTopic('unit2-2')}
            >
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                Proper parameter initialization is crucial for training deep neural networks. Without proper scaling:
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside mb-2">
                <li><strong>Zero Initialization:</strong> Causes symmetry failure. Every neuron in a hidden layer computes the exact same value and receives identical gradient updates. The network cannot learn diverse representations.</li>
                <li><strong>Xavier / Glorot (2010):</strong> Sets variance <code className="font-mono">Var(W) = 2 / (fan_in + fan_out)</code>. Maintains variance of activations and gradients across layers for Sigmoid and Tanh.</li>
                <li><strong>He / Kaiming (2015):</strong> Sets variance <code className="font-mono">Var(W) = 2 / fan_in</code>. Calibrated specifically for ReLU activations, which zero out half of all inputs.</li>
              </ul>
            </TopicItem>

            {/* 3. Optimization Algorithms */}
            <TopicItem
              id="unit2-3"
              title="3. Optimization Algorithms"
              tag="Implemented in Training Loop"
              isInteractive={true}
              expanded={expandedTopics['unit2-3']}
              onToggle={() => toggleTopic('unit2-3')}
            >
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-0.5">Gradient Descent (GD):</span>
                  <p className="text-slate-600">
                    Iteratively moves parameters in the direction of steepest descent (negative gradient of the loss function): <code className="font-mono text-blue-900">θ ← θ - η · ∇L(θ)</code>.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-0.5">Batch vs Stochastic vs Mini-Batch:</span>
                  <ul className="text-slate-600 list-disc list-inside space-y-0.5 mt-0.5">
                    <li><strong>Batch GD (Full-Batch):</strong> Computes gradient over the entire dataset before updating parameters. Stable, deterministic gradient steps (implemented in our lab).</li>
                    <li><strong>Stochastic GD (SGD):</strong> Updates parameters after every single sample. High variance, noisy steps that can escape local minima.</li>
                    <li><strong>Mini-Batch GD:</strong> Computes gradient over small subsets (e.g. 32 or 64 samples). Balances hardware vectorization efficiency with stochastic exploration.</li>
                  </ul>
                </div>
              </div>
            </TopicItem>

            {/* 4. Backpropagation Algorithm */}
            <TopicItem
              id="unit2-4"
              title="4. Backpropagation Algorithm & Chain Rule Derivation"
              tag="Demonstrated in Training & Forward Walkthrough"
              isInteractive={true}
              expanded={expandedTopics['unit2-4']}
              onToggle={() => toggleTopic('unit2-4')}
            >
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                <p>
                  Backpropagation is an efficient application of the calculus <strong>Chain Rule</strong> to compute the partial derivative of the loss function with respect to every weight in a multi-layer network.
                </p>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono space-y-1.5">
                  <div className="text-slate-500 font-sans font-bold text-[11px] uppercase">Mathematical Steps:</div>
                  <div>1. Output Error Signal: <span className="text-blue-900">δ^(L) = ∂L/∂z^(L) = a^(L) - y</span></div>
                  <div>2. Hidden Error Signal: <span className="text-blue-900">δ^(l) = ( (W^(l+1))^T · δ^(l+1) ) ⊙ f'(z^(l))</span></div>
                  <div>3. Weight Gradient: <span className="text-blue-900">∂L/∂W^(l) = δ^(l+1) · (a^(l))^T</span></div>
                  <div>4. Bias Gradient: <span className="text-blue-900">∂L/∂b^(l) = δ^(l+1)</span></div>
                  <div>5. Parameter Update: <span className="text-blue-900">W^(l) ← W^(l) - η · ∂L/∂W^(l)</span></div>
                </div>

                <p className="text-slate-600">
                  By working backward from layer L to layer 1, backpropagation reuses intermediate error signals δ, eliminating redundant derivative calculations and reducing computational complexity from O(W²) to O(W).
                </p>
              </div>
            </TopicItem>

            {/* 5. Associative Memory Networks */}
            <TopicItem
              id="unit2-5"
              title="5. Associative Memory Networks and Their Types"
              tag="Theoretical Syllabus Topic"
              isInteractive={false}
              expanded={expandedTopics['unit2-5']}
              onToggle={() => toggleTopic('unit2-5')}
            >
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  An <strong>Associative Memory Network</strong> is a content-addressable memory system that can store a set of patterns and retrieve the complete, clean pattern when presented with an incomplete, noisy, or corrupted cue.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block mb-1">1. Autoassociative Memory:</span>
                    <p className="text-slate-600 mb-1">
                      Stores a pattern x and recalls the exact same pattern x when queried with a noisy version x̃:
                    </p>
                    <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900 block text-center my-1">
                      Query(x̃) → Output: x
                    </code>
                    <p className="text-slate-500 text-[11px]">Example: Discrete Hopfield Network.</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block mb-1">2. Heteroassociative Memory:</span>
                    <p className="text-slate-600 mb-1">
                      Stores associations between pairs of distinct patterns (x, y). When presented with pattern x, it recalls associated pattern y:
                    </p>
                    <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900 block text-center my-1">
                      Query(x) → Output: y
                    </code>
                    <p className="text-slate-500 text-[11px]">Example: Bidirectional Associative Memory (BAM).</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
                  <strong>Storage Capacity:</strong> For an autoassociative network of N binary neurons, the maximum number of mutually orthogonal patterns that can be reliably recalled without crosstalk noise is approximately <code className="font-mono">P_max ≈ 0.14 · N</code>.
                </div>
              </div>
            </TopicItem>

            {/* 6. Discrete-Time Hopfield Networks */}
            <TopicItem
              id="unit2-6"
              title="6. Discrete-Time Hopfield Networks"
              tag="Theoretical Syllabus Topic"
              isInteractive={false}
              expanded={expandedTopics['unit2-6']}
              onToggle={() => toggleTopic('unit2-6')}
            >
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  Introduced by John Hopfield (1982), the <strong>Discrete-Time Hopfield Network</strong> is a single-layer, fully recurrent, autoassociative neural network with symmetric connection weights and binary threshold units <code className="font-mono">sᵢ ∈ {"{-1, +1}"}</code>.
                </p>

                {/* Key Mathematical Properties */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono space-y-2">
                  <div className="text-slate-500 font-sans font-bold text-[11px] uppercase">Key Mathematical Properties:</div>
                  <div>
                    1. Symmetric Weight Matrix: <span className="text-blue-900">W_ij = W_ji</span> and <span className="text-blue-900">W_ii = 0</span> (no self-loops).
                  </div>
                  <div>
                    2. Hebbian Storage Rule: <span className="text-blue-900">W_ij = (1/N) · Σ_{'{p=1}'}^P sᵢ^(p) · sⱼ^(p)</span>
                  </div>
                  <div>
                    3. Discrete Update Rule: <span className="text-blue-900">sᵢ(t+1) = sgn( Σ_j W_ij · sⱼ(t) - θᵢ )</span>
                  </div>
                  <div>
                    4. Lyapunov Energy Function: <span className="text-blue-900">E = - 1/2 · Σ_i Σ_j W_ij · sᵢ · sⱼ + Σ_i θᵢ · sᵢ</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded text-blue-950">
                  <strong>Convergence Proof:</strong> Because the weight matrix is symmetric (<code className="font-mono">W_ij = W_ji</code>) with zero diagonals, the energy E is monotonically non-increasing (<code className="font-mono">ΔE ≤ 0</code>) with every asynchronous neuron update. The network is guaranteed to settle into a local energy minimum representing a stored memory pattern.
                </div>
              </div>
            </TopicItem>
          </div>
        </div>
      )}

      {/* VIVA & PROFESSOR DEMONSTRATION GUIDE */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">
                Academic Presentation & Viva Voce Guide
              </span>
              <p className="leading-relaxed">
                Use this structured 5-minute script and frequently asked questions when demonstrating the Neural Network Learning Lab to your college professor or external examiner.
              </p>
            </div>
          </div>

          {/* 5-Minute Demonstration Script */}
          <Card
            title="5-Minute Demonstration Walkthrough Script"
            subtitle="Follow these 5 clear steps during your project demonstration"
            badge={<Badge variant="success">Presentation Script</Badge>}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Minute 1: Introduction & Architecture (Tabs: Overview & Architecture)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  "Good morning Professor. This is the Neural Network Learning Lab, designed to demonstrate the core concepts of our Unit I and Unit II Neural Networks syllabus. On the Architecture screen, we see a feed-forward neural network with input, hidden, and output layers. When I adjust the hidden neuron slider or layer count, the wiring matrix updates dynamically. When I click any neuron, we inspect its exact weights and bias parameter, showing how bias shifts the activation boundary."
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Minute 2: Activation Functions (Tab: Activation Functions)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  "Moving to Activation Functions, our syllabus specifies Sigmoid, ReLU, Tanh, and Linear. For each, we plot the analytical activation curve and its derivative. When I drag the input slider to x = 3, we see the real-time output point and its gradient. Notice how Sigmoid saturates near 1 with derivative near 0, explaining the vanishing gradient problem, whereas ReLU maintains a constant gradient of 1 for all positive inputs."
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Minute 3: Numerical Forward Propagation (Tab: Forward Propagation)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  "On the Forward Propagation tab, we demonstrate how inputs travel through a network using concrete numbers rather than abstract math. Using step buttons, we inspect Step 1 input features, Step 2 weighted sum z = Σ wx + b for neuron h₁, Step 3 activation a = f(z), and Step 4 the final output prediction ŷ. The calculations match the exact IEEE floating point operations performed by our math engine."
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Minute 4: Training, Backpropagation & Decision Boundary (Tab: Training)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  "In the Training Workbench, we demonstrate Unit II optimization. We select the classic XOR problem, which cannot be solved by a single-layer perceptron. When I click 'Train Network', the network runs full-batch backpropagation. We observe the real Binary Cross-Entropy loss curve decreasing epoch by epoch. On the right, the 2D decision boundary canvas dynamically reshapes itself from linear to non-linear, correctly classifying all four XOR points."
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Minute 5: Weight Initialization & Symmetry Breakdown (Tab: Weight Initialization)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  "Finally, in the Weight Initialization lab, we demonstrate why initial weights matter. When I select 'Zero Initialization' and attempt to train, the network cannot learn XOR because all hidden neurons compute identical outputs and gradients, demonstrating the symmetry problem. Switching to Xavier or He initialization breaks this symmetry and converges rapidly."
                </p>
              </div>
            </div>
          </Card>

          {/* Frequently Asked Viva Questions */}
          <Card
            title="Top 6 Viva Questions & Answers"
            subtitle="Prepared answers to common questions asked by professors"
            badge={<Badge variant="navy">Viva Prep</Badge>}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q1: Why can't a single-layer perceptron solve the XOR problem?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> A single-layer perceptron can only generate a single linear hyperplane (a straight line in 2D: <code className="font-mono">w₁x₁ + w₂x₂ + b = 0</code>). The XOR truth table places positive points at (0,1) and (1,0) and negative points at (0,0) and (1,1). No single straight line can separate these two classes. A multilayer network solves this by projecting inputs into a hidden feature space where the classes become linearly separable.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q2: What is the purpose of the bias term in a neuron?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> Bias provides an affine shift to the activation function. Without bias (<code className="font-mono">b = 0</code>), the decision hyperplane is strictly constrained to pass through the origin <code className="font-mono">(0, 0)</code>. Adding bias decouples the decision boundary from the origin, allowing it to translate anywhere in the input space to correctly classify data.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q3: What causes the vanishing gradient problem in deep networks?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> The derivative of the Sigmoid function peaks at only 0.25 and approaches 0 for |x| &gt; 3. When backpropagating through multiple hidden layers via the chain rule, gradients are multiplied by these small fractional derivatives (<code className="font-mono">0.25 · 0.25 · 0.25...</code>). The gradient signal exponentially decays toward zero as it approaches early layers, preventing them from learning. ReLU solves this because its derivative is exactly 1 for all positive activations.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q4: Why does zero weight initialization fail in multi-layer networks?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> If all weights are initialized to zero, all hidden neurons in a layer compute identical pre-activations <code className="font-mono">z = 0</code> and identical outputs <code className="font-mono">a = f(0)</code>. During backpropagation, every hidden neuron receives the exact same error gradient <code className="font-mono">δ</code>. Consequently, all weights update identically and remain identical across all training epochs. The network suffers from symmetry failure and functions as if it only had a single hidden neuron.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q5: How does a Discrete Hopfield Network guarantee convergence?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> A Hopfield network has a symmetric weight matrix (<code className="font-mono">W_ij = W_ji</code>) with zero self-connections (<code className="font-mono">W_ii = 0</code>). Hopfield formulated a quadratic Lyapunov energy function <code className="font-mono">E = -1/2 ΣΣ W_ij sᵢ sⱼ</code>. Whenever any individual neuron flips state according to the discrete threshold rule, the change in energy <code className="font-mono">ΔE ≤ 0</code> is always non-positive. Because energy is bounded from below, the network is guaranteed to settle into a stable attractor state (local minimum) representing a stored pattern.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q6: What is the difference between Batch Gradient Descent and Stochastic Gradient Descent?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> In Batch (full-batch) Gradient Descent, gradients are accumulated and averaged over all training samples before taking a parameter step. This yields a smooth, deterministic trajectory toward the minimum. In Stochastic Gradient Descent (SGD), weights are updated after each individual sample, producing faster and noisier steps that can escape shallow saddle points or local minima. Mini-batch combines both benefits.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function TopicItem({ id, title, tag, isInteractive, expanded, onToggle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all shadow-xs">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-slate-900">{title}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
              isInteractive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {tag}
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {expanded && <div className="p-4 pt-1 border-t border-slate-100">{children}</div>}
    </div>
  );
}
