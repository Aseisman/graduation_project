import React, { useEffect, useState } from "react";
import { message, Spin, Button } from "antd";
import notification from "../../components/NotificationBox/index";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import "./index.css";
import { registerUser, mailSend } from "./service";
const Index = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [pwd, setPwd] = useState();
  const [vNum, setVNum] = useState();
  const [time, setTime] = useState(0);
  const register = async () => {
    if (!(email && name && pwd)) {
      notification({
        message: "信息不全",
        description: "请输入用户姓名、邮箱与密码",
      });
      return;
    }
    setLoading(true);
    let res = await registerUser({
      user_email: email,
      user_name: name,
      user_password: pwd,
      vNum:vNum
    });
    if (res.code === 200) {
      //创建成功，跳转登录界面
      message.success("创建成功，即将跳转到登录界面");
      setTimeout(() => history.push("/login"), 2000);
    } else {
      //错误
      message.error(res.msg);
      setLoading(false);
    }
  };
  const sendMail = async () => {
    var re = /^(([^()[\]\\.,;:\s@\"]+(\.[^()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        notification({ message: "错误", description:"邮箱格式有误"});
        return;
    }
    await mailSend({mail:email});
    setTime(60);
  };
  useEffect(() => {
    if (time != 0) {
      setTimeout(() => setTime((c) => c - 1), 1000);
    }
  }, [time]);
  return (
    <Spin spinning={loading} style={{ color: "rgb(238, 113, 91)" }}>
      <div className="all-box">
        <div className="register-box">
          <div className="register-form">
            <div className="register-title">Register</div>
            <Button
              danger
              type="text"
              style={{ position: "absolute", top: "11rem", right: "0rem" }}
              disabled={time != 0}
              onClick={() => sendMail()}
            >
              {time == 0 ? "发送验证码" : time + "后重新调用"}
            </Button>
            <input
              placeholder="Email"
              value={email || ""}
              onChange={(v) => setEmail(v.target.value)}
            />
            <input
              placeholder="Validate Code"
              value={vNum || ""}
              onChange={(v) => setVNum(v.target.value)}
            />
            <input
              placeholder="Name"
              value={name || ""}
              onChange={(v) => setName(v.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={pwd || ""}
              onChange={(v) => setPwd(v.target.value)}
            />
            <div className="common-button" onClick={() => register()}>
              Sign up
            </div>
            <div>
              Have account?{" "}
              <a onClick={() => props.history.push("/login")}>Sign in </a>
              now
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default withRouter(Index);
