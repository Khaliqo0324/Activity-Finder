import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Map from './Map';

interface Location {
  lat: number;
  lng: number;
}

interface Place {
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

interface SearchState {
  isLoading: boolean;
  error: string | null;
  results: Place[];
}

const RADIUS_OPTIONS = [
  { value: '1000', label: '1 km' },
  { value: '2000', label: '2 km' },
  { value: '5000', label: '5 km' },
  { value: '10000', label: '10 km' }
] as const;

const PLACE_TYPES = [
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'cafe', label: 'Cafes' },
  { value: 'gym', label: 'Gyms' },
  { value: 'park', label: 'Parks' },
  { value: 'museum', label: 'Museums' },
  { value: 'library', label: 'Libraries' }
] as const;

const SearchInbox = () => {
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

  // Memoize filtered places
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
        return "Location access was denied. Please enable location services in your browser settings.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable. Please try again.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "Unable to get your location. Please try again.";
    }
  };

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsRequestingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setCurrentLocation(location);
      locationRetryCount.current = 0;
      setLocationError(null);
      
      // Center map on new location
      if (mapInstance) {
        mapInstance.panTo(location);
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        setLocationError(getLocationErrorMessage(error));
      } else {
        setLocationError("Failed to get location. Please try again.");
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

  // Initialize location request
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Handle search criteria changes
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

  const LocationErrorAlert = () => (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{locationError}</AlertDescription>
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-4"
        onClick={requestLocation}
        disabled={isRequestingLocation}
      >
        {isRequestingLocation ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Retrying...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Retry
          </>
        )}
      </Button>
    </Alert>
  );

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Discover Nearby Places</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-white"
                onClick={() => currentLocation && searchNearbyPlaces(currentLocation)}
                disabled={!currentLocation || isRequestingLocation}
              >
                {isRequestingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                Discover
              </Button>
              <Button 
                variant="outline" 
                className="bg-white" 
                onClick={() => setFavoritesModalOpen(true)}
              >
                Favorites
              </Button>
            </div>
          </div>
          
          {locationError && <LocationErrorAlert />}
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search places..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PLACE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRadius} onValueChange={setSelectedRadius}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                {RADIUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {searchState.isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : searchState.error ? (
            <Alert variant="destructive">
              <AlertDescription>{searchState.error}</AlertDescription>
            </Alert>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No places found
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <Card key={place.id} className="hover:bg-gray-50">
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
                        <p className="text-xs text-gray-500">
                          {place.user_ratings_total} reviews
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {place.types.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="capitalize"
                      >
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
      
      <div className="w-1/2 relative">
        {!currentLocation && !locationError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Getting your location...</p>
            </div>
          </div>
        ) : currentLocation ? (
          <Map
            center={currentLocation}
            zoom={14}
            height="100vh"
            markers={searchState.results.map(place => ({
              position: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
              },
              title: place.name
            }))}
            onMapLoad={handleMapLoad}
            showUserLocation={true}
            userLocation={currentLocation}
            onError={(error) => {
              setSearchState(prev => ({
                ...prev,
                error: error.message
              }));
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <p className="text-gray-700 mb-4">Unable to load map</p>
              <Button 
                variant="outline" 
                onClick={requestLocation}
                disabled={isRequestingLocation}
              >
                {isRequestingLocation ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {isFavoritesModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Favorites</h2>
              <button onClick={() => setFavoritesModalOpen(false)} className="text-xl">×</button>
            </div>
            <div className="space-y-4">
              {/* Favorites content goes here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInbox;