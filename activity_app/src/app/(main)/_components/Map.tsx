import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

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
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const isInitializedRef = useRef(false);

  const createUserLocationMarker = useCallback((position: {lat: number; lng: number}) => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    userMarkerRef.current = new google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4A90E2',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      },
      zIndex: 1000,
      animation: google.maps.Animation.DROP,
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

    const infoWindow = new google.maps.InfoWindow({
      content: '<div class="p-2 text-sm"><strong>You are here</strong></div>'
    });

    userMarkerRef.current.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, userMarkerRef.current);
    });
  }, []);

  // Update user location marker when userLocation changes
  useEffect(() => {
    if (showUserLocation && userLocation && mapInstanceRef.current) {
      createUserLocationMarker(userLocation);
    }
  }, [showUserLocation, userLocation, createUserLocationMarker]);

  const initMap = useCallback(() => {
    if (!mapRef.current || isInitializedRef.current) return;

    try {
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

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
      isInitializedRef.current = true;

      if (onMapLoad && mapInstanceRef.current) {
        onMapLoad(mapInstanceRef.current);
      }

      // Initialize user location marker if available
      if (showUserLocation && userLocation) {
        createUserLocationMarker(userLocation);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize map');
      setError(error.message);
      onError?.(error);
    }
  }, [center, zoom, onMapLoad, onError, showUserLocation, userLocation, createUserLocationMarker]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = markers.map((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        animation: window.google.maps.Animation.DROP,
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
    });
  }, [markers]);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        const error = new Error('Google Maps API key is not configured');
        setError(error.message);
        onError?.(error);
        return;
      }

      try {
        if (!window.google) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=beta`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
              setIsLoaded(true);
              resolve();
            };
            script.onerror = () => {
              reject(new Error('Failed to load Google Maps script'));
            };
            document.head.appendChild(script);
          });
        } else {
          setIsLoaded(true);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load Google Maps');
        setError(error.message);
        onError?.(error);
      }
    };

    loadGoogleMaps();

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      markersRef.current = [];
    };
  }, [onError]);

  // Initialize map when loaded
  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded, initMap]);

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