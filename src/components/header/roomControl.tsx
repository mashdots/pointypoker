import React from 'react';
import styled, { css } from 'styled-components';

import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const Wrapper = styled.div<{ appear: boolean }>`
  ${({ appear }) => css`
    opacity: ${ appear ? 1 : 0 };
  `};

  cursor: default;
  display: flex;
  align-items: center;
  padding-top: 0.25rem;
  padding-left: 0.5rem;
  margin-left: 0.5rem;
`;

const Separator = styled.div<ThemedProps & { appear: boolean }>`
  width: 0.125rem;
  margin-right: 0.5rem;
  transition: all 300ms ease-out;

  ${({ appear, theme }) => css`
    height: ${appear ? 1.5 : 0}rem;
    background-color: ${theme.primary.textLow}; 
  `}
`;

const RoomControl = () => {
  const { isInRoom, roomName } = useStore((state) => ({
    isInRoom: !!state.room,
    roomName: state?.room?.name,
  }));
  return (
    <Wrapper appear={isInRoom}>
      <Separator appear={isInRoom} />
      {roomName}
    </Wrapper>
  );
};

export default RoomControl;
