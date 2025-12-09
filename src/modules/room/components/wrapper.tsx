import styled from 'styled-components';

import { VARIATIONS } from '@utils/styles';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 1rem;

  width: 100%;
  
  border: none;
  color: ${ VARIATIONS.structure.accent11 };
`;

export default Wrapper;
