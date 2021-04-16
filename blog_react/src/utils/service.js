import {request} from "./request"

//文章列表
export async function articlesList(data) {
    return request('/articles/find', 'get', data);
}
//文章详情
export async function articleDetail(data) {
    return request('/articles/findOne', 'get', data);
}
//标签列表
export async function tagList() {
    return request('/tags/all', 'get', '');
}

