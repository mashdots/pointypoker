import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const InfoLink = styled(Link)`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.info.accent11 };
  `};

  cursor: pointer;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-thickness: 1px;
    color: ${({ theme }: ThemedProps) => theme.info.accent10};
  }
`;

export default InfoLink;
