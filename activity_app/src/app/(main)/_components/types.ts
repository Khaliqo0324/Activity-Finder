export interface Location {
    lat: number;
    lng: number;
  }
  
  export interface Place {
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
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'cafe', label: 'Cafes' },
    { value: 'gym', label: 'Gyms' },
    { value: 'park', label: 'Parks' },
    { value: 'museum', label: 'Museums' },
    { value: 'library', label: 'Libraries' }
  ] as const;