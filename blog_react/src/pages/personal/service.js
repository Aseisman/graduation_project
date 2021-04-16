import {request} from "../../utils/request"

//找人
export async function detail(data){
    return request('/users/findById','get',data);
}
//更新
export async function update(data){
    return request('/users/update','post',data);
}