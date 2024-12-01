import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
// Import Button from your components
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {InfoWindow} from "@react-google-maps/api";
import { useEffect } from "react";

// Map container style
const mapContainerStyle = {
    width: "100%",
    height: "100vh", // Full height for the map
  };
  
  // Initial center for Athens, GA
  const initialCenter = { lat: 33.9519, lng: -83.3576 };
  
  // Form validation schema
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
  });
  
  type FormValues = z.infer<typeof formSchema>;
  
  const Inbox = () => {
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
    const [filteredEvents, setFilteredEvents] = useState<any[]>([]); // Placeholder for event data
    const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [markers, setMarkers] = useState<{ lat: number, lng: number, name: string, description: string }[]>([]);
    const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);
  
    const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
    });
  
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      libraries: ["places"],
    });
  
    // Handle form submission to add a marker
    const onSubmit = (data: FormValues) => {
      if (selectedLocation) {
        if (selectedMarkerIndex === null) {
          // Add new marker
          setMarkers((prevMarkers) => [
            ...prevMarkers,
            { ...selectedLocation, name: data.name, description: data.description },
          ]);
        } else {
          // Update existing marker
          setMarkers((prevMarkers) =>
            prevMarkers.map((marker, index) =>
              index === selectedMarkerIndex
                ? { ...marker, name: data.name, description: data.description }
                : marker
            )
          );
        }
        reset(); // Reset form after submission
        setIsFormVisible(false); // Hide form after adding or updating event
        setSelectedMarkerIndex(null); // Reset selected marker index
      }
    };
  
    // Autocomplete functionality
    const handleAutocompleteLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
      setAutocomplete(autocompleteInstance);
    };
  
    const handlePlaceChanged = () => {
      if (autocomplete) {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location?.lat();
          const lng = place.geometry.location?.lng();
          if (lat && lng) {
            setSelectedLocation({ lat, lng });
            setCurrentLocation(new google.maps.LatLng(lat, lng)); // Update map center
          }
        }
      }
    };
  
    const handleMapLoad = (map: google.maps.Map) => {
      // Center the map based on the user's location
      if (currentLocation) {
        map.setCenter(currentLocation);
      }
    };
  
    const handleDeleteMarker = (markerIndex: number) => {
      setMarkers((prevMarkers) => prevMarkers.filter((_, index) => index !== markerIndex));
    };
  
    const handleMarkerClick = (index: number) => {
      setSelectedMarkerIndex(index);
      setValue("name", markers[index].name);
      setValue("description", markers[index].description);
      setIsFormVisible(true); // Show form to update
    };
  
    const handleCloseForm = () => {
      setIsFormVisible(false);
      setSelectedMarkerIndex(null); // Reset selected marker index
    };
  
    // Get nearby events based on location (this is just a placeholder logic)
    useEffect(() => {
      if (currentLocation) {
        // In a real app, you would fetch nearby events from an API based on currentLocation
        const nearbyEvents = [
          { lat: currentLocation.lat(), lng: currentLocation.lng(), name: "Sample Event 1", description: "Description of event 1" },
          { lat: currentLocation.lat() + 0.01, lng: currentLocation.lng() + 0.01, name: "Sample Event 2", description: "Description of event 2" },
        ];
        setFilteredEvents(nearbyEvents);
      }
    }, [currentLocation]);
  
    if (!isLoaded) return <div>Loading...</div>;
  
    return (
      <div className="flex w-screen h-screen">
        {/* Left Sidebar */}
        <div className="w-1/3 p-4 border-r border-gray-200 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4">
            {/* Button to toggle Add Event Form */}
            <Button 
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="mb-4 bg-blue-500 text-white p-2 rounded"
            >
              {isFormVisible ? "Close Form" : "Add Event"}
            </Button>
  
            {/* Add Event Form (Hidden by default, only shows when isFormVisible is true) */}
            {isFormVisible && (
              <div className="absolute top-16 left-4 w-96 p-4 border rounded shadow-lg bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <input
                    {...register("name")}
                    placeholder="Event Name"
                    className="border rounded p-2"
                    required
                  />
                  <input
                    {...register("description")}
                    placeholder="Event Description"
                    className="border rounded p-2"
                    required
                  />
                  {/* Autocomplete Input for Location */}
                  <Autocomplete
                    onLoad={handleAutocompleteLoad}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search for a location"
                      className="border rounded p-2"
                    />
                  </Autocomplete>
                  <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {selectedMarkerIndex === null ? "Add Marker" : "Update Marker"}
                  </button>
                  {selectedMarkerIndex !== null && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMarker(selectedMarkerIndex)}
                      className="bg-red-500 text-white p-2 rounded mt-2"
                    >
                      Delete Marker
                    </button>
                  )}
                </form>
              </div>
            )}
  
            {/* Display Events List (simplified) */}
            <div className="space-y-4 mt-8">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No nearby events found</div>
              ) : (
                filteredEvents.map((event, index) => (
                  <div key={index} className="p-4 border rounded mb-2">
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-gray-500">{event.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
  
        {/* Right Map Section (Map will take 2/3 of the width) */}
        <div className="w-2/3 relative">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentLocation || initialCenter}
            zoom={14}
            onLoad={handleMapLoad}
          >
            {/* Markers based on events */}
            {markers.map((event, index) => (
              <Marker
                key={index}
                position={{ lat: event.lat, lng: event.lng }}
                title={event.name}
                onClick={() => handleMarkerClick(index)}
              >
                {selectedMarkerIndex === index && (
                  <InfoWindow onCloseClick={handleCloseForm}>
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p>{event.description}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        </div>
      </div>
    );
  };
  
  export default Inbox;