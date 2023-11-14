// axiosInterceptor.ts

import axios from "axios";

const axiosInstance = axios.create();

let isRefreshing = false;
let failedRequests: any[] = [];

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (email) {
      config.headers["X-User-Email"] = email;
    }
    if (refreshToken) {
      config.headers["X-User-Refresh-Token"] = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        try {
          await new Promise((resolve) => {
            failedRequests.push(() => resolve(axiosInstance(originalRequest)));
          });
          return;
        } catch (error) {
          return Promise.reject(error);
        }
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your token refresh endpoint to get the new access token
        const newAccessToken = error.response.data.data[0].newAccessToken;
        localStorage.setItem("token", newAccessToken);

        // Update the authorization header with the new access token
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        const response = await axiosInstance(originalRequest);
        isRefreshing = false;
        failedRequests.forEach((prom) => prom());
        failedRequests = [];
        return response;
      } catch (refreshError) {
        isRefreshing = false;
        failedRequests.forEach((prom) => prom());
        failedRequests = [];
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
