import React, { useMemo, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Outlet, useOutletContext, useLocation } from 'react-router-dom';

import '../App.css';
import Header from '@components/Header';
import Menu from '@modules/menu';
import { useAuth } from '@modules/user';
import Modal from '@modules/modal';
import usePreferenceSync from '@modules/preferences/hooks';
import useJiraScopeCheck from '@modules/integrations/jira/hooks';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';
import { GlobalStyles } from '@utils/styles';
import useTheme from '@utils/styles/colors';

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

const Root = (): JSX.Element => {
  usePreferenceSync();
  useAuth();
  useJiraScopeCheck();

  const { theme } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerHeight = useMemo(() => headerRef?.current?.clientHeight ?? 0, [headerRef?.current]);
  const location = useLocation();
  const shouldShowMenu = !location.pathname.includes(JIRA_REDIRECT_PATH);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <GlobalStyles/>
        <Header headerRef={headerRef} hideMenu={!shouldShowMenu} />
        <Modal />
        {shouldShowMenu && <Menu topOffset={headerHeight ?? 0} />}
        <ChildrenWrapper>
          <Outlet context={{ refHeight: headerHeight ?? 0 } satisfies ContextType} />
        </ChildrenWrapper>
      </Container>
    </ThemeProvider>
  );
};

export function useHeaderHeight() {
  return useOutletContext<ContextType>();
}

export default Root;
