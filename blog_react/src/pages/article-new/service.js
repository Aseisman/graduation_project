import {request} from "../../utils/request"

//根据用户id查文章
export async function findByUserId(data){
    return request('/articles/findByUserId','get',data);
}
//新建文章
export async function createArticle(data){
    return request('/articles/add',"post",data);
}
//删除文章
export async function deleteArticle(params){
    return request('/articles/delete','delete',params);
}
export async function updateArticle(params){
    return request('/articles/update','post',params)
}