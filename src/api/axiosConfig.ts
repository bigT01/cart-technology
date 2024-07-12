import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance with basic settings
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://cabinet.vbox.kz/api', // Replace with your API base URL
    timeout: 10000, // Set a timeout limit for requests
    headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need here
    },
});

// Interceptor to handle request
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // You can modify the request config before sending it
        // For example, add an authorization token if you have one
        // config.headers.Authorization = `Bearer ${yourAuthToken}`;
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle response
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // You can modify the response data here
        return response;
    },
    (error: any) => {
        // Handle errors, e.g., show a notification or redirect to login
        return Promise.reject(error);
    }
);

export default axiosInstance;
