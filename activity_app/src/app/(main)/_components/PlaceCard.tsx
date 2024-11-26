import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Place } from './types';

interface PlaceCardProps {
  place: Place;
  onFavoriteToggle?: (placeId: string, isFavorite: boolean) => void;
  initialIsFavorite?: boolean;
}

export const PlaceCard = ({ 
  place, 
  onFavoriteToggle,
  initialIsFavorite = false 
}: PlaceCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavoriteToggle?.(place.place_id, newFavoriteState);
  };

  
  return (
    <Card className="hover:bg-gray-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{place.name}</CardTitle>
            <p className="text-sm text-gray-500">{place.vicinity}</p>
          </div>
          <div className="flex items-start gap-4">
            {place.rating && (
              <div className="text-right">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{place.rating}</span>
                <p className="text-xs text-gray-500">{place.user_ratings_total} reviews</p>
              </div>
            )}
            <button
              onClick={handleFavoriteClick}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {place.types.map((type) => (
            <Badge key={type} variant="secondary" className="capitalize">
              {type.replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};