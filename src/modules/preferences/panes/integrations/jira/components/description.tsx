import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/types';

const Description = styled.span`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.greyscale.accent11 };
  `}

  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

export default Description;
