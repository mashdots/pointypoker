import React from 'react';
import styled from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';

const Wrapper = styled.div<ThemedProps>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.accent12};
`;

const UserControl = () => {
  const user = useStore(({ preferences }) => preferences?.user);

  return <Wrapper>{user?.name}</Wrapper>;
};

export default UserControl;
