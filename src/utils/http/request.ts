import axios from 'axios';
import { getAccessToken, removeAccessToken } from '@/utils/token';
import useUserStore from '@/store/modules/user';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { addPending, removePending, getKey } from './dedupe';
import router from '@/router';

let refreshLock = false;
let paddingRequests: {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
}[] = [];

function flushQueue(error?: any) {
    paddingRequests.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
        } else {
            config.headers!['Authorization'] = getAccessToken();
            resolve(service(config));
        }
    });
    paddingRequests = [];
}

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
    // axios 请求基础URL, 开启代理时需要配置代理前缀,否则直接配置后端接口地址
    baseURL: import.meta.env.VITE_IS_REQUEST_PROXY ? import.meta.env.VITE_API_PREFIX : import.meta.env.VITE_API_URL,
    // 超时时间
    timeout: 30000,
});

// request拦截器
service.interceptors.request.use(
    (config) => {
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false;
        // 是否需要防止数据重复提交
        const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;

        if (getAccessToken() && !isToken) {
            config.headers['Authorization'] = getAccessToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        const key = getKey(config);
        if (key.length > 1024) {
            return config;
        }
        if (!isRepeatSubmit) {
            addPending(config);
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        removePending(error.config);
        Promise.reject({
            isCancel: axios.isCancel(error),
            message: error.message,
        });
    },
);

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        removePending(res.config);
        console.log(res);
        const code = res.data.code || 200;
        const msg = res.data.msg;
        // 二进制数据则直接返回
        if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
            return res.data;
        }
        if (code === 200) {
            return Promise.resolve(res.data);
        }
        return Promise.reject({
            isCancel: false,
            message: msg,
        });
    },
    async (error: AxiosError) => {
        removePending(error.config);
        if (axios.isCancel(error)) {
            return Promise.reject({
                isCancel: true,
                message: '请求已取消',
            });
        }
        if (error.status === 401) {
            const originalRequest = error.config as AxiosRequestConfig & {
                _retry: boolean;
            };
            if (originalRequest.url === '/refresh' || originalRequest._retry) {
                console.log(1);
                removeAccessToken();
                // location.href = '/login';
                // router.push({ path: 'login'});
                return Promise.reject('登录状态已过期,请重新登录!');
            }
            originalRequest._retry = true;
            if (refreshLock) {
                return new Promise((resolve, reject) => {
                    paddingRequests.push({
                        resolve,
                        reject,
                        config: originalRequest,
                    });
                });
            }
            refreshLock = true;
            try {
                await useUserStore().refresh();
                flushQueue();
                originalRequest.headers!['Authorization'] = getAccessToken();
                return service(originalRequest);
            } catch (error) {
                flushQueue('登录状态已过期,请重新登录!');
                location.href = '/login';
                return Promise.reject({
                    isCancel: false,
                    message: '登录状态已过期,请重新登录!',
                });
            } finally {
                refreshLock = false;
            }
        }
        console.log('err' + error);
        let { message } = error;
        if (message == 'Network Error') {
            message = '后端接口连接异常';
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时';
        } else if (message.includes('Request failed with status code')) {
            message = '系统接口' + message.slice(-3) + '异常';
        }
        return Promise.reject({
            isCancel: false,
            message: message,
        });
    },
);

export default service;
