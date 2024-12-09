import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/common/TopBar';
import { Button as ShadcnButton } from '@/shadcn/ui/button';
import Card from '@/components/common/Card';
import { CheckCircle2, XCircle, ArrowRight, Medal } from 'lucide-react';
import Container from '@/components/layout/Container';
import Celebrate from './Celebrate';
import { Rank } from '@/types/GameTypes';
import { useGameStore } from '@/stores/useGameStore';
import AboutPage from '@/components/common/AboutPage';

export default function Result() {
  const { rank, results, players } = useGameStore();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [showCelebrate, setCelebrate] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCelebrate(false);
    }, 3500);
  });

  const getMedalIcon = (rank: Rank) => {
    switch (rank) {
      case 1:
        return <Medal className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <AboutPage
        title="게임 결과"
        description="사설, 경쟁전 퀴즈 게임 결과를 조회하는 페이지"
        keywords="퀴즈, 게임, 결과, 조회"
      />
      <TopBar />
      {showCelebrate ? (
        <Celebrate show={show} setShow={setShow} />
      ) : (
        <Container>
          <Card>
            <Card className="p-6 mb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                {getMedalIcon(rank as Rank)}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {rank === 1 ? '우승했습니다!' : `${rank}등 입니다!`}
              </h2>
              <p className="text-gray-600">
                총 {players.length}명 중 {rank}등을 기록하셨습니다.
              </p>
            </Card>

            <h3 className="text-xl font-bold mb-4">문제 리스트</h3>
            {results.map((quiz, index) => (
              <Card key={index} className="p-6 mb-4">
                <div className="flex items-start gap-4">
                  {quiz.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium mb-2">{quiz.quizContent}</h4>
                    <p className="text-sm text-gray-600 mb-2">당신의 답변: {quiz.choice}</p>
                    {quiz.choice !== quiz.answer && (
                      <p className="text-sm text-gray-600 mb-2">정답: {quiz.answer}</p>
                    )}
                    <p className="text-sm text-gray-600">해설: {quiz.explanation}</p>
                  </div>
                </div>
              </Card>
            ))}

            <ShadcnButton
              className="w-full h-14 text-lg"
              size="lg"
              onClick={() => navigate('/game')}
            >
              나가기 <ArrowRight className="ml-2 h-5 w-5" />
            </ShadcnButton>
          </Card>
        </Container>
      )}
    </div>
  );
}
