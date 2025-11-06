import axios from "axios";

const API_BASE = "http://localhost:3001/api/auth";

export const loginApi = (username, password) =>
  axios.post(`${API_BASE}/login`, { username, password });

export const registerApi = (username, password) =>
  axios.post(`${API_BASE}/register`, { username, password });
