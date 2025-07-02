import styled, { css } from 'styled-components';

const Label = styled.div<{ shouldHide: boolean }>`
  ${({ shouldHide }) => css`
    max-height: ${ shouldHide ? 0 : 24 }px;
  `}

  font-size: 1rem;
  transition: all 500ms ease-in;
  overflow: hidden;
`;

export default Label;
