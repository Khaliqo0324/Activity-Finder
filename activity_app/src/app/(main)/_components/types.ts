export interface Location {
    lat: number;
    lng: number;
  }
  
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
  }
  
  export interface SearchState {
    isLoading: boolean;
    error: string | null;
    results: Place[];
  }
  
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

  export interface Event {
    id: string;
    name: string;
    description: string;
    location: string;
    type: string;
    capacity: number;
    start_time: string;
    end_time: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    };
    attendees?: number;
  }

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
      location: {
        lat: number;
        lng: number;
      }
    };
  }

  export interface Event extends BaseEvent {
    attendees?: number;
  }
  
  
  export const EVENT_TYPES = [
    { value: 'all', label: 'All Events' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'art', label: 'Art & Culture' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'networking', label: 'Networking' },
    { value: 'education', label: 'Education' },
    { value: 'community', label: 'Community' },
  ];