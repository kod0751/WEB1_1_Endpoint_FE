import { BaseQuizAPI } from '@/types';
import Avatar from '@eolluga/eolluga-ui/Display/Avatar';
import { useEffect, useState } from 'react';
import { QuizAns, QuizFooter, QuizRenderer } from '.';
import BottomSheet from '../common/BottomSheet';
import { useToggleLike } from '@/api/updateLike';
import { usePostAnswer } from '@/api/quiz/postAnswer';

interface QuizWrapperProps {
  quiz: BaseQuizAPI;
}

function QuizWrapper({ quiz }: QuizWrapperProps) {
  const [isLiked, setIsLiked] = useState(quiz.liked || false);
  const [likes, setLikes] = useState(quiz.count.like);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(quiz.answeredOption ?? null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  const submitAnswerMutation = usePostAnswer();

  useEffect(() => {
    if (selectedAnswer !== null) {
      setIsCorrect(selectedAnswer === quiz.answer?.answerNumber);

      const timer = setTimeout(() => setIsAnswerVisible(true), 50);
      return () => clearTimeout(timer);
    }
    setIsAnswerVisible(false);
  }, [selectedAnswer]);

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    submitAnswerMutation.mutate({ quizId: quiz.id, choiceNumber: answer });

    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (quiz.answer) {
      setIsCorrect(answer === quiz.answer.answerNumber);
    }
  };

  const correctOption = quiz.answer
    ? quiz.options.find((option) => option.no === quiz.answer!.answerNumber)
    : null;

  const answerRate = correctOption ? correctOption.selectionRatio * 100 : 0;

  const authorName = quiz.author?.name || 'default';
  const authorImage = quiz.author?.imagePath || '/';
  
  const toggleLikeMutation = useToggleLike(
    () => {
      setIsLiked((prev) => !prev);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    (error) => {
      console.error('좋아요 요청 중 오류 발생:', error);
    },
  );

  const handleToggleLike = () => {
    toggleLikeMutation.mutate(quiz.id);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <Avatar input="image" size="S" image={authorImage} />
          <div className="ml-4">
            <h4 className="text-md font-bold">{authorName}</h4>
            <p className="text-sm text-gray-500">{quiz.type}</p>
          </div>
        </div>
        <QuizRenderer
          quiz={quiz}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
        />
        {selectedAnswer !== null && quiz.answer && (
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isAnswerVisible ? 'max-h-[500px]' : 'max-h-0'
            }`}
          >
            <QuizAns
              isCorrect={isCorrect!}
              explanation={quiz.answer?.explanation || ''}
              answerRate={answerRate}
            />
          </div>
        )}
        <QuizFooter
          likes={likes}
          comments={quiz.count.comment}
          isLiked={isLiked}
          onToggleLike={handleToggleLike}
          onCommentsClick={() => setBottomSheetOpen(true)}
        />
      </div>
      <BottomSheet isOpen={isBottomSheetOpen} setOpen={setBottomSheetOpen} quizId={quiz.id} />
    </div>
  );
}

export default QuizWrapper;
