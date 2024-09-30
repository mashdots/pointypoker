import React from 'react';
import styled from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

const Wrapper = styled.div<ThemedProps>`
  cursor: default;
  font-family: 'Lexend', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary.accent12};
`;

const FirstLetter = styled.span<ThemedProps>`
  color: ${({ theme }) => theme.primary.accent11};
`;

const Logo = () => {
  return (
    <Wrapper>
      <FirstLetter>p</FirstLetter>ointy <FirstLetter>p</FirstLetter>oker
    </Wrapper>
  );
};

export default Logo;
