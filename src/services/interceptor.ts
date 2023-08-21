// services/interceptor.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:3030/", // Replace with your JSON Server URL
});

api.interceptors.request.use(
    (config: AxiosRequestConfig): any => {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            config.headers = {
                ...config.headers,
                Authorization: userToken,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;