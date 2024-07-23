import { JIRA_REDIRECT_PATH } from '@routes/jiraRedirect';

export enum URL_ACTIONS {
  AUTHORIZE = 'authorize',
  OAUTH = 'oauth/token',
  GET_RESOURCES = 'oauth/token/accessible-resources',
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
      'read:issue:jira',
      'write:issue:jira',
      'read:issue:jira-software',
      'write:issue:jira-software',
      'read:epic:jira-software',
      'read:user:jira',
      'offline_access',
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
