import { useEffect, useRef, useState } from 'react';
import { Room } from '../../../types';
import { watchRoom } from '../../../services/firebase';
import { useNavigate } from 'react-router-dom';
import useStore from '../../../utils/store';

const useRoom = () => {
  const [roomData, setRoomData] = useState<Room>();
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();
  const navigate = useNavigate();
  const { currentRoom, setRoom } = useStore(({ room, setRoom }) => ({
    currentRoom: room,
    setRoom,
  }));
  const roomFromPath = window.location.pathname.slice(1);

  useEffect(() => {
    if ((currentRoom || roomFromPath) && !roomData) {
      const roomToJoin = currentRoom?.name || roomFromPath;

      subscribedRoomRef.current = watchRoom(roomToJoin, (result) => {
        if (!result.error) {
          setRoomData(result.data as Room);

          // If we got the room name from the URL, set it in the store
          if (!currentRoom) {
            setRoom(result.data as Room);
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

  console.log('roomData', roomData);
  return roomData;
};

export default useRoom;

