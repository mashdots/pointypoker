import { useCallback } from 'react';

import {
  JiraAuthData,
  JiraField,
  JiraResourceData,
} from '@modules/integrations/jira/types';
import { ROUTE_PATHS } from '@routes/constants';
import useStore from '@utils/store';
import { useJiraContext } from '@v4/providers/JiraProvider';

import { exchangeToken } from '../providers/jira.utils';

const ATLASSIAN_API_URL = 'https://api.atlassian.com';

const useJira = () => {
  const {
    client,
    isConnected,
    isConfigured,
  } = useJiraContext();
  const {
    jiraResources,
    userId,
    setJiraAccess,
    setJiraResources,
  } = useStore(({ preferences, setPreference }) => ({
    jiraResources: preferences.jiraResources,
    setJiraAccess: (access: JiraAuthData | null) => setPreference('jiraAccess', access),
    setJiraResources: (resources: JiraResourceData | null) => setPreference('jiraResources', resources),
    userId: preferences.user?.id ?? null,
  }));

  const buildJiraUrl = useCallback((ticketKey: string) => {
    const base = jiraResources?.url ?? '';
    return `${base}/browse/${ticketKey}`;
  }, [jiraResources]);

  /**
   * Auth
   */

  const launchOAuth = useCallback(() => {
    if (!userId) return;

    const params = new URLSearchParams({
      audience: 'api.atlassian.com',
      client_id: import.meta.env.VITE_JIRA_CLIENT_ID,
      prompt: 'consent',
      redirect_uri: `${window.location.origin}${ROUTE_PATHS.JIRA_REDIRECT}`,
      response_type: 'code',
      scope: [
        'offline_access',
        'read:board-scope.admin:jira-software',
        'read:board-scope:jira-software',
        'read:issue:jira-software',
        'read:issue-details:jira',
        'read:project:jira',
        'read:sprint:jira-software',
        'read:jira-work',
        'write:jira-work',
        'manage:jira-configuration',
      ].join(' '),
      state: userId,
    });

    const features = 'width=800,height=1000,scrollbars=yes,resizable=yes';
    window.open(
      `https://auth.atlassian.com/authorize?${params}`,
      'targetWindow',
      features,
    );
  }, [userId]);

  const connectWithCode = useCallback(async (code: string) => {
    const tokenData = await exchangeToken(code, false);

    // Fetch accessible resources before persisting anything to avoid half-connected state
    const resourcesUrl = `${ATLASSIAN_API_URL}/oauth/token/accessible-resources`;
    const response = await fetch(resourcesUrl, { headers: { Authorization: `Bearer ${tokenData.access_token}` } });

    if (!response.ok) throw new Error('Failed to fetch accessible resources');

    const resources = await response.json();
    if (!resources.length) throw new Error('No Jira resources found');

    // Only persist once both token and resources are validated
    setJiraAccess(tokenData);
    setJiraResources(resources[0]);
  }, [setJiraAccess, setJiraResources]);

  const revokeAccess = useCallback(() => {
    setJiraAccess(null);
    setJiraResources(null);
  }, [setJiraAccess, setJiraResources]);

  /**
   * Data fetching
   */

  const getBoards = useCallback(async (maxResults = 25, name?: string) => {
    if (!client) throw new Error('Jira client not initialized');

    return client.agile.board.getAllBoards({
      maxResults,
      name,
    });
  }, [client]);

  const getBoardConfiguration = useCallback(async (boardId: number) => {
    if (!client) throw new Error('Jira client not initialized');

    return client.agile.board.getConfiguration({ boardId });
  }, [client]);

  const getSprintsForBoard = useCallback(async (boardId: number, startAt = 0) => {
    if (!client) throw new Error('Jira client not initialized');

    return client.agile.board.getAllSprints({
      boardId,
      startAt,
      state: 'future',
    });
  }, [client]);

  const getIssuesForBoard = useCallback(async (
    boardId: number,
    pointField?: JiraField | null,
    startAt = 0,
  ) => {
    if (!client) throw new Error('Jira client not initialized');

    const fields = [
      'id',
      'key',
      'sprint',
      'summary',
      'issuetype',
      'components',
      'team',
    ];
    let jql = 'Sprint IN futureSprints() AND resolution IS EMPTY';

    if (pointField) {
      jql += ` AND ${pointField.name} = EMPTY`;
      fields.push(pointField.id);
    }

    return client.agile.board.getIssuesForBoard({
      boardId,
      fields,
      jql,
      maxResults: 100,
      startAt,
    });
  }, [client]);

  const getIssueDetail = useCallback(async (key: string, pointField?: JiraField | null) => {
    if (!client) throw new Error('Jira client not initialized');

    const fields = [
      'id',
      'key',
      'sprint',
      'summary',
      'issuetype',
      'components',
      'team',
    ];
    if (pointField) fields.push(pointField.id);

    return client.v3.issues.getIssue({
      fields,
      issueIdOrKey: key,
    });
  }, [client]);

  const getIssueFields = useCallback(async () => {
    if (!client) throw new Error('Jira client not initialized');

    return client.v3.fields.getFields();
  }, [client]);

  const getPointFieldFromBoardId = useCallback(async (boardId: number): Promise<JiraField | undefined> => {
    const [config, fields] = await Promise.all([getBoardConfiguration(boardId), getIssueFields()]);

    const estimationFieldId = config.estimation?.field?.fieldId;
    type FieldLike = {
      id: string;
      name: string;
    };
    const match = (fields as FieldLike[]).find((f) => f.id === estimationFieldId);

    if (!match) return undefined;

    const result: JiraField = {
      id: match.id,
      name: match.name,
    };
    return result;
  }, [getBoardConfiguration, getIssueFields]);

  /**
   * Write
   */

  const writePointValue = useCallback(async (
    issueKey: string,
    value: number,
    fieldId: string,
  ) => {
    if (!client) throw new Error('Jira client not initialized');

    return client.v3.issues.editIssue({
      fields: { [fieldId]: value },
      issueIdOrKey: issueKey,
    });
  }, [client]);

  return {
    buildJiraUrl,
    connectWithCode,
    getBoardConfiguration,
    getBoards,
    getIssueDetail,
    getIssueFields,
    getIssuesForBoard,
    getPointFieldFromBoardId,
    getSprintsForBoard,
    isConfigured,
    isConnected,
    launchOAuth,
    revokeAccess,
    writePointValue,
  };
};

export default useJira;
