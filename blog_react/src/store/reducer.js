import * as constants from './constants';
// import { fromJS } from 'immutable';

// 初始默认的state
// const defaultState = fromJS({
//     myData: 'test',
//     // user:{username:"张三",id:2313123123},
// });
const user = JSON.parse(localStorage.getItem('user'));
const defaultState = {
    myData: 'test',
    // user:{user_id:2313123123,user_name:"张三",user_email:"876956898@qq,com",user_sex:0,user_phone:"13512312323",user_avatar:"https://wx2.sinaimg.cn/mw690/006s6B2Gly1gn5sqhxbfkj30u0140wpf.jpg",is_allow:0},
    user: user ? user : '',
};
//eslint-disable-next-line
export default (state = defaultState, action) => {
    // 由于state是引用型，不能直接修改，否则是监测不到state发生变化的。因此需要先复制一份进行修改，然后再返回新的state。
    let newState = Object.assign({}, state);
    switch (action.type) {
        // case constants.SET_DATA:
        //     newState.myData = action.data
        //     return newState
        case constants.SET_USER:
            newState.user = action.data;
            return newState;
        default:
            return state;
    }
    //用immutable解决这个问题，之后可以直接修改action
    // switch (action.type) {
    //     case constants.SET_DATA:
    //         return state.set('myData', action.data);
    //     case constants.GET_USER:
    //         return state.set('user', action.data);
    //     default:
    //         return state;
    // }
};
