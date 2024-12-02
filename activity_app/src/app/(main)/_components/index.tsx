"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SearchHeader } from './SearchHeader';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { EventCard } from './EventCard';
import { FavoritesModal } from './FavoritesModal';
import Map from './Map';
import { Location, SearchState, Place, Event, EVENT_TYPES } from './types';
import { EventFilters } from './EventFilters';
import { AddModal } from "./AddModal";

// Geocoding service setup
const geocoder = typeof google !== 'undefined' ? new google.maps.Geocoder() : null;

// Geocoding helper function
const geocodeAddress = async (address: string): Promise<Location | null> => {
  if (!geocoder) return null;
  
  try {
    const response = await geocoder.geocode({ address });
    if (response.results && response.results[0]) {
      const location = response.results[0].geometry.location;
      return {
        lat: location.lat(),
        lng: location.lng()
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Location error alert component
const LocationErrorAlert = ({ error, onRetry, isLoading }: { 
  error: string;
  onRetry: () => void;
  isLoading: boolean;
}) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
    <Button 
      variant="outline" 
      size="sm" 
      className="ml-4"
      onClick={onRetry}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : 'Retry'}
    </Button>
  </Alert>
);

// MongoDB events fetching function
export async function fetchMongoEvents(): Promise<Event[]> {
  try {
    const response = await fetch('/api/events');
    if (!response.ok) throw new Error('Failed to fetch events');
    
    const data = await response.json();
    const events = await Promise.all(data.events.map(async (event: any): Promise<Event> => {
      let location = event.geometry?.location;
      if (!location && event.location) {
        const geocoded = await geocodeAddress(event.location);
        if (geocoded) {
          location = geocoded;
        }
      }

      return {
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
        type: event.type,
        capacity: event.capacity,
        start_time: event.start_time,
        end_time: event.end_time,
        geometry: {
          location: location || { lat: 0, lng: 0 }
        },
        attendees: event.attendees
      };
    }));

    return events;
  } catch (error) {
    console.error('Error fetching MongoDB events:', error);
    return [];
  }
}

export const Inbox = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('2000');
  const [selectedType, setSelectedType] = useState('all');
  const [eventType, setEventType] = useState('all');
  const [isEventsView, setIsEventsView] = useState(false);
  const [favorites, setFavorites] = useState<Place[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('today');

  // Modal state
  const [isFavoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [isOnAddModalOpen, setOnAddModalOpen] = useState(false);

  // Search results state
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
    results: []
  });
  
  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  
  // Location state
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  
  // Refs
  const mapServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const locationRetryCount = useRef(0);
  const searchCriteriaRef = useRef({ 
    radius: selectedRadius, 
    type: selectedType,
    eventType: eventType 
  });
  const MAX_RETRY_ATTEMPTS = 3;

  // Memoized filtered places
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return searchState.results;
    return searchState.results.filter(place => 
      place.name.toLowerCase().includes(query) ||
      place.vicinity.toLowerCase().includes(query) ||
      place.types.some(type => type.toLowerCase().includes(query))
    );
  }, [searchState.results, searchQuery]);

  // Memoized filtered events
  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return events.filter(event => {
      const matchesQuery = !query || 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);
        
      const matchesType = eventType === 'all' || event.type === eventType;
      
      return matchesQuery && matchesType;
    });
  }, [events, searchQuery, eventType]);

  // Memoized map markers based on current view
  // Memoized map markers based on current view
    // Memoized map markers based on current view
    const mapMarkers = useMemo(() => {
      if (isEventsView) {
        return filteredEvents.map(event => ({
          position: event.geometry?.location || { lat: 0, lng: 0 },
          title: event.name,
          address: event.location
        }));
      } else {
        return searchState.results.map(place => {
          const location = place.geometry?.location;
          
          const getLat = (loc: any) => {
            if (!loc) return 0;
            return typeof loc.lat === 'function' ? loc.lat() : loc.lat;
          };
          
          const getLng = (loc: any) => {
            if (!loc) return 0;
            return typeof loc.lng === 'function' ? loc.lng() : loc.lng;
          };
    
          return {
            position: {
              lat: getLat(location),
              lng: getLng(location)
            },
            title: place.name,
            address: place.vicinity
          };
        });
      }
    }, [isEventsView, filteredEvents, searchState.results]); 
  // Search for nearby places
  const searchNearbyPlaces = useCallback(async (location: Location) => {
    if (!mapServiceRef.current) return;
  
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
  
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: parseInt(searchCriteriaRef.current.radius),
      type: searchCriteriaRef.current.type === 'all' ? undefined : searchCriteriaRef.current.type
    };
  
    mapServiceRef.current.nearbySearch(
      request,
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const placesResults = results.map(place => {
            const location = place.geometry?.location;
            
            const getLat = (loc: any) => {
              if (!loc) return 0;
              return typeof loc.lat === 'function' ? loc.lat() : loc.lat;
            };
            
            const getLng = (loc: any) => {
              if (!loc) return 0;
              return typeof loc.lng === 'function' ? loc.lng() : loc.lng;
            };
  
            return {
              place_id: place.place_id,
              name: place.name,
              vicinity: place.vicinity,
              types: place.types,
              rating: place.rating,
              user_ratings_total: place.user_ratings_total,
              business_status: place.business_status,
              geometry: {
                location: {
                  lat: getLat(location),
                  lng: getLng(location)
                }
              },
              photos: place.photos,
              opening_hours: place.opening_hours,
              price_level: place.price_level
            };
          });
          
          setSearchState({
            isLoading: false,
            error: null,
            results: placesResults as unknown as Place[]
          });
        } else {
          setSearchState({
            isLoading: false,
            error: 'Failed to fetch nearby places',
            results: []
          });
        }
      }
    );
  }, []);
  // Search for nearby events
  const searchNearbyEvents = useCallback(async (location: Location) => {
    if (!mapServiceRef.current) return;
   
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
   
    try {
      const mongoEvents = await fetchMongoEvents();
   
      const placesEvents = await new Promise<Event[]>((resolve, reject) => {
        const request: google.maps.places.TextSearchRequest = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius: parseInt(searchCriteriaRef.current.radius),
          query: 'events venues conferences',
          type: 'establishment'
        };
   
        mapServiceRef.current!.textSearch(request, async (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const events = await Promise.all(results.map(async place => {
              let eventLocation = place.geometry?.location;
              
              if (!eventLocation && place.formatted_address) {
                const geocoded = await geocodeAddress(place.formatted_address);
                if (geocoded) {
                  eventLocation = new google.maps.LatLng(geocoded.lat, geocoded.lng);
                }
              }
  
              return {
                id: place.place_id || `event-${Math.random()}`,
                name: `Event at ${place.name || 'Unknown Venue'}`,
                description: `Special event happening at ${place.name || 'Unknown Venue'}`,
                location: place.formatted_address || place.name || 'Unknown Location',
                type: EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)].value,
                capacity: Math.floor(Math.random() * 200) + 50,
                start_time: new Date(Date.now() + Math.random() * 86400000).toISOString(),
                end_time: new Date(Date.now() + Math.random() * 172800000).toISOString(),
                geometry: {
                  location: {
                    lat: eventLocation?.lat() ?? 0,
                    lng: eventLocation?.lng() ?? 0
                  }
                }
              };
            }));
            resolve(events);
          } else {
            reject(new Error('Failed to fetch places events'));
          }
        });
      });
   
      const combinedEvents = [...mongoEvents, ...placesEvents];
      setEvents(combinedEvents);
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
   
    } catch (error) {
      console.error('Error fetching events:', error);
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch events'
      }));
    }
  }, []);

  // Handle favorites toggle
  // Update the handleFavoriteToggle function in Inbox.tsx
  const handleFavoriteToggle = useCallback((placeId: string, isFavorite: boolean) => {
    setFavorites(prev => {
      const place = searchState.results.find(p => p.place_id === placeId) || 
                   prev.find(p => p.place_id === placeId);
      
      // Don't update state if nothing would change
      const isAlreadyFavorite = prev.some(p => p.place_id === placeId);
      if (isFavorite === isAlreadyFavorite || !place) {
        return prev;
      }
      
      return isFavorite 
        ? [...prev, place]
        : prev.filter(p => p.place_id !== placeId);
    });
  }, [searchState.results]);



  // Get location error message
  const getLocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access denied. Please enable location services.";
      case error.POSITION_UNAVAILABLE:
        return "Location information unavailable.";
      case error.TIMEOUT:
        return "Location request timed out.";
      default:
        return "Unable to get your location.";
    }
  };

  // Request user location
  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    setIsRequestingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      setCurrentLocation(location);
      locationRetryCount.current = 0;
      setLocationError(null);
      
      if (mapInstance) {
        mapInstance.panTo(location);
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        setLocationError(getLocationErrorMessage(error));
      } else {
        setLocationError("Failed to get location");
      }

      if (locationRetryCount.current < MAX_RETRY_ATTEMPTS) {
        locationRetryCount.current += 1;
        setTimeout(requestLocation, 1000);
      }
    } finally {
      setIsRequestingLocation(false);
    }
  }, [mapInstance]);

  // Handle map load
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    mapServiceRef.current = new google.maps.places.PlacesService(map);
    if (currentLocation) {
      isEventsView ? searchNearbyEvents(currentLocation) : searchNearbyPlaces(currentLocation);
    }
  }, [currentLocation, searchNearbyPlaces, searchNearbyEvents, isEventsView]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!currentLocation) return;
    if (isEventsView) {
      searchNearbyEvents(currentLocation);
    } else {
      searchNearbyPlaces(currentLocation);
    }
  }, [currentLocation, isEventsView, searchNearbyEvents, searchNearbyPlaces]);

  // Handle events toggle
  const handleEventsToggle = useCallback(() => {
    setIsEventsView(prev => !prev);
    if (currentLocation) {
      // Clear previous results
      setSearchState(prev => ({
        ...prev,
        results: [],
        isLoading: true
      }));
      setEvents([]);
      
      // Small timeout to ensure state has updated
      setTimeout(() => {
        if (isEventsView) {
          searchNearbyPlaces(currentLocation);
        } else {
          searchNearbyEvents(currentLocation);
        }
      }, 0);
    }
  }, [currentLocation, isEventsView, searchNearbyEvents, searchNearbyPlaces]);

  // Initial location request
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Update search criteria and trigger search
  useEffect(() => {
    searchCriteriaRef.current = {
      radius: selectedRadius,
      type: selectedType,
      eventType: eventType
    };

    if (currentLocation && mapServiceRef.current) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedRadius, selectedType, eventType, currentLocation, handleSearch]);

  // Update map when view changes
  useEffect(() => {
    if (currentLocation && mapServiceRef.current) {
      if (isEventsView) {
        searchNearbyEvents(currentLocation);
      } else {
        searchNearbyPlaces(currentLocation);
      }
    }
  }, [isEventsView, currentLocation, searchNearbyEvents, searchNearbyPlaces]);

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4">
          <SearchHeader 
            onSearch={handleSearch}
            isRequestingLocation={isRequestingLocation}
            onFavoritesOpen={() => setFavoritesModalOpen(true)}
            onEventsToggle={handleEventsToggle}
            isEventsView={isEventsView}
            onAddOpen={() => setOnAddModalOpen(true)}
          />
          
          {locationError && (
            <LocationErrorAlert 
              error={locationError}
              onRetry={requestLocation}
              isLoading={isRequestingLocation}
            />
          )}
        
          {isEventsView ? (
            <EventFilters
              searchQuery={searchQuery}
              selectedType={eventType}
              selectedRadius={selectedRadius}
              selectedDate={selectedDate}
              selectedTimeFilter={selectedTimeFilter}
              onSearchChange={setSearchQuery}
              onTypeChange={setEventType}
              onRadiusChange={setSelectedRadius}
              onDateChange={setSelectedDate}
              onTimeFilterChange={setSelectedTimeFilter}
            />
          ) : (
            <SearchFilters
              searchQuery={searchQuery}
              selectedType={selectedType}
              selectedRadius={selectedRadius}
              onSearchChange={setSearchQuery}
              onTypeChange={setSelectedType}
              onRadiusChange={setSelectedRadius}
            />
          )}

          {isEventsView ? (
            <div className="space-y-4">
              {searchState.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : searchState.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{searchState.error}</AlertDescription>
                </Alert>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No events found
                </div>
              ) : (
                filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          ) : (
            <SearchResults 
              isLoading={searchState.isLoading}
              error={searchState.error}
              places={filteredPlaces}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
            />
          )}
        </div>
      </div>
      
      <div className="w-1/2 relative">
        <Map
          center={currentLocation || { lat: 0, lng: 0 }}
          zoom={14}
          height="100vh"
          markers={mapMarkers}
          onMapLoad={handleMapLoad}
          onError={(error) => setSearchState(prev => ({ 
            ...prev, 
            error: error.message 
          }))}
          showUserLocation={!!currentLocation}
          userLocation={currentLocation || undefined}
        />
      </div>

      <FavoritesModal 
        isOpen={isFavoritesModalOpen}
        onClose={() => setFavoritesModalOpen(false)}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <AddModal
        isOpen={isOnAddModalOpen}
        onClose={() => setOnAddModalOpen(false)}
      />
    </div>
  );
};

export default Inbox;