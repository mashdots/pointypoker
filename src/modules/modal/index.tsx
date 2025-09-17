import React, {
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import styled, { css } from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedContainer } from 'motion/react-client';

import PlusIcon from '@assets/icons/plus.svg?react';
import { PreferencesModal } from '@modules/preferences';
import { QueueModal, ReportPIIModal } from '@modules/room';
import { JiraReauthModal } from '@modules/modal/jiraReauth';
import { useMobile } from '@utils/hooks/mobile';
import useTheme, { ThemedProps } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';
import Card from '@components/common/card';

export enum MODAL_TYPES {
  FEEDBACK,
  JIRA,
  JIRA_REAUTH,
  PII,
  PREFERENCES,
  TICKET_SEARCH,
}

export type SizeProps = {
  width: string;
  height: string;
  narrowWidth: string;
  narrowHeight: string;
  minWidth: string;
  narrowMinWidth: string;
}

const DEFAULT_SIZE_CONFIG: SizeProps = {
  height: '60%',
  width: '50%',
  narrowHeight: '90%',
  narrowWidth: '90%',
  minWidth: '720px',
  narrowMinWidth: '90%',
};


const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
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

const Modal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isNarrow } = useMobile();
  const { closeModal, modalType } = useStore(({ currentModal, setCurrentModal }) => ({
    closeModal: () => setCurrentModal(null),
    modalType: currentModal,
  }));

  const sizeConfig = useMemo<SizeProps>(() => DEFAULT_SIZE_CONFIG, []);

  const { theme } = useTheme();

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
    case MODAL_TYPES.JIRA_REAUTH:
      return {
        title: 'Jira Integration Update',
        contents: <JiraReauthModal />,
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

  const entryAndExitAnimationStyle = {
    opacity: 0,
    filter: 'blur(1rem)',
    transform: 'perspective(500px) rotateX(-10deg) translateZ(-90px) translateY(20px)',
  };

  // If the user clicks outside the Modal, close it
  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = useCallback((event) => {
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

  return (
    <AnimatePresence>
      {
        modal ? (
          <AnimatedContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            transition={{ duration: 0.25 }}
            style={{
              backgroundColor: theme.transparent.accent1,
              backdropFilter: 'blur(0.25rem)',
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
              transition={{ duration: 0.25 }}
              ref={modalRef}
              style={{
                minWidth: isNarrow ? sizeConfig.narrowMinWidth : sizeConfig.minWidth,
                backdropFilter: 'blur(0.75rem)',
              }}
            >
              <Card
                colorTheme='transparent'
                overrideWidth='100%'
                overrideHeight='100%'
                style={{ padding: '1rem' }}
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
