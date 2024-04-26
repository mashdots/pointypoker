import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

import '../App.css';
import { GlobalStyles } from '../utils/styles';
import Header from '../components/header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh; /* Set container height to fill the viewport */
`;

const ChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

/**
 * General TODOs:
 * Settings page -
 *   1. Allow users to change their name.
 *   2. Light mode
 *   3. Color themes
 *   4. Allow users to clear local data.
 *   5. allow users to see statistics about their participation, including sessions voted, if they typically vote above or below the trend, etc.
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

const Root = (): JSX.Element => (
  <Container>
    <GlobalStyles />
    <Header />
    <ChildrenWrapper>
      <Outlet />
    </ChildrenWrapper>
  </Container>
);


export default Root;
