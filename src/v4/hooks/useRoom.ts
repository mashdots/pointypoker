import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { serverTimestamp, Timestamp } from 'firebase/firestore';

import generateRoomName from '@utils/room';
import useStore from '@utils/store';
import Session from '@yappy/types/session';
import { Participant } from '@yappy/types/user';

import useStorage from './useStorage';

const SESSIONS_COLLECTION = 'sessions';

const useRoom = () => {
  const storage = useStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const {
    session,
    setSession,
    clearSession,
    user,
  } = useStore(({
    session,
    setSession,
    clearSession,
    preferences,
  }) => ({
    clearSession,
    session,
    setSession,
    user: preferences.user ?? null,
  }));

  // Clean up listener on unmount
  useEffect(() => () => {
    unsubscribeRef.current?.();
  }, []);

  const subscribe = useCallback((sessionName: string) => {
    unsubscribeRef.current?.();
    setIsLoading(true);

    unsubscribeRef.current = storage.watch<Session>(
      SESSIONS_COLLECTION,
      sessionName,
      (data, watchError) => {
        setIsLoading(false);
        if (watchError) {
          setError(watchError);
        } else {
          setSession(data);
        }
      },
    );
  }, [storage, setSession]);

  const createRoom = useCallback(async (name?: string): Promise<string> => {
    if (!user) throw new Error('Must be signed in to create a room');

    const sessionName = name ?? generateRoomName();

    const hostParticipant: Participant = {
      consecutiveMisses: 0,
      id: user.id,
      inactive: false,
      isHost: true,
      isObserver: false,
      joinedAt: Date.now(),
      name: user.name,
    };

    const newSession: Session = {
      createdAt: Timestamp.now(),
      currentIssue: null,
      estimations: {},
      // @ts-expect-error serverTimestamp() returns FieldValue; Firestore replaces it with Timestamp on write
      expiresAt: serverTimestamp(),
      history: [],
      issues: {},
      name: sessionName,
      participants: { [user.id]: hostParticipant },
      upcoming: [],
    };

    try {
      await storage.set(
        SESSIONS_COLLECTION,
        sessionName,
        newSession,
      );
      subscribe(sessionName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
      throw err;
    }

    return sessionName;
  }, [
    user,
    storage,
    subscribe,
  ]);

  const joinRoom = useCallback(async (sessionName: string): Promise<void> => {
    if (!user) throw new Error('Must be signed in to join a room');

    const participant: Participant = {
      consecutiveMisses: 0,
      id: user.id,
      inactive: false,
      isHost: false,
      isObserver: false,
      joinedAt: Date.now(),
      name: user.name,
    };

    try {
      await storage.update(
        SESSIONS_COLLECTION,
        sessionName,
        { [`participants.${user.id}`]: participant },
      );
      subscribe(sessionName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
      throw err;
    }
  }, [
    user,
    storage,
    subscribe,
  ]);

  const leaveRoom = useCallback(async (): Promise<void> => {
    if (!user || !session) return;

    await storage.update(
      SESSIONS_COLLECTION,
      session.name,
      { [`participants.${user.id}.inactive`]: true },
    );

    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    clearSession();
  }, [
    user,
    session,
    storage,
    clearSession,
  ]);

  const updateParticipant = useCallback(async (participantId: string, data: Partial<Participant>): Promise<void> => {
    if (!session) return;

    const updates: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      updates[`participants.${participantId}.${key}`] = value;
    });

    await storage.update(
      SESSIONS_COLLECTION,
      session.name,
      updates,
    );
  }, [session, storage]);

  return {
    createRoom,
    error,
    isLoading,
    joinRoom,
    leaveRoom,
    session,
    sessionName: session?.name ?? null,
    updateParticipant,
  };
};

export default useRoom;
