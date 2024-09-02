import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';

type UrlOptions = {
  userId?: string;
}

export const ATLASSIAN_URL = 'atlassian.com';

export enum URL_ACTIONS {
  AUTHORIZE = 'authorize',
  OAUTH = 'oauth/token',
  GET_RESOURCES = 'oauth/token/accessible-resources',
  JIRA_API_PREFIX = 'ex/jira/',
  AGILE_API_PREFIX = 'rest/agile/1.0/',
  API_2_PREFIX = 'rest/api/2/',
  FIELD_PATH = 'field',
  BOARD_PATH = 'board',
  ISSUE_PATH = 'issue',
  ESTIMATION_PATH = 'estimation',
  BOARD_SPRINT_PATH = 'sprint',
}

export enum JIRA_SUBDOMAINS {
  API = 'api',
  AUTH = 'auth',
}

const scopes = [
  'offline_access', // Requests a refresh token with auth
  'read:board-scope.admin:jira-software', // board config
  'read:board-scope:jira-software', // boards, board issues
  'read:issue:jira-software', // issue
  'read:issue-details:jira', // board issues
  'read:project:jira', // boards, board config, fields
  'read:sprint:jira-software', // board sprints
  'read:jira-work', // fields
  'write:jira-work', // issue update
];

const buildUrl = (action: URL_ACTIONS, options?: UrlOptions) => {
  let url = `https://${JIRA_SUBDOMAINS.AUTH}.${ATLASSIAN_URL}`;

  switch (action) {
  case URL_ACTIONS.AUTHORIZE: {
    if (!options?.userId) {
      throw new Error('User ID is required for this action');
    }

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
