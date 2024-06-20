import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { VARIATIONS } from '../../../../utils/styles';
import { getIcon } from '../../../../components/icons';

export type InfoCellProps = {
  icon?: string | JSX.Element;
  value?: number | string | null;
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

const Value = styled.div<{ shouldHide: boolean }>`
  ${({ shouldHide }) => css`
    max-height: ${shouldHide ? 0 : 300}px;
  `}

  transition: all 500ms ease-in;
  font-size: 2rem;
  font-weight: bold;
  overflow: hidden;
`;

const Label = styled.div<{ shouldHide: boolean }>`
  ${({ shouldHide }) => css`
    max-height: ${ shouldHide ? 0 : 24 }px;
  `}

  font-size: 1rem;
  transition: all 500ms ease-in;
  overflow: hidden;
`;

let timeout: number;

const InfoCell = ({ icon, value, label }: InfoCellProps) => {
  const [ valueData, setValueData ] = useState(value);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    console.log('value', value);

    if (value === null) {
      setShouldHide(true);
      timeout = setTimeout(() => {
        setValueData(null);
      }, 500);
    } else {
      setValueData(value);
      setShouldHide(false);
    }

    return () => clearTimeout(timeout);
  },
  [value],
  );

  return (
    <Wrapper>
      <ContentContainer>
        {/* Make this more Typescript-y */}
        {typeof icon !== 'object' ? getIcon(icon as string) : icon}
        <Value shouldHide={shouldHide}>{valueData}</Value>
        <Label shouldHide={shouldHide}>{label}</Label>
      </ContentContainer>
    </Wrapper>
  );};


export default InfoCell;
