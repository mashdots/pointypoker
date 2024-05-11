import React from 'react';
import styled, { css } from 'styled-components';

import Logo from './logo';
import RoomControl from './roomControl';
import UserControl from './userControl';

type SectionProps = {
  align: 'left' | 'right';
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
`;

const Section = styled.div<SectionProps>`
  display: flex;
  flex: 1;

  ${({ align }) => css`
    justify-content: ${align === 'left' ? 'flex-start' : 'flex-end'};
  `}
`;

const Header = () => (
  <Wrapper>
    <Section align='left'>
      <Logo />
      <RoomControl />
    </Section>
    <Section align='right'>
      <UserControl />
    </Section>
  </Wrapper>
);

export default Header;
