import React, {
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedContainer } from 'motion/react-client';

import PlusIcon from '@assets/icons/plus.svg?react';
import { PreferencesModal } from './modals/preferences';
import { QueueModal, ReportPIIModal } from '@modules/room';
import { NarrowProps, useMobile } from '@utils/hooks/mobile';
import useTheme, { ThemedProps } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';
import { Card } from '@components/common';
import { MODAL_TYPES } from './constants';

export type SizeProps = {
  width: string;
  height: string;
  narrowWidth: string;
  narrowHeight: string;
  minWidth: string;
  narrowMinWidth: string;
}

type VisibleProps = {
  isVisible: boolean;
} & ThemedProps & NarrowProps;

type ModalContentProps = {
  title: string;
  subtitle?: string;
  contents: React.ReactNode;
}

const DEFAULT_SIZE_CONFIG: SizeProps = {
  height: '60%',
  width: '50%',
  narrowHeight: '90%',
  narrowWidth: '90%',
  minWidth: '720px',
  narrowMinWidth: '90%',
};

const Container = styled.div<VisibleProps>`
  ${ ({ isNarrow, isVisible, theme }: VisibleProps) => css`
    background-color: ${ theme.greyscale.accent2 };
    border-color: ${ theme.primary.accent6 };
    color: ${ theme.primary.accent12 };
    height: ${ isNarrow ? 90 : 60 }%;
    min-width: ${ isNarrow ? '90%' : '720px' };
    width: ${ isNarrow ? 90 : 50 }%;
    transform: translateY(${ isVisible ? 1 : 3 }rem);
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
  width: 100%;
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
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.primary.accent11 };
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
    stroke: ${ ({ theme }: ThemedProps) => theme.primary.accent11 };
  }

  &:hover {
    > line {
      stroke: ${ ({ theme }: ThemedProps) => theme.primary.accent12 };
    }
  }
`;

const Modal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [ sizeConfig, setSizeConfig ] = useState<SizeProps>(DEFAULT_SIZE_CONFIG);
  const { isNarrow } = useMobile();
  const { closeModal, isOpen, modalType } = useStore(({ currentModal, setCurrentModal }) => ({
    closeModal: () => setCurrentModal(null),
    isOpen: currentModal !== null,
    modalType: currentModal,
  }));

  const handleSizeUpdate = (sizeConfig?: SizeProps): void => {
    setSizeConfig(sizeConfig ?? DEFAULT_SIZE_CONFIG);
  };

  // If the user clicks outside the Modal, close it
  const handleBackdropClick = useCallback((event: MouseEvent) => {
    if (modalRef.current) {
      const { clientX, clientY } = event;
      const { top, right, bottom, left } = modalRef.current.getBoundingClientRect();

      if (
        clientY < top ||
        clientY > bottom ||
        clientX < left ||
        clientX > right
      ) {
        closeModal();
      }
    }
  }, [ closeModal, modalRef.current ]);

  const modal = useMemo(() => {
    switch (modalType) {
    case MODAL_TYPES.FEEDBACK:
      return {
        title: 'Feedback',
        contents: <div>Feedback</div>,
      };
    case MODAL_TYPES.PREFERENCES:
      return {
        title: 'Preferences',
        subtitle: 'Changes save automatically',
        contents: <PreferencesModal />,
      };
    case MODAL_TYPES.JIRA:
      return {
        title: 'Import from Jira',
        contents: <QueueModal />,
      };
    case MODAL_TYPES.PII:
      return {
        title: 'Report PII',
        contents: <ReportPIIModal />,
      };
    default:
      return null;
    }
  }, [ modalType ]);

  const { theme } = useTheme();

  const entryAndExitAnimationStyle = {
    opacity: 0,
    filter: 'blur(1rem)',
    transform: 'perspective(500px) rotateX(-10deg) translateZ(-90px) translateY(20px)',
  };

  return (
    <AnimatePresence>
      {
        modal ? (
          <AnimatedContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: theme.transparent.accent1,
              backdropFilter: `blur(${ isNarrow ? 0 : 8 }px)`,
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              position: 'fixed',
              left: 0,
              top: 0,
              height: '100vh',
              width: '100vw',
              zIndex: 100,
            }}
          >
            <AnimatedContainer
              initial={{
                ...entryAndExitAnimationStyle,
                height: isNarrow ? sizeConfig.narrowHeight : sizeConfig.height,
                width: isNarrow ? sizeConfig.narrowWidth : sizeConfig.width,
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0rem)',
                transform: 'perspective(500px) rotateX(0deg) translateZ(0px) translateY(0px)',
                height: isNarrow ? sizeConfig.narrowHeight : sizeConfig.height,
                width: isNarrow ? sizeConfig.narrowWidth : sizeConfig.width,
              }}
              exit={entryAndExitAnimationStyle}
              transition={{ duration: 0.5 }}
              ref={modalRef}
              style={{
                minWidth: isNarrow ? sizeConfig.narrowMinWidth : sizeConfig.minWidth,

                //   display: 'flex',
                //   flexDirection: 'column',
                //   justifyContent: 'flex-start',
                //   borderRadius: '0.5rem',
                //   borderStyle: 'solid',
                //   borderWidth: '1px',
                // padding: '2rem',
                //   zIndex: 100,
              }}
            >
              <Card
                colorTheme='transparent'
                direction="column"
                overrideWidth='100%'
                overrideHeight='100%'
                style={{ padding: '2rem' }}
                shadowStyle='spread'
              >
                <HeaderWrapper>
                  <TitlesWrapper>
                    <Title>{modal.title}</Title>
                    {modal.subtitle ? <Subtitle>{modal.subtitle}</Subtitle> : null}
                  </TitlesWrapper>
                  <CloseIcon onClick={closeModal} theme={theme} />
                </HeaderWrapper>
                {modal.contents}
              </Card>
            </AnimatedContainer>
          </AnimatedContainer>

        ) : null
      }
    </AnimatePresence>
  );
};

export default Modal;
