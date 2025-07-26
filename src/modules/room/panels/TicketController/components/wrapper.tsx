import styled, { css } from 'styled-components';

type Props = {
  flex?: number;
  width?: string;
}

const Wrapper = styled.div<Props>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 1rem;

  ${({ flex }) => flex && css`
    flex: ${flex};
  `}

  ${({ width }) => width && css`
    width: ${width};
  `}
`;

export default Wrapper;
