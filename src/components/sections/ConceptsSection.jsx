import React, { useState } from 'react';
import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Formula } from '../common/Formula.jsx';
import { VivaQuiz } from '../common/VivaQuiz.jsx';
import { MathView } from '../common/MathView.jsx';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopics, setExpandedTopics] = useState({
    'unit1-1': true,
    'unit1-5': true,
    'unit1-6': true,
    'unit1-8': true,
    'unit1-12': true,
    'unit2-1': true,
    'unit2-2': true,
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

      {/* Search Filter Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search syllabus topics (e.g. Hopfield, XOR, Bias, ReLU, Hebb, Loss, Chain Rule)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
        />
        <svg
          className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Syllabus Tab Selector */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto scrollbar-none pb-px">
        <button
          onClick={() => setActiveTab('unit1')}
          type="button"
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap min-h-[44px] shrink-0 ${
            activeTab === 'unit1'
              ? 'border-blue-600 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unit I: Architecture of Neural Networks (12 Topics)
        </button>
        <button
          onClick={() => setActiveTab('unit2')}
          type="button"
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap min-h-[44px] shrink-0 ${
            activeTab === 'unit2'
              ? 'border-blue-600 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unit II: Neural Networks for Control (6 Topics)
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          type="button"
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap min-h-[44px] shrink-0 ${
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
              query={searchQuery}
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
              query={searchQuery}
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
                <li><strong>Dendrites &rarr; Inputs (<MathView math="x_i" inline />):</strong> Receive signals from upstream sources.</li>
                <li><strong>Synapse Strength &rarr; Weights (<MathView math="w_i" inline />):</strong> Scale input importance. Positive <MathView math="w > 0" inline /> is excitatory; negative <MathView math="w < 0" inline /> is inhibitory.</li>
                <li><strong>Soma / Cell Body &rarr; Summation + Bias (<MathView math="z = \sum w_i x_i + b" inline />):</strong> Accumulates weighted potentials.</li>
                <li><strong>Axon Hillock &rarr; Activation Function <MathView math="f(z)" inline />:</strong> Determines whether and how strongly the neuron activates.</li>
                <li><strong>Axon &rarr; Output (<MathView math="a = f(z)" inline />):</strong> Transmits activation to downstream layers.</li>
              </ul>
            </TopicItem>

            {/* 4. Neural Network Architecture */}
            <TopicItem
              query={searchQuery}
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
              query={searchQuery}
              id="unit1-5"
              title="5. The Role of Bias in Artificial Neurons"
              tag="Interactive Control in Architecture & Forward"
              isInteractive={true}
              expanded={expandedTopics['unit1-5']}
              onToggle={() => toggleTopic('unit1-5')}
            >
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                Bias is an independent trainable scalar parameter added to the weighted sum before activation:
              </p>
              <MathView math="z = \sum_{i=1}^n w_i x_i + b" display className="bg-slate-50 p-2 rounded border border-slate-200 text-blue-900 mb-2" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Why Bias is Essential:</strong> Without bias (<MathView math="b = 0" inline />), the neuron's decision boundary is mathematically forced to pass through the origin <MathView math="(0, 0)" inline />. If all input features are zero (<MathView math="\mathbf{x} = \mathbf{0}" inline />), <MathView math="z" inline /> would always be zero regardless of weights. Adding bias allows the decision hyperplane (<MathView math="\mathbf{w}^T \mathbf{x} + b = 0" inline />) to translate freely along any axis to separate arbitrary data clusters.
              </p>
            </TopicItem>

            {/* 6. Activation Functions */}
            <TopicItem
              query={searchQuery}
              id="unit1-6"
              title="6. Activation Functions (Sigmoid, ReLU, Tanh, Linear)"
              tag="Interactive Explorer in Activation Tab"
              isInteractive={true}
              expanded={expandedTopics['unit1-6']}
              onToggle={() => toggleTopic('unit1-6')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-blue-900 block mb-1">Sigmoid Function:</span>
                  <MathView math="\sigma(x) = \frac{1}{1 + e^{-x}}" display className="bg-white p-2 rounded border border-slate-200 text-blue-900 mb-2" />
                  <p className="text-slate-600 mt-0.5 leading-relaxed">Range <MathView math="(0, 1)" inline />. Smooth probabilistic S-curve. Standard choice for binary classification output layers. Suffers from vanishing gradient for <MathView math="|x| > 3" inline />.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-teal-800 block mb-1">ReLU (Rectified Linear Unit):</span>
                  <MathView math="f(x) = \max(0, x)" display className="bg-white p-2 rounded border border-slate-200 text-teal-900 mb-2" />
                  <p className="text-slate-600 mt-0.5 leading-relaxed">Range <MathView math="[0, \infty)" inline />. Piecewise linear. Avoids saturation for positive activations (<MathView math="f'(x) = 1" inline />). Standard choice for deep hidden layers.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-purple-800 block mb-1">Hyperbolic Tangent (Tanh):</span>
                  <MathView math="\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}" display className="bg-white p-2 rounded border border-slate-200 text-purple-900 mb-2" />
                  <p className="text-slate-600 mt-0.5 leading-relaxed">Range <MathView math="(-1, 1)" inline />. Strictly zero-centered, which accelerates gradient descent compared to Sigmoid in intermediate hidden layers.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-amber-800 block mb-1">Linear Activation:</span>
                  <MathView math="f(x) = x" display className="bg-white p-2 rounded border border-slate-200 text-amber-900 mb-2" />
                  <p className="text-slate-600 mt-0.5 leading-relaxed">Range <MathView math="(-\infty, \infty)" inline />. Constant derivative <MathView math="f'(x) = 1" inline /> everywhere. Used in linear regression output layers. Cannot model non-linear boundaries.</p>
                </div>
              </div>
            </TopicItem>

            {/* 7. Learning Methods */}
            <TopicItem
              query={searchQuery}
              id="unit1-7"
              title="7. Learning Methods in Neural Networks"
              tag="Theory Reference"
              isInteractive={false}
              expanded={expandedTopics['unit1-7']}
              onToggle={() => toggleTopic('unit1-7')}
            >
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>Supervised Learning:</strong> The network is provided with pairs of inputs and corresponding ground-truth targets <MathView math="(\mathbf{x}, y)" inline />. The network computes error (loss) and updates weights using backpropagation (as demonstrated in our lab).</li>
                <li><strong>Unsupervised Learning:</strong> The network receives unlabeled inputs <MathView math="\mathbf{x}" inline /> and identifies underlying cluster structures, patterns, or principal dimensions (e.g. Self-Organizing Maps, Autoencoders, K-Means).</li>
                <li><strong>Reinforcement Learning:</strong> An autonomous agent interacts with an environment, receiving scalar rewards or penalties based on trial-and-error actions (e.g. Q-learning, Policy Gradients).</li>
              </ul>
            </TopicItem>

            {/* 8. Learning Rules */}
            <TopicItem
              query={searchQuery}
              id="unit1-8"
              title="8. Fundamental Learning Rules"
              tag="Core Syllabus Topic"
              isInteractive={false}
              expanded={expandedTopics['unit1-8']}
              onToggle={() => toggleTopic('unit1-8')}
            >
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">1. Hebbian Learning Rule (Hebb, 1949):</span>
                  <p className="italic text-slate-600 mb-1.5">"Neurons that fire together, wire together."</p>
                  <MathView math="\Delta w_i = \eta \cdot x_i \cdot y" display className="bg-white p-2 rounded border border-slate-200 text-blue-900 mb-1.5" />
                  <p className="mt-1 leading-relaxed">If input neuron <MathView math="x_i" inline /> and output neuron <MathView math="y" inline /> are simultaneously active, the synaptic weight between them increases proportionally.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">2. Perceptron Learning Rule (Rosenblatt, 1958):</span>
                  <MathView math="\mathbf{w}^{(\text{new})} = \mathbf{w}^{(\text{old})} + \eta (y - \hat{y})\mathbf{x}" display className="bg-white p-2 rounded border border-slate-200 text-blue-900 mb-1.5" />
                  <p className="mt-1 leading-relaxed">Updates weights only when a classification error occurs (<MathView math="y \neq \hat{y}" inline />). Guaranteed to converge in finite steps if and only if classes are linearly separable.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">3. Delta Rule / Widrow-Hoff Rule (Adaline, 1960):</span>
                  <MathView math="\Delta w_i = \eta (y - \hat{y}) f'(z) x_i" display className="bg-white p-2 rounded border border-slate-200 text-blue-900 mb-1.5" />
                  <p className="mt-1 leading-relaxed">Minimizes Mean Squared Error via gradient descent. The continuous, differentiable ancestor of generalized backpropagation.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">4. Correlation Learning Rule:</span>
                  <MathView math="\Delta w_i = \eta \cdot x_i \cdot y_{\text{target}}" display className="bg-white p-2 rounded border border-slate-200 text-blue-900 mb-1.5" />
                  <p className="mt-1 leading-relaxed">A supervised variant of Hebbian learning where synaptic weight adjustment is directly driven by the cross-correlation between input stimulus and teacher response.</p>
                </div>
              </div>
            </TopicItem>

            {/* 9 & 10. Single-layer vs Multilayer Neural Networks */}
            <TopicItem
              query={searchQuery}
              id="unit1-9"
              title="9 & 10. Single-Layer vs. Multilayer Neural Networks"
              tag="Demonstrated on XOR vs AND in Workbench"
              isInteractive={true}
              expanded={expandedTopics['unit1-9']}
              onToggle={() => toggleTopic('unit1-9')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">Single-Layer Networks:</span>
                  <p className="text-slate-600 leading-relaxed mb-2">
                    Direct input-to-output mapping without intermediate processing units.
                  </p>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside">
                    <li>Forms a single linear hyperplane boundary: <MathView math="w_1 x_1 + w_2 x_2 + b = 0" inline />.</li>
                    <li>Can solve AND and OR logic gates (linearly separable).</li>
                    <li><strong>Fundamental limitation:</strong> Mathematically incapable of solving XOR (Minsky & Papert, 1969).</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">Multilayer Networks (MLP):</span>
                  <p className="text-slate-600 leading-relaxed mb-2">
                    Contains one or more hidden layers with non-linear activation functions.
                  </p>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside">
                    <li>Combines multiple linear hyperplanes into convex polygons and smooth non-linear regions.</li>
                    <li>Can solve XOR, Concentric Circles, and arbitrary non-linear problems.</li>
                    <li><strong>Universal Approximation Theorem (Cybenko, 1989):</strong> An MLP with a single hidden layer containing sufficient non-linear neurons can approximate any continuous function on a compact subset of <MathView math="\mathbb{R}^n" inline />.</li>
                  </ul>
                </div>
              </div>
            </TopicItem>

            {/* 11. Feed-forward Neural Networks */}
            <TopicItem
              query={searchQuery}
              id="unit1-11"
              title="11. Feed-Forward Neural Networks"
              tag="Interactive Walkthrough in Forward Tab"
              isInteractive={true}
              expanded={expandedTopics['unit1-11']}
              onToggle={() => toggleTopic('unit1-11')}
            >
              <p className="text-xs text-slate-700 leading-relaxed">
                In a feed-forward network, connections between nodes form a directed acyclic graph (DAG). Information flows strictly unidirectionally from input units, through hidden layers, to output units. There are no cycles, memory delay elements, or feedback loops. Feed-forward networks are memoryless: the prediction for input <MathView math="\mathbf{x}(t)" inline /> depends strictly on the current input <MathView math="\mathbf{x}(t)" inline />, independent of past inputs <MathView math="\mathbf{x}(t-1)" inline />.
              </p>
            </TopicItem>

            {/* 12. Recurrent Neural Networks */}
            <TopicItem
              query={searchQuery}
              id="unit1-12"
              title="12. Recurrent Neural Networks (RNNs)"
              tag="Theoretical Syllabus Topic"
              isInteractive={false}
              expanded={expandedTopics['unit1-12']}
              onToggle={() => toggleTopic('unit1-12')}
            >
              <div className="space-y-3 text-xs text-slate-700">
                <p className="leading-relaxed">
                  Unlike feed-forward networks, <strong>Recurrent Neural Networks (RNNs)</strong> contain feedback loops where the output or hidden state at time step <MathView math="t" inline /> is fed back into the network as input at time step <MathView math="t+1" inline />. This recurrence provides the network with <strong>internal memory</strong>, making it suited for sequential and temporal data (time series, audio, speech, natural language).
                </p>

                {/* Conceptual RNN Diagram */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Recurrent Neuron State Transition:
                  </div>
                  <MathView 
                    math="\begin{aligned} \mathbf{h}_t &= \tanh\left(W_{hh}\mathbf{h}_{t-1} + W_{xh}\mathbf{x}_t + \mathbf{b}_h\right) \\ \hat{\mathbf{y}}_t &= \operatorname{softmax}\left(W_{hy}\mathbf{h}_t + \mathbf{b}_y\right) \end{aligned}" 
                    display 
                    className="bg-white p-2.5 rounded border border-slate-200 text-blue-900 mb-2" 
                  />
                  <p className="text-[11px] text-slate-500">
                    Where <MathView math="\mathbf{h}_t" inline /> is the hidden state vector at time step <MathView math="t" inline />, <MathView math="\mathbf{h}_{t-1}" inline /> is the previous hidden state (internal memory), and <MathView math="W_{hh}" inline /> is the recurrent weight transition matrix.
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
              query={searchQuery}
              id="unit2-1"
              title="1. Loss Functions in Neural Networks"
              tag="Implemented in Training Core"
              isInteractive={true}
              expanded={expandedTopics['unit2-1']}
              onToggle={() => toggleTopic('unit2-1')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">Binary Cross-Entropy (BCE) / Log Loss:</span>
                  <MathView 
                    math="\mathcal{L} = -\frac{1}{N}\sum_{i=1}^N \left[ y_i \ln(\hat{y}_i) + (1 - y_i)\ln(1 - \hat{y}_i) \right]" 
                    display 
                    className="bg-white p-2 rounded border border-slate-200 text-blue-900 my-1.5" 
                  />
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    The standard loss for binary classification with Sigmoid output. Heavily penalizes confident incorrect predictions (e.g. predicting <MathView math="\hat{y}=0.99" inline /> when true label is <MathView math="y=0" inline />).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">Mean Squared Error (MSE):</span>
                  <MathView 
                    math="\text{MSE} = \frac{1}{2N}\sum_{i=1}^N (\hat{y}_i - y_i)^2" 
                    display 
                    className="bg-white p-2 rounded border border-slate-200 text-blue-900 my-1.5" 
                  />
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Measures average squared Euclidean distance between predictions and targets. Common for continuous regression tasks and classical Adaline / Delta Rule formulations.
                  </p>
                </div>
              </div>
            </TopicItem>

            {/* 2. Weight Initialization */}
            <TopicItem
              query={searchQuery}
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
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside mb-2">
                <li><strong>Zero Initialization:</strong> Causes symmetry failure. Every neuron in a hidden layer computes the exact same value and receives identical gradient updates. The network cannot learn diverse representations.</li>
                <li><strong>Xavier / Glorot (2010):</strong> Sets variance <MathView math="\operatorname{Var}(W) = \frac{2}{n_{\text{in}} + n_{\text{out}}}" inline />. Preserves variance of activations and backpropagated gradients across layers for Sigmoid and Tanh activations.</li>
                <li><strong>He / Kaiming (2015):</strong> Sets variance <MathView math="\operatorname{Var}(W) = \frac{2}{n_{\text{in}}}" inline />. Specifically calibrated for non-symmetric ReLU activations, which zero out negative half-spaces.</li>
              </ul>
            </TopicItem>

            {/* 3. Optimization Algorithms */}
            <TopicItem
              query={searchQuery}
              id="unit2-3"
              title="3. Optimization Algorithms"
              tag="Implemented in Training Loop"
              isInteractive={true}
              expanded={expandedTopics['unit2-3']}
              onToggle={() => toggleTopic('unit2-3')}
            >
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">Gradient Descent (GD):</span>
                  <p className="text-slate-600 mb-1.5">
                    Iteratively moves parameters in the direction of steepest descent (negative gradient of the loss surface):
                  </p>
                  <MathView math="\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \nabla_{\boldsymbol{\theta}}\mathcal{L}(\boldsymbol{\theta}_t)" display className="bg-white p-2 rounded border border-slate-200 text-blue-900" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
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
              query={searchQuery}
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

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                  <div className="text-slate-500 font-sans font-bold text-[11px] uppercase tracking-wider">Mathematical Steps:</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-44">1. Output Error Signal:</span>
                    <MathView math="\boldsymbol{\delta}^{(L)} = \frac{\partial \mathcal{L}}{\partial \mathbf{z}^{(L)}} = \mathbf{a}^{(L)} - \mathbf{y}" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-44">2. Hidden Error Signal:</span>
                    <MathView math="\boldsymbol{\delta}^{(l)} = \left( (W^{(l+1)})^T \boldsymbol{\delta}^{(l+1)} \right) \odot f'(\mathbf{z}^{(l)})" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-44">3. Weight Gradient:</span>
                    <MathView math="\frac{\partial \mathcal{L}}{\partial W^{(l)}} = \boldsymbol{\delta}^{(l+1)} (\mathbf{a}^{(l)})^T" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-44">4. Bias Gradient:</span>
                    <MathView math="\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{(l)}} = \boldsymbol{\delta}^{(l+1)}" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-44">5. Parameter Update:</span>
                    <MathView math="W^{(l)} \leftarrow W^{(l)} - \eta \frac{\partial \mathcal{L}}{\partial W^{(l)}}" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                </div>

                <p className="text-slate-600">
                  By working backward from layer L to layer 1, backpropagation reuses intermediate error signals <MathView math="\boldsymbol{\delta}" inline />, eliminating redundant derivative calculations and reducing computational complexity from <MathView math="\mathcal{O}(W^2)" inline /> to <MathView math="\mathcal{O}(W)" inline />.
                </p>
              </div>
            </TopicItem>

            {/* 5. Associative Memory Networks */}
            <TopicItem
              query={searchQuery}
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
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block mb-1">1. Autoassociative Memory:</span>
                    <p className="text-slate-600 mb-1">
                      Stores a pattern <MathView math="\mathbf{x}" inline /> and recalls the exact same pattern <MathView math="\mathbf{x}" inline /> when queried with a noisy version <MathView math="\mathbf{\tilde{x}}" inline />:
                    </p>
                    <MathView math="\operatorname{Query}(\mathbf{\tilde{x}}) \longrightarrow \text{Output: } \mathbf{x}" display className="bg-white p-2 rounded border border-slate-200 text-blue-900 my-1" />
                    <p className="text-slate-500 text-[11px] mt-1">Example: Discrete Hopfield Network.</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block mb-1">2. Heteroassociative Memory:</span>
                    <p className="text-slate-600 mb-1">
                      Stores associations between pairs of distinct patterns <MathView math="(\mathbf{x}, \mathbf{y})" inline />. When presented with pattern <MathView math="\mathbf{x}" inline />, it recalls associated pattern <MathView math="\mathbf{y}" inline />:
                    </p>
                    <MathView math="\operatorname{Query}(\mathbf{x}) \longrightarrow \text{Output: } \mathbf{y}" display className="bg-white p-2 rounded border border-slate-200 text-blue-900 my-1" />
                    <p className="text-slate-500 text-[11px] mt-1">Example: Bidirectional Associative Memory (BAM).</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
                  <strong>Storage Capacity:</strong> For an autoassociative network of N binary neurons, the maximum number of mutually orthogonal patterns that can be reliably recalled without crosstalk noise is approximately <MathView math="P_{\max} \approx 0.14 \cdot N" inline />.
                </div>
              </div>
            </TopicItem>

            {/* 6. Discrete-Time Hopfield Networks */}
            <TopicItem
              query={searchQuery}
              id="unit2-6"
              title="6. Discrete-Time Hopfield Networks"
              tag="Theoretical Syllabus Topic"
              isInteractive={false}
              expanded={expandedTopics['unit2-6']}
              onToggle={() => toggleTopic('unit2-6')}
            >
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  Introduced by John Hopfield (1982), the <strong>Discrete-Time Hopfield Network</strong> is a single-layer, fully recurrent, autoassociative neural network with symmetric connection weights and binary threshold units <MathView math="s_i \in \{-1, +1\}" inline />.
                </p>

                {/* Key Mathematical Properties */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                  <div className="text-slate-500 font-sans font-bold text-[11px] uppercase tracking-wider">Key Mathematical Properties:</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-52">1. Symmetric Weight Matrix:</span>
                    <MathView math="W_{ij} = W_{ji}, \quad W_{ii} = 0" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-52">2. Hebbian Storage Rule:</span>
                    <MathView math="W_{ij} = \frac{1}{N}\sum_{p=1}^P s_i^{(p)} s_j^{(p)}" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-52">3. Discrete Update Rule:</span>
                    <MathView math="s_i(t+1) = \operatorname{sgn}\left( \sum_{j=1}^N W_{ij} s_j(t) - \theta_i \right)" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 w-52">4. Lyapunov Energy Function:</span>
                    <MathView math="E = -\frac{1}{2}\sum_{i=1}^N \sum_{j=1}^N W_{ij} s_i s_j + \sum_{i=1}^N \theta_i s_i" inline className="text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200" />
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded text-blue-950">
                  <strong>Convergence Proof:</strong> Because the weight matrix is symmetric (<MathView math="W_{ij} = W_{ji}" inline />) with zero diagonals (<MathView math="W_{ii} = 0" inline />), the energy E is monotonically non-increasing (<MathView math="\Delta E \le 0" inline />) with every asynchronous neuron update. The network is guaranteed to settle into a local energy minimum representing a stored memory pattern.
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
                  <strong>Answer:</strong> A single-layer perceptron can only generate a single linear hyperplane (<MathView math="w_1 x_1 + w_2 x_2 + b = 0" inline />). The XOR truth table places positive points at (0,1) and (1,0) and negative points at (0,0) and (1,1). No single straight line can separate these two classes. A multilayer network solves this by projecting inputs into a hidden feature space where the classes become linearly separable.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q2: What is the purpose of the bias term in a neuron?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> Bias provides an affine shift to the activation function. Without bias (<MathView math="b = 0" inline />), the decision hyperplane is strictly constrained to pass through the origin <MathView math="(0, 0)" inline />. Adding bias decouples the decision boundary from the origin, allowing it to translate anywhere in the input space to correctly classify data.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q3: What causes the vanishing gradient problem in deep networks?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> The derivative of the Sigmoid function peaks at only 0.25 and approaches 0 for <MathView math="|x| > 3" inline />. When backpropagating through multiple hidden layers via the chain rule, gradients are multiplied by these small fractional derivatives (<MathView math="0.25 \times 0.25 \times 0.25..." inline />). The gradient signal exponentially decays toward zero as it approaches early layers, preventing them from learning. ReLU solves this because its derivative is exactly 1 for all positive activations (<MathView math="f'(x) = 1" inline />).
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q4: Why does zero weight initialization fail in multi-layer networks?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> If all weights are initialized to zero, all hidden neurons in a layer compute identical pre-activations <MathView math="z = 0" inline /> and identical outputs <MathView math="a = f(0)" inline />. During backpropagation, every hidden neuron receives the exact same error gradient <MathView math="\boldsymbol{\delta}" inline />. Consequently, all weights update identically and remain identical across all training epochs. The network suffers from symmetry failure and functions as if it only had a single hidden neuron.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">
                  Q5: How does a Discrete Hopfield Network guarantee convergence?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Answer:</strong> A Hopfield network has a symmetric weight matrix (<MathView math="W_{ij} = W_{ji}" inline />) with zero self-connections (<MathView math="W_{ii} = 0" inline />). Hopfield formulated a quadratic Lyapunov energy function <MathView math="E = -\frac{1}{2} \sum_{i} \sum_{j} W_{ij} s_i s_j" inline />. Whenever any individual neuron flips state according to the discrete threshold rule, the change in energy <MathView math="\Delta E \le 0" inline /> is always non-positive. Because energy is bounded from below, the network is guaranteed to settle into a stable attractor state (local minimum) representing a stored pattern.
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

          {/* Interactive Viva Voce Self-Assessment Quiz */}
          <VivaQuiz />
        </div>
      )}
    </div>
  );
}

function TopicItem({ id, title, tag, isInteractive, expanded, onToggle, query = '', keywords = '', children }) {
  const q = query.trim().toLowerCase();
  const isMatch = !q || title.toLowerCase().includes(q) || tag.toLowerCase().includes(q) || keywords.toLowerCase().includes(q);
  if (!isMatch) return null;

  const isOpen = q ? true : expanded;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all shadow-xs">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer transition-colors"
      >
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 pr-2">
          <span className="font-semibold text-xs text-slate-900">{title}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
              isInteractive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {tag}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      {isOpen && <div className="p-4 pt-1 border-t border-slate-100">{children}</div>}
    </div>
  );
}
