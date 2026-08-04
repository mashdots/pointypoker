import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type RoomUIContextValue = {
  closeSpotlight: () => void;
  closeTimeline: () => void;
  isSpotlightOpen: boolean;
  isTimelineOpen: boolean;
  openSpotlight: () => void;
  toggleTimeline: () => void;
};

const RoomUIContext = createContext<RoomUIContextValue | null>(null);

const useRoomUI = (): RoomUIContextValue => {
  const context = useContext(RoomUIContext);

  if (!context) {
    throw new Error('useRoomUI must be used within a RoomUIProvider');
  }

  return context;
};

const RoomUIProvider = ({ children }: { children: ReactNode }) => {
  const [isSpotlightOpen, setSpotlightOpen] = useState(false);
  const [isTimelineOpen, setTimelineOpen] = useState(false);

  const openSpotlight = useCallback(() => {
    setSpotlightOpen(true);
    setTimelineOpen(false);
  }, []);

  const closeSpotlight = useCallback(() => {
    setSpotlightOpen(false);
  }, []);

  const toggleTimeline = useCallback(() => {
    setTimelineOpen((prev) => !prev);
  }, []);

  const closeTimeline = useCallback(() => {
    setTimelineOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = useMemo(() => ({
    closeSpotlight,
    closeTimeline,
    isSpotlightOpen,
    isTimelineOpen,
    openSpotlight,
    toggleTimeline,
  }), [
    closeSpotlight,
    closeTimeline,
    isSpotlightOpen,
    isTimelineOpen,
    openSpotlight,
    toggleTimeline,
  ]);

  return (
    <RoomUIContext.Provider value={value}>
      {children}
    </RoomUIContext.Provider>
  );
};

export { useRoomUI, RoomUIProvider };
