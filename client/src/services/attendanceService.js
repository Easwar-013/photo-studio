import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/attendance`;

export const checkIn = (data) =>
  axios.post(`${API}/checkin`, data);

export const checkOut = (data) =>
  axios.post(`${API}/checkout`, data);

export const getAttendance = () =>
  axios.get(API);