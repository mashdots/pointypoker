import styled, { css, keyframes } from 'styled-components';

import Check from '@assets/icons/check.svg?react';
import { ThemedProps } from '@utils/styles/colors/types';

const checkAnimation = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-45deg) scale(0);
  }

  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
`;

const SuccessIcon = styled(Check)`
  ${ ({ theme }: ThemedProps) => css`
    > polyline {
      stroke: ${ theme.success.accent9 };
    }
  `}
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;

  animation: ${ checkAnimation } 300ms;
`;

export default SuccessIcon;
