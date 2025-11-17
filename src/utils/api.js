const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic API call function
const apiCall = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login', 'POST', { email, password }),
  
  register: (userData) => 
    apiCall('/auth/register', 'POST', userData),
};

// User APIs
export const userAPI = {
  getProfile: () => 
    apiCall('/users/me', 'GET', null, true),
  
  updateProfile: (userData) => 
    apiCall('/users/me', 'PUT', userData, true),
};

// Provider APIs
export const providerAPI = {
  getAll: (service = null) => {
    const query = service ? `?service=${service}` : '';
    return apiCall(`/providers${query}`, 'GET');
  },
  
  getById: (id) => 
    apiCall(`/providers/${id}`, 'GET'),
  
  create: (providerData) => 
    apiCall('/providers', 'POST', providerData, true),
};

// Service APIs
export const serviceAPI = {
  getAll: () => 
    apiCall('/services', 'GET'),
  
  getByCategory: (category) => 
    apiCall(`/services/category/${category}`, 'GET'),
};

// Booking APIs
export const bookingAPI = {
  getAll: () => 
    apiCall('/bookings', 'GET', null, true),
  
  getById: (id) => 
    apiCall(`/bookings/${id}`, 'GET', null, true),
  
  create: (bookingData) => 
    apiCall('/bookings', 'POST', bookingData, true),
  
  updateStatus: (id, status) => 
    apiCall(`/bookings/${id}/status`, 'PUT', { status }, true),
  
  delete: (id) => 
    apiCall(`/bookings/${id}`, 'DELETE', null, true),
};

// Order APIs
export const orderAPI = {
  getAll: () => 
    apiCall('/orders', 'GET', null, true),
  
  getById: (id) => 
    apiCall(`/orders/${id}`, 'GET', null, true),
  
  create: (orderData) => 
    apiCall('/orders', 'POST', orderData, true),
  
  updateStatus: (id, status) => 
    apiCall(`/orders/${id}/status`, 'PUT', { status }, true),
};

// Product APIs
export const productAPI = {
  getAll: (category = null) => {
    const query = category ? `?category=${category}` : '';
    return apiCall(`/products${query}`, 'GET');
  },
  
  getById: (id) => 
    apiCall(`/products/${id}`, 'GET'),
  
  create: (productData) => 
    apiCall('/products', 'POST', productData, true),
  
  update: (id, productData) => 
    apiCall(`/products/${id}`, 'PUT', productData, true),
  
  delete: (id) => 
    apiCall(`/products/${id}`, 'DELETE', null, true),
};

export default {
  authAPI,
  userAPI,
  providerAPI,
  serviceAPI,
  bookingAPI,
  orderAPI,
  productAPI,
};
