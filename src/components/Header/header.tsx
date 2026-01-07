import React from 'react';

import styled, { css } from 'styled-components';

import MenuIcon from '@assets/icons/menu.svg?react';
import { useAuthorizedUser } from '@modules/user';
import { ThemedProps } from '@utils/styles/colors/types';

import Logo from './logo';
import RoomName from './roomName';
import UserControl from './userControl';

type Props = {
  headerRef: React.RefObject<HTMLDivElement | null>;
  hideMenu: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

type SectionProps = {
  align: 'left' | 'right';
  flex: number;
};

type MenuIconProps = {
  isopen: 'true' | 'false';
} & ThemedProps;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem 1rem;
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
  ${({ theme, isopen }: MenuIconProps) => isopen === 'true' ? css`
    > line {
      stroke: ${theme.primary.accent12};
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
      stroke: ${theme.primary.accent11};
    }
  `}

  cursor: pointer;
  margin-left: 1rem;
  overflow: visible;
  width: 2rem;

  > line {
    transition: all 300ms cubic-bezier(.54, 1.60, .5, 1);
  }
`;

const Header = ({
  headerRef,
  hideMenu,
  isMenuOpen,
  toggleMenu,
}: Props) => {
  const { isAuthenticated } = useAuthorizedUser();

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMenu();
  };

  return (
    <Wrapper ref={headerRef}>
      <Section
        flex={6}
        align='left'
        style={{
          opacity: isAuthenticated ? 1 : 0,
          transition: 'all 300ms ease-out',
        }}
      >
        <Logo />
        <RoomName />
      </Section>
      <Section flex={1} align='right'>
        <UserControl />
        {!hideMenu && (
          <MenuButton
            onClick={handleMenuButtonClick}
            isopen={`${ isMenuOpen }`}
          />
        )}
      </Section>
    </Wrapper>
  );
};

export default Header;
