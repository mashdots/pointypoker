import React from 'react';
import styled from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';

import { useAuth } from '../../modules/user';

const Wrapper = styled.div<ThemedProps>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.accent12};
`;

const UserControl = () => {
  const user = useStore(({ preferences }) => preferences?.user);
  const { signOut } = useAuth();

  return <Wrapper onClick={signOut}>{user?.name}</Wrapper>;
};

export default UserControl;
