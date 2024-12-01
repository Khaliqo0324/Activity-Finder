// SearchHeader.tsx
import React from 'react';
import { Loader2, MapPin, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
//import { AddEvent } from '@/app/(addEvent)/_components/AddEvent';
import { EventProvider } from "./EventContext";


interface SearchHeaderProps {
  onSearch: () => void;
  isRequestingLocation: boolean;
  onFavoritesOpen: () => void;
  onAddOpen: () => void;
  onEventsToggle: () => void;
  isEventsView: boolean;
}

export const SearchHeader = ({ 
  onSearch, 
  isRequestingLocation, 
  onFavoritesOpen, 
  onAddOpen, //<---added
  onEventsToggle,
  isEventsView 
}: SearchHeaderProps) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">
      {isEventsView ? 'Discover Nearby Events' : 'Discover Nearby Places'}
    </h1>
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="bg-white"
        onClick={onSearch}
        disabled={isRequestingLocation}
      >
        {isRequestingLocation ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="mr-2 h-4 w-4" />
        )}
        Discover
      </Button>
      <Button 
        variant={isEventsView ? "default" : "outline"}
        className={isEventsView ? "" : "bg-white"}
        onClick={onEventsToggle}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Events
      </Button>
      <Button variant="outline" className="bg-white" onClick={onFavoritesOpen}>
        Favorites
      </Button>
       
      <Button variant="outline" className="bg-white" onClick={onAddOpen}>
       Add Event
      </Button>
      
    </div>
  </div>
);