import axios from "axios";

const api = axios.create({
  baseURL: "https://image-color-picker-mern.onrender.com",
  withCredentials: true,
});

export default api;