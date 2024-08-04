export type InitialAuth = {
  code: string;
  redirect_uri: string;
}

export type RefreshAuth = {
  refresh_token: string;
}

export type JiraAuthPayload = {
  grant_type: string;
  client_id: string;
  client_secret: string;
} & (InitialAuth | RefreshAuth);

export type JiraBoardPayloadValue = {
  id: number;
  name: string;
  self: string;
}

export type JiraFieldPayload = {
  id: string;
  name: string;
  clauseNames: string[];
  scope?: {
    type: string;
    project?: {
      id: string;
    }
  },
  schema: {
    type: string;
  }
}

export type JiraIssueSearchPayload = {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    [key: string]: any;
    sprint: JiraSprint;
  }
}

export type JiraField = {
  id: string;
  jqlFilter: string;
  name: string;
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
  defaultBoard?: JiraBoardPayloadValue | null;
  pointField?: JiraField | null;
}

export type JiraSprint = {
  id: number,
  self: string,
  state: string,
  name: string,
  originBoardId: number,
  goal: string
}

export type JiraSprintWithIssues = JiraSprint & {
  issues?: JiraIssueSearchPayload[];
}

export type BasePayload = {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  total: number;
}

export type JiraDataPayload = BasePayload & {
  values: JiraBoardPayloadValue[] | JiraSprint[]
}

export type JiraIssuesDataPayload = BasePayload & {
  issues: JiraIssueSearchPayload[]
}
