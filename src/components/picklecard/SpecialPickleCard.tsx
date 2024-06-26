import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

import HeartButton from '@/components/common/button/HeartButton';
import BackImg from '@/assets/images/specialPickleCardBackImg.png';
import SpecialPickleCardArrowIcon from '@/assets/icons/SpecialPickleCardArrowIcon';
import routes from '@/constants/routes';
import { useGetLikeCount, usePickleLikeMutation, useDeletePickleLikeMutation } from '@/hooks/query/like';
import { formatCurrency } from '@/utils/formatData';

const ONEDAY_MILLISECOND = 1000 * 60 * 60 * 24;

const calculateDday = (deadLine: string) => {
  const today = new Date().getTime();
  const deadLineMilliseconds = new Date(deadLine).getTime();
  return Math.floor((deadLineMilliseconds - today) / ONEDAY_MILLISECOND);
};

export default function SpecialPickleCard({ pickleData }: { pickleData: any }) {
  const { data } = useGetLikeCount(pickleData.id);
  const { mutate: postLikeMutate } = usePickleLikeMutation(pickleData.id);
  const { mutate: deleteLikeMutate } = useDeletePickleLikeMutation(pickleData.id);

  const Dday = calculateDday(pickleData.deadLine);

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (data?.data.isClicked) {
      deleteLikeMutate();
    } else {
      postLikeMutate();
    }
  };

  return (
    <S.CardLayer to={`${routes.pickle}/${pickleData.id}`}>
      <S.Wrap>
        <S.DeadlineBadge>D-{Dday}</S.DeadlineBadge>
        <HeartButton size={22} $active={data?.data.isClicked} onClick={handleHeartClick} />
      </S.Wrap>
      <S.Title>{pickleData?.title}</S.Title>
      <S.ResgisterStatus>
        {pickleData?.capacity}명 중 <span>{pickleData?.participantNumber}</span>명이 신청하는 중
      </S.ResgisterStatus>
      <S.Price>
        {formatCurrency(pickleData?.cost)}
        <span>원</span>
      </S.Price>
      <S.Circle>
        <SpecialPickleCardArrowIcon />
      </S.Circle>
    </S.CardLayer>
  );
}

const S = {
  CardLayer: styled(Link)`
    position: relative;
    display: block;
    width: 14.4rem;
    height: 16.5rem;
    margin: auto;
    padding: 1.2rem 1rem 1.5rem 1.5rem;
    border-radius: 0.4rem;
    background: #fff;
    background-image: url(${BackImg});
    box-shadow: 0px 1px 2.8px 0px rgba(0, 0, 0, 0.25);
    color: #161616;
    transition: 0.5s;

    &:hover {
      transform: translateY(-6px);
      transition: all ease-in-out 0.25s;
    }
  `,
  Wrap: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  DeadlineBadge: styled.span`
    display: inline-block;
    min-width: 2.8rem;
    height: 1.3rem;
    padding: 0 0.6rem;
    background: #dbd8d8;
    border-radius: 0.8rem;
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 1.3rem;
    margin-bottom: 1.6rem;
  `,
  Title: styled.h3`
    min-height: 3.4rem;
    margin-bottom: 1.2rem;
    ${({ theme }) => theme.typography.subTitle4};
    letter-spacing: -0.8px;
  `,
  ResgisterStatus: styled.span`
    display: inline-block;
    width: 56%;
    margin-bottom: 0.6rem;
    color: rgba(111, 111, 111, 0.6);
    ${({ theme }) => theme.typography.body2};

    span {
      font-weight: bold;
    }
  `,
  Price: styled.em`
    display: flex;
    align-items: center;
    ${({ theme }) => theme.typography.subTitle1};

    span {
      margin-left: 0.2rem;
      color: #2c2c2c;
      ${({ theme }) => theme.typography.detail}
      transform: translateY(1.2px);
    }
  `,
  Circle: styled.div`
    position: absolute;
    bottom: 1.7rem;
    right: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #6fa978;
  `,
};
