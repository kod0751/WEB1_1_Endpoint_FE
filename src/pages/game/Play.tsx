import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStompStore } from '@/api/game/useStompStore';
import { useGameStore } from '@/stores/useGameStore';
import Avatar from '@eolluga/eolluga-ui/Display/Avatar';
import { Button as ShadcnButton } from '@/shadcn/ui/button';
import Card from '@/components/common/Card';
import { Progress } from '@/shadcn/ui/progress';
import { LogOut, CheckCircle, XCircle } from 'lucide-react';
import DragScrollWrapper from '@/components/common/DragScrollWrapper';
import Dialog from '@/components/common/Dialog';
import FlexBox from '@/components/layout/FlexBox';
import Container from '@/components/layout/Container';
import NotFound from '@/components/game/NotFound';
import { GameQuiz } from '@/types/GameTypes';
import AboutPage from '@/components/common/AboutPage';

export default function GameProgress() {
  const navigate = useNavigate();
  const { submitAnswer, endGame } = useStompStore();
  const { gameId, quiz, players, isCorrect, setIsCorrect } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  if (quiz === null) return <NotFound message="퀴즈 데이터가 없습니다...!" />;

  const questions = quiz as GameQuiz[];
  const currentQuestionData = questions[currentQuestion];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (!isSubmit) {
        submitAnswer(gameId, currentQuestionData.id, '');
      }
      handleNextQuestion();
    }
  }, [timeLeft]);

  const handleSubmit = (quizId: number, answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const answer = currentQuestionData.options[answerIndex].content;
    submitAnswer(gameId, quizId, answer);
    setIsSubmit(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(10);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setIsSubmit(false);
    } else {
      endGame(gameId);
      setTimeout(() => {
        navigate('/game/result');
      }, 1000);
    }
  };

  const handleExit = () => navigate('/game');

  return (
    <FlexBox direction="col">
      <AboutPage
        title="게임 플레이"
        description="게임(퀴즈)을 플레이하는 페이지입니다"
        keywords="게임, 퀴즈, 멀티 플레이, 경쟁"
      />
      <header className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">{timeLeft}초</div>
          <Progress value={(timeLeft / 10) * 100} className="w-1/2" />
          <div className="text-lg font-semibold">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
      </header>

      <Container className="pb-32">
        {currentQuestionData && (
          <Card className="mb-4 p-4">
            <h2 className="text-xl font-bold mb-4">{currentQuestionData.content}</h2>
            <div className="grid grid-cols-1 gap-4">
              {currentQuestionData.options.map((option, index) => (
                <ShadcnButton
                  key={index}
                  onClick={() => handleSubmit(currentQuestionData.id, index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full justify-start text-left
                  ${
                    selectedAnswer === null
                      ? ' py-3 px-4 bg-white hover:bg-gray-100 border text-black' // 기본 상태
                      : selectedAnswer === index && isCorrect
                        ? ' py-3 px-4 bg-green-500 text-white' // 정답인 경우
                        : selectedAnswer === index && !isCorrect
                          ? 'py-3 px-4 bg-red-500 text-white' // 오답인 경우
                          : 'py-3 px-4 bg-white hover:bg-gray-100 border text-black' // 선택되지 않은 다른 버튼
                  }`}
                >
                  {option.content}
                </ShadcnButton>
              ))}
            </div>
            {isCorrect !== null && (
              <div
                className={`mt-4 flex items-center justify-center ${
                  isCorrect ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 mr-2" />
                )}
                <span className="text-lg font-semibold">
                  {isCorrect ? '정답입니다!' : '틀렸습니다!'}
                </span>
              </div>
            )}
          </Card>
        )}
      </Container>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-md z-10 w-full p-4">
        <DragScrollWrapper>
          {players.map((player) => (
            <FlexBox key={player.id} direction="col" className="items-center text-center relative">
              <Avatar input="image" size="S" image={player.imgPath} />
              <div className="mt-1 text-sm font-medium">{player.name}</div>
              <div className="mt-1 text-lg font-bold">{player.score}</div>
            </FlexBox>
          ))}
        </DragScrollWrapper>
        <ShadcnButton
          variant="destructive"
          className="w-full mt-2"
          onClick={() => setShowExitConfirmation(true)}
        >
          <LogOut className="mr-2 h-4 w-4" /> 나가기
        </ShadcnButton>
      </div>
      <Dialog
        open={showExitConfirmation}
        title="게임에서 나가시겠습니까?"
        description="게임에서 나가면 현재 진행 상황이 모두 사라집니다."
        leftText="예"
        rightText="아니요"
        leftOnClick={handleExit}
        rightOnClick={() => setShowExitConfirmation(false)}
        onClose={() => setShowExitConfirmation(false)}
      />
    </FlexBox>
  );
}
