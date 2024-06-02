import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../utils/styles/colors/colorSystem';

const Wrapper = styled.div`
  cursor: default;
  font-family: 'Lexend', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.5rem;
  color: ${({ theme }: { theme: Theme }) => theme.primary.textHighContrast};
`;

const FirstLetter = styled.span`
  color: ${({ theme }: { theme: Theme }) => theme.primary.textLowContrast};
`;

const Logo = () => {
  return <Wrapper>
    <FirstLetter>p</FirstLetter>ointy <FirstLetter>p</FirstLetter>oker
  </Wrapper>;
};

export default Logo;
