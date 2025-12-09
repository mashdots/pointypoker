import styled, { css } from 'styled-components';

import PlusIcon from '@assets/icons/plus.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const CloseIcon = styled(PlusIcon)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.25rem;
  transform: rotate(45deg);
  
  ${({ theme }: ThemedProps) => css`
    > line {
      stroke: ${theme.primary.accent11};
    }
  `}
`;

export default CloseIcon;
