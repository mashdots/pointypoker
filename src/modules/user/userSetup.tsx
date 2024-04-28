import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { createUserPayload, getUserCookie, setUserCookie } from '../../utils';
import { VARIATIONS } from '../../utils/styles';
import NameInput from './nameInput';
import { signIn } from '../../services/firebase/auth';
import useStore from '../../utils/store';

type WrapperProps = { isVisible: boolean, isOpen: boolean }

const Wrapper = styled.div<WrapperProps>`
  transition: opacity 300ms;
  display: flex;
  flex-direction: column;
  height: 100%;

  ${ ({ isOpen, isVisible }) => css`
    display: ${ isOpen ? 'inherit' : 'none' };
    opacity: ${ isVisible ? 100 : 0 }%;
  `};
`;

const CookieNotice = styled.p`
  color: ${ VARIATIONS.structure.textLowContrast };
`;

let timeout: ReturnType<typeof setTimeout>;

const withUserSetup = (WrappedComponent: () => JSX.Element) => {
  const UserSetup = () => {
    const { setUser, user } = useStore(({ setUser, user }) => ({
      setUser,
      user,
    }));
    const userCookie = getUserCookie();
    const [ isVisible, setIsVisible ] = useState(!user);
    const [ isOpen, setIsOpen ] = useState(!user);
    const [ name, setName ] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const payload = createUserPayload(name);
      try {
        const anonUser = await signIn();
        payload.id = anonUser.userId!;
        setUserCookie(payload);
        setUser(payload);
      } catch (error) {
        console.error(e);
      }
    };

    useEffect(() => {
      if (userCookie && !user) {
        setUser(userCookie);
      }
    }, [ user ]);

    useEffect(() => {
      clearTimeout(timeout);

      if (user) {
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

      return () => {
        setName('');
        clearTimeout(timeout);
      };
    }, [ user ]);

    // TODO: Create cookie notice for header so we can disclose everything
    if (!user) {
      return (
        <Wrapper isOpen={isOpen} isVisible={isVisible} id='user-setup-show'>
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
    } else {
      return (
        <Wrapper isOpen={!isOpen} isVisible={!isVisible} id='user-setup-hide'>
          <WrappedComponent />
        </Wrapper>
      );
    }
  };

  return UserSetup;
};

export default withUserSetup;
