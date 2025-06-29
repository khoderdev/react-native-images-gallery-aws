import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getApiBaseUrl } from "../config/environment";
import { AuthResponse, ImageData, User } from "../types";

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const TOKEN_KEY = "auth_token";

export const tokenManager = {
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },
};

api.interceptors.request.use(async (config) => {
  const token = await tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenManager.removeToken();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token } = response.data;
      await tokenManager.setToken(token);
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token } = response.data;
      await tokenManager.setToken(token);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  },

  logout: async (): Promise<void> => {
    await tokenManager.removeToken();
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get("/users/me");
      return response.data.user;
    } catch (error: any) {
      console.error("Get current user error:", error);
      throw new Error(
        error.response?.data?.error || "Failed to get user profile"
      );
    }
  },
};

export const imageApi = {
  uploadImage: async (
    imageData: string,
    folder: string = "gallery"
  ): Promise<ImageData> => {
    try {
      const response = await api.post("/images/upload", {
        imageData,
        folder,
      });
      return response.data.image;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.response?.data?.error || "Failed to upload image");
    }
  },

  getAllImages: async (): Promise<ImageData[]> => {
    try {
      const response = await api.get("/images");
      return response.data.images || [];
    } catch (error: any) {
      console.error("Get images error:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch images");
    }
  },

  getMyImages: async (): Promise<ImageData[]> => {
    try {
      const response = await api.get("/images/my-images");
      return response.data.images || [];
    } catch (error: any) {
      console.error("Get my images error:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch your images"
      );
    }
  },

  getImageById: async (id: number): Promise<ImageData> => {
    try {
      const response = await api.get(`/images/${id}`);
      return response.data.image;
    } catch (error: any) {
      console.error("Get image error:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch image");
    }
  },

  deleteImage: async (id: number): Promise<void> => {
    try {
      await api.delete(`/images/${id}`);
    } catch (error: any) {
      console.error("Delete image error:", error);
      throw new Error(error.response?.data?.error || "Failed to delete image");
    }
  },
};

export const userApi = {
  getUserProfile: async (
    userId: string
  ): Promise<{
    id: number;
    first_name: string;
    last_name: string;
    created_at: string;
    images: ImageData[];
  }> => {
    try {
      const response = await api.get(`/users/profile/${userId}`);
      return response.data.profile;
    } catch (error: any) {
      console.error("Get user profile error:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch user profile"
      );
    }
  },

  getUserById: async (
    userId: string
  ): Promise<{
    id: number;
    first_name: string;
    last_name: string;
    created_at: string;
  }> => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.user;
    } catch (error: any) {
      console.error("Get user by ID error:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
  },
};

export default api;
