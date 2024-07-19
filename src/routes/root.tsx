import React, { useMemo, useRef } from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import { Outlet, useOutletContext, useLocation } from 'react-router-dom';

import '../App.css';
import { GlobalStyles } from '../utils/styles';
import Header from '../components/header';
import Menu from '../modules/menu';
import { MobileProvider } from '../utils/hooks/mobile';
import useTheme from '../utils/styles/colors';
import Modal from '../modules/modal';
import usePreferenceSync from '../modules/preferences/hooks';
import { useAuth } from '../modules/user';
import { JIRA_REDIRECT_PATH } from '../main';

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

const Root = (): JSX.Element => {
  usePreferenceSync();
  useAuth();
  const { theme } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerHeight = useMemo(() => headerRef?.current?.clientHeight ?? 0, [headerRef?.current]);
  const location = useLocation();
  const shouldShowMenu = !location.pathname.includes(JIRA_REDIRECT_PATH);

  return (
    <ThemeProvider theme={theme}>
      <MobileProvider>
        <Container>
          <GlobalStyles/>
          <Header headerRef={headerRef} hideMenu={!shouldShowMenu} />
          <Modal />
          {shouldShowMenu && <Menu topOffset={headerHeight ?? 0} />}
          <ChildrenWrapper referenceHeight={headerHeight ?? 0} >
            <Outlet context={{ refHeight: headerHeight ?? 0 } satisfies ContextType} />
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
