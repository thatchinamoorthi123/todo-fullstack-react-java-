// API Service for communicating with Java Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/todos';

// Event listener for recording API activities in real-time (for Educational Inspector)
const activityListeners = [];

export const onApiActivity = (callback) => {
  activityListeners.push(callback);
  return () => {
    const idx = activityListeners.indexOf(callback);
    if (idx !== -1) activityListeners.splice(idx, 1);
  };
};

const notifyActivity = (action, method, endpoint, status, data, duration) => {
  activityListeners.forEach((fn) =>
    fn({
      id: Date.now() + Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      method,
      endpoint,
      status,
      data,
      duration: `${duration}ms`,
    })
  );
};

export const todoService = {
  // Check backend health
  async checkHealth() {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      const duration = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        notifyActivity('Health Check', 'GET', '/api/todos/health', res.status, data, duration);
        return { connected: true, data };
      }
      notifyActivity('Health Check', 'GET', '/api/todos/health', res.status, null, duration);
      return { connected: false, error: 'Server returned error status: ' + res.status };
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      notifyActivity('Health Check Failed', 'GET', '/api/todos/health', 'ERR_CONNECTION', { message: err.message }, duration);
      return { connected: false, error: err.message };
    }
  },

  // GET all todos
  async getAllTodos(search = '', completed = null) {
    const start = performance.now();
    let url = API_BASE_URL;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (completed !== null) params.append('completed', completed);
    if (params.toString()) url += `?${params.toString()}`;

    try {
      const res = await fetch(url);
      const duration = Math.round(performance.now() - start);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch todos`);
      const data = await res.json();
      notifyActivity('Fetch Todos', 'GET', url.replace('http://localhost:8080', ''), res.status, { count: data.length }, duration);
      return data;
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      notifyActivity('Fetch Failed', 'GET', url.replace('http://localhost:8080', ''), 'FAILED', { error: err.message }, duration);
      throw err;
    }
  },

  // POST create todo
  async createTodo(todo) {
    const start = performance.now();
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      const duration = Math.round(performance.now() - start);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to create todo`);
      const data = await res.json();
      notifyActivity('Create Todo', 'POST', '/api/todos', res.status, data, duration);
      return data;
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      notifyActivity('Create Failed', 'POST', '/api/todos', 'FAILED', { error: err.message }, duration);
      throw err;
    }
  },

  // PUT update todo
  async updateTodo(id, todo) {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      const duration = Math.round(performance.now() - start);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to update todo`);
      const data = await res.json();
      notifyActivity('Update Todo', 'PUT', `/api/todos/${id}`, res.status, data, duration);
      return data;
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      notifyActivity('Update Failed', 'PUT', `/api/todos/${id}`, 'FAILED', { error: err.message }, duration);
      throw err;
    }
  },

  // PATCH toggle completed status
  async toggleTodo(id) {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
      });
      const duration = Math.round(performance.now() - start);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to toggle todo status`);
      const data = await res.json();
      notifyActivity('Toggle Todo', 'PATCH', `/api/todos/${id}/toggle`, res.status, data, duration);
      return data;
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      notifyActivity('Toggle Failed', 'PATCH', `/api/todos/${id}/toggle`, 'FAILED', { error: err.message }, duration);
      throw err;
    }
  },

  // DELETE todo
  async deleteTodo(id) {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const duration = Math.round(performance.now() - start);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to delete todo`);
      const data = await res.json();
      notifyActivity('Delete Todo', 'DELETE', `/api/todos/${id}`, res.status, data, duration);
      return data;
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      notifyActivity('Delete Failed', 'DELETE', `/api/todos/${id}`, 'FAILED', { error: err.message }, duration);
      throw err;
    }
  },
};
