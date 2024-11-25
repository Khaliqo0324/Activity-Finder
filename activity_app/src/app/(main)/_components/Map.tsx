'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const Map = ({ 
  center, 
  zoom, 
  markers = [], 
  height = '400px',
  width = '100%',
  onMapLoad,
  onError 
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    try {
      const mapOptions: google.maps.MapOptions = {
        center,
        zoom,
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        zoomControl: true,
      };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map: mapInstanceRef.current,
          title: markerData.title,
          animation: window.google.maps.Animation.DROP,
        });
        markersRef.current.push(marker);
      });

      if (onMapLoad && mapInstanceRef.current) {
        onMapLoad(mapInstanceRef.current);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize map');
      setError(error.message);
      onError?.(error);
    }
  }, [center, zoom, markers, onMapLoad, onError]);

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
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
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
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, [onError]);

  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded, initMap]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div 
        style={{ width, height }}
        className="bg-gray-100 rounded-lg animate-pulse"
        role="progressbar"
        aria-label="Loading map..."
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ width, height }}
      className="rounded-lg overflow-hidden"
      role="application"
      aria-label="Google Map"
    />
  );
};

export default Map;