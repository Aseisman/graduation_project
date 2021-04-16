import { Row, Col } from "antd";
import {
  TagOutlined,
  SisternodeOutlined,
  FunctionOutlined,
  HighlightOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import header_photo from "../../assets/1.jpg";
import { withRouter } from "react-router";
import * as actionCreators from "../../store/actionCreators";
import "./index.css";
import { connect } from "react-redux";
const Header = (props) => {
  const pathname = props.location.pathname;
  return (
    <>
      <Row className="header">
        <Col span={6} className="header_left">
          {props.user ? (
            <img
              src={props.user.user_avatar}
              className="header_photo"
              alt="照片"
            />
          ) : (
            <img src={header_photo} className="header_photo" alt="照片" />
          )}
        </Col>
        <Col span={12} className="header_center">
          <div
            // className={pathname === "/message" ? "menu-active" : "menu"}
            // onClick={() => pathname !== '/message' && props.history.push('/message')}
          >
            <a className={pathname === "/message" ? "menu-active" : "menu"} href="./message/index.html">
              <SisternodeOutlined />
              首页
            </a>
          </div>
          <div
            className={pathname === "/" ? "menu-active" : "menu"}
            onClick={() => pathname !== "/" && props.history.push("/")}
          >
            <TagOutlined />
            文章
          </div>
          <div
            className={pathname === "/leavingMessage" ? "menu-active" : "menu"}
            onClick={() =>
              pathname !== "/leavingMessage" && props.history.push("/leavingMessage")
            }
          >
            <FunctionOutlined />
            留言
          </div>
        </Col>
        <Col sm={12} md={6} span={6} className="header_right">
          {props.user ? (
            <>
              <img
                src={props.user.user_avatar}
                className="header_photo"
                alt="照片"
              />
              <div className="drop-down">
                <p
                  style={{
                    lineHeight: "3.5rem",
                    maxWidth: "15rem",
                    margin: "0",
                    whiteSpace: "nowrap",
                    fontSize: "1.3rem",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    minWidth: "15rem",
                  }}
                >
                  {props.user.user_name}
                </p>
                <div className="triangle"></div>
                <div className="drop-list">
                  <p
                    onClick={()=>{
                      props.history.push("/personal")
                    }}
                  >
                    <UserSwitchOutlined
                      style={{ color: "rgb(238, 113, 91)" }}
                    />
                    我的信息
                  </p>
                  <p
                    onClick={() => {
                      localStorage.clear();
                      mapDispatchToProps(null);
                      window.location.reload();
                    }}
                  >
                    <LogoutOutlined style={{ color: "rgb(238, 113, 91)" }} />
                    退出
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="register"
                onClick={() => props.history.push("register")}
              >
                注册
              </div>
              <div
                className="login"
                onClick={() => props.history.push("login")}
              >
                {" "}
                <HighlightOutlined />
                登录
              </div>
            </>
          )}
        </Col>
      </Row>
      <div className="header_height"></div>
      {props.children}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  //返回一个方法，传入props,要更新store就调用这个方法
  updateUser(data) {
    const action = actionCreators.setUser(data);
    dispatch(action);
  },
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
// export default withRouter(Header);
