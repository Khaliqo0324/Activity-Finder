import React from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlaceCard } from './PlaceCard';
import { Place } from './types';

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  places: Place[];
}

export const SearchResults = ({ isLoading, error, places }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No places found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {places.map(place => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};
