import { AnimatePresence } from 'motion/react';
import { div as AnimatedContainer } from 'motion/react-client';
import {
  JSX,
  useEffect,
  useRef,
} from 'react';

import styled, { css } from 'styled-components';

import { useJira } from '@modules/integrations';
import { ThemeModeToggleRow } from '@modules/preferences';
import { Separator } from '@modules/preferences/panes/common';
import { useAuthorizedUser } from '@modules/user';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/types';

import {
  FeedbackMenuItem,
  LeaveRoomMenuItem,
  PreferencesMenuItem,
  ImportFromJiraMenuItem,
} from './menuItems';

type Props = {
  isOpen: boolean;
  closeMenu: () => void;
};

const Container = styled.div<ThemedProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  border-width: 2px;
  border-style: solid;
  border-radius: 0.5rem;
  padding: 1rem;

  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.greyscale.accent3};
    border-color: ${theme.primary.accent6};
    color: ${theme.primary.accent12};
    right: 1rem;
    top: 0px;
  `}
`;

const Menu = ({
  isOpen,
  closeMenu,
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthorizedUser();
  const { roomName } = useStore(({ room }) => (
    { roomName: room?.name }
  ));
  const { isConnected } = useJira();

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', closeMenu);
    } else {
      document.removeEventListener('click', closeMenu);
    }

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [closeMenu, isOpen]);

  const menuItems: Array<{
    component: JSX.Element,
    shouldShow?: boolean
  }> = [
    {
      component: <PreferencesMenuItem key='preferences' />,
      shouldShow: isAuthenticated,
    },
    { component: <FeedbackMenuItem key='feedback' /> },
    {
      component: <Separator key="separator" />,
      shouldShow: !!roomName,
    },
    {
      component: <ImportFromJiraMenuItem key='jira' />,
      shouldShow: isConnected && !!roomName,
    },
    {
      component: <LeaveRoomMenuItem key='leave-room' />,
      shouldShow: !!roomName,
    },
  ];

  return (
    <AnimatePresence>
      <AnimatedContainer
        key={isOpen ? 'menu-open' : 'menu-closed'}
        initial={{
          opacity: 0,
          transform: 'translateY(-10px) scale(0.9)',
        }}
        animate={{
          opacity: 1,
          transform: 'translateY(0px) scale(1)',
        }}
        exit={{
          opacity: 0,
          transform: 'translateY(-10px) scale(0.9)',
        }}
        style={{
          transformOrigin: 'top right',
          zIndex: 100,
        }}
        transition={{ duration: 0.125 }}
      >
        {isOpen ? (
          <Container id="menu" ref={menuRef}>
            <ThemeModeToggleRow key="theme-mode-toggle" />
            {menuItems.map(({ component, shouldShow }) => shouldShow && component)}
          </Container>
        ) : null}
      </AnimatedContainer>
    </AnimatePresence>
  );
};

export default Menu;
