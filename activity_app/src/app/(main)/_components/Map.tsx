import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { loadGoogleMapsScript } from './googleMapsLoader';
import { Place } from './types';

interface Location {
  lat: number;
  lng: number;
}

interface MapMarker {
  position: Location;
  title?: string;
  address?: string;
}

interface MapProps {
  center: Location;
  zoom: number;
  markers?: MapMarker[];
  height?: string;
  width?: string;
  onMapLoad?: (map: google.maps.Map) => void;
  onError?: (error: Error) => void;
  showUserLocation?: boolean;
  userLocation?: Location;
}

const MAP_ID = 'a71c0fa800231e0e';

const Map = ({ 
  center, 
  zoom, 
  markers = [], 
  height = '400px',
  width = '100%',
  onMapLoad,
  onError,
  showUserLocation = false,
  userLocation 
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const scriptLoadedRef = useRef(false);

  const geocodeAddress = async (address: string): Promise<Location | null> => {
    if (!google.maps) return null;
    
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address });
      if (response.results?.[0]?.geometry?.location) {
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

  const createUserLocationMarker = useCallback(async (position: Location) => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    const pinElement = document.createElement('div');
    pinElement.innerHTML = `
      <div class="relative">
        <!-- Outer pulse animation -->
        <div class="absolute -inset-4">
          <div class="w-12 h-12 rounded-full bg-blue-500 opacity-20 animate-[ping_2s_ease-in-out_infinite]"></div>
        </div>
        <!-- Inner pulse animation -->
        <div class="absolute -inset-2">
          <div class="w-8 h-8 rounded-full bg-blue-500 opacity-40 animate-[ping_2s_ease-in-out_infinite_0.75s]"></div>
        </div>
        <!-- Main marker -->
        <div class="relative">
          <!-- Outer circle -->
          <div class="w-6 h-6 rounded-full bg-blue-500 shadow-lg flex items-center justify-center">
            <!-- Inner dot -->
            <div class="w-3 h-3 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
    `;

    userMarkerRef.current = new AdvancedMarkerElement({
      map: mapInstanceRef.current,
      position,
      title: 'Your Location',
      content: pinElement,
    });

    // Add a subtle radius circle
    new google.maps.Circle({
      map: mapInstanceRef.current,
      center: position,
      radius: 75,
      fillColor: '#3B82F6',
      fillOpacity: 1,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.2,
      strokeWeight: 2,
    });
  }, []);

  const createMarker = useCallback(async (position: Location, title?: string) => {
    if (!mapInstanceRef.current) return null;
  
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    const marker = new AdvancedMarkerElement({
      position,
      map: mapInstanceRef.current,
      title
    });
  
    if (title) {
      // Create directions URL
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;
  
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-sm">
            <div class="mb-3">
              <div class="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
            <h3 class="font-bold text-lg mb-2">${title}</h3>
            <div class="flex flex-col gap-2">
              <div class="text-sm text-gray-600">
                ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Open Now</span>
                <span class="text-sm text-gray-600">• Closes at 10 PM</span>
              </div>
              <div class="flex items-center gap-1 text-sm">
                <span class="text-yellow-500">★★★★☆</span>
                <span class="text-gray-600">4.2 (328 reviews)</span>
              </div>
              <div class="mt-2 flex gap-2">
                <a 
                  href="${directionsUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors no-underline"
                >
                  Get Directions
                </a>
                <button class="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        `
      });
  
      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
    }
  
    return marker;
  }, []);

  const updateMarkers = useCallback(async () => {
    if (!mapInstanceRef.current) return;

    // Clean up existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    // Process each marker
    const newMarkers = await Promise.all(markers.map(async (markerData) => {
      let position = markerData.position;

      // If address is provided and position is not valid, try to geocode
      if (markerData.address && (!position.lat || !position.lng || (position.lat === 0 && position.lng === 0))) {
        const geocodedPosition = await geocodeAddress(markerData.address);
        if (geocodedPosition) {
          position = geocodedPosition;
        } else {
          console.warn(`Failed to geocode address: ${markerData.address}`);
          return null;
        }
      }

      return createMarker(position, markerData.title);
    }));

    // Filter out null markers (failed geocoding)
    markersRef.current = newMarkers.filter((marker): marker is google.maps.marker.AdvancedMarkerElement => marker !== null);
  }, [markers, createMarker]);

  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      
      const mapOptions: google.maps.MapOptions = {
        center,
        zoom,
        mapId: MAP_ID,
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        zoomControl: true,
        disableDefaultUI: false,
        clickableIcons: false,
      };

      mapInstanceRef.current = new Map(mapRef.current, mapOptions);

      if (onMapLoad && mapInstanceRef.current) {
        onMapLoad(mapInstanceRef.current);
      }

      await updateMarkers();

      if (showUserLocation && userLocation) {
        await createUserLocationMarker(userLocation);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize map');
      setError(error.message);
      onError?.(error);
    }
  }, [center, zoom, onMapLoad, onError, showUserLocation, userLocation, createUserLocationMarker, updateMarkers]);

  useEffect(() => {
    const loadMap = async () => {
      if (!scriptLoadedRef.current) {
        try {
          await loadGoogleMapsScript();
          scriptLoadedRef.current = true;
          setIsLoaded(true);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to load Google Maps');
          setError(error.message);
          onError?.(error);
        }
      }
    };

    loadMap();

    return () => {
      markersRef.current.forEach(marker => marker.map = null);
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
      }
      markersRef.current = [];
    };
  }, [onError]);

  useEffect(() => {
    if (isLoaded && !mapInstanceRef.current) {
      initMap();
    }
  }, [isLoaded, initMap]);

  useEffect(() => {
    if (mapInstanceRef.current && userLocation && showUserLocation) {
      createUserLocationMarker(userLocation);
    }
  }, [userLocation, showUserLocation, createUserLocationMarker]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [markers, updateMarkers]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center]);

  if (!isLoaded) {
    return (
      <div 
        style={{ width, height }}
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        role="progressbar"
        aria-label="Loading map..."
      >
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ width, height }}
        className="rounded-lg overflow-hidden shadow-lg"
        role="application"
        aria-label="Google Map"
      />
      {isLocating && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Getting your location...</span>
        </div>
      )}
    </div>
  );
};

export default Map;