import axios from "axios";

const API = "http://localhost:5000/api/payroll";

export const getPayroll = () =>
  axios.get(API);

export const generatePayroll = (data) =>
  axios.post(`${API}/generate`, data);