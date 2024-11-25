import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SearchHeader } from './SearchHeader';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { FavoritesModal } from './FavoritesModal';
import Map from './Map';
import { Location, SearchState, Place } from './types';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('2000');
  const [selectedType, setSelectedType] = useState('restaurant');
  const [isFavoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
    results: []
  });
  
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  
  const mapServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const locationRetryCount = useRef(0);
  const searchCriteriaRef = useRef({ radius: selectedRadius, type: selectedType });
  const MAX_RETRY_ATTEMPTS = 3;

  const filteredPlaces = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return searchState.results;
    return searchState.results.filter(place => 
      place.name.toLowerCase().includes(query) ||
      place.vicinity.toLowerCase().includes(query) ||
      place.types.some(type => type.toLowerCase().includes(query))
    );
  }, [searchState.results, searchQuery]);

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

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    mapServiceRef.current = new google.maps.places.PlacesService(map);
    if (currentLocation) {
      searchNearbyPlaces(currentLocation);
    }
  }, [currentLocation, searchNearbyPlaces]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    searchCriteriaRef.current = {
      radius: selectedRadius,
      type: selectedType
    };

    if (currentLocation && mapServiceRef.current) {
      const timeoutId = setTimeout(() => {
        searchNearbyPlaces(currentLocation);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedRadius, selectedType, currentLocation, searchNearbyPlaces]);

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4">
          <SearchHeader 
            onSearch={() => currentLocation && searchNearbyPlaces(currentLocation)}
            isRequestingLocation={isRequestingLocation}
            onFavoritesOpen={() => setFavoritesModalOpen(true)}
          />
          
          {locationError && (
            <LocationErrorAlert 
              error={locationError}
              onRetry={requestLocation}
              isLoading={isRequestingLocation}
            />
          )}
        
          <SearchFilters
            searchQuery={searchQuery}
            selectedType={selectedType}
            selectedRadius={selectedRadius}
            onSearchChange={setSearchQuery}
            onTypeChange={setSelectedType}
            onRadiusChange={setSelectedRadius}
          />

          <SearchResults 
            isLoading={searchState.isLoading}
            error={searchState.error}
            places={filteredPlaces}
          />
        </div>
      </div>
      
      <div className="w-1/2 relative">
        <Map
            center={currentLocation || { lat: 0, lng: 0 }}
            zoom={14}
            height="100vh"
            markers={searchState.results.map(place => ({
                position: place.geometry.location,
                title: place.name
            }))}
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
      />
    </div>
  );
};

export default Inbox;