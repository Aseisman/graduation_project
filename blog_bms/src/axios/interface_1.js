import { request } from './index'

export default {

    expertLogin: (data) => {
        return request('/admins/login', 'post', data)
    },
    //标签列表
    tagList: (data) => {
        return request('/labels/all', 'get', data)
    },
    //新增标签
    tagAdd:(data)=>{
        return request('/labels/add','post',data);
    },
    tagUpdate:(data)=>{
        return request('/labels/update','post',data);
    },
    //文章列表
    articleList:(data)=>{
        return request('/articles/all','get',data);
    },
    //查找文章详情
    articleById:(data)=>{
        return request('/articles/findOne','get',data);
    },
    //删除
    articleDelete:(data)=>{
        return request("/articles/delete","delete",data);
    },
    //审核文章
    articleAudit:(data)=>{
       return request("/articles/audit",'post',data);  
    },
    
    //用户列表
    userList:(data)=>{
        return request('/users/find','get',data);
    },
    //禁用
    userDelete:(data)=>{
        return request('/users/delete','delete',data);
    }


    // //专家注册
    // register: (data) => {
    //     return request('/api/expert/register', 'post', data)
    // },
    // //获取验证码
    // verify: (data) => {
    //     return request('/api/email/verify', 'post', data)
    // },
    // //获取专家个人信息
    // info: () => {
    //     return request('/api/expert/info', 'get', "")
    // },
    // //更新信息
    // updateMessage: (data) => {
    //     return request('/api/expert/update/info', 'post', data)
    // },
    // //修改密码
    // updatePassword: (data) => {
    //     return request('/api/expert/update/password', 'post', data)
    // },


    // //问题部分
    // answer: (data) => {
    //     return request('/api/question/answer', 'post', data)
    // },
    // deleteQuestion: (data) => {
    //     return request('/api/question/deleteQuestion', 'delete', data)
    // },
    // getQuestionRecord: (data) => {
    //     return request('/api/question/getQuestionRecord', 'get', data)
    // },
    // getQuestionsInfo: (data) => {
    //     return request('/api/question/getQuestionsInfo', 'get', data)
    // },
    // newQuestion: (data) => {
    //     return request('/api/question/newQuestion', 'post', data)
    // },
    // updateStatus: (data) => {
    //     return request('/api/question/updateStatus', 'post', data)
    // },
}