import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/types';

import InformationWrapper from './informationWrapper';

const NoticeWrapper = styled(InformationWrapper)`
  ${({ theme }: ThemedProps) => css`
    background-color: ${ theme.warning.accent4 };
  `};
`;

export default NoticeWrapper;
