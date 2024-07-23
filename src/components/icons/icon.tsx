import React from 'react';
import styled from 'styled-components';

import SuggestSvg from '@assets/icons/bulb.svg?react';
import AverageSvg from '@assets/icons/chart.svg?react';

const SuggestIcon = styled(SuggestSvg)`
  width: 1rem;
  height: 1rem;
`;

const AverageIcon = styled(AverageSvg)`
  width: 1rem;
  height: 1rem;
`;

const getIcon = (label?: string) => {
  let Icon;

  switch (label) {
  case 'suggest':
    Icon = SuggestIcon;
    break;
  case 'average':
  default:
    Icon = AverageIcon;
    break;
  }

  return <Icon />;
};

export default getIcon;
