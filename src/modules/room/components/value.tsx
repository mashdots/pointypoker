import styled, { css } from 'styled-components';

const Value = styled.div<{ shouldHide: boolean }>`
  ${({ shouldHide }) => css`
    max-height: ${shouldHide ? 0 : 300}px;
  `}

  transition: all 500ms ease-in;
  font-size: 2rem;
  font-weight: bold;
  overflow: hidden;
`;

export default Value;
