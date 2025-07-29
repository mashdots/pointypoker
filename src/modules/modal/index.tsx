import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

import PlusIcon from '@assets/icons/plus.svg?react';
import { PreferencesModal } from '@modules/preferences';
import { QueueModal, ReportPIIModal } from '@modules/room';
import { JiraReauthModal } from '@modules/modal/jiraReauth';
import { useMobile } from '@utils/hooks/mobile';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';

export enum MODAL_TYPES {
  FEEDBACK,
  JIRA,
  JIRA_REAUTH,
  PII,
  PREFERENCES,
}

type VisibleProps = {
  isVisible: boolean;
} & ThemedProps;

type ModalContentProps = {
  title: string;
  subtitle?: string;
  contents: React.ReactNode;
}

const BackDrop = styled.div<VisibleProps>`
  ${({ isNarrow, isVisible, theme }: VisibleProps) => css`
    background-color: ${theme.transparent.accent3};
    opacity: ${isVisible ? 1 : 0};
    backdrop-filter: blur(${isNarrow ? 0 : 2}px);
  `}
    
  align-items: center;
  display: flex;
  justify-content: center;

  position: fixed;
  left: 0;
  top: 0;

  height: 100vh;
  width: 100vw;
  z-index: 100;

  transition: opacity 300ms;
`;

const Container = styled.div<VisibleProps>`
  ${({ isNarrow, isVisible, theme }: VisibleProps) => css`
    background-color: ${theme.greyscale.accent2};
    border-color: ${theme.primary.accent6};
    color: ${theme.primary.accent12};
    height: ${isNarrow ? 90 : 60}%;
    min-width: ${isNarrow ? '90%' : '720px'};
    width: ${isNarrow ? 90 : 50}%;
    transform: translateY(${isVisible ? 1 : 3}rem);
  `}

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  border-radius: 0.5rem;
  border-style: solid;
  border-width: 2px;
  padding: 2rem;

  z-index: 100;

  transition: 
    transform 300ms,
    width 300ms,
    height 300ms;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const TitlesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
`;

const Title = styled.h2`
  margin: 0;
`;

const Subtitle = styled.h4`
  ${({ theme }: ThemedProps) => css`
    color: ${theme.primary.accent11};
  `}

  margin: 0 1rem;
`;

const CloseIcon = styled(PlusIcon)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  transform: rotate(45deg);
  
  > line {
    transition: stroke 300ms;
    stroke: ${({ theme }: ThemedProps) => theme.primary.accent11};
  }

  &:hover {
    > line {
      stroke: ${({ theme }: ThemedProps) => theme.primary.accent12};
    }
  }
`;

let timer: number;

const Modal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isNarrow } = useMobile();
  const [ renderedModal, setRenderedModal ] = useState<ModalContentProps | null>(null);
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const { closeModal, isOpen, modalType } = useStore(({ currentModal, setCurrentModal }) => ({
    closeModal: () => setCurrentModal(null),
    isOpen: currentModal !== null,
    modalType: currentModal,
  }));

  // If the user clicks outside the Modal, close it
  const handleBackdropClick = useCallback((event: MouseEvent) => {
    if (modalRef.current && !event.composedPath().includes(modalRef.current)) {
      closeModal();
    }
  }, [ closeModal, modalRef.current ]);

  useEffect(() => {
    clearTimeout(timer);

    if (isOpen) {
      let modalContent: ModalContentProps;

      switch (modalType) {
      case MODAL_TYPES.FEEDBACK:
        modalContent = {
          title: 'Feedback',
          contents: <div>Feedback</div>,
        };
        break;
      case MODAL_TYPES.PREFERENCES:
        modalContent = {
          title: 'Preferences',
          subtitle: 'Changes save automatically',
          contents: <PreferencesModal />,
        };
        break;
      case MODAL_TYPES.JIRA:
        modalContent = {
          title: 'Import from Jira',
          contents: <QueueModal />,
        };
        break;
      case MODAL_TYPES.JIRA_REAUTH:
        modalContent = {
          title: 'Jira Integration Update',
          contents: <JiraReauthModal />,
        };
        break;
      case MODAL_TYPES.PII:
        modalContent = {
          title: 'Report PII',
          contents: <ReportPIIModal />,
        };
        break;
      default:
        modalContent = {
          title: 'Modal',
          contents: <div>Modal</div>,
        };
      }

      document.addEventListener('click', handleBackdropClick);
      setRenderedModal(modalContent);

      timer = setTimeout(() => {
        setIsModalVisible(true);
      }, 100);
    } else {
      document.removeEventListener('click', handleBackdropClick);
      setIsModalVisible(false);

      timer = setTimeout(() => {
        setRenderedModal(null);
      }, 300);
    }

    return () => {
      document.removeEventListener('click', handleBackdropClick);
      clearTimeout(timer);
    };
  }, [ isOpen ]);

  return renderedModal ? (
    <BackDrop isNarrow={isNarrow} isVisible={isModalVisible}>
      <Container
        id="modalContainer"
        ref={modalRef}
        isNarrow={isNarrow}
        isVisible={isModalVisible}
      >
        <HeaderWrapper>
          <TitlesWrapper>
            <Title>{renderedModal.title}</Title>
            <Subtitle>{renderedModal?.subtitle}</Subtitle>
          </TitlesWrapper>
          <CloseIcon onClick={closeModal} />
        </HeaderWrapper>
        {renderedModal.contents}
      </Container>
    </BackDrop>
  ): null;
};

export default Modal;
