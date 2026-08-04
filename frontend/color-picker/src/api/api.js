import axios from "axios";

const api = axios.create({
  baseURL: "https://image-color-picker-mern.onrender.com/api",
  withCredentials: true,
});

//04/08/2026 {time:  PM}
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
