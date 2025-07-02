import styled, { css } from 'styled-components';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import InformationWrapper from './informationWrapper';

const ConnectWrapper = styled(InformationWrapper)`
  ${({ theme }: ThemedProps) => css`
    border: 2px solid ${ theme.success.accent7 };
  `};
`;

export default ConnectWrapper;
