import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { createUserPayload, setUserCookie } from '../../utils';
import useStore from '../../utils/store';
import { VARIATIONS } from '../../utils/styles';
import NameInput from './NameInput';

type WrapperProps = { isVisible: boolean, isOpen: boolean }

const Wrapper = styled.div<WrapperProps>`
  transition: opacity 300ms;

  ${({ isOpen, isVisible }) => css`
    display: ${ isOpen ? 'inherit' : 'none' };
    opacity: ${ isVisible ? 100 : 0 }%;
  `};
`;

const CookieNotice = styled.p`
  color: ${VARIATIONS.structure.textLowContrast};
`;

let timeout: ReturnType<typeof setTimeout>;

const UserSetup = () => {
  const [ isVisible, setIsVisible ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);
  const [name, setName] = useState<string>('');
  const { setUser, isUserSet } = useStore((state) => ({
    setUser: state.setUser,
    isUserSet: !!state.user,
  }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = createUserPayload(name);
    setUser(payload);
    setUserCookie(payload);
  };

  useEffect(() => {
    clearTimeout(timeout);
    if (isUserSet) {
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
    <Wrapper isOpen={isOpen} isVisible={isVisible} id='user-setup'>
      <h1>what do we call you?</h1>
      <CookieNotice>this is stored in a cookie so we won&apos;t ask you every time.</CookieNotice>
      <form onSubmit={handleSubmit} autoComplete='off'>
        <NameInput
          id='name'
          onChange={({ target }) => setName(target.value)}
          value={name}
        />
      </form>
    </Wrapper>
  );
};

export default UserSetup;
