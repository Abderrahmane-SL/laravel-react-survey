import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("TOKEN");
      window.location.reload();
      return error;
    }

    // Log detailed error information for debugging
    console.error("Axios Error:", {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config,
      url: error.config?.url,
      method: error.config?.method,
    });

    throw error;
  }
);

export default axiosClient;
