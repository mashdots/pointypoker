import { AnimatePresence } from 'motion/react';
import { div as AnimatedContainer } from 'motion/react-client';
import {
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import styled, { css } from 'styled-components';

import PlusIcon from '@assets/icons/plus.svg?react';
import Card from '@components/common/card';
import { JiraReauthModal } from '@modules/modal/jiraReauth';
import { PreferencesModal } from '@modules/preferences';
import { QueueModal, ReportPIIModal } from '@modules/room';
import { useMobile } from '@utils/hooks/mobile';
import useStore from '@utils/store';
import useTheme from '@utils/styles/colors';
import { ThemedProps } from '@utils/styles/colors/types';

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
};

const DEFAULT_SIZE_CONFIG: SizeProps = {
  height: '60%',
  minWidth: '720px',
  narrowHeight: '90%',
  narrowMinWidth: '90%',
  narrowWidth: '90%',
  width: '50%',
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
          contents: <div>Feedback</div>,
          title: 'Feedback',
        };
      case MODAL_TYPES.PREFERENCES:
        return {
          contents: <PreferencesModal />,
          subtitle: 'Changes save automatically',
          title: 'Preferences',
        };
      case MODAL_TYPES.JIRA:
        return {
          contents: <QueueModal />,
          title: 'Import from Jira',
        };
      case MODAL_TYPES.JIRA_REAUTH:
        return {
          contents: <JiraReauthModal />,
          title: 'Jira Integration Update',
        };
      case MODAL_TYPES.PII:
        return {
          contents: <ReportPIIModal />,
          title: 'Report PII',
        };
      default:
        return null;
    }
  }, [modalType]);

  const entryAndExitAnimationStyle = {
    filter: 'blur(1rem)',
    opacity: 0,
    transform: 'perspective(500px) rotateX(-10deg) translateZ(-90px) translateY(20px)',
  };

  // If the user clicks outside the Modal, close it
  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = useCallback((event) => {
    if (modalRef.current) {
      const { clientX, clientY } = event;
      const {
        top,
        right,
        bottom,
        left,
      } = modalRef.current.getBoundingClientRect();

      if (
        clientY < top ||
        clientY > bottom ||
        clientX < left ||
        clientX > right
      ) {
        closeModal();
      }
    }
  }, [closeModal, modalRef.current]);

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
              alignItems: 'center',
              backdropFilter: 'blur(0.5rem)',
              backgroundColor: theme.transparent.accent1,
              display: 'flex',
              height: '100vh',
              justifyContent: 'center',
              left: 0,
              position: 'fixed',
              top: 0,
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
                filter: 'blur(0rem)',
                height: isNarrow ? sizeConfig.narrowHeight : sizeConfig.height,
                opacity: 1,
                transform: 'perspective(500px) rotateX(0deg) translateZ(0px) translateY(0px)',
                width: isNarrow ? sizeConfig.narrowWidth : sizeConfig.width,
              }}
              exit={entryAndExitAnimationStyle}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              style={{ minWidth: isNarrow ? sizeConfig.narrowMinWidth : sizeConfig.minWidth }}
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
