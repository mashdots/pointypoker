import React, { ContextType, useEffect, useRef, useState } from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import { Outlet, useOutletContext } from 'react-router-dom';

import '../App.css';
import { GlobalStyles } from '../utils/styles';
import Header from '../components/header';
import { MobileProvider } from '../utils/mobile';
import useTheme from '../utils/styles/colors';
import useStore from '../utils/store';

type ContextType = {
  refHeight: number;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ChildrenWrapper = styled.div<{ referenceHeight: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${({ referenceHeight }) => css`
    height: calc(100vh - ${referenceHeight}px);
  `}
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
 *  1. Fix animations
 *  3. Add a loading spinner / animation
 *  4. Add a footer
 *  5. Add a cookie notice, privacy policy, and terms of service
 */

const Root = (): JSX.Element => {
  const { theme } = useTheme();
  const isRoomOpen = useStore((state) => state.isRoomOpen);
  const [refHeight, setRefHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  /**
   * This is all so we don't have to hard-code the header height, so the rest of
   * the app renders without making the page too long.
   */
  useEffect(() => {
    if (headerRef.current) {
      setRefHeight(headerRef.current.clientHeight);
    }
  }, [headerRef.current]);

  return (
    <ThemeProvider theme={theme}>
      <MobileProvider>
        <Container>
          <GlobalStyles isRoomOpen={isRoomOpen} />
          <Header headerRef={headerRef} />
          <ChildrenWrapper
            referenceHeight={refHeight}
          >
            <Outlet context={{ refHeight } satisfies ContextType} />
          </ChildrenWrapper>
        </Container>
      </MobileProvider>
    </ThemeProvider>
  );
};

export function useHeaderHeight() {
  return useOutletContext<ContextType>();
}

export default Root;
