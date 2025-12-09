import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import styled, { css, keyframes } from 'styled-components';

import Check from '@assets/icons/check.svg?react';
import LoadingIcon from '@assets/icons/loading-circle.svg?react';
import Error from '@assets/icons/plus.svg?react';
import { useJira } from '@modules/integrations';
import { JiraAuthData } from '@modules/integrations/jira/types';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

export const JIRA_REDIRECT_PATH = '/jira-redirect';

enum STATUS {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transition: all 300ms ease-in-out;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const checkAnimation = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-45deg) scale(0);
  }

  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
`;

const errorAnimation = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-90deg) scale(0);
  }

  100% {
    opacity: 1;
    transform: rotate(-45deg) scale(1);
  }
`;

const LoadingIndicator = styled(LoadingIcon)`
  height: 4rem;
  width: 4rem;
  animation: ${spin} 1s linear infinite;
`;

const SuccessIcon = styled(Check)`
  ${({ theme }: ThemedProps) => css`
    > polyline {
      stroke: ${theme.success.accent9};
    }
  `}
  height: 4rem;
  width: 4rem;

  animation: ${checkAnimation} 300ms;
`;

const ErrorIcon = styled(Error)`
  ${({ theme }: ThemedProps) => css`
    > line {
      stroke: ${theme.error.accent9};
    }
  `}
  height: 4rem;
  width: 4rem;

  transform: rotate(45deg);
  animation: ${errorAnimation} 300ms;
`;

const Text = styled.p`
  ${({ theme }: ThemedProps) => css`
    color: ${theme.greyscale.accent12};
  `}

  font-size: 1.5rem;
  text-align: center;
`;

const UnderText = styled.p`
  ${({ theme }: ThemedProps) => css`
    color: ${theme.greyscale.accent11};
  `}

  font-size: 1rem;
  text-align: center;
`;

const JiraRedirect = () => {
  const [status, setStatus] = useState(STATUS.LOADING);
  const { access, setAccess } = useStore(({ preferences, setPreferences }) => ({
    access: preferences?.jiraAccess,
    setAccess: (access: JiraAuthData) => setPreferences('jiraAccess', access),
  }));
  const { getAccessTokenFromApi } = useJira();

  const mainComponent = useMemo(() => {
    switch (status) {
      case STATUS.SUCCESS:
        return (
          <>
            <SuccessIcon />
            <Text>all set!</Text>
            <UnderText>(closing the window)</UnderText>
          </>
        );
      case STATUS.ERROR:
        return (
          <>
            <ErrorIcon />
            <Text>there was a problem</Text>
            <UnderText>try connecting Jira again</UnderText>
          </>
        );
      default:
        return (
          <>
            <LoadingIndicator />
            <Text>getting tokens . . .</Text>
          </>
        );
    }
  }, [status]);

  const handleGetAccessToken = async (code: string) => {
    try {
      const response = await getAccessTokenFromApi(code);
      response.expires_at = Date.now() + response.expires_in * 1000;
      setAccess(response);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(STATUS.ERROR);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (access) {
      setStatus(STATUS.SUCCESS);
    } else if (code) {
      handleGetAccessToken(code);
    } else {
      setStatus(STATUS.ERROR);
    }
  }, []);

  useEffect(() => {
    if ([STATUS.SUCCESS, STATUS.ERROR].includes(status)){
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, [status]);

  return (
    <Wrapper>
      {mainComponent}
    </Wrapper>
  );
};

export default JiraRedirect;
