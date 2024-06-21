import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useStore from '../../utils/store';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import DoorIcon from '../../assets/icons/door.svg?react';


type NoticeProps = ThemedProps & {
  shouldShow?: boolean;
};

const Wrapper = styled.div<{ appear: boolean }>`
  cursor: default;
  display: flex;
  align-items: center;
  padding-top: 0.25rem;
  padding-left: 0.5rem;
  margin-left: 0.5rem;

  ${({ appear }) => css`
    opacity: ${appear ? 1 : 0};
    > div {
      cursor: ${appear ? 'pointer' : 'default'};
    }
  `};
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

const ExitWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Icon = styled(DoorIcon)<ThemedProps>`
  width: 1.25rem;
  margin-left: 0.5rem;
  transition: all 300ms;

  ${({ theme }) => css`
    > line, path {
      stroke: ${theme.primary.textHigh};
    }
    > circle {
      fill: ${theme.primary.textHigh};
    }
  `}
`;

const Notice = styled.p<NoticeProps>`
  margin-left: 0.5rem;
  transition: opacity 250ms;
  font-size: 0.75rem;

  ${ ({ shouldShow = true, theme }) => css`
    color: ${ theme.primary.textHigh };
    opacity: ${ shouldShow ? 1 : 0 };
  `}
`;

const RoomControl = () => {
  const { isInRoom, roomName, clearRoom } = useStore((state) => ({
    isInRoom: !!state.room,
    roomName: state?.room?.name,
    clearRoom: state.clearRoom,
  }));
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleExitRoom = () => {
    navigate('/');
    clearRoom();
  };

  return (
    <Wrapper appear={isInRoom}>
      <Separator appear={isInRoom} />
      {roomName}
      <ExitWrapper
        onClick={() => isInRoom && handleExitRoom()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon /><Notice shouldShow={isHovered}>leave room</Notice>
      </ExitWrapper>
    </Wrapper>
  );
};

export default RoomControl;
