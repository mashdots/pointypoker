import styled, { css } from 'styled-components';

import { fadeDownEntrance } from '@components/common/animations';

export const SectionWrapper = styled.div<{ isColumn?: boolean }>`
  ${ ({ isColumn }: { isColumn?: boolean }) => css`
  justify-content: ${ isColumn ? 'flex-start' : 'center' };
  `}
  
  flex-direction: column;
  height: 100%;
  opacity: 0;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-radius: 0.5rem;
  animation: ${fadeDownEntrance} 250ms ease-out forwards;
`;

export const InformationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 2rem;
  margin-bottom: 0.5rem;
`;
