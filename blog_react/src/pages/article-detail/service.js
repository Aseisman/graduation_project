import {request} from "../../utils/request"

//用户id找用户信息
export async function findByUserId(data){
    return request('/users/findById','get',data);
}
//文章详情
export async function findArticleById(data){
    return request('/articles/findOne','get',data);
}
//添加评论
export async function addComment(data){
    return request("/comments/add",'post',data);
}
//评论列表
export async function findCommentById(data){
    return request('/comments/findById','get',data);
}
//点赞
export async function addAgree(data){
    return request("/articles/like","post",data);
}
//判断是否已点赞
export async function isAgree(data){
    return request("/articles/isLike",'get',data);
}
//举报
export async function report(data){
    return request("/articles/report",'post',data);
}