import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Heart } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  type: string;
  capacity?: number;
  attendees?: number;
}

interface EventCardProps {
  event: Event;
  onFavoriteToggle?: (eventId: string, isFavorite: boolean) => void;
  initialIsFavorite?: boolean;
}

export const EventCard = ({ 
  event, 
  onFavoriteToggle,
  initialIsFavorite = false 
}: EventCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavoriteToggle?.(event.id, newFavoriteState);
  };

  return (
    <Card className="hover:bg-gray-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <p className="text-sm text-gray-500">{event.description}</p>
          </div>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        {(event.capacity || event.attendees) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {event.attendees ?? 0}/{event.capacity ?? '∞'} attendees
            </span>
          </div>
        )}
        <Badge variant="secondary" className="capitalize">
          {event.type}
        </Badge>
      </CardContent>
    </Card>
  );
};