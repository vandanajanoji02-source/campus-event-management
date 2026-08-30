import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Services

// User APIs
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getAllStudents: () => api.get('/users/students')
};

// Event APIs
export const eventAPI = {
  getAllEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getEventStatistics: (id) => api.get(`/events/${id}/statistics`)
};

// Registration APIs
export const registrationAPI = {
  registerForEvent: (eventId) => api.post('/registrations', { eventId }),
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  cancelRegistration: (registrationId, reason) =>
    api.delete(`/registrations/${registrationId}`, { data: { reason } }),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  checkRegistration: (eventId) => api.get(`/registrations/check/${eventId}`)
};

// Health check
export const checkHealth = () => api.get('/health');

export default api;
