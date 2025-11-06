import axios from "axios";

const API_BASE = "http://localhost:3001/api";

export const loginApi = (username, password) =>
  axios.post(`${API_BASE}/auth/login`, { username, password });

export const registerApi = (username, password) =>
  axios.post(`${API_BASE}/auth/register`, { username, password });

export const getPosts = ({ search = "", tag = "", page = 1 }) =>
  axios.get(`${API_BASE}/posts`, { params: { search, tag, page } });

export const getUserProfile = (username, token) =>
  axios.get(
    `${API_BASE}/users/profile/${username}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  );
