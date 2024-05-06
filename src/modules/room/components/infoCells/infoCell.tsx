import React from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../../utils/styles';

export type InfoCellProps = {
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

const Icon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${ VARIATIONS.structure.bgElement };
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Label = styled.div`
  font-size: 1rem;
`;

const InfoCell = ({ value, label }: InfoCellProps) => (
  <Wrapper>
    <ContentContainer>
      <Icon />
      <Value>{value}</Value>
      <Label>{label}</Label>
    </ContentContainer>
  </Wrapper>
);


export default InfoCell;
