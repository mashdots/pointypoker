import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  JSX,
} from 'react';

import { Button } from '@components/common';
import { useJira } from '@modules/integrations';
import { JiraResourceData } from '@modules/integrations/jira/types';
import { Separator } from '@modules/preferences/panes/common';
import DefaultBoardSection from '@modules/preferences/panes/integrations/jira/defaultBoardSection';
import { isDev } from '@utils';
import useStore from '@utils/store';

import usePreferenceSync from '../../../hooks';
import IntegrationCard from '../integrationCard';
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
  } = useStore(({ preferences, setPreference }) => ({
    accessToken: preferences?.jiraAccess?.access_token,
    isConfigured: !!preferences?.jiraAccess,
    resources: preferences?.jiraResources,
    revokeAccess: () => {
      setPreference('jiraAccess', null);
      setPreference('jiraResources', null);
      setPreference('jiraPreferences', null);
    },
    setResources: (resources: JiraResourceData | null) => setPreference('jiraResources', resources),
  }));
  const {
    isConnected,
    launchJiraOAuth,
    getAccessibleResources,
  } = useJira();
  const { syncPrefsToStore } = usePreferenceSync();

  const eventListenerMethod = useCallback((event: StorageEvent) => {
    if (event.key === 'jiraAccess') {
      syncPrefsToStore();
    }
  }, [syncPrefsToStore]);

  const button = useMemo(() => {
    if (isConfigured && resources) {
      return null;
    }

    let buttonChildren: string | JSX.Element = 'Connect';
    let buttonVariation = 'info';

    if (isError) {
      buttonChildren = isConnected ? 'Reconnect' : 'Retry connection';
      buttonVariation = isConnected ? 'warning' : 'error';
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
        disabled={isLoading}
        refresh
      >
        {buttonChildren}
      </Button>
    );
  }, [
    isConfigured,
    resources,
    isError,
    isLoading,
    isConnected,
    launchJiraOAuth,
    eventListenerMethod,
  ]);


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

  const connectInfoBlock = !isConnected ? (
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
    const handleFetchResources = async () => {
      setIsLoading(true);

      try {
        const result: JiraResourceData = await getAccessibleResources();
        setResources(result);
        setIsError(false);
        removeEventListener('storage', eventListenerMethod);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setResources(null);
        setIsError(true);
      }

      setIsLoading(false);
    };

    if (isConfigured && !resources) {
      handleFetchResources();
    }
  }, [
    isConfigured,
    resources,
    getAccessibleResources,
    setResources,
    eventListenerMethod,
  ]);

  return (
    <IntegrationCard
      button={button}
      icon={<JiraIcon />}
      isActive={isConfigured}
      title="Jira"
      subtitle="View issues and assign points"
    >
      {connectInfoBlock}
      {isConnected && [
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
