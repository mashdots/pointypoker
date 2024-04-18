import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';

import useStore from '../../utils/store';
import { updateRoom, watchRoom } from '../../services/firebase';
import { Participant, Room as RoomType } from '../../types';
import withUserSetup from '../user/userSetup';

/**
 * TO DOs:
 *
 * === Issues ===
 * 1. Add "new issue" button that creates a new issue and pushes it to the database. When a new issue is created, all votes are reset. The previous issue name appears in a separate section with the average vote
 * 2. If the name of the issue is changed _after_ votes have been cast, go through the new issue cycle
 * 3. When typing a new issue name, propagate updates after 3 seconds of inactivity.
 * 4. Whenever a new issue is created, start a timer that stops whenever the votes are shown
 *
 * === Pointing ===
 * 1. Create and style the pointing interface
 * 2. Add "show votes" button that reveals all votes.
 * 3. Whenever a participant votes, update their vote in the database. Hash the vote value so it can't be seen by others. Visually hide until Issue's "show votes" button is clicked.
 * 4. Auto-show votes when everyone has voted. When votes are auto-shown, unhash the votes and write them to the database.
 * 5. Whenever votes are forced to be shown, anyone who hasn't voted will have consecutiveMisses incremented by 1. If consecutiveMisses is 3, set inactive to true. Have the UI reflect this.
 * 6. If a user votes, it resets their consecutiveMisses to 0.
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
  const [currentDescription, setCurrentDescription] = useState('');
  const [pointing, setPointing] = useState('');
  const [roomData, setRoomData] = useState<RoomType | null>(null);
  const { currentRoom, user } = useStore(({ room, user }) => ({
    currentRoom: room,
    user,
  }));
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();
  const navigate = useNavigate();

  const roomFromPath = window.location.pathname.slice(1);

  const handleCurrentDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDescription(e.target.value);
  };

  const handlePointing = (points: string) => {
    setPointing(points);
  };

  // If a room is in the URL or in the store, attempt to join it, otherwise redirect home
  useEffect(() => {
    if (currentRoom || roomFromPath) {
      const roomToJoin = currentRoom || roomFromPath;
      subscribedRoomRef.current = watchRoom(roomToJoin, (result) => {
        if (!result.error) {
          setRoomData(result.data as RoomType);
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
    if (currentRoom) {
      document.title = `pointy poker - ${currentRoom}`;
    }
  }, []);

  return (
    <div>
      <h1>{roomData?.name}</h1>
      <input type="text" value={currentDescription} onChange={handleCurrentDescriptionChange} />
      <button onClick={() => handlePointing(currentDescription)}>Point</button>
      <h2>Participants</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {roomData?.participants.map((participant) => (
            <tr key={participant.id}>
              <td>{participant.name}</td>
              <td>{participant.vote}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Results</h2>
      <p>Average: {roomData?.average}</p>
      <p>Breakdown</p>
      {/* <ul>
        {roomData?.breakdown.map((breakdown) => (
          <li key={breakdown.points}>
            {breakdown.points}: {breakdown.count}
          </li>
        ))}
      </ul> */}
    </div>
  );
});

export default Room;
