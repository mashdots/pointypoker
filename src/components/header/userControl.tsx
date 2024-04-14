import React from 'react';
import styled from 'styled-components';

import useStore from '../../utils/store';
import { clearUserCookie } from '../../utils/cookies';

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1rem;
`;

const UserControl = () => {
  const user = useStore((state) => state.user);
  const clearUser = useStore((state) => state.clearUser);
  const clearRoom = useStore((state) => state.clearRoom);

  const handleClearUser = () => {
    clearUser();
    clearRoom();
    clearUserCookie();
  };

  return <Wrapper onClick={handleClearUser}>{user?.name}</Wrapper>;
};

export default UserControl;
