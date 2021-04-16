import axios from 'axios'
import QS from 'qs'
//Vue.prototype.GLOBAL = global_ //挂载到Vue实例上面
const Axios = axios.create({
    // baseURL: "/apis", // 因为我本地做了反向代理
    // baseURL: "http://129.28.152.92:8080",
    baseURL:"http://localhost:5000",
    timeout: 10000,
    responseType: "json",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});
// //传参序列化 拦截器
// Axios.interceptors.request.use(
//     config => {
//         //   if (config.method === 'post' || config.method === 'PUT' || config.method === 'DELETE') {
//         config.data = qs.stringify(config.data);
//         const token = localStorage.getItem("token");
//         //  }
//         if (token) {
//             config.headers["Authorization"] = token;
//         }
//         return config;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );
// //返回状态判断 拦截器
// Axios.interceptors.response.use(
//     res => {
//         if (res.code == "401") {
//             localStorage.removeItem("token");
//             this.$router.replace("/");
//             // console.log("报错401")
//         }
//         if (res.data && res.status != "200") {
//             return Promise.reject(res);
//         }
//         return res;
//     },
//     error => {
//         //404等问题可以在这里处理
//         return Promise.reject(error);
//     }
// );
//进行封装处理
const request = (url, method, params) => {
    return new Promise((resolve, reject) => {
        if (method == "post") {
            Axios.post(url, QS.stringify(params))
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else if (method == "get") {
            Axios.get(url, {
                    params: params
                })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else if (method == "put") {
            Axios.put(url, params)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else if (method == "delete") {
            Axios.delete(url, {data:QS.stringify(params)})
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
};

export {
    Axios
};
export {
    request
};