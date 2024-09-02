import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import debounce from 'lodash/debounce';

import { FeedbackMenuItem, LeaveRoomMenuItem, PreferencesMenuItem, ImportFromJiraMenuItem } from './menuItems';
import { ThemeModeToggleRow } from '@modules/preferences';
import { Separator } from '@modules/preferences/panes/common';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';
import { useJira } from '@modules/integrations';

type Props = {
  topOffset: number;
}

type ContainerProps = {
  isVisible: boolean;
  top: number;
  right: number;
} & ThemedProps;

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  border-width: 2px;
  border-style: solid;
  border-radius: 0.5rem;
  padding: 1rem;
  z-index: 100;

  transition: opacity 400ms, transform 400ms, filter 400ms;

  ${({ isVisible, right, top, theme }: ContainerProps) => css`
    background-color: ${theme.greyscale.componentBg};
    border-color: ${theme.primary.border};
    color: ${theme.primary.textHigh};
    opacity: ${isVisible ? 1 : 0};
    right: calc(${right}px + 1rem);
    top: calc(${top}px + 1rem);
    transform: translateY(${isVisible ? 0 : -1}rem);
    filter: blur(${isVisible ? 0 : 1}rem);
  `}
`;

let timer: number;

const Menu = ({ topOffset }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthed, isMenuOpen, setIsMenuOpen, roomName } = useStore(
    ({ isMenuOpen, setIsMenuOpen, room, preferences }) => (
      {
        isAuthed: !!preferences?.user,
        isMenuOpen,
        setIsMenuOpen,
        roomName: room?.name,
      }
    ),
  );
  const { isConfigured } = useJira();
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [rightOffset, setRightOffset] = useState(0);

  useEffect(() => {
    const resizeObserverFunction = debounce(
      () => {
        if (window.innerWidth > 1280) {
          setRightOffset((window.innerWidth - 1280) / 2);
        } else {
          setRightOffset(0);
        }
      },
      500,
    );

    window.addEventListener('resize', resizeObserverFunction);

    return () => {
      window.removeEventListener('resize', resizeObserverFunction);
    };
  }, []);

  // If the user clicks outside the menu, close it
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (menuRef.current && !event.composedPath().includes(menuRef.current)) {
      setIsMenuOpen(false);
    }
  }, [setIsMenuOpen, menuRef.current]);

  useEffect(() => {
    clearTimeout(timer);

    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
      setIsMenuRendered(true);

      timer = setTimeout(() => {
        setIsMenuVisible(true);
      }, 100);
    } else {
      document.removeEventListener('click', handleOutsideClick);
      setIsMenuVisible(false);

      timer = setTimeout(() => {
        setIsMenuRendered(false);
      }, 300);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      clearTimeout(timer);
    };
  }, [isMenuOpen]);

  const menuItems: Array<{ component: JSX.Element, shouldShow?: boolean }> = [
    {
      component: <PreferencesMenuItem />,
      shouldShow: isAuthed,
    },
    {
      component: <FeedbackMenuItem />,
    },
    {
      component: <Separator />,
      shouldShow: !!roomName,
    },
    {
      component: <ImportFromJiraMenuItem />,
      shouldShow: isConfigured && !!roomName,
    },
    {
      component: <LeaveRoomMenuItem />,
      shouldShow: !!roomName,
    },
  ];

  return isMenuRendered ? (
    <Container
      id="menu"
      ref={menuRef}
      isVisible={isMenuVisible}
      top={topOffset}
      right={rightOffset}
    >
      <ThemeModeToggleRow />
      {menuItems.map(({ component, shouldShow }) => shouldShow && component)}
    </Container>
  ) : null;
};

export default Menu;
