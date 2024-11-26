import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Place } from './types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Place[];
  onFavoriteToggle: (placeId: string, isFavorite: boolean) => void;
}

export const FavoritesModal = ({ 
  isOpen, 
  onClose, 
  favorites,
  onFavoriteToggle 
}: FavoritesModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Favorites ({favorites.length})</h2>
          <button 
            onClick={onClose} 
            className="text-xl hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No favorites added yet
            </p>
          ) : (
            favorites.map((place) => (
              <Card key={place.place_id} className="hover:bg-gray-50">
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
                          <p className="text-xs text-gray-500">
                            {place.user_ratings_total} reviews
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => onFavoriteToggle(place.place_id, false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Remove from favorites"
                      >
                        <Heart className="h-6 w-6 fill-red-500 text-red-500" />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};