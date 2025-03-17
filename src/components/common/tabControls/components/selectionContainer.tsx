import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

const SelectionContainer = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.accent3 };
    box-shadow: inset 0 0 0.25rem ${ theme.greyscale.accent1 };
  `};
  
  display: flex;
  border-radius: 0.5rem;
  justify-content: space-between;
  position: relative;
`;

export default SelectionContainer;
