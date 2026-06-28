import axios from "axios";

const API = "http://localhost:5000/api/payment";

export const createPayment = (data) =>
  axios.post(API, data);

export const getPayments = () =>
  axios.get(API);