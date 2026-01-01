import {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useLocation } from 'react-router-dom';

import styled, { ThemeProvider } from 'styled-components';

import Header from '@components/Header';
import ControlBar from '@modules/ControlBar';
import Menu from '@modules/menu';
import Modal from '@modules/modal';
import usePreferenceSync from '@modules/preferences/hooks';
import { AuthProvider } from '@modules/user';
import { usePostHog } from '@posthog/react';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';
import flags, { FlagName } from '@utils/flags';
import useStore from '@utils/store';
import { GlobalStyles } from '@utils/styles';
import useTheme from '@utils/styles/colors';

import '../App.css';

export type ContextType = {
  refHeight: number;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 80rem;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
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
  const [isPosthogInitialized, setIsPosthogInitialized] = useState(false);

  const { isInV4Experience, setFlag } = useStore(({ getFlag, setFlag }) => (
    {
      isInV4Experience: getFlag(flags.REDESIGN),
      setFlag,
    }));
  const { theme } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const shouldShowMenu = useMemo(() => (
    location.pathname !== JIRA_REDIRECT_PATH
  ), [location.pathname]);

  // Initialization and subscription to PostHog feature flags
  useEffect(() => {
    if (posthog) {
      if (!isPosthogInitialized) {
        posthog.setPersonProperties({ deployVersion: import.meta.env.VITE_VERSION });
        setIsPosthogInitialized(true);
      } else {
        posthog.onFeatureFlags((_, variants) => {
          Object.entries(variants).forEach(([flag, isEnabled]) => {
            setFlag(flag as FlagName, !!isEnabled);
          });
        });
      }
    }
  }, [
    isPosthogInitialized,
    posthog,
    setFlag,
  ]);

  const menuBarComponent = useMemo(() => isInV4Experience
    ? null
    : <Header headerRef={headerRef} hideMenu={!shouldShowMenu} />, [isInV4Experience, shouldShowMenu] );

  const controlComponent = useMemo(() => isInV4Experience
    ? <ControlBar />
    : null, [isInV4Experience] );

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Container>
            {menuBarComponent}
            <GlobalStyles/>
            <Modal />
            {shouldShowMenu && <Menu topOffset={headerRef?.current?.clientHeight ?? 0} />}
            <ChildrenWrapper>
              <Outlet context={{ refHeight: headerRef?.current?.clientHeight ?? 0 } satisfies ContextType} />
            </ChildrenWrapper>
            {controlComponent}
          </Container>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default Root;
