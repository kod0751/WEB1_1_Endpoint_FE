import { useState } from 'react';
import type { BaseQuizAPI } from '@/types';

interface QuizABProps {
  quiz: BaseQuizAPI;
  onAnswerSelect: (answer: number) => void;
  selectedAnswer: number | null;
}

function QuizAB({ quiz, onAnswerSelect, selectedAnswer }: QuizABProps) {
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(selectedAnswer);

  const handleOptionClick = (optionNo: number) => {
    if (currentAnswer !== null) return;
    setCurrentAnswer(optionNo);
    onAnswerSelect(optionNo);
  };

  return (
    <div>
      <h3 className="text-md font-semibold mb-4">{quiz.content}</h3>
      <div className="grid grid-cols-2 gap-4">
        {quiz.options.map((option) => (
          <div key={option.no} className="flex flex-col items-center gap-4">
            {option.imagePath && (
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src={option.imagePath}
                  alt={option.content}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            )}
            <div
              className={`p-4 rounded-lg border text-sm font-medium cursor-pointer text-center w-full ${
                currentAnswer === null ? 'hover:bg-gray-100' : ''
              }`}
              onClick={() => handleOptionClick(option.no)}
              style={{
                background:
                  currentAnswer !== null
                    ? `linear-gradient(to right, ${
                        currentAnswer === option.no ? '#FDBA94' : '#FEF2EA'
                      } ${option.selectionRatio * 100}%, #FFFFFF ${option.selectionRatio * 100}%)`
                    : '',
                color:
                  currentAnswer !== null && currentAnswer !== option.no ? '#6B7280' : '#000000',
                borderColor:
                  currentAnswer !== null
                    ? currentAnswer === option.no
                      ? '#FDBA94'
                      : '#E5E7EB'
                    : '#D1D5DB',
              }}
            >
              {option.content}
              {currentAnswer !== null && (
                <span className="block mt-2 font-semibold">
                  {(option.selectionRatio * 100).toFixed(1)}% (
                  {Math.round(option.selectionRatio * 100)}명)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizAB;
