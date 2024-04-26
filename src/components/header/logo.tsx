import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  cursor: default;
  font-family: 'Lexend', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  padding-left: 1rem;

`;

const Logo = () => {
  return <Wrapper>pointy poker</Wrapper>;
};

export default Logo;
