"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EVENT_TYPES, EventType } from "@/app/(main)/_components/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Script from 'next/script';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface Props {
  onLocationSelect: (data: LocationData) => void;
  initialValue?: string;
}

const LocationAutocomplete: React.FC<Props> = ({
  onLocationSelect,
  initialValue = '',
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && !autocompleteRef.current) {
      const input = inputRef.current;
      if (input) {
        // Initialize Autocomplete
        autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
          fields: ['formatted_address', 'geometry'],
        });

        // Initialize Geocoder
        geocoderRef.current = new window.google.maps.Geocoder();

        // Add place_changed listener
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.geometry && place.geometry.location) {
            const locationData = {
              address: place.formatted_address || input.value,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setInputValue(locationData.address);
            onLocationSelect(locationData);
          } else {
            // Fallback to geocoding if no geometry is available
            const inputAddress = input.value;
            if (inputAddress) {
              geocodeAddress(inputAddress);
            }
          }
        });
      }
    }
  }, [onLocationSelect]);

  const geocodeAddress = (address: string) => {
    console.log('Geocoding address:', address);
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];
          const locationData = {
            address: result.formatted_address,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          };
          setInputValue(locationData.address);
          onLocationSelect(locationData);
        } else {
          console.error(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const address = e.target.value;
    if (address) {
      geocodeAddress(address);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="location-input">Location</label>
      <Input
        id="location-input"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Enter a location"
      />
    </div>
  );
};

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  type: EventType;
  capacity: number;
  start_time: string;
  end_time: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  attendees?: number;
}

interface FormData {
  name: string;
  description: string;
  location: string;
  type: EventType;
  capacity: number;
  start_time: string;
  end_time: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  attendees: number;
}

const initialFormState: FormData = {
  name: '',
  description: '',
  location: '',
  type: 'custom',
  capacity: 0,
  start_time: new Date().toISOString().slice(0, 16),
  end_time: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  geometry: {
    location: {
      lat: 0,
      lng: 0
    }
  },
  attendees: 0
};

const EventForm = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormState);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        geometry: {
          location: {
            ...prev.geometry.location,
            [name]: parseFloat(value) || 0
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'capacity' || name === 'attendees'
          ? parseInt(value) || 0 
          : value
      }));
    }
  };

  const handleTypeChange = (value: EventType) => {
    setFormData(prev => ({ ...prev, type: value }));
  };
/*
This submit handler:

Prevents the default form submission behavior

Sets a loading state and clears any previous errors

Makes a POST request to the /api/events endpoint with the form data

If successful, it refreshes the events list and resets the form

If there's an error, it displays an error message
Finally, it turns off the loading state regardless of success or failure
*///
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to create event');
      
      await fetchEvents();
      setFormData(initialFormState);
    } catch (err) {
      setError('Failed to create event');
      console.error('Error creating event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEvent.id,
          ...formData
        })
      });
      
      if (!response.ok) throw new Error('Failed to update event');
      
      await fetchEvents();
      setFormMode('create');
      setSelectedEvent(null);
      setFormData(initialFormState);
    } catch (err) {
      setError('Failed to update event');
      console.error('Error updating event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (event: Event) => {
    setFormMode('edit');
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      location: event.location,
      type: event.type,
      capacity: event.capacity,
      start_time: event.start_time.slice(0, 16),
      end_time: event.end_time.slice(0, 16),
      geometry: event.geometry,
      attendees: event.attendees || 0
    });
  };

  const handleCancel = () => {
    setFormMode('create');
    setSelectedEvent(null);
    setFormData(initialFormState);
  };

  const handleLocationSelect = (locationData: LocationData) => {
    setFormData(prev => ({
      ...prev,
      location: locationData.address,
      geometry: {
        location: {
          lat: locationData.lat,
          lng: locationData.lng
        }
      }
    }));
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>{formMode === 'create' ? 'Create New Event' : 'Edit Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formMode === 'create' ? handleCreate : handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type">Event Type</label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <LocationAutocomplete
                    onLocationSelect={handleLocationSelect}
                    initialValue={formData.location}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="capacity">Capacity</label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="start_time">Start Time</label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="end_time">End Time</label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {formMode === 'edit' && (
                  <div className="space-y-2">
                    <label htmlFor="attendees">Current Attendees</label>
                    <Input
                      id="attendees"
                      name="attendees"
                      type="number"
                      value={formData.attendees}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                  ) : formMode === 'create' ? 'Create Event' : 'Update Event'}
                </Button>
                {formMode === 'edit' && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No events found</p>
              ) : (
                events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{event.name}</h3>
                            <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                              {EVENT_TYPES.find(t => t.value === event.type)?.label || event.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <p className="text-sm">Location: {event.location}</p>
                          <p className="text-sm">Capacity: {event.capacity}</p>
                          <p className="text-sm">Start: {new Date(event.start_time).toLocaleString()}</p>
                          <p className="text-sm">End: {new Date(event.end_time).toLocaleString()}</p>
                          <p className="text-sm">
                            Coordinates: {event.geometry.location.lat}, {event.geometry.location.lng}
                          </p>
                          {event.attendees !== undefined && (
                            <p className="text-sm">Attendees: {event.attendees}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(event)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
export default EventForm;