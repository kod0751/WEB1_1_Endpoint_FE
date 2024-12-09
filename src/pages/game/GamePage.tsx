import { useNavigate } from 'react-router-dom';
import useGetProfile from '@/api/game/useGetProfile';
import Avatar from '@eolluga/eolluga-ui/Display/Avatar';
import Icon from '@eolluga/eolluga-ui/icon/Icon';
import { IoGameControllerOutline, IoTrophyOutline } from 'react-icons/io5';
import Card from '@/components/common/Card';
import TopBar from '@/components/common/TopBar';
import Container from '@/components/layout/Container';
import FlexBox from '@/components/layout/FlexBox';
import { Skeleton } from '@/shadcn/ui/skeleton';
import AboutPage from '@/components/common/AboutPage';

export default function Game() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProfile();

  return (
    <div className="flex flex-col">
      <AboutPage
        title="게임 메인"
        description="간단한 사용자 프로필 조회 및 게임 관련 옵션을 선택하는 페이지"
        keywords="게임, 퀴즈, 랜덤 매칭, 초대 코드"
      />
      <TopBar />
      <Container>
        <Card>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            ) : (
              <>
                <Avatar input="image" image={data?.profileImageUrl} />
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-1">{data?.name}</h2>
                  <div className="flex items-center gap-2">
                    <Icon icon={'person_outlined'} />
                    <span className="font-medium">레이팅: {data.rating}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
        <FlexBox direction="col" className="gap-4">
          <button
            className="w-full flex h-16 text-lg justify-between items-center p-4 bg-white border rounded-lg focus:bg-gray-100"
            onClick={() => navigate('/game/create')}
          >
            <div className="flex items-center gap-3">
              <Icon icon={'people'} />방 생성
            </div>
            <Icon icon={'chevron_right_outlined'} />
          </button>

          <button
            className="w-full flex h-16 text-lg justify-between items-center p-4 bg-white border rounded-l focus:bg-gray-100"
            onClick={() => navigate('/game/random')}
          >
            <div className="flex items-center gap-3">
              <IoGameControllerOutline size={24} />
              랜덤 매칭
            </div>
            <Icon icon={'chevron_right_outlined'} />
          </button>

          <button
            className="w-full flex h-16 text-lg justify-between items-center p-4 bg-white border rounded-lg focus:bg-gray-100"
            onClick={() => navigate('/game/entry')}
          >
            <div className="flex items-center gap-3">
              <IoTrophyOutline size={24} />
              코드로 참가
            </div>
            <Icon icon={'chevron_right_outlined'} />
          </button>
        </FlexBox>
      </Container>
    </div>
  );
}
