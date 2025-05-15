import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Set config defaults when creating the instance
const instance: AxiosInstance = axios.create({
    baseURL: 'https://api.ftss.id.vn/api/v1',
});
instance.defaults.withCredentials = true;

// Hàm để refresh token
// const refreshToken = async () => {
//     try {
//         const refresh_token = localStorage.getItem('refresh_token');
//         if (!refresh_token) {
//             throw new Error('No refresh token found');
//         }

//         // Gọi API để refresh token
//         const response = await axios.post(
//             'https://souvi-be-v1.onrender.com/auth/refresh-token',
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${refresh_token}`,
//                 },
//             },
//         );

//         const access_token = response.data.data.access_token;

//         // Lưu lại access token mới và thời gian hết hạn nếu cần
//         localStorage.setItem('access_token', access_token);
//         localStorage.setItem('refresh_token', response.data.data.refresh_token);

//         return access_token;
//     } catch (error) {
//         console.error('Failed to refresh token:', error);
//         // Nếu refresh token thất bại, có thể chuyển người dùng đến trang đăng nhập hoặc thông báo lỗi
//         return null;
//     }
// };

// Add a request interceptor
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Lấy token mới nhất từ localStorage
        const access_token = localStorage.getItem('access_token');

        if (access_token) {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }

        // Do something before the request is sent
        return config;
    },
    (error) => {
        // Do something with the request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
let isToastShown = false;

instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Đảm bảo reset cờ sau khi response thành công
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi là 401 và toast chưa được hiển thị
        if (error.response?.status === 401 && !isToastShown) {
            isToastShown = true; // Đánh dấu rằng toast đã được hiển thị
            await toast.warning('Phiên bản đã hết hạn xin hãy đăng nhập lại');

            // Xóa token trong localStorage
            localStorage.removeItem('access_token');

            // Chuyển người dùng về trang đăng nhập (nếu cần)
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);

            // Reset lại cờ sau một khoảng thời gian
            setTimeout(() => {
                isToastShown = false;
            }, 3000); // Đặt thời gian phù hợp với tình huống của bạn
        }

        return Promise.reject(error);
    },
);

export default instance;
