import axios from "axios";
import { getSession } from "next-auth/react";
import { OpenAPI } from "./api/core/OpenAPI";
import { request } from "./api/core/request";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://idegin-cloud-backend.fly.dev/api/v1/private";

// Ensure OpenAPI.BASE is set if API_BASE_URL is available
if (API_BASE_URL && !OpenAPI.BASE) {
  OpenAPI.BASE = API_BASE_URL;
}

// Validate API_BASE_URL before creating axios client
if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. API calls may fail.");
}

export const apiClient = axios.create({
  ...(API_BASE_URL && { baseURL: API_BASE_URL }),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and org user ID
apiClient.interceptors.request.use(
  async (config) =>
  {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }

      // Add current org user ID if stored in localStorage
      const currentOrgUserId = localStorage.getItem("currentOrgUserId");
      if (currentOrgUserId) {
        config.headers[ "x-org-user-id" ] = currentOrgUserId;
      }
    }
    return config;
  },
  (error) =>
  {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) =>
  {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const session = await getSession();

        if (session?.user?.refreshToken) {
          try {
            const refreshUrl = API_BASE_URL || OpenAPI.BASE || "";
            if (!refreshUrl) {
              window.location.href = "/auth/login";
              return Promise.reject(new Error("API URL not configured"));
            }

            const response = await axios.post(`${refreshUrl}/auth/refresh-token`, {
              refreshToken: session.user.refreshToken,
            });

            const { accessToken } = response.data.data;

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        } else {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
