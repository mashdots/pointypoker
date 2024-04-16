import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { createUserPayload, getUserCookie, setUserCookie } from '../../utils';
import { VARIATIONS } from '../../utils/styles';
import NameInput from './NameInput';
import { createUser } from '../../services/firebase';
import { signIn } from '../../services/firebase/auth';
import useStore from '../../utils/store';

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
  const { setUser, user } = useStore(({ setUser, user }) => ({
    setUser,
    user,
  }));
  const userCookie = getUserCookie();
  const isUserSet = !!user;
  const [ isVisible, setIsVisible ] = useState(!isUserSet);
  const [ isInitiallyOpen, setIsInitiallyOpen ] = useState(!isUserSet);
  const [ isOpen, setIsOpen ] = useState(!isUserSet);
  const [ name, setName ] = useState<string>('');

  useEffect(() => {
    if (userCookie && !user) {
      setUser(userCookie);
    }
  }, [ user ]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = createUserPayload(name);
    try {
      const anonUser = await signIn();
      console.log('anonUser', anonUser);
      payload.id = anonUser.userId!;
      createUser(payload, async () => {
        setUserCookie(payload);
        setUser(payload);
      });
    } catch (error) {
      console.error(e);
    }
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

    return () => {
      setName('');
      clearTimeout(timeout);
    };
  }, [ isUserSet ]);

  if (!isInitiallyOpen) {
    return null;
  }

  // TODO: Create cookie notice for header so we can disclose everything
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
