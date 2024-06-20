import React from 'react';
import styled from 'styled-components';

import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import { useAuth } from '../../modules/user';

const Wrapper = styled.div<ThemedProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary.textHigh};
`;

const UserControl = () => {
  const { user } = useAuth();

  return <Wrapper>{user?.name}</Wrapper>;
};

export default UserControl;
