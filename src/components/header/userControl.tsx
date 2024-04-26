import React from 'react';
import styled from 'styled-components';

import useStore from '../../utils/store';
import { clearUserCookie } from '../../utils/cookies';
import { signOut } from '../../services/firebase/auth';

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 1rem;
`;

const UserControl = () => {
  const user = useStore((state) => state.user);
  const clearUser = useStore((state) => state.clearUser);
  const clearRoom = useStore((state) => state.clearRoom);

  const handleSignOut = async () => {
    try {
      await signOut();
      clearUser();
      clearRoom();
      clearUserCookie();
    } catch (e) {
      console.error(e);
    }
  };

  return <Wrapper onClick={handleSignOut}>{user?.name}</Wrapper>;
};

export default UserControl;
