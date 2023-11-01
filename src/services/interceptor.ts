import axios, { AxiosInstance, AxiosRequestConfig } from "axios";


const api: AxiosInstance = axios.create({
    // baseURL: "http://172.16.244.40:84/api", // production server URL
    baseURL: "http://172.16.244.40:85/api"     // testing server URL
});

api.interceptors.request.use(
    (config: AxiosRequestConfig): any => {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${userToken}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
