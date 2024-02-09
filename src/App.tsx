import React, { useEffect } from 'react';
import styled from 'styled-components';

import './App.css';
import Logo from './components/logo';
import { RoomSetup } from './modules/room';
import { UserSetup } from './modules/user';
import { getUserCookie } from './utils';
import useStore from './utils/store';
import { GlobalStyles } from './utils/styles';
import { User } from './types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh; /* Set container height to fill the viewport */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const Wrapper = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`;

const App = (): JSX.Element => {
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);
  const userCookie = getUserCookie();

  useEffect(() => {
    if (userCookie && !user) {
      setUser(userCookie);
    }
  }, [user]);

  return (
    <AppContainer>
      <GlobalStyles />
      <Header>
        <Spacer />
        <Logo />
        <CurrentUser />
      </Header>
      <Wrapper>
        <UserSetup user={user} handleSetUser={(payload: User) => setUser(payload)} />
        <RoomSetup />
      </Wrapper>
    </AppContainer>
  );
};

export default App;
