import React from 'react';
import styled, { css } from 'styled-components';

import Logo from './logo';
import RoomControl from './roomControl';
import UserControl from './userControl';
import MenuIcon from '../../assets/icons/menu.svg?react';
import useStore from '../../utils/store';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';

type Props = {
  headerRef: React.RefObject<HTMLDivElement>;
  hideMenu: boolean;
}

type SectionProps = {
  align: 'left' | 'right';
  flex: number;
}

type MenuIconProps = {
  isOpen: boolean;
} & ThemedProps;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
`;

const Section = styled.div<SectionProps>`
  display: flex;
  align-items: center;

  ${({ align, flex }) => css`
    flex: ${flex};

    justify-content: ${align === 'left' ? 'flex-start' : 'flex-end'};
  `}
`;

const MenuButton = styled(MenuIcon)<MenuIconProps>`
  ${({ theme, isOpen }: MenuIconProps) => isOpen ? css`
    > line {
      stroke: ${theme.primary.textHigh};
    }

    > line:nth-child(3) {
      transform: rotate(-45deg) translateY(124px) translateX(-120px);
    }

    > line:nth-child(2){
      opacity: 0;
    }

    > line:nth-child(4) {
      transform: rotate(45deg) translateY(-200px) translateX(64px);
    }
  ` : css`
    > line {
      stroke: ${theme.primary.textLow};
    }
    `}
    
  cursor: pointer;
  margin-left: 1rem;
  overflow: visible;
  width: 2rem;

  > line {
    transition: all 300ms ease-out;
  }
`;

const Header = ({ headerRef, hideMenu }: Props) => {
  const { isMenuOpen, setIsMenuOpen } = useStore(({ isMenuOpen, setIsMenuOpen }) => ({ isMenuOpen, setIsMenuOpen }));

  return (
    <Wrapper ref={headerRef}>
      <Section flex={6} align='left'>
        <Logo />
        <RoomControl />
      </Section>
      <Section flex={1} align='right'>
        <UserControl />
        {!hideMenu && <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)} isOpen={isMenuOpen} />}
      </Section>
    </Wrapper>
  );
};

export default Header;
