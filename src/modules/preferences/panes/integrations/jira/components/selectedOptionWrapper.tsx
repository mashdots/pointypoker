import styled, { css } from 'styled-components';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const SelectedOptionWrapper = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.accent2 };
    color: ${ theme.primary.accent12 };
  `}

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  width: 100%;
  border-radius: 0.5rem;
`;

export default SelectedOptionWrapper;
