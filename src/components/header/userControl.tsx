import React from 'react';
import styled from 'styled-components';

import { Theme } from '../../utils/styles/colors/colorSystem';
import { useAuth } from '../../modules/user';

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }: { theme: Theme}) => theme.primary.textHighContrast};
`;

const UserControl = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return <Wrapper onClick={handleSignOut}>{user?.name}</Wrapper>;
};

export default UserControl;
