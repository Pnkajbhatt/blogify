import api from "../services/api";
import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: [],
  loading: false,

  fetchPost: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/api/post");
      set({ posts: response.data?.data || [], loading: false });
    } catch (error) {
      console.error("Fetch posts failed:", error);
      set({ posts: [], loading: false });
    }
  },
  clearPosts: () => set({ posts: [] }),
}));
