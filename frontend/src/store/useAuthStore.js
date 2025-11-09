// stores/auth.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // This broadcasts logout to all tabs!
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
