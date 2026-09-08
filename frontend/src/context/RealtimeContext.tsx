import React, { createContext, useContext, useEffect, useState } from 'react';

interface RealtimeEvent {
  event_id: string;
  event_type: string;
  payload: any;
  timestamp: string;
}

interface RealtimeContextType {
  lastEvent: RealtimeEvent | null;
  events: RealtimeEvent[];
}

const RealtimeContext = createContext<RealtimeContextType>({
  lastEvent: null,
  events: [],
});

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);

  useEffect(() => {
    // Simulated realtime polling / WebSocket listener
    const timer = setInterval(() => {
      const simulatedEvent: RealtimeEvent = {
        event_id: `EVT-${Date.now()}`,
        event_type: 'TRAIN_POSITION_UPDATE',
        payload: { train_number: '12951', location_km: 118.5, status: 'ON_TIME' },
        timestamp: new Date().toISOString(),
      };
      setLastEvent(simulatedEvent);
      setEvents((prev) => [simulatedEvent, ...prev.slice(0, 19)]);
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  return (
    <RealtimeContext.Provider value={{ lastEvent, events }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
