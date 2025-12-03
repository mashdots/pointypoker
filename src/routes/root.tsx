import React, { FC, useEffect, useMemo, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Outlet, useOutletContext, useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react'

import Header from '@components/Header';
import Menu from '@modules/menu';
import Modal from '@modules/modal';
import AuthProvider from '@modules/user/AuthContext';
import usePreferenceSync from '@modules/preferences/hooks';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';
import { GlobalStyles } from '@utils/styles';
import useTheme from '@utils/styles/colors';

import '../App.css';

type ContextType = {
  refHeight: number;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 80rem;
  height: 100vh;
  margin: 0 auto;
`;

const ChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const Root: FC = () => {
  usePreferenceSync();

  const posthog = usePostHog();
  const { theme } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerHeight = useMemo(() => headerRef?.current?.clientHeight ?? 0, [headerRef?.current]);
  const location = useLocation();
  const shouldShowMenu = !location.pathname.includes(JIRA_REDIRECT_PATH);

  useEffect(() => {
    if (posthog) {
      posthog.setPersonProperties({
        deployVersion: import.meta.env.VITE_VERSION
      });
    }
  }, [posthog]);

  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <Container>
        <GlobalStyles/>
        <Header headerRef={headerRef} hideMenu={!shouldShowMenu} />
        <Modal />
        {shouldShowMenu && <Menu topOffset={headerHeight} />}
        <ChildrenWrapper>
          <Outlet context={{ refHeight: headerHeight} satisfies ContextType} />
        </ChildrenWrapper>
      </Container>
    </ThemeProvider>
    </AuthProvider>
  );
};

export function useHeaderHeight() {
  return useOutletContext<ContextType>();
}

export default Root;
