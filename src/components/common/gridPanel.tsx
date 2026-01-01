import React from 'react';

import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/types';

import { GridConfiguration } from './types';

export type GridPanelProps = {
  title?: string;
  config: GridConfiguration;
  children: React.ReactNode;
  headingElement?: React.ReactNode;
};

const Container = styled.div<ThemedProps & GridConfiguration>`
  display: flex;
  border-width: 1px;
  border-style: solid;
  border-radius: 0.5rem;
  padding: 1rem;
  flex-direction: column;
  
  ${({
    columnStart,
    columnEnd,
    rowStart,
    rowEnd,
    theme,
  }: ThemedProps & GridConfiguration) => css`
    grid-column-start: ${columnStart};
    grid-column-end: ${columnEnd};
    grid-row-start: ${rowStart};
    grid-row-end: ${rowEnd};

    border-color: ${theme.primary.accent6 };
    background-color: ${ theme.transparent.accent1};
  `}
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  padding: 0 0.5rem;
  
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.primary.accent11 };
  `}
`;

const ChildrenWrapper = styled.div`
  height: 100%;
  overflow: auto;
`;

const GridPanel = ({
  config,
  children,
  title,
  headingElement,
}: GridPanelProps) => {
  const titleComponent = title ? <Title>{title.toLowerCase()}</Title> : null;

  return (
    <Container {...config}>
      {titleComponent}
      {headingElement}
      <ChildrenWrapper>
        {children}
      </ChildrenWrapper>
    </Container>
  );
};

export default GridPanel;
