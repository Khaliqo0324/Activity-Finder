import React, { createContext, useContext, useState } from "react";

// Define the structure of an event
interface Event {
  lat: number;
  lng: number;
  name: string;
  type: string;
}

// Define the structure of the context value
interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  currentLocation: { lat: number; lng: number } | null;
  setCurrentLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
}

// Create the context with an initial value
const EventContext = createContext<EventContextType | undefined>(undefined);

// Provider component
export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <EventContext.Provider value={{ events, setEvents, currentLocation, setCurrentLocation }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook for consuming the context
export const useEventContext = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};
