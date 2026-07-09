/**
 * API SERVICE - All Axios calls to Spring Boot backend
 * 
 * WHY create a separate service file?
 * → All API URLs are in ONE place (easy to change base URL)
 * → Components don't need to know about HTTP details
 * → Easy to test and mock
 * 
 * AXIOS vs FETCH:
 * → Axios automatically converts response to JSON
 * → Axios has better error handling
 * → Axios supports request/response interceptors
 * → Axios works in older browsers
 */

import axios from 'axios';

// Base URL of your Spring Boot API
// Using relative path '/api' so it works in ALL environments:
//   - Docker locally  → Nginx proxies /api → backend container
//   - AWS EC2         → Nginx proxies /api → backend container
//   - Local dev       → React proxy in package.json handles it
const BASE_URL = '/api';

/**
 * Create an Axios instance with default config
 * This way we don't repeat the base URL in every call
 */
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',  // We're sending JSON
    },
    timeout: 10000, // 10 second timeout
});

/**
 * REQUEST INTERCEPTOR
 * Runs before every request is sent
 * Useful for adding auth tokens (JWT) to headers
 */
api.interceptors.request.use(
    (config) => {
        // If you have a JWT token stored, add it here:
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Runs after every response is received
 * Useful for global error handling
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================================
// TASK API FUNCTIONS
// ============================================================

/**
 * GET all tasks (with optional filters)
 * 
 * params object examples:
 *   {}                    → GET /api/tasks
 *   { status: 'TODO' }    → GET /api/tasks?status=TODO
 *   { search: 'meeting' } → GET /api/tasks?search=meeting
 */
export const getAllTasks = (params = {}) => {
    return api.get('/tasks', { params });
};

/**
 * GET single task by ID
 * GET /api/tasks/5
 */
export const getTaskById = (id) => {
    return api.get(`/tasks/${id}`);
};

/**
 * POST - Create new task
 * Sends: { title, description, status, priority }
 */
export const createTask = (taskData) => {
    return api.post('/tasks', taskData);
};

/**
 * PUT - Update entire task
 * Sends: { title, description, status, priority }
 */
export const updateTask = (id, taskData) => {
    return api.put(`/tasks/${id}`, taskData);
};

/**
 * PATCH - Update only status
 * PATCH /api/tasks/5/status?status=COMPLETED
 */
export const updateTaskStatus = (id, status) => {
    return api.patch(`/tasks/${id}/status`, null, { params: { status } });
};

/**
 * DELETE - Delete a task
 * DELETE /api/tasks/5
 */
export const deleteTask = (id) => {
    return api.delete(`/tasks/${id}`);
};

export default api;
