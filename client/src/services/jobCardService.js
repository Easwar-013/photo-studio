import axios from "axios";

const API = "http://localhost:5000/api/jobcards";

export const getJobs = () => axios.get(API);

export const createJob = (data) =>
  axios.post(API, data);

export const updateJob = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteJob = (id) =>
  axios.delete(`${API}/${id}`);