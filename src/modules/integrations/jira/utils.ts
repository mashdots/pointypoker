import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';

export enum URL_ACTIONS {
  AUTHORIZE = 'authorize',
  OAUTH = 'oauth/token',
  GET_RESOURCES = 'oauth/token/accessible-resources',
  JIRA_API_PREFIX = 'ex/jira/',
  BOARD_PATH = 'rest/agile/1.0/board',
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
      'offline_access',
      'read:me',
      'read:group:jira',
      'read:issue:jira',
      'write:issue:jira',
      'read:field:jira',
      'read:issue-details:jira',
      'read:user:jira',
      'read:project:jira',
      'read:board-scope:jira-software',
      'read:epic:jira-software',
      'read:issue:jira-software',
      'write:issue:jira-software',
      'read:sprint:jira-software',
      // 'read:user:jira',
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
