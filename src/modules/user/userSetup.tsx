import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { useAuth } from './useAuth';
import LogoSvg from '@assets/pointy-poker.svg?react';
import ArrowSvg from '@assets/icons/arrow-right.svg?react';
import LinkSvg from '@assets/icons/link-out.svg?react';
import { Button, Card, TextInput } from '@components/common';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { useMobile } from '@utils/hooks/mobile';


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

const ArrowIcon = styled(ArrowSvg)<{ disabled: boolean }>`
  ${({ theme, disabled }: ThemedProps & { disabled: boolean }) => css`
    > line, polyline {
      stroke: ${disabled ? theme.greyscale.accent11 : theme.primary.accent12};
    }
  `}

  height: 1.5rem;
  width: 1.5rem;
`;

const LinkIcon = styled(LinkSvg)`
  height: 0.75rem;
  width: 0.75rem;
  margin-left: 0.25rem;
`;

const InfoLink = styled(Link)`
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.info.accent11 };
  `};

  cursor: pointer;
  text-decoration: none;
  font-weight: 100;

  &:hover {
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-thickness: 1px;
    color: ${ ({ theme }: ThemedProps) => theme.info.accent10 };
  }
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

const Header = styled.h2`
  font-weight: 300;
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
    font-weight: 300;
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
    <Card isNarrow={isNarrow} overrideWidth='70%'>
      <Wrapper>
        <HeaderWrapper>
          <Icon />
          <Header>welcome to pointy poker</Header>
        </HeaderWrapper>
        <FormWrapper>
          <p>what do we call you?</p>
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
              disabled={!name}
              refresh
              round
              style={{ margin: '0 0 0 0.75rem' }}
              textSize='small'
              type='submit'
              variation='info'
            >
              <ArrowIcon disabled={!name} />
            </Button>
          </Form>
        </FormWrapper>
        <p>
          <InfoLink
            to='/privacy'
            aria-label='Privacy policy'
            target='_blank'
          >
            privacy
            <LinkIcon />
          </InfoLink>
        </p>
      </Wrapper>
    </Card>
  );

};

export default UserSetup;
