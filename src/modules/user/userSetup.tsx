import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { useAuth } from './useAuth';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import { TextInput } from '../../components/common';

type NoticeProps = ThemedProps & {
  shouldShow?: boolean;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Notice = styled.p<NoticeProps>`
  transition: opacity 200ms;

  ${({ shouldShow = true, theme }) => css`
    color: ${theme.primary.textLowContrast};
    opacity: ${ shouldShow ? 1 : 0};
  `}
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
