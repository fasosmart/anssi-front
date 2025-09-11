import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Let Axios handle the Content-Type header
});

apiClient.interceptors.request.use(
  (config) => {
    // Set content type to application/json only if data is not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    // The browser will automatically set the correct Content-Type and boundary for FormData
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
