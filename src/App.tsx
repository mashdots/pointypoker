import React, { useEffect } from 'react';
import styled from 'styled-components';

import './App.css';
import { Room } from './modules/room';
import { UserSetup } from './modules/user';
import { getUserCookie } from './utils';
import useStore from './utils/store';
import { GlobalStyles } from './utils/styles';
import { User } from './types';
import Header from './components/header';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh; /* Set container height to fill the viewport */
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
      <Header />
      <Wrapper>
        <UserSetup user={user} handleSetUser={(payload: User) => setUser(payload)} />
        <Room />
      </Wrapper>
    </AppContainer>
  );
};

export default App;
