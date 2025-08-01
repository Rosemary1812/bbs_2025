import axios from 'axios';
import { ElLoading } from 'element-plus';
import message from "@/utils/Message";
import { he, ms, tr } from 'element-plus/es/locale/index.mjs';
import store from '../store';

const contentTypeForm = "application/x-www-form-urlencoded"
const contentTypeJson = "application/json"

const instance = axios.create({
    baseURL: "/api",
    timeout: 10 * 1000,
})
//请求前过滤器
let loading = null;
instance.interceptors.request.use((config) => {
    if (config.showLoading) {
        loading = ElLoading.service({
            lock: true,
            text: 'Loading...',
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 3000 // 增加zIndex，确保在Dialog之上
        })
    }
    return config;
}, (error) => {
    if (error.config.showLoading && loading) {
        loading.close();
    }
    message.error("请求发送失败")
    return Promise.reject("请求发送失败");
});

//响应后过滤器
instance.interceptors.response.use(
    (response) => {
        const { showLoading, errorCallback, showError } = response.config;
        if (showLoading && loading) {
            loading.close();
        }
        const responseData = response.data;
        console.log('API响应:', response.config.url, responseData);
        if (responseData.code == 200) {
            return responseData;
        } else if (responseData.code == 901) {
            store.commit("showLogin", true);
            store.commit("updateLoginUserInfo", null);
            return Promise.reject({ showError: false, msg: "登录超时" })
        } else {
            if (errorCallback) {
                errorCallback(responseData)
            }
            return Promise.reject({ showError: false, msg: responseData.info });
        }
    }, (error) => {
        console.error('网络请求错误:', error);
        if (error.config && error.config.showLoading && loading) {
            loading.close();
        }

        // 检查网络连接
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            return Promise.reject({ showError: true, msg: "无法连接到服务器，请检查网络连接或联系管理员" });
        }

        return Promise.reject({ showError: true, msg: "网络异常: " + (error.message || '未知错误') });
    }
);


const request = async (config) => {
    const { url, params, dataType, showLoading = true, errorCallback, showError = true } = config;
    let contentType = contentTypeForm;
    let fromData = new FormData();
    for (let key in params) {
        fromData.append(key, params[key] == undefined ? "" : params[key]);
    }
    if (dataType != null && dataType === "json") {
        contentType = contentTypeJson;
    }
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest'
    }
    try {
        return await instance.post(url, fromData, {
            headers: headers,
            showLoading: showLoading,
            errorCallback: errorCallback,
            showError: showError
        });
    } catch (error) {
        if (error.showError) {
            message.error(error.msg);
        }
        return null;
    }
}

export default request;
