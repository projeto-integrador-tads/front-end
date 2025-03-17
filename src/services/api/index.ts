import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./endpoints";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("@App:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("@App:token");
      await AsyncStorage.removeItem("@App:user");
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message ||
                        error.message ||
                        'Ocorreu um erro na requisição';
                        
    return Promise.reject({
      status: error.response?.status,
      error: errorMessage,
      data: error.response?.data
    });
  }
);

export default api;
