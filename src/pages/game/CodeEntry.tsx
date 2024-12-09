import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStompStore } from '@/api/game/useStompStore';
import useJoinGame from '@/api/game/useJoinGame';
import { useGameStore } from '@/stores/useGameStore';
import TextField from '@eolluga/eolluga-ui/Input/TextField';
import TopBar from '@/components/common/TopBar';
import FlexBox from '@/components/layout/FlexBox';
import Label from '@/components/common/Label';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/layout/Container';
import Card from '@/components/common/Card';
import { Button as ShadcnButton } from '@/shadcn/ui/button';
import AboutPage from '@/components/common/AboutPage';

export default function CodeEntry() {
  const navigate = useNavigate();
  const { mutate: joinGame } = useJoinGame();
  const { connect } = useStompStore();
  const { updateId, updatePlayers, updateSubject, updateLevel, updateInviteCode } = useGameStore();
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) {
      alert('초대 코드를 입력해주세요.');
      return;
    }

    joinGame(inviteCode, {
      onSuccess: (res) => {
        connect(res.result.id);
        updateId(res.result.id);
        updatePlayers(res.result.players);
        updateSubject(res.result.subject);
        updateLevel(res.result.level);
        updateInviteCode(res.result.inviteCode);
        navigate('/game/waiting'); // 성공 시 리다이렉트
      },
      onError: () => {
        alert('방 참여에 실패했습니다. 초대 코드를 확인해주세요.');
      },
    });
  };

  return (
    <FlexBox direction="col">
      <AboutPage
        title="초대 코드"
        description="초대 코드를 통해 사설 게임방에 참여할 수 있도록 하는 페이지"
        keywords="초대, 코드, 게임, 퀴즈"
      />
      <TopBar leftIcon="left" leftText="코드로 참가" onClickLeft={() => navigate('/game')} />
      <Container>
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="invite-code" content="초대 코드" />
              <TextField
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="초대 코드를 입력하세요"
                size={'M'}
              />
            </div>
            <ShadcnButton type="submit" className="w-full h-14 text-lg" size="lg">
              참가하기 <ArrowRight className="ml-2 h-5 w-5" />
            </ShadcnButton>
          </form>
        </Card>
        <p className="text-center text-gray-600">
          친구에게 받은 6자리 코드를 입력하여 게임에 참가하세요.
        </p>
      </Container>
    </FlexBox>
  );
}
