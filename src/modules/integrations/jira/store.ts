import type { StateCreator } from 'zustand';

import { JiraIssueSearchPayload } from '@modules/integrations/jira/types';

export type JiraStore = {
  issueRepository: JiraIssueSearchPayload[];
  addIssueToRepository: (issue: JiraIssueSearchPayload) => void;
  addIssuesToRepository: (issues: JiraIssueSearchPayload[]) => void;
  getIssueFromRepository: (key: string) => JiraIssueSearchPayload | undefined;
  getIssuesFromRepository: () => JiraIssueSearchPayload[];
}

const jiraSlice: StateCreator<JiraStore> = (set, get) => ({
  issueRepository: [],
  addIssueToRepository: (issue) => set((state) => ({ issueRepository: [ ...state.issueRepository, issue ] })),
  addIssuesToRepository: (issues) => set((state) => ({ issueRepository: [ ...state.issueRepository, ...issues ] })),
  getIssueFromRepository: (key) => get().issueRepository.find((issue) => issue.key === key),
  getIssuesFromRepository: () => get().issueRepository,
});

export default jiraSlice;
