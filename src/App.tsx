import React, { useEffect } from 'react';
import styled from 'styled-components';

import './App.css';
import Logo from './components/logo';
import { RoomSetup } from './modules/room';
import { UserSetup } from './modules/user';
import { getUserCookie } from './utils';
import useStore from './utils/store';
import { GlobalStyles } from './utils/styles';

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

  useEffect(() => {
    const user = getUserCookie();
    setUser(user);
  }, []);

  return (
    <AppContainer>
      <GlobalStyles />
      <Logo />
      <Wrapper>
        <UserSetup />
        <RoomSetup />
      </Wrapper>
    </AppContainer>
  );
};

export default App;
