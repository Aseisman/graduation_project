import { request } from '../../utils/request';

//查找label
export async function labelList(data) {
    return request('/labels/find', 'get', data);
}

//更新
export async function updateCondition(data) {
    return request('/articles/updateCondition', 'post', data);
}
//上传图片
export async function uploadPhoto(data){
    return request('/upload/photo','file',data);
}