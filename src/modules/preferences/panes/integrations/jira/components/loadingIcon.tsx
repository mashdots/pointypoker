import styled from 'styled-components';

import Spinner from '@assets/icons/loading-circle.svg?react';
import { spinAnimation } from '@components/common/animations';

const LoadingIcon = styled(Spinner)`
  height: 1rem;
  width: 1rem;
  animation: ${spinAnimation} 1s linear infinite;
`;

export default LoadingIcon;
