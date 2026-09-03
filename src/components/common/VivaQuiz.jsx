import React, { useState } from 'react';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Award } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: 'Why is a single-layer perceptron mathematically unable to solve the XOR logic function?',
    options: [
      { text: 'A single-layer perceptron has no weights or bias terms.', correct: false },
      { text: 'A single-layer perceptron can only generate a single linear hyperplane boundary, whereas XOR is non-linearly separable.', correct: true },
      { text: 'The learning rate is always too small for XOR.', correct: false },
      { text: 'XOR requires continuous real-valued inputs between -1 and +1.', correct: false },
    ],
    explanation: 'Minsky & Papert (1969) proved that single-layer perceptrons can only form linear decision boundaries. XOR requires a non-linear boundary formed by at least one hidden layer.',
  },
  {
    id: 2,
    question: 'What is the mathematical role of the bias parameter b in z = W·x + b?',
    options: [
      { text: 'To shift the activation threshold away from the origin (0, 0).', correct: true },
      { text: 'To scale the magnitude of incoming input features.', correct: false },
      { text: 'To prevent the network from having negative outputs.', correct: false },
      { text: 'To compute the loss derivative during backpropagation.', correct: false },
    ],
    explanation: 'Without bias, the decision boundary is forced to pass through the origin (0, 0). Bias allows the decision boundary to translate freely across the feature space.',
  },
  {
    id: 3,
    question: 'Which activation function avoids the vanishing gradient problem for positive pre-activations?',
    options: [
      { text: 'Sigmoid, because its maximum derivative is 0.25.', correct: false },
      { text: 'Tanh, because its output is zero-centered.', correct: false },
      { text: 'ReLU (Rectified Linear Unit), because its derivative is constant 1 for all x > 0.', correct: true },
      { text: 'Linear, because it collapses multi-layer networks to a single layer.', correct: false },
    ],
    explanation: 'ReLU has a constant derivative f\'(x) = 1 for all positive inputs, allowing gradient signals to backpropagate through deep layers without exponential decay.',
  },
  {
    id: 4,
    question: 'What occurs during training if all weights and biases are initialized to zero?',
    options: [
      { text: 'The network trains 50% faster because calculations are simpler.', correct: false },
      { text: 'Symmetry breakdown failure: all hidden neurons compute identical outputs and receive identical gradients, preventing feature learning.', correct: true },
      { text: 'The loss immediately reaches zero on the first epoch.', correct: false },
      { text: 'Gradients explode to infinity.', correct: false },
    ],
    explanation: 'Zero initialization causes all hidden units to behave symmetrically. They update identically and the network acts as if it only had a single hidden neuron.',
  },
  {
    id: 5,
    question: 'What mathematical property guarantees convergence in a Discrete-Time Hopfield Network?',
    options: [
      { text: 'A symmetric weight matrix (W_ij = W_ji) with zero diagonals ensuring a non-increasing Lyapunov energy function (ΔE ≤ 0).', correct: true },
      { text: 'Using the Adam optimizer with high momentum.', correct: false },
      { text: 'Having an infinite number of training epochs.', correct: false },
      { text: 'Ensuring inputs are strictly normalized between 0 and 1.', correct: false },
    ],
    explanation: 'Hopfield (1982) formulated a Lyapunov quadratic energy function. Because weights are symmetric with zero diagonals, every asynchronous state update results in ΔE ≤ 0, guaranteeing convergence to a local energy minimum.',
  },
];

export function VivaQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optIdx }
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId, optIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.correct) {
        score++;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === QUESTIONS.length;

  return (
    <Card
      title="Syllabus Viva Voce Self-Assessment Quiz"
      subtitle="Test your comprehension of Unit I & Unit II core viva examination questions"
      badge={
        submitted ? (
          <Badge variant={score === 5 ? 'success' : score >= 3 ? 'primary' : 'warning'}>
            Score: {score} / {QUESTIONS.length}
          </Badge>
        ) : (
          <Badge variant="navy">5 Questions</Badge>
        )
      }
      action={
        submitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        )
      }
    >
      <div className="space-y-5 text-xs">
        {QUESTIONS.map((q, qIdx) => {
          const selected = selectedAnswers[q.id];
          return (
            <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-semibold text-slate-900 mb-2.5 text-xs leading-relaxed">
                <span className="text-blue-700 font-bold mr-1.5">{qIdx + 1}.</span>
                {q.question}
              </div>

              <div className="space-y-1.5">
                {q.options.map((opt, optIdx) => {
                  const isChosen = selected === optIdx;
                  let optStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';

                  if (submitted) {
                    if (opt.correct) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
                    } else if (isChosen && !opt.correct) {
                      optStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                    }
                  } else if (isChosen) {
                    optStyle = 'bg-blue-50 border-blue-600 text-blue-950 font-medium ring-1 ring-blue-600';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full p-2.5 rounded-md border text-left flex items-start gap-2 transition-all cursor-pointer ${optStyle}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 text-[11px] leading-relaxed">{opt.text}</span>
                      {submitted && opt.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {submitted && isChosen && !opt.correct && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-2.5 p-2 bg-blue-50/70 border border-blue-200 rounded text-[11px] text-blue-950">
                  <strong>Academic Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        {!submitted ? (
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500 text-[11px]">
              {Object.keys(selectedAnswers).length} of {QUESTIONS.length} answered
            </span>
            <button
              disabled={!allAnswered}
              onClick={() => setSubmitted(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-md shadow-xs cursor-pointer transition-colors"
            >
              Submit & Check Answers
            </button>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-3 text-emerald-950">
            <Award className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold block">
                Quiz Result: {score} out of {QUESTIONS.length} correct ({((score / QUESTIONS.length) * 100).toFixed(0)}%)
              </span>
              <p className="text-[11px] text-emerald-900 mt-0.5">
                {score === 5
                  ? 'Outstanding! You have mastered the Unit I & II syllabus concepts for your viva voce.'
                  : 'Review the explanations above to strengthen your answers for the viva voce.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
