import { config, logger } from './config.js';

const BACKEND_URL = config.apiUrl;

// Helper function to make authenticated requests
const makeAuthRequest = async (url, options = {}, token) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  logger.debug('Making API request:', { url: `${BACKEND_URL}${url}`, method: options.method || 'GET' });

  try {
    const response = await fetch(`${BACKEND_URL}${url}`, {
      ...options,
      headers,
      timeout: config.apiTimeout,
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error('API request failed:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    logger.debug('API request successful:', { url: `${BACKEND_URL}${url}`, data });
    return data;
  } catch (error) {
    logger.error('API request error:', error);
    throw error;
  }
};

// Task API functions
export const taskApi = {
  // Get filtered tasks
  getFilteredTasks: async (filters = {}, token) => {
    const query = [];
    if (filters.status && filters.status !== 'all') {
      query.push(`status=${filters.status}`);
    }
    if (filters.priority && filters.priority !== 'all') {
      query.push(`priority=${filters.priority}`);
    }
    if (filters.search && filters.search.trim()) {
      query.push(`title=${encodeURIComponent(filters.search)}`);
    }
    
    const queryString = query.length ? `?${query.join('&')}` : '';
    return makeAuthRequest(`/api/tasks/filter${queryString}`, {}, token);
  },

  // Get all tasks with pagination
  getAllTasks: async (page = 1, limit = 10, token) => {
    const queryString = `?page=${page}&limit=${limit}`;
    return makeAuthRequest(`/api/tasks${queryString}`, {}, token);
  },

  // Create a new task
  createTask: async (taskData, token) => {
    return makeAuthRequest('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }, token);
  },

  // Update a task (for future use when update endpoint is implemented)
  updateTask: async (taskId, taskData, token) => {
    return makeAuthRequest(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }, token);
  },

  // Delete a task (for future use when delete endpoint is implemented)
  deleteTask: async (taskId, token) => {
    return makeAuthRequest(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    }, token);
  },
};

export default taskApi;
