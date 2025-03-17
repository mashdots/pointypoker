import React, { useMemo, useRef } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';

import '../App.css';
import Header from '@components/header';
import Menu from '@modules/menu';
import { useAuth } from '@modules/user';
import Modal from '@modules/modal';
import usePreferenceSync from '@modules/preferences/hooks';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';
import { GlobalStyles } from '@utils/styles';
import useTheme from '@utils/styles/colors';

type HeightAdjusted = {
  heightDiff: number;
}

const Container = styled.div<HeightAdjusted>`
  ${({ heightDiff }) => css`
    height: calc(100vh - ${ heightDiff + 1 || 0 }px);
  `}

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 80rem;
  overflow: hidden;
  margin: 0 auto;
`;

const ChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
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
      <GlobalStyles/>
      <Header headerRef={headerRef} hideMenu={!shouldShowMenu} />
      <Container heightDiff={headerHeight}>
        <Modal />
        {shouldShowMenu && <Menu topOffset={headerHeight ?? 0} />}
        <ChildrenWrapper>
          <Outlet />
        </ChildrenWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Root;
