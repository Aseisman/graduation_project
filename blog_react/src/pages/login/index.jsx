import React, { useState } from 'react';
import { message, Spin } from 'antd';
import notification from '../../components/NotificationBox/index';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actionCreators';
import './index.css';
import { loginUser } from './service';
const Index = props => {
    const [email, setEmail] = useState("878@qq.com");
    const [loading, setLoading] = useState(false);
    const [pwd, setPwd] = useState("123456");
    const login = async () => {
        if (!(email && pwd)) {
            notification({ message: '信息不全', description: '请输入用户姓名、邮箱与密码' });
            return;
        }
        setLoading(true);
        let res = await loginUser({ user_email: email, user_password: pwd });
        if (res.code === 200) {
            //登录成功
            //登录完之后，把user放入localstorage，token放入localstorage
            let token=res.data.token;
            let user={...res.data};
            delete user.token;
            localStorage.setItem("user",JSON.stringify(user));
            localStorage.setItem("token",token);
            props.updateUser(user);
            message.success("登录成功，即将跳转到文章界面");
            setTimeout(()=>{
                props.history.push("/")
            },2000)
        } else {
            //错误
            message.error(res.msg);
        }
        setLoading(false);
    };
    return (
        <Spin spinning={loading} style={{ color: 'rgb(238, 113, 91)' }}>
            <div className="all-box">
                <div className="login-box">
                    <div className="login-form">
                        <div className="login-title">Rosella</div>
                        <input
                            placeholder="Email"
                            value={email || ''}
                            onChange={v => setEmail(v.target.value)}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={pwd || ''}
                            onChange={v => setPwd(v.target.value)}
                        />
                        <div className="common-button" onClick={() => login()}>Sign in</div>
                        <div>
                            Dont have account?{' '}
                            <a onClick={() => props.history.push('/register')}>Sign Up </a>now
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

const mapDispatchToProps = dispatch => ({
    //返回一个方法，传入props,要更新store就调用这个方法
    updateUser(data) {
        const action = actionCreators.setUser(data);
        dispatch(action);
    },
});
export default withRouter(connect(null,mapDispatchToProps)(Index));
