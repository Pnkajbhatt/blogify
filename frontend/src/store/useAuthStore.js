import { create } from "zustand";
import { persist } from "zustand/middleware"; // npm i zustand/middleware if needed
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "auth-storage" }
  )
);
