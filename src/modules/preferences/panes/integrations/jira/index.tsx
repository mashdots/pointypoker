import {
  useMemo,
  useState,
  JSX,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import { Button } from '@components/common';
import { useJira } from '@modules/integrations';
import { Separator } from '@modules/preferences/panes/common';
import DefaultBoardSection from '@modules/preferences/panes/integrations/jira/defaultBoardSection';
import { useAuthorizedUser } from '@modules/user';
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


const TRUSTED_ORIGINS = ['http://localhost:5173', 'https://pointypoker.dev'];


const JiraIntegrationCard = () => {
  const redirectWindowRef = useRef<Window | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { userId } = useAuthorizedUser();
  const {
    isConfigured,
    accessToken,
    resources,
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
  }));

  const {
    isConnected,
    launchJiraOAuth,
  } = useJira();
  const { syncPrefsToStore } = usePreferenceSync();

  /**
   * Listens for messages from the Jira OAuth redirect window. Validates the
   * origin and userId before syncing preferences and closing the window. These
   * extra checks ensure we're executing based on specific payloads from known
   * sources.
   */
  const eventListener = useCallback((e: MessageEvent) => {
    const { data, origin } = e;
    if (!TRUSTED_ORIGINS.includes(origin)) {
      console.warn('Rejected message from untrusted origin:', origin);
      return;
    }

    if (data?.userId && data?.userId !== userId) {
      console.warn('Rejected message for different user:', data?.userId);
      return;
    }

    if (data?.type === 'jiraAuthSuccess') {
      syncPrefsToStore();
      setIsLoading(false);
      setIsError(false);
      setTimeout(() => {
        redirectWindowRef.current?.close();
      }, 2000);
    }
  }, [userId, syncPrefsToStore] );


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
          redirectWindowRef.current = launchJiraOAuth() ?? null;

          if (redirectWindowRef.current) {
            window.addEventListener('message', eventListener);
          }
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
    eventListener,
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
    if (isConfigured && resources) {
      window.removeEventListener('message', eventListener);
    }

    return () => {
      window.removeEventListener('message', eventListener);
    };
  }, [
    eventListener,
    isConfigured,
    resources,
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
