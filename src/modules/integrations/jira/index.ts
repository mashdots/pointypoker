import { useCallback } from 'react';

import { ATLASSIAN_URL, buildUrl, JIRA_SUBDOMAINS, URL_ACTIONS } from './utils';
import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';
import useStore from '@utils/store';
import createApiClient, { getJiraApiClient } from '@utils/axios';
import { blobToBase64 } from '@utils/room';

import {
  InitialAuth,
  JiraAuthData,
  JiraAuthPayload,
  JiraBoardConfig,
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
  const { access, isConnected, isConfigured, isExpired, resources, userId, setAccess } = useStore(({ preferences, setPreferences }) => {
    const { jiraAccess, jiraResources, jiraPreferences } = preferences;
    return {
      access: jiraAccess,
      resources: jiraResources,
      isConnected: !!jiraAccess && !!jiraResources,
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
    const path = buildUrl(URL_ACTIONS.GET_BOARDS, { resourceId: resources?.id });

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

  const getBoardConfiguration = async (boardId: string | number) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = buildUrl(URL_ACTIONS.GET_BOARD_CONFIGURATION, { resourceId: resources?.id, boardId });

    return client(
      {
        method: 'GET',
        url: path,
      },
    )
      .then((res): JiraBoardConfig => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getIssueFields = async () => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = buildUrl(URL_ACTIONS.GET_FIELDS, { resourceId: resources?.id });

    return client(
      {
        method: 'GET',
        url: path,
        params: {
          orderBy: 'name',
        },
      },
    )
      .then((res): JiraFieldPayload[] => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getSprintsForBoard = async (boardId: string | number, startAt = 0) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = buildUrl(URL_ACTIONS.GET_SPRINTS, { resourceId: resources?.id, boardId });

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
    const path = buildUrl(URL_ACTIONS.GET_ISSUES_NO_JQL, { resourceId: resources?.id, boardId });

    const fields = ['id', 'key', 'sprint', 'summary', 'issuetype', 'components', 'team'];
    let jql = 'Sprint IN futureSprints() AND resolution IS EMPTY';

    if (pointField) {
      jql += ` AND ${ pointField.name } = EMPTY`;
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
    const path = buildUrl(URL_ACTIONS.ISSUE, { resourceId: resources?.id, issueId: key });

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

  const getAvatars = async (avatarData: { [key: string]: number }) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const promises = Object.entries(avatarData).map(([issueType, avatarId]) => {
      const path = buildUrl(URL_ACTIONS.GET_AVATAR, { resourceId: resources?.id, avatarId });

      return client(
        {
          method: 'GET',
          url: path,
          responseType: 'blob',
          params: {
            size: 'large',
          },
        },
      )
        .then(async (res) => {
          const base64Data = await blobToBase64(res.data);
          return { blobData: base64Data, contentType: res.data.type };
        })
        .then((data) => ({
          [ issueType ]: { ...data },
        }))
        .catch((error) => {
          throw new Error(error);
        });
    });

    // Combine all promises into a single object
    return Promise.all(promises)
      .then(
        (results) => results.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      );
  };

  const getPointFieldFromBoardId = async (boardId: number) => {
    try {
      const boardConfig = await getBoardConfiguration(boardId);
      const issueFields = await getIssueFields();
      const estimationField = issueFields.find((field) => field.id === boardConfig.estimation.field.fieldId);

      if (estimationField) {
        return ({
          id: estimationField.id,
          name: estimationField.name,
        });
      }
    } catch (error) {
      console.error('WHOOPS', error);
    }
  };

  const writePointValue = async (issue: string, value: number, fieldId: string) => {
    const accessToken = await getJiraAccessToken();
    const client = getJiraApiClient(API_URL, accessToken);
    const path = buildUrl(URL_ACTIONS.ISSUE, { resourceId: resources?.id, issueId: issue });

    return client(
      {
        method: 'PUT',
        url: path,
        data: {
          fields: {
            [ fieldId ]: value,
          },
        },
      },
    )
      .then((res) => res.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  return {
    buildJiraUrl,
    isConnected,
    isConfigured,
    jiraAccessibleResources: resources,
    launchJiraOAuth,
    getAccessTokenFromApi,
    getAccessibleResources,
    getAvatars,
    getBoards,
    getBoardConfiguration,
    getIssueFields,
    getIssuesForBoard,
    getIssueDetail,
    getPointFieldFromBoardId,
    getSprintsForBoard,
    writePointValue,
  };
};

export default useJira;
