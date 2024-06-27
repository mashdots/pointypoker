import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import debounce from 'lodash/debounce';

import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import useStore from '../../utils/store';
import { ThemeModeToggleRow } from '../preferences';

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

  transition: opacity 250ms, transform 250ms;

  ${({ isVisible, right, top, theme }: ContainerProps) => css`
    background-color: ${theme.greyscale.componentBg};
    border-color: ${theme.primary.border};
    color: ${theme.primary.textHigh};
    opacity: ${isVisible ? 1 : 0};
    right: calc(${right}px + 1rem);
    top: calc(${top}px + 1rem);
    transform: translateY(${isVisible ? 0 : -1}rem);
  `}
`;

let timer: number;

const Menu = ({ topOffset }: Props) => {
  const { isMenuOpen } = useStore(({ isMenuOpen }) => ({ isMenuOpen }));
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

  useEffect(() => {
    clearTimeout(timer);
    if (isMenuOpen) {
      setIsMenuRendered(true);
      timer = setTimeout(() => {
        setIsMenuVisible(true);
      }, 100);
    } else {
      setIsMenuVisible(false);
      timer = setTimeout(() => {
        setIsMenuRendered(false);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isMenuOpen]);

  return isMenuRendered ? (
    <Container
      isVisible={isMenuVisible}
      top={topOffset}
      right={rightOffset}
    >
      <ThemeModeToggleRow />
    </Container>
  ) : null;
};

export default Menu;
