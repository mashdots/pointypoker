import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/types';

const RevokeLink = styled.a`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.error.accent11 };
  `};

  cursor: pointer;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-thickness: 1px;
    color: ${({ theme }: ThemedProps) => theme.error.accent10};
  }
`;

export default RevokeLink;
