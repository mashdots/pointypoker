import React from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../../utils/styles';
import SuggestIcon from '../../../../assets/icons/bulb.svg?react';
import AverageIcon from '../../../../assets/icons/chart.svg?react';

export type InfoCellProps = {
  icon?: string;
  value: number | string;
  label: string;
};

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 1rem;

  width: 100%;
  
  border: none;
  color: ${ VARIATIONS.structure.textLowContrast };
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const getStyledIcon = (svgIcon: any) => styled(svgIcon)`
  width: 1rem;
  height: 1rem;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const Label = styled.div`
  font-size: 1rem;
`;

const getIcon = (label?: string) => {
  let iconSvg;

  switch (label) {
  case 'suggest':
    iconSvg = SuggestIcon;
    break;
  case 'average':
  default:
    iconSvg = AverageIcon;
    break;
  }

  return getStyledIcon(iconSvg);
};

const InfoCell = ({ icon, value, label }: InfoCellProps) => {
  const CellIcon = getIcon(icon);

  return (
    <Wrapper>
      <ContentContainer>
        <CellIcon />
        <Value>{value}</Value>
        <Label>{label}</Label>
      </ContentContainer>
    </Wrapper>
  );};


export default InfoCell;
