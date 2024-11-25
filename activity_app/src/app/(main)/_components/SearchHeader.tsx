// SearchHeader.tsx
import React from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SearchHeaderProps {
  onSearch: () => void;
  isRequestingLocation: boolean;
  onFavoritesOpen: () => void;
}

export const SearchHeader = ({ onSearch, isRequestingLocation, onFavoritesOpen }: SearchHeaderProps) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Discover Nearby Places</h1>
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
      <Button variant="outline" className="bg-white" onClick={onFavoritesOpen}>
        Favorites
      </Button>
    </div>
  </div>
);