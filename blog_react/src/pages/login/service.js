import {request} from "../../utils/request"

//根据用户id查文章
export async function loginUser(data){
    return request('/users/login','post',data);
}