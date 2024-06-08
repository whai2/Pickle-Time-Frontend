import { Link, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/zustand/useAuth';
import KaKaoMap from '@/components/map/KaKaoMap';
import routes from '@/constants/routes';
import BackDropModal from '@/components/common/modal/BackDropModal';
import { Suspense, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import HeartButton from '@/components/common/button/HeartButton';
import useHeartButtonClick from '@/hooks/useHeartButtonClick';
import { useCreatePickleMutation } from '@/hooks/query/pickles';
import MainLayout from '@/layouts/MainLayout';
import Carousel from '@/components/carousel/Carousel';
import PickleList from '@/components/picklecardlist/PickleCardListElement';
import PickleCardList from '@/components/picklecardlist/PickleCardList';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import SkeletonPickleCardList from '@/components/picklecardlist/PickleCardList.Skeleton';

const Button = styled.button`
  color: hotpink;
  border: 1px solid black;
`;

// const temData = {
//   title: '명동 스터디6',
//   capacity: 5,
//   cost: 8000,
//   deadLine: '2024-06-10T23:00:00Z',
//   where: '명동커피',
//   when: {
//     summary: '사흘 간',
//     times: ['2024-06-15T07:00:00Z', '2024-06-16T07:00:00Z', '2024-06-14T07:00:00.000Z', '2024-06-13T07:00:00.000Z'],
//   },
//   content: '스터디',
//   explanation: '그냥 하고싶으신 거 모여서 합니다! 환영해요~.',
//   latitude: 37.5636,
//   longitude: 126.982,
// };

export default function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const { isHeartClicked, handleHeartClick } = useHeartButtonClick({
    pickleId: '1',
    isInUserWishList: false,
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // 전역 상태
  const { getMe, signOut } = useAuth();
  // console.log(getMe());

  // server state
  // const { mutate } = useCreatePickleMutation(temData);

  // const handleMutate = async () => {
  //   mutate();
  // };

  return (
    <MainLayout>
      <div>
        <Carousel />
        <PickleList.Container>
          <PickleList.Header category="popular" />
          <ErrorBoundary fallback={Error}>
            <Suspense fallback={<SkeletonPickleCardList />}>
              <PickleCardList category="popular" />
            </Suspense>
          </ErrorBoundary>
        </PickleList.Container>
        <PickleList.Container sectionBg>
          <PickleList.Header category="hotTime" />
          <ErrorBoundary fallback={Error}>
            <Suspense fallback={<SkeletonPickleCardList />}>
              <PickleCardList category="hotTime" />
            </Suspense>
          </ErrorBoundary>
        </PickleList.Container>
        <div>
          {getMe() ? (
            <>
              안녕하세요 {getMe()?.nickname}님 <button onClick={signOut}>로그아웃</button>
            </>
          ) : (
            <Link to={routes.signIn}>Sign In</Link>
          )}
        </div>
        <br />
        <br />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to={routes.chatList}>Chat List</Link>

          <Link to={'/pickle/6662941ec1151126a67f6530'}>테스트 피클 보기+신청하기테스트</Link>
        </div>
        <Button type="button" onClick={() => navigate('/pickle-create')}>
          피클 생성 페이지로 이동
        </Button>
        <br />
        <br />
        <br />
        <KaKaoMap />
        <Button type="button" onClick={openModal}>
          모달 테스트 버튼
        </Button>
        <BackDropModal isOpen={isModalOpen} onClose={closeModal}>
          <div>티라노 앙</div>
        </BackDropModal>
        <HeartButton isActive={isHeartClicked} onClick={handleHeartClick} />
      </div>
    </MainLayout>
  );
}

function Error({ error }: { error: Error }) {
  console.log(error);
  return <h1>에러 발생</h1>;
}
