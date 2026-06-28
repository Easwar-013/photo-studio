import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/payment`;

export const createPayment = (data) =>
  axios.post(API, data);

export const getPayments = () =>
  axios.get(API);