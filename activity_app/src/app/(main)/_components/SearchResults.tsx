import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Place } from './types';
import React from 'react';

interface PlaceCardProps {
  place: Place;
  onFavoriteToggle: (placeId: string, isFavorite: boolean) => void;
  initialIsFavorite: boolean;
}

const PlaceCard = ({ 
  place, 
  onFavoriteToggle,
  initialIsFavorite
}: PlaceCardProps) => {
  const [isFavorite, setIsFavorite] = React.useState(initialIsFavorite);

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavoriteToggle(place.place_id, newFavoriteState);
  };

  return (
    <Card className="hover:bg-gray-50 transition-colors duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {place.name}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">{place.vicinity}</p>
          </div>
          <div className="flex items-start gap-4">
            {place.rating !== undefined && place.user_ratings_total !== undefined && (
              <div className="text-right">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 font-medium">{place.rating}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {place.user_ratings_total.toLocaleString()} reviews
                </p>
              </div>
            )}
            <button
              onClick={handleFavoriteClick}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {place.types.map((type) => (
            <Badge 
              key={type} 
              variant="secondary" 
              className="capitalize text-xs"
            >
              {type.replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
        {place.photos && place.photos.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {place.photos.length} photo{place.photos.length !== 1 ? 's' : ''} available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  places: Place[];
  onFavoriteToggle: (placeId: string, isFavorite: boolean) => void;
  favorites: Place[];
}

export const SearchResults = ({ 
  isLoading, 
  error, 
  places,
  onFavoriteToggle,
  favorites
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-500">Searching nearby places...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No places found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your search criteria or increasing the search radius
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {places.map(place => (
        <PlaceCard 
          key={place.place_id} 
          place={place}
          onFavoriteToggle={onFavoriteToggle}
          initialIsFavorite={favorites.some(f => f.place_id === place.place_id)}
        />
      ))}
    </div>
  );
};