import React from 'react';
import styled, { css } from 'styled-components';

import { getPointOptions, PointingTypes } from '@modules/room/utils';
import { Card } from '@components/common';

type Props = {
  initialPoints?: number | string;
  onPointAdjust?: (points: number) => void;
}

const Wrapper = styled.div`
  display: flex;

  align-items: center;
`;


const Adjuster = ({ initialPoints, onPointAdjust }: Props) => {
  const { sequence } = getPointOptions();
  return (
    <Wrapper>
      suggested points <Card colorTheme="greyscale" overrideWidth='2rem'>{initialPoints}</Card>
    </Wrapper>
  );
};

export default Adjuster;
