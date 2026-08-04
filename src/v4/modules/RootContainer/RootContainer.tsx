import { Outlet } from 'react-router';

import styled, { ThemeProvider } from 'styled-components';

import { Theme } from '@radix-ui/themes';
import { GlobalStyles } from '@utils/styles';
import useTheme from '@utils/styles/colors';
import ServicesProvider from '@v4/providers';

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

const RootContainer = () => {
  const { theme, themeMode } = useTheme();

  return (
    <ServicesProvider>
      <Theme appearance={themeMode}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Container>
            <ChildrenWrapper>
              <Outlet />
            </ChildrenWrapper>
          </Container>
        </ThemeProvider>
      </Theme>
    </ServicesProvider>
  );
};

export default RootContainer;
