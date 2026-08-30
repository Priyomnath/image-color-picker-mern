import axios from "axios";

const api = axios.create({
  baseURL: "https://image-color-picker-mern.onrender.com/api",
  withCredentials: true,
});

//08/08/2026 {time:  PM}
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;
