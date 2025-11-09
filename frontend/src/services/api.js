import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { create } from "zustand";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  try {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    return JSON({ message: "no token " + error });
  }
});

export default api;
