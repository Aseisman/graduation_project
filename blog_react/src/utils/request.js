import axios from "axios";
import QS from "qs"
// 创建axios实例
const service = axios.create({
  baseURL: "http://localhost:5000", // api的base_url
  timeout: 10000, // 请求超时时间
  responseType: "json",
//   withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// console.log('process.env.BASE_URL',process.env.BASE_URL)
// request拦截器 axios的一些配置
// service.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if(token){
//         config.headers["Authorization"]=token;
//     }
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//      // for debug
//     return Promise.reject(error);
//   }
// );

// respone拦截器 axios的一些配置
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    return Promise.reject(error);
  }
);

//进行封装处理
const request = (url, method, params) => {
    return new Promise((resolve, reject) => {
        if (method === "post") {
            service.post(url,QS.stringify(params))
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else if (method === "get") {
            service.get(url, {
                    params: params
                })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else if (method === "put") {
            service.put(url, params)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else if (method === "delete") {
            console.log(params)
            service.delete(url, {data:QS.stringify(params)})
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else if (method === "file"){
            service.headers={
                "Content-Type":"multipart/form-data"
            }
            var form =new FormData();
            form.append('file',params.file);
            service.post(url,form)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
};
export{
    service,
    request
};
