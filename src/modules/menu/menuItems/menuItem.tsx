import React from 'react';
import styled from 'styled-components';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';
import useStore from '../../../utils/store';

export type MenuItemProps = {
  text: string;
  onClick?: () => void;
  uniqueElement: JSX.Element;
}

const Wrapper = styled.div`
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  padding: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
  
  transition: background-color 300ms;

  &:hover {
    background-color: ${({ theme }: ThemedProps) => theme.primary.componentBgHover};
  }
`;

const MenuItem = ({ text, onClick, uniqueElement }: MenuItemProps) => {
  const setIsMenuOpen = useStore(({ setIsMenuOpen }) => setIsMenuOpen);

  return (
    <Wrapper
      onClick={() => {
        onClick?.();
        setIsMenuOpen(false);
      }}
    >
      {uniqueElement}{text}
    </Wrapper>
  );
};

export default MenuItem;
