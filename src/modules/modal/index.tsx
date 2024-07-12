import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import useStore from '../../utils/store';
import { useMobile } from '../../utils/hooks/mobile';
import PlusIcon from '../../assets/icons/plus.svg?react';
import { PreferencesModal } from '../preferences';
import { QueueModal } from '../room';

export enum MODAL_TYPES {
  FEEDBACK,
  PREFERENCES,
  QUEUE,
}

type VisibleProps = {
  isVisible: boolean;
  isMobile: boolean;
} & ThemedProps;

type ModalContentProps = {
  title: string;
  subtitle?: string;
  contents: React.ReactNode;
}

const BackDrop = styled.div<VisibleProps>`
  ${({ isMobile, isVisible, theme }: VisibleProps) => css`
    background-color: ${theme.transparent.componentBg};
    opacity: ${isVisible ? 1 : 0};
    backdrop-filter: blur(${isMobile ? 0 : 2}px);
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
  ${({ isMobile, isVisible, theme }: VisibleProps) => css`
    background-color: ${theme.greyscale.bgAlt};
    border-color: ${theme.primary.border};
    color: ${theme.primary.textHigh};
    height: ${isMobile ? 90 : 50}%;
    min-width: ${isMobile ? '90%' : '720px'};
    width: ${isMobile ? 90 : 50}%;
    transform: translateY(${isVisible ? 1 : 3}rem);
  `}

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  border-radius: 0.5rem;
  border-style: solid;
  border-width: 2px;
  padding: 1rem;

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
    color: ${theme.primary.textLow};
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
    stroke: ${({ theme }: ThemedProps) => theme.primary.textLow};
  }

  &:hover {
    > line {
      stroke: ${({ theme }: ThemedProps) => theme.primary.textHigh};
    }
  }
`;

let timer: number;

const Modal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobile();
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
      case MODAL_TYPES.QUEUE:
        modalContent = {
          title: 'Build a ticket queue',
          contents: <QueueModal />,
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
    <BackDrop isMobile={isMobile} isVisible={isModalVisible}>
      <Container
        id="modalContainer"
        ref={modalRef}
        isMobile={isMobile}
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
