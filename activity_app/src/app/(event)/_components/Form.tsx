"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Event {
  _id: string;
  name: string;
  description: string;
  location: string;
  capacity: string;
}

const initialFormState = {
  name: '',
  description: '',
  location: '',
  capacity: ''
};

const EventForm = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  // Create new event
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  // Update event
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEvent._id,
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
    }
  };

  // Delete event
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      
      await fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  // Set up edit mode
  const handleEditClick = (event: Event) => {
    setFormMode('edit');
    setSelectedEvent(event);
    setFormData({
      name: event.name || '',
      description: event.description || '',
      location: event.location || '',
      capacity: event.capacity || ''
    });
  };

  // Cancel edit mode
  const handleCancel = () => {
    setFormMode('create');
    setSelectedEvent(null);
    setFormData(initialFormState);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{formMode === 'create' ? 'Create New Event' : 'Edit Event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formMode === 'create' ? handleCreate : handleUpdate} className="space-y-4">
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
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location">Location</label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="capacity">Capacity</label>
              <Input
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {formMode === 'create' ? 'Create Event' : 'Update Event'}
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

      {/* Events List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <p>No events found.</p>
            ) : (
              events.map((event) => (
                <Card key={event._id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{event.name}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-sm">Location: {event.location}</p>
                        <p className="text-sm">Capacity: {event.capacity}</p>
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
                          onClick={() => handleDelete(event._id)}
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
    </>
  );
};

export default EventForm;