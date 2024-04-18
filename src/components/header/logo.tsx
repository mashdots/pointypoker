import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  cursor: default;
  font-family: 'Lexend', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
`;

const Logo = () => {
  return <Wrapper>pointy poker</Wrapper>;
};

export default Logo;
