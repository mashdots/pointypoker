import React from 'react';
import styled from 'styled-components';

import Logo from './logo';
import RoomControl from './roomControl';
import UserControl from './userControl';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

/**
 * TO DOS:
 * 1. Align header to left and show room name next to it
 * 2. Add a settings button to the right
 * 3. Make a settings panel that gives the options:
 *   - Change name
 *   - Dark or light mode
 *   - Change pointing scale
 *   - Delete personal data
 */

const Header = () => (
  <Wrapper>
    <UserControl />
    <Logo />
    <RoomControl />
  </Wrapper>
);

export default Header;
