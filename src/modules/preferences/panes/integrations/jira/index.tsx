import React, { useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import IntegrationCard from '../integrationCard';
import usePreferenceSync from '../../../hooks';
import Check from '@assets/icons/check.svg?react';
import JiraLogo from '@assets/icons/jira-logo.svg?react';
import Link from '@assets/icons/link-out.svg?react';
import Copy from '@assets/icons/copy.svg?react';
import Spinner from '@assets/icons/loading-circle.svg?react';
import { Button } from '@components/common';
import { useJira } from '@modules/integrations';
import { JiraResourceData } from '@modules/integrations/jira';
import DefaultBoardSection from '@modules/preferences/panes/integrations/jira/defaultBoardSection';
import { Separator, VerticalContainer } from '@modules/preferences/panes/common';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import PointFieldSection from '@modules/preferences/panes/integrations/jira/pointFieldSection';
import { isDev } from '@utils';

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

const JiraIcon = styled(JiraLogo)`
  ${({ theme }: ThemedProps) => css`
    > path {
      fill: ${ theme.info.solidBg };
    }
  `}

  height: 2rem;
  width: 2rem;
  margin-right: 0.5rem;
`;

const LoadingIcon = styled(Spinner)`
  height: 1rem;
  width: 1rem;
  animation: ${spin} 1s linear infinite;
`;


const SuccessIcon = styled(Check)`
  ${ ({ theme }: ThemedProps) => css`
    > polyline {
      stroke: ${ theme.success.solidBg };
    }
  `}
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;

  animation: ${ checkAnimation } 300ms;
`;

const LinkIcon = styled(Link)`
  height: 0.75rem;
  width: 0.75rem;
  margin-left: 0.25rem;
`;

const CopyIcon = styled(Copy)`
  height: 0.75rem;
  width: 0.75rem;
  margin-left: 0.25rem;
`;

const InformationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem;

  border-radius: 0.5rem;

  > p {
    margin: 0;
    font-size: 0.8rem;
  }
`;

const ConnectWrapper = styled(InformationWrapper)`
  ${({ theme }: ThemedProps) => css`
    border: 2px solid ${ theme.success.borderElement };
  `};
`;

const NoticeWrapper = styled(InformationWrapper)`
  ${({ theme }: ThemedProps) => css`
    background-color: ${ theme.warning.componentBgHover };
  `};
`;

const DisconnectInfoWrapper = styled(InformationWrapper)`
  padding: 0;
`;

const RevokeLink = styled.a`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.error.textLow };
  `};

  cursor: pointer;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-thickness: 1px;
    color: ${({ theme }: ThemedProps) => theme.error.solidBgHover};
  }
`;

const Wrapper = styled(VerticalContainer)`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.componentBgActive };
  `}

  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
  margin: 0.5rem;
`;

const JiraIntegrationCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {
    isConfigured,
    accessToken,
    resources,
    setResources,
    revokeAccess,
  } = useStore(({ preferences, setPreferences }) => ({
    isConfigured: !!preferences?.jiraAccess,
    accessToken: preferences?.jiraAccess?.access_token,
    resources: preferences?.jiraResources,
    setResources: (resources: JiraResourceData | null) => setPreferences('jiraResources', resources),
    revokeAccess: () => {
      setPreferences('jiraAccess', null);
      setPreferences('jiraResources', null);
    },
  }));
  const { launchJiraOAuth, getAccessibleResources } = useJira();
  const { syncPrefsToStore } = usePreferenceSync();

  const eventListenerMethod = (event: StorageEvent) => {
    if (event.key === 'jiraAccess') {
      syncPrefsToStore();
    }
  };

  const button = useMemo(() => {
    if (isConfigured && resources) {
      return null;
    }

    let buttonChildren: string | JSX.Element = 'Connect';
    let buttonVariation = 'info';

    if (isError) {
      buttonChildren =  isConfigured ? 'Reconnect' : 'Retry connection';
      buttonVariation = isConfigured ? 'warning' : 'error';
    }

    if (isLoading) {
      buttonChildren = <LoadingIcon />;
    }

    return (
      <Button
        onClick={() => {
          setIsLoading(true);
          launchJiraOAuth();
          addEventListener('storage', eventListenerMethod);
        }}
        noMargin
        variation={buttonVariation as 'info' | 'warning' | 'error'}
        textSize='small'
        width={'quarter'}
        isDisabled={isLoading}
      >
        {buttonChildren}
      </Button>
    );
  }, [isLoading, isError, isConfigured]);

  const handleFetchResources = async () => {
    setIsLoading(true);

    try {
      const result: JiraResourceData = await getAccessibleResources();
      setResources(result);
      setIsError(false);
      removeEventListener('storage', eventListenerMethod);
    } catch (error) {
      setResources(null);
      setIsError(true);
    }

    setIsLoading(false);
  };

  const handleRevokeAccess = () => {
    revokeAccess();
    window.open('https://id.atlassian.com/manage-profile/apps', '_blank');
  };

  const copyTokenLink = isDev ? (
    <span style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(accessToken ?? '')}>
      <CopyIcon />
    </span>
  ) : null;

  const connectSuccessBlock = (
    <ConnectWrapper key='success-notice'>
      <SuccessIcon />
      <p>connected to {resources?.name} {copyTokenLink}</p>
    </ConnectWrapper>
  );

  const connectInfoBlock = (
    <NoticeWrapper>
      <p>
        By connecting to Jira, you authorize pointy poker to view and modify
        issues on your behalf. Your credentials are only stored locally and are
        only used to communicate with Jira. The only ticket data stored in the
        cloud is the ticket title, points, and the ticket number. {'<--'} Copy TBD
      </p>
    </NoticeWrapper>
  );

  const disconnectBlock = (
    <DisconnectInfoWrapper key="disconnect-info">
      <p>
        The following revokes access to Jira by clearing all local token data
        and navigating you to manage your connected Atlassian apps:&nbsp;&nbsp;
        <RevokeLink
          onClick={handleRevokeAccess}
          aria-label='Revoke access to Jira'
        >
          Revoke Access
          <LinkIcon />
        </RevokeLink>
      </p>
    </DisconnectInfoWrapper>
  );

  useEffect(() => {
    if (isConfigured) {
      handleFetchResources();
    }
  }, [ isConfigured ]);

  return (
    <IntegrationCard
      button={button}
      icon={<JiraIcon />}
      isActive={isConfigured}
      title="Jira"
      subtitle="View issues and assign points"
    >
      {connectInfoBlock}
      {isConfigured && resources && [
        connectSuccessBlock,
        <Separator key='separator-1' />,
        <p key="setup-message">
          Every Jira instance is different, so some extra configuration is
          necessary to make things work as ✨expected✨.
        </p>,
        (
          <Wrapper key='integration-setup'>
            <DefaultBoardSection />
            <PointFieldSection />
          </Wrapper>
        ),
        <Separator key='separator-2' />,
        disconnectBlock,
      ]}
    </IntegrationCard>
  );
};

export default JiraIntegrationCard;
