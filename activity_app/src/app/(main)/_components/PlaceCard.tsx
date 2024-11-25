// PlaceCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Place } from './types';

interface PlaceCardProps {
  place: Place;
}

export const PlaceCard = ({ place }: PlaceCardProps) => (
  <Card className="hover:bg-gray-50">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg">{place.name}</CardTitle>
          <p className="text-sm text-gray-500">{place.vicinity}</p>
        </div>
        {place.rating && (
          <div className="text-right">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{place.rating}</span>
            <p className="text-xs text-gray-500">{place.user_ratings_total} reviews</p>
          </div>
        )}
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