import React, { useEffect, useMemo, useState } from 'react';

import IntegrationCard from '../integrationCard';
import usePreferenceSync from '../../../hooks';
import { Button } from '@components/common';
import { useJira } from '@modules/integrations';
import DefaultBoardSection from '@modules/preferences/panes/integrations/jira/defaultBoardSection';
import { Separator } from '@modules/preferences/panes/common';
import useStore from '@utils/store';
import { isDev } from '@utils';
import { JiraResourceData } from '@modules/integrations/jira/types';
import {
  ConnectWrapper,
  CopyIcon,
  DisconnectInfoWrapper,
  InfoLink,
  JiraIcon,
  LinkIcon,
  LoadingIcon,
  NoticeWrapper,
  RevokeLink,
  SuccessIcon,
  Wrapper,
} from './components';

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
      setPreferences('jiraPreferences', null);
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
        width='quarter'
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

  const connectInfoBlock = !isConfigured ? (
    <NoticeWrapper>
      <p>
        When you connect pointy poker to Jira, Oauth tokens are
        stored locally and are only used to communicate with Jira. Some ticket
        data is stored in the database for syncing between participants,
        including the title, points, sprint information, and the ticket number.
        For information on how your data is used, visit the&nbsp;
        <InfoLink
          to='/privacy'
          aria-label='Privacy policy'
          target='_blank'
        >
          privacy policy
          <LinkIcon />
        </InfoLink>.
      </p>
    </NoticeWrapper>
  ) : null;

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
        (
          <Wrapper key='integration-setup'>
            <DefaultBoardSection />
          </Wrapper>
        ),
        <Separator key='separator-2' />,
        disconnectBlock,
      ]}
    </IntegrationCard>
  );
};

export default JiraIntegrationCard;
