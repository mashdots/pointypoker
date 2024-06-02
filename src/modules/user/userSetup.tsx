import React, { useState } from 'react';
import styled from 'styled-components';

import { useAuth } from './useAuth';
import { Theme } from '../../utils/styles/colors/colorSystem';
import { TextInput } from '../../components/common';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Notice = styled.p<{ shouldShow?: boolean}>`
  color: ${({ theme }: { theme: Theme }) => theme.primary.textLowContrast };
  transition: opacity 200ms;
  opacity: ${({ shouldShow = true }) => shouldShow ? 1 : 0};
`;

const UserSetup = () => {
  const { signIn } = useAuth();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name) {
      await signIn(name);
    }
  };

  return (
    <Wrapper id='user-setup-show'>
      <h1>what do we call you?</h1>
      <Notice>this is stored in a cookie so we won&apos;t ask you every time</Notice>
      <form onSubmit={handleSubmit} autoComplete='off'>
        <TextInput
          alignment='center'
          id='name'
          onChange={({ target }) => setName(target.value)}
          placeHolder='your name'
          value={name}
        />
      </form>
      <Notice shouldShow={!!name}>press enter to get started</Notice>
    </Wrapper>
  );

};

export default UserSetup;
