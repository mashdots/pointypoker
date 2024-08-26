import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';

export enum URL_ACTIONS {
  AUTHORIZE = 'authorize',
  OAUTH = 'oauth/token',
  GET_RESOURCES = 'oauth/token/accessible-resources',
  JIRA_API_PREFIX = 'ex/jira/',
  AGILE_API_PREFIX = 'rest/agile/1.0/',
  FIELD_PATH = 'rest/api/3/field',
  BOARD_PATH = 'board',
  ISSUE_PATH = 'issue',
  ESTIMATION_PATH = 'estimation',
  BOARD_SPRINT_PATH = 'sprint',
}

type UrlOptions = {
  userId?: string;
}

export enum JIRA_SUBDOMAINS {
  API = 'api',
  AUTH = 'auth',
}

export const ATLASSIAN_URL = 'atlassian.com';

const buildUrl = (action: URL_ACTIONS, options?: UrlOptions) => {
  let url = `https://${JIRA_SUBDOMAINS.AUTH}.${ATLASSIAN_URL}`;

  switch (action) {
  case URL_ACTIONS.AUTHORIZE: {
    if (!options?.userId) {
      throw new Error('User ID is required for this action');
    }

    const scopes = [
      'offline_access', // Requests a refresh token with auth
      'read:avatar:jira', // do we need?
      'read:board-scope.admin:jira-software', // do we need?
      'read:board-scope:jira-software',
      'read:field:jira',
      'read:issue:jira',
      'read:issue:jira-software',
      'read:issue-details:jira',
      'read:jira-work',
      'read:jql:jira',
      'read:project:jira',
      'read:project-category:jira',
      'read:sprint:jira-software',
      'read:field-configuration:jira',
      'write:issue:jira-software',
    ];

    const params = new URLSearchParams({
      audience: `${JIRA_SUBDOMAINS.API}.${ATLASSIAN_URL}`,
      client_id: import.meta.env.VITE_JIRA_CLIENT_ID,
      scope: scopes.join(' '),
      redirect_uri: `${window.location.origin}${JIRA_REDIRECT_PATH}`,
      state: options.userId,
      response_type: 'code',
      prompt: 'consent',
    });

    url += `/${ URL_ACTIONS.AUTHORIZE }?${params.toString()}`;
    break;
  }
  case URL_ACTIONS.OAUTH:
    url += `/${ URL_ACTIONS.OAUTH }`;
    break;
  case URL_ACTIONS.GET_RESOURCES:
    url += `/${ URL_ACTIONS.GET_RESOURCES }`;
    break;
  default:
    return '';
  }

  return url;
};

export {
  buildUrl,
};
