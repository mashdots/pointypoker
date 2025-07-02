import React, { useEffect, useState } from 'react';
import Wrapper from './wrapper';
import ContentContainer from './contentContainer';
import Value from './value';
import Label from './label';

export type InfoCellProps = {
  icon?: string | JSX.Element;
  value?: number | string | null;
  label: string;
};

let timeout: number;

const InfoCell = ({ icon, value, label }: InfoCellProps) => {
  const [ valueData, setValueData ] = useState(value);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
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
        {icon}
        <Value shouldHide={shouldHide}>{valueData}</Value>
        <Label shouldHide={shouldHide}>{label}</Label>
      </ContentContainer>
    </Wrapper>
  );};


export default InfoCell;
