import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  InputComponent,
  StepIndicator,
  StepIndicatorContainer,
  SubmitButton,
  Title,
  TitleContainer,
} from './CreatePickleStyled';
import CategorySelect from '@/components/pickleCreate/CategorySelect';
import TitleInput from '@/components/pickleCreate/TitleInput';
import ImgSelect from '@/components/pickleCreate/ImgSelect';
import WriteDetail from '@/components/pickleCreate/WriteDetail';
import GoalSelect from '@/components/pickleCreate/GoalSelect';
import useBottomSheetModal from '@/hooks/zustand/useBottomSheetModal';
import ConfirmationModal from '@/components/common/modal/ConfirmationModal';
import { useEffect } from 'react';
import usePickleEdit from '@/hooks/zustand/usePickleEdit';
import { useGetPickelDetail } from '@/hooks/query/pickles';
import useAuth from '@/hooks/zustand/useAuth';

export default function PickleEdit() {
  const {
    step,
    setStep,
    title,
    setTitle,
    category,
    setCategory,
    clear,
    imgUrl,
    setImgUrl,
    explanation,
    setExplanation,
    goals,
    setGoals,
    isImgLoading,
  } = usePickleEdit();

  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleOpen } = useBottomSheetModal(state => state);
  const { data } = useGetPickelDetail(id || '');
  const pickleDetailData = data?.data;

  useEffect(() => {
    if (pickleDetailData) {
      if (user?._id !== pickleDetailData.leader) {
        alert('피클 작성자만 수정할 수 있습니다.');
        navigate('/pickle/' + id);
      }
      clear();
      setTitle(pickleDetailData.title || '');
      setCategory(pickleDetailData.category || '');
      setImgUrl(pickleDetailData.imgUrl || '');
      setExplanation(pickleDetailData.explanation || '');
      setGoals(pickleDetailData.goals || []);
    }
  }, [pickleDetailData]);

  return (
    <Container>
      <TitleContainer>
        <Title>
          <img
            src="/icons/back.svg"
            alt="back"
            onClick={() => {
              if (step === 1) {
                handleOpen({
                  renderComponent: ConfirmationModal,
                  nocallback: () => {},
                  yescallback: () => {
                    clear();
                    navigate('/');
                  },
                  message: '변경된 수정사항은 삭제됩니다.',
                  yesText: '확인',
                  noText: '취소',
                });
              } else {
                setStep((step - 1) as 1 | 2);
              }
            }}
          />
          <div>피클 수정</div>
        </Title>
        <StepIndicatorContainer>
          <StepIndicator $selected={step === 1}>1</StepIndicator>
          <StepIndicator $selected={step === 2}>2</StepIndicator>
        </StepIndicatorContainer>
      </TitleContainer>

      {(() => {
        switch (step) {
          case 1:
            return (
              <>
                <InputComponent>
                  <TitleInput hook={usePickleEdit} />
                </InputComponent>
                <InputComponent>
                  <CategorySelect hook={usePickleEdit} />
                </InputComponent>
                <SubmitButton disabled={category === '' || title === ''} onClick={() => setStep(2)}>
                  다음 단계로 이동하기
                </SubmitButton>
              </>
            );
          case 2:
            return (
              <>
                <InputComponent>
                  <ImgSelect hook={usePickleEdit} />
                </InputComponent>
                <InputComponent>
                  <WriteDetail hook={usePickleEdit} />
                </InputComponent>
                <InputComponent>
                  <GoalSelect hook={usePickleEdit} />
                </InputComponent>
                <SubmitButton
                  disabled={isImgLoading || imgUrl === '' || explanation === '' || goals.length === 0}
                  onClick={() => {
                    // 수정하기 call
                    clear();
                    navigate('/pickle/' + id);
                  }}
                >
                  수정하기
                </SubmitButton>
              </>
            );
          default:
            return <div>잘못된 접근입니다.</div>;
        }
      })()}
    </Container>
  );
}
