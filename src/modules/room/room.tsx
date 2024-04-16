import React, { useEffect, useRef, useState } from 'react';

import useStore from '../../utils/store';
import { watchRoom } from '../../services/firebase';

/**
 * TO DOs:
 * 1. Set URL path to new room name. Update title.
 * 2. Create local issue that is also pushed to the database after 3 seconds of no changes.
 * 3. Add "show votes" button that reveals all votes.
 * 4. Add "new issue" button that creates a new issue and pushes it to the database. When a new issue is created, all votes are reset.
 * 5. List all participants and their votes in order of joinedAt
 * 6. Whenever a participant votes, update their vote in the database. Hash the vote value so it can't be seen by others. Visually hide until Issue's "show votes" button is clicked.
 * 7. Auto-show votes when everyone has voted. When votes are auto-shown, unhash the votes and write them to the database.
 * 8. Whenever a new issue is created, start a timer that stops whenever the votes are shown
 * 9. Whenever votes are forced to be shown, anyone who hasn't voted will have consecutiveMisses incremented by 1. If consecutiveMisses is 3, set inactive to true. Have the UI reflect this.
 * 10. If the user is inactive, then their lack of vote will not be counted towards the total votes needed to show votes, and won't affect the average score calculation.
 * 11. If a user votes, it resets their consecutiveMisses to 0.
 * 12. If the user leaves the room, set their inactive to true.
 * 13. If the user closes the window or navigates to another website, set their inactive to true.
 * 14. When there is consensus, show a message that there is consensus. See if you can show confetti
 * 15. Differentiate between inactivity and leaving.
 */

const Room = () => {
  const [currentDescription, setCurrentDescription] = useState('');
  const [pointing, setPointing] = useState('');
  const { currentRoom } = useStore((state) => ({
    currentRoom: state.room,
  }));
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();

  const handleCurrentDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDescription(e.target.value);
  };

  const handlePointing = (points: string) => {
    setPointing(points);
  };

  useEffect(() => {
    if (currentRoom) {
      subscribedRoomRef.current = watchRoom(currentRoom.name, (result) => {
        console.log(result);
      });
    }

    return () => {
      subscribedRoomRef.current?.();
    };
  }, [currentRoom]);


  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <section>
        <input
          type="text"
          value={currentDescription}
          onChange={handleCurrentDescriptionChange}
          placeholder="Describe what is being pointed"
        />
      </section>
      <section>
        <button onClick={() => handlePointing('1')}>1</button>
        <button onClick={() => handlePointing('2')}>2</button>
        <button onClick={() => handlePointing('3')}>3</button>
        <button onClick={() => handlePointing('5')}>5</button>
        <button onClick={() => handlePointing('8')}>8</button>
        <button onClick={() => handlePointing('13')}>13</button>
        <button onClick={() => handlePointing('?')}>?</button>
      </section>
    </div>
  );
};

export default Room;
