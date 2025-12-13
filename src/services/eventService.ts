export interface EventLink {
  id: string;
  originalUrl: string;
  viewCount: number;
  createdAt: Date;
  lastViewedAt?: Date;
}

export const getRecentEvents = async (): Promise<EventLink[]> => {
  const response = await fetch('/api/events/list');
  if (!response.ok) {
     try {
        const error = await response.json();
        throw new Error(error.message);
     } catch (e) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
     }
  }
  return response.json();
};

export const createEventLink = async (url: string): Promise<EventLink> => {
  const response = await fetch('/api/events/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create event link');
  }

  return response.json();
};

export const getOriginalUrl = async (id: string): Promise<{ originalUrl: string }> => {
  const response = await fetch(`/api/events/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch event link');
  }

  return response.json();
};
