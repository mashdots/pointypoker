import { useCallback, useMemo } from 'react';

import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

import { JiraTicket } from '@modules/integrations/jira/types';
import { isVoteCast } from '@modules/room/utils';
import useStore from '@utils/store';
import { calculate, CalculationResult } from '@v4/utils/calculations';
import Estimation from '@yappy/types/estimation';
import Issue from '@yappy/types/issue';
import { Participant } from '@yappy/types/user';

import useJira from './useJira';
import useRoom from './useRoom';
import useStorage from './useStorage';

const SESSIONS_COLLECTION = 'sessions';

type VoteEntry = {
  estimation: Estimation | null;
  hasVoted: boolean;
  participant: Participant;
};

const useTickets = () => {
  const storage = useStorage();
  const { session, sessionName } = useRoom();
  const { writePointValue } = useJira();

  const user = useStore((state) => state.preferences.user ?? null);

  const currentIssue: Issue | null = useMemo(() => {
    if (!session?.currentIssue || !session.issues) return null;
    return session.issues[session.currentIssue] ?? null;
  }, [session]);

  const upcomingIssues: Issue[] = useMemo(() => {
    if (!session?.upcoming || !session.issues) return [];
    return session.upcoming.map((id) => session.issues[id]).filter(Boolean);
  }, [session]);

  const historyIssues: Issue[] = useMemo(() => {
    if (!session?.history || !session.issues) return [];
    return session.history.map((id) => session.issues[id]).filter(Boolean);
  }, [session]);

  const nextIssue: Issue | null = useMemo(() => upcomingIssues[0] ?? null, [upcomingIssues]);

  const voteData: VoteEntry[] = useMemo(() => {
    if (!session?.participants) return [];

    const participants = Object.values(session.participants)
      .filter((p) => !p.inactive)
      .sort((a, b) => a.joinedAt - b.joinedAt);

    // Put self first
    const selfIndex = participants.findIndex((p) => p.id === user?.id);
    if (selfIndex > 0) {
      const [self] = participants.splice(selfIndex, 1);
      participants.unshift(self);
    }

    return participants.map((participant) => {
      const estimation = session.estimations?.[participant.id] ?? null;
      return {
        estimation,
        hasVoted: isVoteCast(estimation?.value),
        participant,
      };
    });
  }, [session, user]);

  const areAllVotesCast = useMemo(() => {
    if (!session?.participants) return false;

    return Object.values(session.participants)
      .filter((p) => !p.inactive && !p.isObserver && p.consecutiveMisses < 3)
      .every((p) => isVoteCast(session.estimations?.[p.id]?.value));
  }, [session]);

  const shouldShowVotes = !!currentIssue?.votingEndedAt;

  const calculation: CalculationResult = useMemo(() => {
    if (!currentIssue?.votingEndedAt) {
      return {
        average: null,
        distribution: {},
        suggestedValue: null,
      };
    }

    const votes: Record<string, string | number> = {};
    if (session?.estimations) {
      Object.values(session.estimations)
        .filter((e) => e.issueID === currentIssue.id)
        .forEach((e) => { votes[e.userId] = e.value; });
    }

    return calculate({ votes });
  }, [session, currentIssue]);

  /**
   * Voting actions
   */

  const castVote = useCallback(async (value: string) => {
    if (!user || !sessionName || !currentIssue) return;

    const estimation: Estimation = {
      id: uuid(),
      issueID: currentIssue.id,
      timestamp: Timestamp.now(),
      userId: user.id,
      value,
    };

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { [`estimations.${user.id}`]: estimation },
    );
  }, [
    user,
    sessionName,
    currentIssue,
    storage,
  ]);

  const clearVote = useCallback(async () => {
    if (!user || !sessionName) return;
    await storage.removeField(
      SESSIONS_COLLECTION,
      sessionName,
      `estimations.${user.id}`,
    );
  }, [
    user,
    sessionName,
    storage,
  ]);

  const revealVotes = useCallback(async () => {
    if (!sessionName || !currentIssue) return;

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { [`issues.${currentIssue.id}.votingEndedAt`]: serverTimestamp() },
    );
  }, [
    sessionName,
    currentIssue,
    storage,
  ]);

  const setOverrideValue = useCallback(async (issueId: string, value: string | number) => {
    if (!sessionName) return;

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { [`issues.${issueId}.overrideValue`]: value },
    );
  }, [sessionName, storage]);

  /**
   * Issue lifecycle
   */

  const createIssue = useCallback(async (name: string) => {
    if (!user || !sessionName) return;

    const id = uuid();
    const newIssue: Issue = {
      createdAt: Timestamp.now(),
      creatorId: user.id,
      id,
      name,
      votingEndedAt: null,
    };

    const updates: Record<string, unknown> = { [`issues.${id}`]: newIssue };

    if (!session?.currentIssue) {
      updates['currentIssue'] = id;
    }

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      updates,
    );
  }, [
    user,
    sessionName,
    session,
    storage,
  ]);

  const advanceIssue = useCallback(async () => {
    if (!sessionName || !session || !currentIssue) return;

    const calculatedValue = calculation.suggestedValue ?? calculation.average ?? null;
    const updates: Record<string, unknown> = {
      currentIssue: nextIssue?.id ?? null,
      estimations: {},
      history: [...(session.history ?? []), currentIssue.id],
      [`issues.${currentIssue.id}.calculatedValue`]: calculatedValue,
      upcoming: (session.upcoming ?? []).filter((id) => id !== nextIssue?.id),
    };

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      updates,
    );
  }, [
    sessionName,
    session,
    currentIssue,
    nextIssue,
    calculation,
    storage,
  ]);

  const skipIssue = useCallback(async () => {
    if (!sessionName || !currentIssue) return;

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { [`issues.${currentIssue.id}.calculatedValue`]: 'skip' },
    );

    await advanceIssue();
  }, [
    sessionName,
    currentIssue,
    advanceIssue,
    storage,
  ]);

  /**
   * Queue management
   */

  const addToQueue = useCallback(async (issues: Issue[]) => {
    if (!sessionName || !session) return;

    const issueUpdates: Record<string, unknown> = {};
    issues.forEach((issue) => {
      issueUpdates[`issues.${issue.id}`] = issue;
    });

    const newUpcoming = [...(session.upcoming ?? []), ...issues.map((i) => i.id)];

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      {
        ...issueUpdates,
        upcoming: newUpcoming,
      },
    );
  }, [
    sessionName,
    session,
    storage,
  ]);

  const removeFromQueue = useCallback(async (issueId: string) => {
    if (!sessionName || !session) return;

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { upcoming: (session.upcoming ?? []).filter((id) => id !== issueId) },
    );
  }, [
    sessionName,
    session,
    storage,
  ]);

  const reorderQueue = useCallback(async (orderedIds: string[]) => {
    if (!sessionName) return;

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { upcoming: orderedIds },
    );
  }, [sessionName, storage]);

  const setCurrentIssue = useCallback(async (issueId: string) => {
    if (!sessionName) return;

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { currentIssue: issueId },
    );
  }, [sessionName, storage]);

  /**
   * Jira bridge
   */

  const importFromJira = useCallback(async (jiraTickets: JiraTicket[]) => {
    if (!user) return;

    const issues: Issue[] = jiraTickets.map((ticket) => ({
      createdAt: Timestamp.now(),
      creatorId: user.id,
      external: {
        persistedToRemote: false,
        source: 'jira',
        sprint: ticket.sprint,
        type: {
          ...ticket.type,
          icon: {
            contentType: ticket.type.icon.contentType,
            data: ticket.type.icon.blobData,
          },
        },
        url: ticket.url,
      },
      id: ticket.id,
      name: ticket.name ?? ticket.id,
      votingEndedAt: null,
    }));

    await addToQueue(issues);
  }, [user, addToQueue]);

  const syncToJira = useCallback(async (
    issueId: string,
    value: number,
    fieldId: string,
  ) => {
    if (!sessionName) return;

    const issue = session?.issues[issueId];
    if (!issue?.external) return;

    const ticketKey = issue.external.url.split('/browse/').pop() ?? '';
    await writePointValue(
      ticketKey,
      value,
      fieldId,
    );

    await storage.update(
      SESSIONS_COLLECTION,
      sessionName,
      { [`issues.${issueId}.external.persistedToRemote`]: true },
    );
  }, [
    sessionName,
    session,
    writePointValue,
    storage,
  ]);

  return {
    addToQueue,
    advanceIssue,
    areAllVotesCast,
    calculation,
    castVote,
    clearVote,
    createIssue,
    currentIssue,
    historyIssues,
    importFromJira,
    nextIssue,
    removeFromQueue,
    reorderQueue,
    revealVotes,
    setCurrentIssue,
    setOverrideValue,
    shouldShowVotes,
    skipIssue,
    syncToJira,
    upcomingIssues,
    voteData,
  };
};

export default useTickets;
