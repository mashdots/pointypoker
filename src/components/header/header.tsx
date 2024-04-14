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

const Header = () => (
  <Wrapper>
    <UserControl />
    <Logo />
    <RoomControl />
  </Wrapper>
);

export default Header;
