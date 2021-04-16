import {request} from "../../utils/request"

//列表
export async function findLMessage(){
    return request('/lmessages/find','get','');
}
//添加
export async function addLMessage(data){
    return request('/lmessages/add','post',data);
}