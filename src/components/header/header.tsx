import React from 'react';
import styled, { css } from 'styled-components';

import Logo from './logo';
import RoomControl from './roomControl';
import UserControl from './userControl';

type Props = {
  headerRef: React.RefObject<HTMLDivElement>;
}

type SectionProps = {
  align: 'left' | 'right';
  flex: number;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
`;

const Section = styled.div<SectionProps>`
  display: flex;
  align-items: center;

  ${({ align, flex }) => css`
    flex: ${flex};

    justify-content: ${align === 'left' ? 'flex-start' : 'flex-end'};
  `}
`;

const Header = ({ headerRef }: Props) => (
  <Wrapper ref={headerRef}>
    <Section flex={6} align='left'>
      <Logo />
      <RoomControl />
    </Section>
    <Section flex={1} align='right'>
      <UserControl />
    </Section>
  </Wrapper>
);

export default Header;
