export interface EventLink {
  id: string;
  originalUrl: string;
  viewCount: number;
  flagCount: number;
  isDisabled: boolean;
  createdAt: Date;
  lastViewedAt?: Date;
}

export interface EventResponse {
  originalUrl: string;
  isDisabled?: boolean;
  flagCount?: number;
  message?: string;
}

export const getRecentEvents = async (): Promise<EventLink[]> => {
  const response = await fetch('/api/events/list');
  if (!response.ok) {
     try {
        const error = await response.json();
        throw new Error(error.message);
     } catch (e) {
        throw new Error(`获取活动列表失败: ${response.statusText}`);
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
    throw new Error(errorData.message || '创建活动链接失败');
  }

  return response.json();
};

export const getOriginalUrl = async (id: string): Promise<EventResponse> => {
  const response = await fetch(`/api/events/${id}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // If disabled (410), still return the data so UI can handle it
    if (response.status === 410) {
      return data;
    }
    throw new Error(data.message || '获取活动链接失败');
  }

  return data;
};

export const flagEvent = async (id: string): Promise<{ flagCount: number; isDisabled: boolean }> => {
  const response = await fetch('/api/events/flag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '标记活动失败');
  }

  return response.json();
};
