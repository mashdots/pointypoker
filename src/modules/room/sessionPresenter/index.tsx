import React from 'react';
import styled, { css } from 'styled-components';

import { Card } from '@components/common';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SidePanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 8rem);
`;

const SidePanel = styled.div`
  ${({ theme }: ThemedProps ) => css`
    border-color: ${ theme.primary.accent7 };
    border-top-width: 1px;
    border-left-width: 1px;
    border-bottom-width: 1px;
  `};
  
  border-style: solid;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  border-right: none;
  padding: 1rem;
  display: flex;
  height: 100%;
`;

const CardWrapper = styled.div`
  display: flex;
  flex: 3;
  height: calc(100% - 2rem);
`;

const SessionPresenter = () => {
  return (
    <Wrapper>
      <SidePanelWrapper>
        <SidePanel>
          <h3>SidePanel</h3>
        </SidePanel>
      </SidePanelWrapper>
      <CardWrapper>
        <Card colorTheme='greyscale' isNarrow={false} overrideHeight='100%' overrideWidth='100%'>
          <h1>SessionPresenter</h1>
        </Card>
      </CardWrapper>
    </Wrapper>
  );
};

export default SessionPresenter;
