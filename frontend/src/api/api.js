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

export const uploadImage = (formData, token) =>
  axios.post(`${API_BASE}/posts/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

export const createPost = (postData, token) =>
  axios.post(`${API_BASE}/posts`, postData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePost = (id, postData, token) =>
  axios.put(`${API_BASE}/posts/${id}`, postData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPost = (id) => axios.get(`${API_BASE}/posts/${id}`);

export const getCommentsForPost = (postId) =>
  axios.get(`${API_BASE}/posts/${postId}/comments`);

export const createCommentApi = (postId, commentData, token) =>
  axios.post(`${API_BASE}/posts/${postId}/comments`, commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const likePost = (postId, token) =>
  axios.post(
    `${API_BASE}/posts/${postId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deletePostApi = (postId, token) =>
  axios.delete(`${API_BASE}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
