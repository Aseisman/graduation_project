import {request} from "../../utils/request"

//根据用户id查文章
export async function registerUser(data){
    return request('/users/register','post',data);
}
//发送邮箱验证码
export async function mailSend(data){
    return request('/users/mail','get',data);
}