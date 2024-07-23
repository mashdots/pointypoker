import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

export const Separator = styled.span`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.primary.border };
  `}

    display: inline-block;
    height: 2px;
    width: 100%;
    margin-top: 1rem;
`;

export const SettingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
