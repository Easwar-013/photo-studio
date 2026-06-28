import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/jobcards`;

export const getJobs = () => axios.get(API);

export const createJob = (data) =>
  axios.post(API, data);

export const updateJob = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteJob = (id) =>
  axios.delete(`${API}/${id}`);