import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { createUserPayload, setUserCookie } from '../../utils';
import { VARIATIONS } from '../../utils/styles';
import NameInput from './NameInput';
import { User } from '../../types';

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

type Props = {
  user: User | null;
  handleSetUser: (payload: User) => void;
}

const UserSetup = ({ user, handleSetUser }: Props) => {
  const isUserSet = !!user;
  const [ isVisible, setIsVisible ] = useState(!isUserSet);
  const [ isInitiallyOpen, setIsInitiallyOpen ] = useState(!isUserSet);
  const [ isOpen, setIsOpen ] = useState(!isUserSet);
  const [name, setName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = createUserPayload(name);
    setUserCookie(payload);
    handleSetUser(payload);
  };

  useEffect(() => {
    clearTimeout(timeout);

    if (isUserSet) {
      setIsVisible(false);

      timeout = setTimeout(() => {
        setIsOpen(false);
      }, 300);
    } else {
      setIsInitiallyOpen(true);
      setIsOpen(true);

      timeout = setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, [ isUserSet ]);

  if (!isInitiallyOpen) {
    return null;
  }

  return (
    <Wrapper isOpen={isOpen} isVisible={isVisible} id='user-setup'>
      <h1>what do we call you?</h1>
      <CookieNotice>this is stored in a cookie so we won&apos;t ask you every time</CookieNotice>
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
