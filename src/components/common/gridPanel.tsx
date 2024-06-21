import React from 'react';
import styled, { css } from 'styled-components';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';

export type GridConfiguration = {
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
};

export type GridPanelProps = {
  gridConfig: GridConfiguration;
};

type Props = {
  title?: string;
  config: GridConfiguration;
  children: React.ReactNode;
}

const Container = styled.div<ThemedProps & GridConfiguration>`
  display: flex;
  border-width: 1px;
  border-style: solid;
  border-radius: 0.5rem;
  padding: 1rem;
  flex-direction: column;
  
  ${({ columnStart, columnEnd, rowStart, rowEnd, theme }: ThemedProps & GridConfiguration) => css`
    grid-column-start: ${columnStart};
    grid-column-end: ${columnEnd};
    grid-row-start: ${rowStart};
    grid-row-end: ${rowEnd};

    border-color: ${theme.primary.border };
    background-color: ${ theme.transparent.bg};
  `}
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  padding: 0 0.5rem;
  
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.primary.textLow };
  `}
`;

const GridPanel = ({ config, children, title }: Props) => {
  const titleComponent = title ? <Title>{title.toLowerCase()}</Title> : null;

  return (
    <Container {...config}>
      {titleComponent}
      <div style={{ height: '100%' }}>
        {children}
      </div>
    </Container>
  );
};

export default GridPanel;