import { div as MotionDiv } from 'motion/react-client';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import styled from 'styled-components';

import { ThemedProps } from '@components/common';
import ZIndex from '@components/common/constants';
import useJira from '@v4/hooks/useJira';
import useTickets from '@v4/hooks/useTickets';

import { useRoomUI } from '../RoomUIContext';
import SpotlightActions from './SpotlightActions';
import SpotlightInput from './SpotlightInput';
import SpotlightResults, { SpotlightResult } from './SpotlightResults';

const JIRA_KEY_PATTERN = /^[A-Z][A-Z0-9]+-\d+$/i;

const Backdrop = styled.div<ThemedProps>`
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  inset: 0;
  justify-content: center;
  padding-top: 20vh;
  position: fixed;
  z-index: ${ZIndex.MODAL_OVERLAY};
`;

const Panel = styled.div<ThemedProps>`
  background-color: ${({ theme }: ThemedProps) => theme.primary.accent2};
  border: 1px solid ${({ theme }: ThemedProps) => theme.primary.accent6};
  border-radius: 0.75rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.4);
  max-height: 60vh;
  overflow: hidden;
  width: min(90vw, 36rem);
`;

const Spotlight = () => {
  const { closeSpotlight } = useRoomUI();
  const { createIssue } = useTickets();
  const { isConnected, getIssueDetail } = useJira();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotlightResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isJiraQuery = useMemo(() => JIRA_KEY_PATTERN.test(query.trim()), [query]);

  useEffect(() => {
    if (!isConnected || !isJiraQuery) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const issue = await getIssueDetail(query.trim());
        if (issue) {
          setResults([
            {
              iconUrl: issue.iconUrl,
              isParent: issue.isParent,
              key: issue.key || query.trim(),
              name: issue.summary || issue.key || query.trim(),
            },
          ]);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    query,
    isConnected,
    isJiraQuery,
    getIssueDetail,
  ]);

  const handleCreate = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    await createIssue(trimmed);
    closeSpotlight();
  }, [
    query,
    createIssue,
    closeSpotlight,
  ]);

  const handleSelectResult = useCallback(async (result: SpotlightResult) => {
    await createIssue(result.name);
    closeSpotlight();
  }, [createIssue, closeSpotlight]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSpotlight();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeSpotlight]);

  return (
    <Backdrop onClick={closeSpotlight}>
      <MotionDiv
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: -20,
        }}
        initial={{
          opacity: 0,
          scale: 0.95,
          y: -20,
        }}
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.2 }}
      >
        <Panel>
          <SpotlightInput
            onChange={setQuery}
            onSubmit={handleCreate}
            value={query}
          />

          {results.length > 0 && !isSearching ? (
            <SpotlightResults
              onSelect={handleSelectResult}
              results={results}
            />
          ) : (
            <SpotlightActions
              isJiraConnected={isConnected}
              onCreateTicket={handleCreate}
              onOpenJiraWizard={() => {}}
              query={query}
            />
          )}
        </Panel>
      </MotionDiv>
    </Backdrop>
  );
};

export default Spotlight;
