import styled, { css } from 'styled-components';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { VerticalContainer } from '@modules/preferences/panes/common';

const Wrapper = styled(VerticalContainer)`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.accent5 };
  `}

  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
  margin: 0.5rem;
`;

export default Wrapper;
