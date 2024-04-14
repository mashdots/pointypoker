import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import useStore from '../../utils/store';
import RoomSetup from './roomSetup';

type WrapperProps = { isVisible: boolean, isOpen: boolean }

const Wrapper = styled.div<WrapperProps>`
  transition: opacity 300ms;

  ${ ({ isOpen, isVisible }) => css`
    display: ${ isOpen ? 'inherit' : 'none' };
    opacity: ${ isVisible ? 100 : 0 }%;
  `};
`;

let timeout: ReturnType<typeof setTimeout>;

const Room = () => {
  const [ isVisible, setIsVisible ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);
  const { isUserSet, roomName } = useStore((state) => ({
    isUserSet: !!state.user,
    roomName: state.room,
  }));


  useEffect(() => {
    clearTimeout(timeout);
    if (!isUserSet) {
      setIsVisible(false);

      timeout = setTimeout(() => {
        setIsOpen(false);
      }, 300);
    } else {
      setIsOpen(true);

      timeout = setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, [ isUserSet ]);


  return (
    <Wrapper isOpen={isOpen} isVisible={isVisible} id='room'>
      {!roomName ? <RoomSetup /> : <h1>{roomName}</h1>}
    </Wrapper>
  );

};

export default Room;
