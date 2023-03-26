import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useStore from '../../utils/store';

type WrapperProps = { isVisible: boolean, isOpen: boolean }

const Wrapper = styled.div<WrapperProps>`
  transition: opacity 300ms;

  ${ ({ isOpen, isVisible }) => css`
    display: ${ isOpen ? 'inherit' : 'none' };
    opacity: ${ isVisible ? 100 : 0 }%;
  `};
`;

let timeout: ReturnType<typeof setTimeout>;

const RoomSetup = () => {
  const [ isVisible, setIsVisible ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);

  const { userName, isUserSet } = useStore((state) => ({
    userName: state.user?.name || '',
    isUserSet: !!state.user,
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

  return <Wrapper isOpen={isOpen} isVisible={isVisible} id='user-setup'>hey {userName}</Wrapper>;
};

export default RoomSetup;
