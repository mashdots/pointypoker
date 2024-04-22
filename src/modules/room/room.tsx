import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import useStore from '../../utils/store';
import { addIssue, updateRoom, watchRoom } from '../../services/firebase';
import { Issue, Participant, Room as RoomType } from '../../types';
import withUserSetup from '../user/userSetup';
import { VARIATIONS } from '../../utils/styles';
import { TitleInput, VoteButtons, VoteDisplay } from './components';
import { Vote } from '../../types/room';
import { VoteDisplayProps } from './components/voteDisplay';
import Button from '../../components/common/button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  height: 100%;
  width: 100%;
  align-items: center;
`;

/**
 * TO DOs:
 * 1. Simplify and abstract the logic in this component
 *
 * === Issues ===
 * 1. The previous issue name appears in a separate section with the average vote
 * 2. Whenever a new issue is created, start a timer that stops whenever the votes are shown
 *
 * === Pointing ===
 * 1. Style the pointing interface
 * 2. Whenever votes are forced to be shown, anyone who hasn't voted will have consecutiveMisses incremented by 1. If consecutiveMisses is 3, set inactive to true. Have the UI reflect this.
 * 3. If a user votes, it resets their consecutiveMisses to 0.
 *
 * === Participant Section ===
 * 1. List all participants and their votes in order of joinedAt
 * 2. If the user joins the room and was a former participant, update their joinedAt time, and set inactive to false, and reset consecutiveMisses to 0.
 * 3. If the user is inactive, then their lack of vote will not be counted towards the total votes needed to show votes, and won't affect the average score calculation.
 * 4. If the user leaves the room, or if the user closes the window or navigates to another website, set their inactive to true.
 * 5. Differentiate between inactivity and leaving.
 *
 * === Final Results Section ===
 * 1. When there is consensus, show a message that there is consensus. See if you can show confetti
 *
 * === Completed Issues section ===
 * 1. Show all issues that have been completed, including the average vote.
 */

const Room = withUserSetup(() => {
  // Room Setup
  const [roomData, setRoomData] = useState<RoomType | null>(null);
  const { currentRoom, setRoom, user } = useStore(({ room, setRoom, user }) => ({
    currentRoom: room,
    setRoom,
    user,
  }));
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();
  const navigate = useNavigate();

  const roomFromPath = window.location.pathname.slice(1);

  // Issue Setup
  const currentIssue = useMemo(() =>
    roomData?.issues
      ? Object.values(roomData?.issues).sort((a, b) => b?.createdAt - a?.createdAt)[0]
      : null, [ roomData ]);

  const voteData = useMemo(() => {
    const { participants } = roomData || { participants: [] };
    const { votes }: { votes: {[ key: string ]: Vote} } = currentIssue || { votes: {} };

    return participants
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map(({ name, id }): VoteDisplayProps => ({
        name: name,
        vote: votes ? votes[ id ] : '',
      }));
  }, [ roomData?.participants, currentIssue?.votes ]);

  const areAllVotesCast = useMemo(() => {
    const { participants } = roomData || { participants: [] };
    const { votes }: { votes: {[ key: string ]: Vote} } = currentIssue || { votes: {} };

    return participants.every(({ id }) => votes[ id ]);
  }, [ roomData?.participants, currentIssue?.votes ]);

  const handleUpdateLatestIssue = useCallback((field: string, value: any, callback?: () => void) => {
    if (roomData && user && currentIssue) {
      console.log('latest issue', currentIssue);
      let roomObjPath = 'issues';
      let resolvedValue = value;
      roomObjPath += `.${currentIssue.id}.${field}`;

      if (field === 'votes') {
        resolvedValue = {
          participantId: user.id,
          vote: value,
        };

        roomObjPath += `.${user.id}`;
      }

      updateRoom(roomData.name, roomObjPath, resolvedValue, callback);
    }
  }, [ roomData ]);

  const handleCreateIssue = useCallback((newIssueName?: string) => {
    if (roomData && user) {
      const newIssue: Issue = {
        name: newIssueName || '',
        id: uuid(),
        shouldShowVotes: false,
        votes: {},
        createdAt: Date.now(),
      };

      console.log('new issue', newIssue);
      console.log('newIssueName', newIssueName);
      updateRoom(roomData.name, `issues.${newIssue.id}`, newIssue);
    }
  }, [ roomData ]);

  // If a room is in the URL or in the store, attempt to join it, otherwise redirect home
  useEffect(() => {
    if ((currentRoom || roomFromPath) && !roomData ) {
      const roomToJoin = currentRoom || roomFromPath;
      subscribedRoomRef.current = watchRoom(roomToJoin, (result) => {
        if (!result.error) {
          setRoomData(result.data as RoomType);

          // If we got the room name from the URL, set it in the store
          if (!currentRoom) {
            setRoom((result.data as RoomType).name);
          }
        } else {
          navigate('/');
          console.error(result);
        }
      });
    } else {
      navigate('/');
    }

    return () => {
      subscribedRoomRef.current?.();
    };
  }, [ currentRoom, roomFromPath ]);

  // If someone joins the room, add them as a participant
  useEffect(() => {
    if (roomData && user && !roomData.participants.find((participant) => participant.id === user.id)) {
      const selfAsParticipant: Participant = {
        id: user.id,
        name: user.name,
        consecutiveMisses: 0,
        inactive: false,
        isHost: false,
        joinedAt: Date.now(),
      };

      const updatedRoomData = cloneDeep(roomData);
      updatedRoomData.participants.push(selfAsParticipant);
      updateRoom(roomData.name, 'participants', updatedRoomData.participants);
    }
  }, [ roomData ]);

  // When a room loads, update the page title
  useEffect(() => {
    if (roomData) {
      document.title = `pointy poker - ${ roomData.name}`;
    }
  }, []);

  return (
    <Wrapper>
      <TitleInput
        updatedIssueTitle={currentIssue?.name || ''}
        handleUpdate={handleUpdateLatestIssue}
        createIssue={handleCreateIssue}
        allVotesCast={areAllVotesCast}
      />
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Button margin='left' variation='info' width='half' onClick={() => handleCreateIssue()}>new issue</Button>
        <Button
          margin='right'
          variation='info'
          width='half'
          onClick={() => handleUpdateLatestIssue('shouldShowVotes', true)}
        >
          show votes
        </Button>
      </div>
      <VoteButtons handleVote={handleUpdateLatestIssue} />
      <VoteDisplay currentUser={user} voteData={voteData} shouldShowVotes={currentIssue?.shouldShowVotes || areAllVotesCast} />
      <p>Breakdown</p>
      {/* <ul>
        {roomData?.breakdown.map((breakdown) => (
          <li key={breakdown.points}>
            {breakdown.points}: {breakdown.count}
          </li>
        ))}
      </ul> */}
    </Wrapper>
  );
});

export default Room;
