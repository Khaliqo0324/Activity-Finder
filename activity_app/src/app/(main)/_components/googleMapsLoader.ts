// Create a new file: googleMapsLoader.ts

let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = () => {
  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Return immediately if already loaded
  if (isLoaded) {
    return Promise.resolve();
  }

  // Create new loading promise
  loadPromise = new Promise<void>((resolve, reject) => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      reject(new Error('Google Maps API key is not configured'));
      return;
    }

    // Check if script already exists
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      isLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker&v=beta`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      resolve();
    };

    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isGoogleMapsLoaded = () => isLoaded;