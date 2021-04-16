import {request} from "../../utils/request"
//添加评论
export async function addComment(data){
    return request("/comments/add",'post',data);
}