export const createMockEvent = (params: {
    lat: number;
    lng: number;
    name?: string;
    type?: string;
  }) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      id: `event-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name || 'New Community Festival',
      description: 'Join us for this exciting community event featuring local artists, food vendors, and live performances!',
      start_time: now.toISOString(),
      end_time: tomorrow.toISOString(),
      location: '123 Main Street',
      type: params.type || 'community',
      capacity: 200,
      attendees: 0,
      geometry: {
        location: {
          lat: params.lat,
          lng: params.lng
        }
      }
    };
  };