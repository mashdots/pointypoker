import React from 'react';
import styled, { css } from 'styled-components';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';

type Props = {
  title?: string;
  children: React.ReactNode;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
`;

const Container = styled.div<ThemedProps>`
  ${({ theme }: ThemedProps) => css`
    border-color: ${theme.primary.border};
    background-color: ${theme.transparent.bg};
  `}

  border-width: 1px;
  border-style: solid;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin: 0 0.5rem;
  
  ${({ theme }: ThemedProps) => css`
    color: ${theme.primary.textHigh};
  `}
`;

const Panel = ({ children, title, ...rest }: Props) => {
  const titleComponent = title ? <Title>{title.toLowerCase()}</Title> : null;

  return (
    <Wrapper>
      <Container style={{ ...rest }}>
        {titleComponent}
        {children}
      </Container>
    </Wrapper>
  );
};

export default Panel;
