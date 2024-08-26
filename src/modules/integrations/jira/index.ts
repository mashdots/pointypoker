import { useCallback } from 'react';

import { ATLASSIAN_URL, buildUrl, JIRA_SUBDOMAINS, URL_ACTIONS } from './utils';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';
import useStore from '@utils/store';
import createApiClient, { getJiraApiClient } from '@utils/axios';
import {
  InitialAuth,
  JiraAuthData,
  JiraAuthPayload,
  JiraDataPayload,
  JiraField,
  JiraFieldPayload,
  JiraIssuesDataPayload,
  JiraIssueSearchPayload,
  RefreshAuth,
} from './types';

/**
 * Jira service
 *
 * Methods:
 * - Get issue detail
 * - Assign points to issue
 * - Batch assign points to issues
 */

const API_URL = `https://${ JIRA_SUBDOMAINS.API }.${ ATLASSIAN_URL }`;

const useJira = () => {
  const { access, isConfigured, isExpired, resources, userId, setAccess } = useStore(({ preferences, setPreferences }) => {
    const { jiraAccess, jiraResources, jiraPreferences } = preferences;
    return {
      access: jiraAccess,
      resources: jiraResources,
      isConfigured: !!jiraAccess && !!jiraResources && !!jiraPreferences?.defaultBoard,
      isExpired: Date.now() >= (preferences?.jiraAccess?.expires_at ?? 0),
      setAccess: (access: JiraAuthData) => setPreferences('jiraAccess', access),
      userId: preferences?.user?.id,
    };
  });

  const buildJiraUrl = (ticketKey: string) => `${resources?.url ?? ''}/browse/${ticketKey}`;

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
      const client = getJiraApiClient(API_URL, accessToken);

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

  const getBoards = async (maxResults = 25, name?: string) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = `/${ URL_ACTIONS.JIRA_API_PREFIX }${ resources?.id }/${ URL_ACTIONS.AGILE_API_PREFIX }${ URL_ACTIONS.BOARD_PATH }`;

    return client(
      {
        method: 'GET',
        url: path,
        params: {
          maxResults,
          orderBy: 'name',
          name,
        },
      },
    )
      .then((res): JiraDataPayload => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getIssueFields = async () => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = `/${URL_ACTIONS.JIRA_API_PREFIX}${resources?.id}/${URL_ACTIONS.FIELD_PATH}`;

    return client(
      {
        method: 'GET',
        url: path,
        params: {
          orderBy: 'name',
        },
      },
    )
      .then((res): { values: JiraFieldPayload[] } => ({ values: res.data }))
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getSprintsForBoard = async (boardId: string | number, startAt = 0) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = `/${ URL_ACTIONS.JIRA_API_PREFIX }${ resources?.id }/${ URL_ACTIONS.AGILE_API_PREFIX }${ URL_ACTIONS.BOARD_PATH }/${ boardId}/${ URL_ACTIONS.BOARD_SPRINT_PATH }`;

    return client(
      {
        method: 'GET',
        url: path,
        params: {
          state: 'future',
          startAt,
        },
      },
    )
      .then((res): JiraDataPayload => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getIssuesForBoard = async (boardId: string | number, pointField?: JiraField | null, startAt = 0) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = `/${ URL_ACTIONS.JIRA_API_PREFIX }${ resources?.id }/${ URL_ACTIONS.AGILE_API_PREFIX }${ URL_ACTIONS.BOARD_PATH }/${ boardId }/${ URL_ACTIONS.ISSUE_PATH }`;

    const fields = ['id', 'key', 'sprint', 'summary', 'issuetype', 'components', 'team'];
    let jql = 'Sprint IN futureSprints() AND resolution IS EMPTY';

    if (pointField) {
      jql += ` AND ${ pointField.jqlFilter } = EMPTY`;
      fields.push(pointField.id);
    }

    return client(
      {
        method: 'GET',
        url: path,
        params: {
          jql,
          maxResults: 100,
          startAt,
          fields: fields.join(','),
        },
      },
    )
      .then((res): JiraIssuesDataPayload => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getIssueDetail = async (key: string, pointField?: JiraField | null) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = `/${ URL_ACTIONS.JIRA_API_PREFIX }${ resources?.id }/${ URL_ACTIONS.AGILE_API_PREFIX }${ URL_ACTIONS.ISSUE_PATH }/${ key }`;

    const fields = [ 'id', 'key', 'sprint', 'summary', 'issuetype', 'components', 'team' ];

    if (pointField) {
      fields.push(pointField.id);
    }

    return client(
      {
        method: 'GET',
        url: path,
        params: {
          fields: fields.join(','),
        },
      },
    )
      .then((res): JiraIssueSearchPayload => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const writePointValue = async (issue: string, value: number) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = `/${ URL_ACTIONS.JIRA_API_PREFIX }${ resources?.id }/${ URL_ACTIONS.AGILE_API_PREFIX }${ URL_ACTIONS.ISSUE_PATH }/${ issue }/${ URL_ACTIONS.ESTIMATION_PATH }`;

    return client(
      {
        method: 'PUT',
        url: path,
        params: {
          value: value.toFixed(1).toString(),
        },
      },
    )
      .then((res): JiraIssueSearchPayload => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const batchWritePointValues = () => {
    // Batch assign points to issues
  };

  return {
    buildJiraUrl,
    isConfigured,
    jiraAccessibleResources: resources,
    launchJiraOAuth,
    getAccessTokenFromApi,
    getAccessibleResources,
    getBoards,
    getIssueFields,
    getIssuesForBoard,
    getIssueDetail,
    getSprintsForBoard,
    writePointValue,
    batchWritePointValues,
  };
};

export default useJira;
