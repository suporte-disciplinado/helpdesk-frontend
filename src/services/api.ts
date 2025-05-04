import axios from 'axios';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8080', withCredentials: true });

axiosServices.interceptors.request.use(
    async (config) => {
        //const accessToken = btoa("email_login:senha");
        const accessToken = localStorage.getItem('serviceToken');
        if (accessToken) {
            config.headers['Authorization'] = `Basic ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401 && !window.location.href.includes('/login')) {
            window.location.pathname = '/login';
        }
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;

