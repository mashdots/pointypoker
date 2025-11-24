import React from 'react';
import styled from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

import { useAuth } from '../../modules/user';

const Wrapper = styled.div<ThemedProps>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.accent12};
`;

const UserControl = () => {
  const { signOut, user } = useAuth();

  return <Wrapper onClick={signOut}>{user?.name}</Wrapper>;
};

export default UserControl;
