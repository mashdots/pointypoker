import styled, { css } from 'styled-components';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const VisibilityControl = styled.div<{ isVisible: boolean }>`
  ${({ isVisible, theme }: { isVisible: boolean } & ThemedProps) => css`
      opacity: ${isVisible ? 1 : 0};
      filter: blur(${isVisible ? 0 : 0.25}rem);

      > a {
        color: ${theme.info.accent11};
      }
    `}

  > a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-decoration-style: dashed;
      text-decoration-thickness: 1px;
    }
  }

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 250ms;
`;

export default VisibilityControl;
