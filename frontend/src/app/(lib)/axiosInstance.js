// https://medium.com/@iamshahrukhkhan07/how-to-create-http-middleware-with-axios-in-react-next-js-70966ddf7865
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 10000,
});


axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');

        // If token exists, add it to the Authorization header
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle generic errors
axiosInstance.interceptors.response.use(
    (response) => response, // Simply return the response if no error
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., token expired, invalid token)
            console.error('Unauthorized, redirecting to login...');
            localStorage.removeItem('accessToken'); // Optionally remove the token
            // window.location.href = '/login'; // Redirect to log in
        }
        return Promise.reject(error); // Reject any other errors
    }
);

export default axiosInstance;
