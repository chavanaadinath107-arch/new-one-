import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { generateQuiz } from '../services/gemini';
import { QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setQuizFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    try {
      const data = await generateQuiz();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-zinc-500 font-medium">AI is generating your quiz...</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white border border-black/5 rounded-3xl p-10 shadow-sm text-center space-y-6"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>
          <p className="text-zinc-500">You scored {score} out of {questions.length}</p>
        </div>
        <div className="text-5xl font-bold text-emerald-600">
          {Math.round((score / questions.length) * 100)}%
        </div>
        <button
          onClick={fetchQuiz}
          className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          Try Another Quiz
        </button>
      </motion.div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Knowledge Quiz</h2>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Question {currentIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="px-4 py-1 bg-zinc-100 rounded-full text-sm font-bold text-zinc-600">
          Score: {score}
        </div>
      </div>

      <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="bg-emerald-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold leading-tight">{current.question}</h3>
        
        <div className="grid gap-3">
          {current.options.map((option, idx) => {
            const isCorrect = idx === current.correctAnswer;
            const isSelected = idx === selectedAnswer;
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full p-5 text-left rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group",
                  selectedAnswer === null 
                    ? "bg-white border-black/5 hover:border-emerald-500 hover:bg-emerald-50/30" 
                    : isCorrect 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                      : isSelected 
                        ? "bg-red-50 border-red-500 text-red-700" 
                        : "bg-white border-black/5 opacity-50"
                )}
              >
                <span className="font-medium">{option}</span>
                {selectedAnswer !== null && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                {selectedAnswer !== null && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 text-white p-6 rounded-3xl space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Explanation</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">{current.explanation}</p>
              <button
                onClick={nextQuestion}
                className="w-full mt-4 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
