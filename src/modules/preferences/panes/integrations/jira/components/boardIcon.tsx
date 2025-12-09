import styled, { css } from 'styled-components';

import BoardImage from '@assets/icons/article.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const BoardIcon = styled(BoardImage)`
  margin-right: 0.25rem;
  margin-left: 0rem;
  width: 1.5rem;
    
  ${ ({ theme }: ThemedProps) => css`
    > line {
      stroke: ${theme.primary.accent12};
    }

    > rect {
      stroke: ${theme.primary.accent11};
    }
  `}
`;

export default BoardIcon;
