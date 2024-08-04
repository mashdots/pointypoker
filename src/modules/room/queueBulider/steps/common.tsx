import styled, { css } from 'styled-components';

export const SelectionWrapper = styled.div<{ isColumn?: boolean }>`
  ${ ({ isColumn }: { isColumn?: boolean }) => css`
    flex-direction: ${ isColumn ? 'column' : 'row' };
    justify-content: ${ isColumn ? 'flex-start' : 'center' };
  `}

  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-radius: 0.5rem;
`;

export const InformationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 2rem;
`;
