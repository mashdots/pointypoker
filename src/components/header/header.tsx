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

/**
 * TO DOS:
 * 2. Add a settings button to the right
 * 3. Make a settings panel that gives the options:
 *   - Change name
 *   - Dark or light mode
 *   - Change pointing scale
 *   - Delete personal data
 */

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
