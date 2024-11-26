import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { loadGoogleMapsScript, isGoogleMapsLoaded } from './googleMapsLoader';
interface MapProps {
  
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markers?: Array<{
    position: {
     
      lat: number;
      lng: number;
    };
    title?: string;
  }>;
  height?: string;
  width?: string;
  onMapLoad?: (map: google.maps.Map) => void;
  onError?: (error: Error) => void;
  showUserLocation?: boolean;
  userLocation?: {
    lat: number;
    lng: number;
  };
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

  const createUserLocationMarker = useCallback(async (position: {lat: number; lng: number}) => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    const pinElement = document.createElement('div');
    pinElement.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background: #4A90E2;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `;

    userMarkerRef.current = new AdvancedMarkerElement({
      map: mapInstanceRef.current,
      position: position,
      title: 'Your Location',
      content: pinElement,
    });

    new google.maps.Circle({
      map: mapInstanceRef.current,
      center: position,
      radius: 50,
      fillColor: '#4A90E2',
      fillOpacity: 1,
      strokeColor: '#4A90E2',
      strokeOpacity: 0.3,
      strokeWeight: 1,
    });
  }, []);

  const updateMarkers = useCallback(async () => {
    if (!mapInstanceRef.current) return;

    // Clean up existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // Create new markers
    const newMarkers = await Promise.all(markers.map(async (markerData) => {
      const marker = new AdvancedMarkerElement({
        position: markerData.position,
        map: mapInstanceRef.current!,
        title: markerData.title  //<----values.name
      });

      if (markerData.title) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div class="p-2"><h3 class="font-bold">${markerData.title}</h3></div>`
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      }

      return marker;
    }));

    markersRef.current = newMarkers;
  }, [markers]);

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