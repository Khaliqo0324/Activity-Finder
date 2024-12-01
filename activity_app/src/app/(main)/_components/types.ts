// Basic location type
export interface Location {
  lat: number;
  lng: number;
}

// Google Places types
export interface Place {
  place_id: string;
  id: string;
  name: string;
  vicinity: string;
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  geometry: {
    location: Location;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  formatted_address?: string;
}

// Search state management
export interface SearchState {
  isLoading: boolean;
  error: string | null;
  results: Place[];
}

// Event related types
export interface BaseEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  capacity: number;
  start_time: string;
  end_time: string;
  geometry: {
    location: Location;
  };
}

export interface Event extends BaseEvent {
  attendees?: number;
}

// Constants
export const RADIUS_OPTIONS = [
  { value: '1000', label: '1 km' },
  { value: '2000', label: '2 km' },
  { value: '5000', label: '5 km' },
  { value: '10000', label: '10 km' }
] as const;

export const PLACE_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'cafe', label: 'Cafes' },
  { value: 'gym', label: 'Gyms' },
  { value: 'park', label: 'Parks' },
  { value: 'museum', label: 'Museums' },
  { value: 'library', label: 'Libraries' }
] as const;

export const EVENT_TYPES = [
  { value: 'all', label: 'All Events' },
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'art', label: 'Art & Culture' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'networking', label: 'Networking' },
  { value: 'education', label: 'Education' },
  { value: 'community', label: 'Community' },
  { value: 'custom', label: 'Custom Event' }
] as const;

export type PlaceType = typeof PLACE_TYPES[number]['value'];
export type EventType = typeof EVENT_TYPES[number]['value'];
export type RadiusOption = typeof RADIUS_OPTIONS[number]['value'];

// Map marker type
export interface MapMarker {
  position: Location;
  title: string;
}

// Filter props types
export interface SearchFiltersProps {
  searchQuery: string;
  selectedType: PlaceType;
  selectedRadius: RadiusOption;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: PlaceType) => void;
  onRadiusChange: (value: RadiusOption) => void;
}

export interface EventFiltersProps extends Omit<SearchFiltersProps, 'selectedType' | 'onTypeChange'> {
  selectedType: EventType;
  selectedDate?: Date;
  selectedTimeFilter: string;
  onTypeChange: (value: EventType) => void;
  onDateChange: (date?: Date) => void;
  onTimeFilterChange: (value: string) => void;
}

// Modal props types
export interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Place[];
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
}