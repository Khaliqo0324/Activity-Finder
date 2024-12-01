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
import {AddModal} from "./AddModal";
import { createMockEvent } from './mockEventHelpers';
import { addMap } from './addMap';


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

export const Inbox = () => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('2000');
  const [selectedType, setSelectedType] = useState('all');
  const [eventType, setEventType] = useState('all');
  const [isEventsView, setIsEventsView] = useState(false);
  const [favorites, setFavorites] = useState<Place[]>([]);

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

  // Filter places based on search query
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return searchState.results;
    return searchState.results.filter(place => 
      place.name.toLowerCase().includes(query) ||
      place.vicinity.toLowerCase().includes(query) ||
      place.types.some(type => type.toLowerCase().includes(query))
    );
  }, [searchState.results, searchQuery]);

  // Filter events based on search query and event type
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

  // Search for nearby places
  const searchNearbyPlaces = useCallback(async (location: Location) => {
    if (!mapServiceRef.current) return;
  
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
  
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: parseInt(searchCriteriaRef.current.radius),
      type: searchCriteriaRef.current.type
    };
  
    mapServiceRef.current.nearbySearch(
      request,
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setSearchState({
            isLoading: false,
            error: null,
            results: results as unknown as Place[]
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

  const handleFavoriteToggle = useCallback((placeId: string, isFavorite: boolean) => {
    setFavorites(prev => {
      if (isFavorite) {
        const place = searchState.results.find(p => p.place_id === placeId);
        if (place && !prev.some(p => p.place_id === placeId)) {
          return [...prev, place];
        }
      } else {
        return prev.filter(p => p.place_id !== placeId);
      }
      return prev;
    });
  }, [searchState.results]);
  
  const searchNearbyEvents = useCallback(async (location: Location) => {
    if (!mapServiceRef.current) return;
  
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
  
    const request: google.maps.places.TextSearchRequest = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: parseInt(searchCriteriaRef.current.radius),
      query: 'events venues conferences',
      type: 'establishment'
    };
  
    try {
      mapServiceRef.current.textSearch(
        request,
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const mockEvents: Event[] = results
            //const addEventMain: Event[] = results
              .filter(place => place.geometry?.location)
              .map(place => {
                // Extract the actual number values from the LatLng object
                const lat = place.geometry?.location?.lat() ?? 0;
                const lng = place.geometry?.location?.lng() ?? 0;
                
                return {
                  id: place.place_id || `event-${Math.random()}`,
                  name: `Event at ${place.name || 'Unknown Venue'}`,
                  description: `Special event happening at ${place.name || 'Unknown Venue'}`,
                  start_time: new Date(Date.now() + Math.random() * 86400000).toISOString(),
                  end_time: new Date(Date.now() + Math.random() * 172800000).toISOString(),
                  location: place.formatted_address || place.name || 'Unknown Location',
                  type: EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)].value,
                  capacity: Math.floor(Math.random() * 200) + 50,
                  attendees: Math.floor(Math.random() * 50),
                  geometry: {
                    location: {
                      lat, // Now it's just a number
                      lng  // Now it's just a number
                    }
                  }
                };
              });
  
           setEvents(mockEvents);
           //setEvents(addEventMain);
            setSearchState(prev => ({
              ...prev,
              isLoading: false,
              error: null
            }));
          } else {
            setSearchState(prev => ({
              ...prev,
              isLoading: false,
              error: 'Failed to fetch nearby events',
            }));
          }
        }
      );
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to search for events',
      }));
    }
  }, []);

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

  // Handle search trigger
  const handleSearch = useCallback(() => {
    if (!currentLocation) return;
  
    if (isEventsView) {
      searchNearbyEvents(currentLocation);
    } else {
      searchNearbyPlaces(currentLocation);
    }
  }, [currentLocation, isEventsView, searchNearbyEvents, searchNearbyPlaces]);

  const handleEventsToggle = useCallback(() => {
    setIsEventsView(prev => !prev);
    if (currentLocation) {
      // Small timeout to ensure state has updated
      setTimeout(() => {
        if (!isEventsView) {
          searchNearbyEvents(currentLocation);
        } else {
          searchNearbyPlaces(currentLocation);
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

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('today');

  const handleAddMockEvent = () => {
    if (!currentLocation) return;
    
    const mockEvent = createMockEvent({
      lat: currentLocation.lat + 0.001,
      lng: currentLocation.lng + 0.001,
      name: "Community Festival 2024",
      type: "community"
    });
    
  setEvents(prevEvents => [...prevEvents, mockEvent]);
  };

/** 
  const handleAddEvent = () => {
    if (!currentLocation) return;
    
    const mainEvent = addMap({
      lat: currentLocation.lat + 0.001,
      lng: currentLocation.lng + 0.001,
      name: "Community Festival 2024",
      type: "community"
    });
    
    setEvents(prevEvents => [...prevEvents, mainEvent]);
  };

*/
//<Button>
  //onClick={mockEvent}
  //disabled={!currentLocation}
  //className={"ml-2"}
        
          
//</Button>

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4">
          
        

          <SearchHeader 
            onSearch={handleSearch}
            isRequestingLocation={isRequestingLocation}
            onFavoritesOpen={() => setFavoritesModalOpen(true)}
            onEventsToggle={handleEventsToggle}  // Use the new handler
            isEventsView={isEventsView}
            onAddOpen={()=> setOnAddModalOpen(true)}
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
          markers={isEventsView ? 
            filteredEvents.map(event => ({
              position: event.geometry.location,
              title: event.name
            })) :
            filteredPlaces.map(place => ({
              position: place.geometry.location,
              title: place.name
            }))
          }
          onMapLoad={handleMapLoad}
          showUserLocation={!!currentLocation}
          userLocation={currentLocation || undefined}
          onError={(error) => setSearchState(prev => ({ 
            ...prev, 
            error: error.message 
          }))}
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
        onClose={()=> setOnAddModalOpen(false)}
      />


    </div>
  );
};

export default Inbox;