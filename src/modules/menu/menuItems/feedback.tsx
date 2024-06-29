import React from 'react';
import styled, { css } from 'styled-components';

import FeedbackIcon from '../../../assets/icons/feedback.svg?react';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';
import MenuItem from './menuItem';


const Icon = styled(FeedbackIcon) <ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;

  ${ ({ theme }: ThemedProps) => css`
    > line, path, polyline {
      stroke: ${ theme.greyscale.textLow };
    }
  `}
`;

const FeedbackMenuItem = () => {
  return (
    <MenuItem
      uniqueElement={<Icon />}
      text='feedback'
    />
  );

};

export default FeedbackMenuItem;
