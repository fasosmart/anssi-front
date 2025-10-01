import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptors should only run on the client-side
if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use(
    async (config) => {
      // If an Authorization header is not already set, try to add one from the session
      if (!config.headers['Authorization']) {
          const session = await getSession();
          if (session?.accessToken) {
            config.headers['Authorization'] = `Bearer ${session.accessToken}`;
          }
      }
      
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Check for 401 error and ensure it's not a retry request
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const session = await getSession();
          if (session?.refreshToken) {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt/refresh/`, 
              { refresh: session.refreshToken }
            );
  
            const { access } = response.data;
            
            // For the current and subsequent requests, we update the axios instance's default header
            // and the original request's header.
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            
            return apiClient(originalRequest);
          } else {
            // No refresh token found, sign out
            signOut({ callbackUrl: '/login' });
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          signOut({ callbackUrl: '/login' });
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
} else {
  // For server-side, just set the content type
  apiClient.interceptors.request.use(
    (config) => {
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}


export const getAccreditationTypes = async () => {
  const response = await apiClient.get('/api/demands/types/');
  return response.data;
};

export const createDemand = async (entitySlug: string) => {
  const response = await apiClient.post(`/api/${entitySlug}/demands/`);
  return response.data;
};

export const updateDemand = async (entitySlug: string, demandSlug: string, data: any) => {
  const response = await apiClient.patch(`/api/${entitySlug}/demands/${demandSlug}/`, data);
  return response.data;
};

export const submitDemand = async (entitySlug: string, demandSlug: string) => {
  const response = await apiClient.post(`/api/${entitySlug}/demands/${demandSlug}/submit/`);
  return response.data;
};

export const getDemands = async (entitySlug: string) => {
  const response = await apiClient.get(`/api/${entitySlug}/demands/`);
  return response.data;
};

export const deleteDemand = async (entitySlug: string, demandSlug: string) => {
  const response = await apiClient.delete(`/api/${entitySlug}/demands/${demandSlug}/`);
  return response.data;
};

export const makeDemandDraft = async (entitySlug: string, demandSlug: string) => {
  const response = await apiClient.post(`/api/${entitySlug}/demands/${demandSlug}/make-draft/`);
  return response.data;
};

export default apiClient;
