import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5555";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cloudinary-hosted images already carry a full URL; local-disk uploads are served
// through the /car/image/:id route instead.
export const getCarImageUrl = (car) =>
  car.image?.startsWith("http") ? car.image : `${API_URL}/car/image/${car._id}`;

export default api;
