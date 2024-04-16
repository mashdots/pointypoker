import React from 'react';
import styled from 'styled-components';

import './App.css';
import { RoomController } from './modules/room';
import { UserSetup } from './modules/user';
import { GlobalStyles } from './utils/styles';
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

/**
 * General TODOs:
 * Settings page -
 *   1. Allow users to change their name.
 *   2. Light mode
 *   3. Allow users to clear local data.
 *   4. allow users to see statistics about their participation, including sessions voted, if they typically vote above or below the trend, etc.
 *
 * Site -
 *  1. Add a favicon
 *  2. Fix animations
 *  3. Add a loading spinner / animation
 *  4. Add a footer
 *  5. Add a cookie notice, privacy policy, and terms of service
 *  6. Mobile responsiveness
 *
 */

const App = (): JSX.Element => (
  <AppContainer>
    <GlobalStyles />
    <Header />
    <Wrapper>
      <UserSetup />
      <RoomController />
    </Wrapper>
  </AppContainer>
);


export default App;
