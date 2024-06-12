import React from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../../utils/styles';
import { getIcon } from '../../../../components/icons';

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
  color: ${ VARIATIONS.structure.textLow };
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const Label = styled.div`
  font-size: 1rem;
`;

const InfoCell = ({ icon, value, label }: InfoCellProps) => {

  return (
    <Wrapper>
      <ContentContainer>
        {getIcon(icon)}
        <Value>{value}</Value>
        <Label>{label}</Label>
      </ContentContainer>
    </Wrapper>
  );};


export default InfoCell;
