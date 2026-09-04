import React, { useState } from 'react';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { CheckCircle2, XCircle, RotateCcw, Award, Check } from 'lucide-react';

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
  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === QUESTIONS.length;
  const progressPct = (answeredCount / QUESTIONS.length) * 100;

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
          <Badge variant="navy">{QUESTIONS.length} Questions</Badge>
        )
      }
      action={
        submitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-medium active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        )
      }
    >
      <div className="space-y-5 text-xs">
        {/* Progress Tracker */}
        <div className="space-y-1.5 pb-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Completion Progress</span>
            <span className="font-mono font-semibold text-blue-900">
              {answeredCount} of {QUESTIONS.length} Answered ({progressPct.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Questions list */}
        {QUESTIONS.map((q, qIdx) => {
          const selected = selectedAnswers[q.id];
          return (
            <div
              key={q.id}
              className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-xl transition-all duration-200 shadow-xs"
            >
              <div className="font-semibold text-slate-900 mb-3 text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <span className="font-serif-heading flex-1">{q.question}</span>
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isChosen = selected === optIdx;
                  let optStyle =
                    'bg-white border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30 text-slate-700 shadow-xs';

                  if (submitted) {
                    if (opt.correct) {
                      optStyle = 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-medium shadow-xs';
                    } else if (isChosen && !opt.correct) {
                      optStyle = 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-xs';
                    }
                  } else if (isChosen) {
                    optStyle =
                      'bg-blue-50/90 border-blue-600 text-blue-950 font-medium ring-2 ring-blue-600/20 shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer active:scale-[0.99] ${optStyle}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 ${
                          isChosen
                            ? 'border-blue-600 bg-blue-600 text-white font-bold'
                            : 'border-slate-300 text-slate-500 bg-slate-50'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 text-[11px] sm:text-xs leading-relaxed">{opt.text}</span>
                      {submitted && opt.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {submitted && isChosen && !opt.correct && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200/90 rounded-lg text-[11px] sm:text-xs text-blue-950 leading-relaxed">
                  <strong className="font-semibold text-blue-900 block mb-0.5">
                    Academic Viva Explanation:
                  </strong>{' '}
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit or Result Banner */}
        {!submitted ? (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-slate-500 text-[11px] font-medium">
              {answeredCount === QUESTIONS.length
                ? 'All questions completed! Ready to submit.'
                : `Please answer ${QUESTIONS.length - answeredCount} more questions.`}
            </span>
            <button
              disabled={!allAnswered}
              onClick={() => setSubmitted(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Submit & Evaluate Viva</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/90 border border-emerald-300/90 rounded-xl flex items-start sm:items-center gap-3.5 text-emerald-950 shadow-xs">
            <Award className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <span className="font-bold text-sm block font-serif-heading">
                Assessment Score: {score} / {QUESTIONS.length} ({((score / QUESTIONS.length) * 100).toFixed(0)}%)
              </span>
              <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                {score === 5
                  ? 'Excellent! You have completely mastered the core syllabus viva concepts.'
                  : score >= 3
                  ? 'Solid foundation! Review the academic explanations above for any incorrect questions to achieve perfection in your viva.'
                  : 'Re-examine the concepts and forward/backward propagation interactive sections above, then retake the quiz.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
