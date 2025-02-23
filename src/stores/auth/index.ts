import { defineStore } from "pinia";
import apiClient from "@/services/api";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false); // Initially false, only true after login

  // Fetch CSRF token from Sanctum (required for all form submissions)
  const fetchCsrfToken = async () => {
    try {
      await apiClient.get("/sanctum/csrf-cookie");
    } catch (error) {
      console.error("Failed to fetch CSRF token", error);
      throw error;
    }
  };

  // Login: Fetch CSRF first, then attempt login
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/login", { email, password });
      user.value = response.data.user; // Store user data
      isAuthenticated.value = true; // Mark as authenticated
    } catch (error) {
      console.error("Login failed", error);
      isAuthenticated.value = false; // Ensure false on failure
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await apiClient.post("/logout", {});
      user.value = null;
      isAuthenticated.value = false; // Mark as unauthenticated
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Fetch current user (to check if already logged in)
  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/api/user");
      user.value = response.data;
      isAuthenticated.value = true; // User exists, so authenticated
    } catch (error) {
      console.error("Failed to fetch user", error);
      user.value = null;
      isAuthenticated.value = false; // No user, not authenticated
    }
  };

  return { user, isAuthenticated, login, logout, fetchUser, fetchCsrfToken };
});
