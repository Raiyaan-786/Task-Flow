import axios from 'axios';

// Create an instance of axios with the base URL
const API = axios.create({
  baseURL: 'http://localhost:4000/api',  // Your backend URL
});

// Set the JWT token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;