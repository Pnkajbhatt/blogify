// stores/auth.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      error: null,

      login: async (credentials) => {
        try {
          const response = await api.post("/api/auth/login", credentials);
          const { token, ...userData } = response.data;
          set({ user: userData, token, error: null });
          return true;
        } catch (error) {
          set({ error: error.response?.data?.message || "Login failed" });
          return false;
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post("/api/auth/register", userData);
          const { token, ...user } = response.data;
          set({ user, token, error: null });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
          });
          return false;
        }
      },

      setAuth: (user, token) => set({ user, token, error: null }),

      logout: () => set({ user: null, token: null, error: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateError: () => console.log("Rehydrate failed"),
    }
  )
);

// Optional: Listen to storage events to sync logout across tabs
window.addEventListener("storage", (e) => {
  if (e.key === "auth-storage" && !e.newValue) {
    useAuthStore.getState().logout();
  }
});
