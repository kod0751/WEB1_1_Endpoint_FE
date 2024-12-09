import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStartGame from '@/api/game/useStartGame';
import { useGameStore } from '@/stores/useGameStore';
import { useStompStore } from '@/api/game/useStompStore';
import NumberStepper from '@eolluga/eolluga-ui/Input/NumberStepper';
import Icon from '@eolluga/eolluga-ui/icon/Icon';
import TextField from '@eolluga/eolluga-ui/Input/TextField';
import { Play, Loader2 } from 'lucide-react';
import TopBar from '@/components/common/TopBar';
import DragScrollWrapper from '@/components/common/DragScrollWrapper';
import MemberItem from '@/components/common/MemberItem';
import { Player } from '@/types/GameTypes';
import Card from '@/components/common/Card';
import Label from '@/components/common/Label';
import { Button as ShadcnButton } from '@/shadcn/ui/button';
import ToastMessage from '@/components/common/ToastMessage';
import LoadingSpinner from '@/components/game/LoadingSpinner';
import AboutPage from '@/components/common/AboutPage';

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { mutate: startGame } = useStartGame();
  const { gameId, subject, level, quiz, quizCount, inviteCode, players } = useGameStore();
  const { isLoading, setIsLoading, exitGame, kickPlayer } = useStompStore();
  const [copied, setCopied] = useState(false);
  const [kicked, setKicked] = useState(false);

  useEffect(() => {
    if (quiz !== null) {
      setTimeout(() => {
        navigate('/game/play');
        setIsLoading(false);
      }, 2000);
    }
  }, [quiz]);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGameStart = async () => {
    setIsLoading(true);
    startGame(gameId);
  };

  const exitGameRoom = () => {
    exitGame(gameId);
    navigate('/game/create');
  };

  const kickUser = (playerId: number) => {
    kickPlayer(gameId, playerId);
  };

  const hostPlayer = players.filter((player) => player.host === true);
  const isHost = hostPlayer[0].host;

  return (
    <div className="flex flex-col">
      <AboutPage
        title="게임 대기"
        description="사설, 경쟁전 참가 이전에 참여자들과 대기하는 페이지"
        keywords="대기, 퀴즈, 게임"
      />
      <TopBar leftIcon="left" leftText="게임 대기방" onClickLeft={exitGameRoom} />
      {isLoading && <LoadingSpinner />}

      <section className="pt-20 px-4">
        <Card>
          <label className="block text-xl font-bold text-gray-700 mb-2">참여자</label>
          <DragScrollWrapper>
            {players.map((player: Player) => (
              <MemberItem
                key={player.name}
                member={player}
                handleExit={() => kickUser(player.id)}
              />
            ))}
          </DragScrollWrapper>
        </Card>
      </section>

      <section className="px-4 pb-24">
        <Card>
          <div className="pb-4">
            <Label className="block mb-2" content="퀴즈 주제" />
            <div className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-left shadow-sm">
              <span>{subject}</span>
            </div>
          </div>

          <div className="pb-4">
            <Label className="block mb-2" content="난이도" />
            <div className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-left shadow-sm">
              <span>{level}</span>
            </div>
          </div>

          <Label className="block mb-2" content="문제 갯수" />
          <NumberStepper
            state="readOnly"
            count={quizCount}
            width={'long'}
            size={'M'}
            description="최소 5문제부터 최대 20문제까지 가능합니다"
            setCount={() => console.log('')}
          />
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">초대 코드</h2>
          <div className="flex items-center gap-2">
            <TextField
              value={inviteCode}
              state="readOnly"
              onChange={() => console.log('')}
              size={'M'}
            />
            <ShadcnButton size="icon" onClick={copyInviteCode}>
              {copied ? (
                <Icon icon="checkmark" className="fill-white" />
              ) : (
                <Icon icon="copy" className="fill-white" />
              )}
            </ShadcnButton>
          </div>
        </Card>
      </section>

      {isHost && (
        <div className="max-w-xl mx-auto fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-md z-10 w-full p-4">
          <ShadcnButton
            className="w-full h-14 text-lg relative"
            size="lg"
            onClick={handleGameStart}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                게임 시작 중...
              </>
            ) : (
              <>
                <Play className="mr-2 h-6 w-6" /> 게임 시작
              </>
            )}
            <ToastMessage
              message="초대코드가 복사되었습니다"
              icon="check"
              open={copied}
              setOpen={setCopied}
            />
            <ToastMessage
              message="해당 플레이어를 강퇴했습니다"
              icon="warning"
              open={kicked}
              setOpen={setKicked}
            />
          </ShadcnButton>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
