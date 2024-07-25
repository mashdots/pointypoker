import { useCallback, useState } from 'react';

import { ATLASSIAN_URL, buildUrl, JIRA_SUBDOMAINS, URL_ACTIONS } from './utils';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';
import useStore from '@utils/store';
import createApiClient from '@utils/axios';
import { AxiosInstance } from 'axios';

type InitialAuth = {
  code: string;
  redirect_uri: string;
}

type RefreshAuth = {
  refresh_token: string;
}

type JiraAuthPayload = {
  grant_type: string;
  client_id: string;
  client_secret: string;
} & (InitialAuth | RefreshAuth);

export type JiraBoardPayloadValue = {
  id: number;
  name: string;
  self: string;
}

export type JiraBoardPayload = {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  total: number;
  values: JiraBoardPayloadValue[];
}

export type JiraBoard = {
  id: number;
  name: string;
  apiUrl: string;
}

export type JiraAuthData = {
  access_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

export type JiraResourceData = {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}

export type JiraPreferences = {
  defaultBoard: JiraBoardPayloadValue | null;
}

/**
 * Jira service
 *
 * Methods:
 * - Connect to Jira
 *   - Get get auth code from redirect
 *   - Get access token in redirect page
 * - Get issues from epic
 * - Get issues from sprint
 * - Get issue detail
 * - Assign points to issue
 * - Batch assign points to issues
 */

const useJira = () => {
  const [apiClient, setApiClient] = useState<AxiosInstance | null>(null);
  const { access, resources, userId, isExpired, setAccess } = useStore(({ preferences, setPreferences }) => ({
    access: preferences?.jiraAccess,
    resources: preferences?.jiraResources,
    isExpired: Date.now() >= (preferences?.jiraAccess?.expires_at ?? 0),
    setAccess: (access: JiraAuthData) => setPreferences('jiraAccess', access),
    userId: preferences?.user?.id,
  }));

  /**
   * Auth methods
   */

  /**
   * Kicks off the OAuth flow for Jira by opening a new window to JIRA's OAuth page
   */
  const launchJiraOAuth = () => {
    const options = {
      toolbar: 'no',
      location: 'no',
      status: 'no',
      menubar: 'no',
      scrollbars: 'yes',
      resizable: 'yes',
      width: 800,
      height: 1000,
    };

    const optionsString = Object.entries(options).map(([key, value]) => `${key}=${value}`).join(', ');

    const url = buildUrl(URL_ACTIONS.AUTHORIZE, { userId });

    window.open(url, 'targetWindow', optionsString);
  };

  /**
   * Calls the Jira auth API to get an access token.
   *
   * @param authorization the authorization or refresh code to get the access token
   * @param isRefresh whether or not we are passing a refresh token. Required by the Jira API.
   * @returns Axios API Client
   */
  const getAccessTokenFromApi = (authorization: string, isRefresh = false) => {
    const url = `https://${JIRA_SUBDOMAINS.AUTH}.${ATLASSIAN_URL}`;
    const data: Partial<JiraAuthPayload> = {
      grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
      client_id: import.meta.env.VITE_JIRA_CLIENT_ID,
      client_secret: import.meta.env.VITE_JIRA_CLIENT_SECRET,
    };

    if (!isRefresh) {
      (data as InitialAuth).code = authorization;
      (data as InitialAuth).redirect_uri = `${ window.location.origin }${ JIRA_REDIRECT_PATH }`;
    } else {
      (data as RefreshAuth).refresh_token = authorization;
    }

    const accessClient = createApiClient({
      baseURL: url,
      headers: { 'Content-Type': 'application/json' },
    });

    return accessClient
      .post(`/${URL_ACTIONS.OAUTH}`, data)
      .then((res) => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getJiraAccessToken = useCallback(async (forceRefresh?: boolean) => {
    if (access) {
      if (!isExpired && !forceRefresh) {
        return access.access_token;
      } else {
        const response = await getAccessTokenFromApi(access.refresh_token, true);
        response.expires_at = Date.now() + response.expires_in * 1000;
        setAccess(response);
        return response.access_token;
      }
    }
  }, [access, isExpired]);

  const getAccessibleResources = useCallback(async () => {
    if (access) {
      const accessToken = await getJiraAccessToken(true);
      const url = `https://${ JIRA_SUBDOMAINS.API }.${ ATLASSIAN_URL }`;
      const client = createApiClient({
        baseURL: url,
        headers: {
          Authorization: `Bearer ${ accessToken }`,
          Accept: 'application/json',
        },
      });

      return client
        .get(`/${URL_ACTIONS.GET_RESOURCES}`)
        .then((res) => {
          if (res.data.length === 0) {
            throw new Error('No resources found');
          }
          return res.data[ 0 ];
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [access]);

  /**
   * Query methods
  */

  const getAllBoards = async (startAt = 0, maxResults = 25) => {
    const accessToken = await getJiraAccessToken(true);
    const url = `https://${ JIRA_SUBDOMAINS.API }.${ ATLASSIAN_URL }`;
    const client = createApiClient({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${ accessToken }`,
        Accept: 'application/json',
      },
    });
    const path = `/${URL_ACTIONS.JIRA_API_PREFIX}${resources?.id}/${URL_ACTIONS.BOARD_PATH}`;

    return client(
      {
        method: 'GET',
        url: path,
        params: {
          startAt,
          maxResults,
          orderBy: 'name',
        },
      },
    )
      .then((res): JiraBoardPayload => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getIssuesFromEpic = () => {
    // Get issues from epic
  };

  const getIssuesFromSprint = () => {
    // Get issues from sprint
  };

  const getIssueDetail = () => {
    // Get issue detail
  };

  const assignPointsToIssue = () => {
    // Assign points to issue
  };

  const batchAssignPointsToIssues = () => {
    // Batch assign points to issues
  };

  return {
    jiraAccessibleResources: resources,
    launchJiraOAuth,
    getAccessTokenFromApi,
    getAccessibleResources,
    getAllBoards,
    getIssuesFromEpic,
    getIssuesFromSprint,
    getIssueDetail,
    assignPointsToIssue,
    batchAssignPointsToIssues,
  };
};

export default useJira;
