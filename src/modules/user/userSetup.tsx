import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { useAuth } from './useAuth';
import LogoSvg from '@assets/pointy-poker.svg?react';
import ArrowSvg from '@assets/icons/arrow-right.svg?react';
import { Button, TextInput } from '@components/common';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import Logo from '@components/Header/logo';
import { useMobile } from '@utils/hooks/mobile';

type CardProps = {
  overrideWidth?: number,
  overrideHeight?: number,
  scroll?: boolean,
} & ThemedProps;


const Icon = styled(LogoSvg)`
  ${({ theme }: ThemedProps) => css`
    > path {
      fill: ${theme.primary.accent11};
    }

    filter: drop-shadow(0 0.125rem 0.125rem ${theme.primary.accent1});
  `}

  width: 5rem;
  height: 5rem;
  margin-bottom: 1rem;
`;

const ArrowIcon = styled(ArrowSvg)`
  height: 1.5rem;
  width: 1.5rem;
`;

const Card = styled.div<CardProps>`
  ${({ scroll, theme }: CardProps) => css`
    background-color: ${theme.primary.accent3};
    border-color: ${theme.primary.accent6};
    overflow: ${scroll ? 'auto' : 'hidden'};
  `};

  ${ ({ overrideWidth, isNarrow }: CardProps) => !isNarrow && overrideWidth && css`
    width: ${overrideWidth}rem !important;
  `}

  ${({ overrideHeight }: CardProps) => overrideHeight && css`
    height: ${overrideHeight}rem !important;
  `}

  border-width: 1px;
  border-style: solid;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 1rem;
  width: 90%;
  height: 30rem;
  transition: all 300ms ease-out;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  height: 100%;
  padding: 1rem;

  > form {
    width: 100%;
  }
`;

const HeaderWrapper = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`;

const Header = styled.h2<ThemedProps>`
  ${({ isNarrow }) => css`
    flex-direction: ${isNarrow ? 'column' : 'row'};
  `}
  
  justify-content: center;
  align-items: center;
  font-weight: 500;
  display: flex;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  > form {
    width: 100%;
  }

  > p {
    font-weight: 100;
    margin-bottom: 0;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  padding: 1rem 0;
`;

const UserSetup = () => {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const { isNarrow } = useMobile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name) {
      await signIn(name);
    }
  };

  return (
    <Card isNarrow={isNarrow} overrideHeight={24} overrideWidth={40}>
      <Wrapper>
        <HeaderWrapper>
          <Icon />
          <Header isNarrow={isNarrow}>welcome to&nbsp;<Logo /></Header>
        </HeaderWrapper>
        <FormWrapper>
          <p>what do we call you?</p>
          {/* <Notice>this is stored locally so you&apos;re not asked every time, and in the cloud to sync with room data</Notice> */}
          <Form onSubmit={handleSubmit} autoComplete='off' role="user name">
            <TextInput
              alignment='left'
              id='name'
              onChange={({ target }) => setName(target.value)}
              placeHolder='your name'
              value={name}
              collapse
            />
            <Button
              style={{ margin: '0 0 0 0.75rem' }}
              textSize='small'
              type='submit'
              variation='info'
              width={3}
            >
              <ArrowIcon />
            </Button>
          </Form>
        </FormWrapper>
      </Wrapper>
    </Card>
  );

};

export default UserSetup;
