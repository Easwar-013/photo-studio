import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/payroll`;

export const getPayroll = () =>
  axios.get(API);

export const generatePayroll = (data) =>
  axios.post(`${API}/generate`, data);