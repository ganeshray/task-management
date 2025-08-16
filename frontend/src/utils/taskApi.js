const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to make authenticated requests
const makeAuthRequest = async (url, options = {}, token) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
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
