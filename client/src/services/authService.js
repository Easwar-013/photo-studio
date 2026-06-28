import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const login = (data) => {
  return axios.post(`${API}/login`, data);
};

export const register = (data) => {
  return axios.post(`${API}/register`, data);
};