import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const normalizeAuthPayload = (data = {}) => ({
  ...data,
  username: data.username ?? data.name,
  email: data.email?.trim().toLowerCase() || "",
  password: data.password || "",
});

export const registerUser = (data) =>
  axios.post(`${API}/api/auth/register`, normalizeAuthPayload(data));

export const loginUser = (data) =>
  axios.post(`${API}/api/auth/login`, normalizeAuthPayload(data));
