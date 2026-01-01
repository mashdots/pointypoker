import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/types';

import InformationWrapper from './informationWrapper';

const ConnectWrapper = styled(InformationWrapper)`
  ${({ theme }: ThemedProps) => css`
    border: 1px solid ${ theme.success.accent7 };
  `};
`;

export default ConnectWrapper;
