import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { addLMessage, findLMessage } from "./service";
import { Form, Input, message, Button, Comment, Avatar } from "antd";
import * as style from "./index.module.css";
import notification from "../../components/NotificationBox/index";
const { TextArea } = Input;
const LeavingMessage = (props) => {
  let publisher = JSON.parse(localStorage.getItem("user"));
  const [list, setList] = useState([]);
  useEffect(() => {
    findList();
  }, []);
  let findList = async () => {
    let res = await findLMessage();
    console.log(res);
    setList(res.data);
  };
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const onFinish = async (values) => {
    let condition = {
      user_id: publisher.user_id,
      user_name: publisher.user_name,
      user_avatar: publisher.user_avatar,
      msg: values.msg,
    };
    let res = await addLMessage(condition);
    if (res.code == 200) {
      message.success("评论成功");
      findList();
    } else {
      notification({ message: "错误", description: res.msg });
    }
  };
  return (
    <>
      <Form
        {...layout}
        name="basic"
        onFinish={onFinish}
        style={{
          marginTop: "3rem",
          width: "70%",
          display: "flex",
          flexDirection: "column",
          marginLeft: "15%",
        }}
      >
        <Form.Item
          label="留言"
          name="msg"
          rules={[
            {
              required: true,
              message: "请输入留言",
            },
          ]}
        >
          <TextArea
            className={style["ant-textarea"]}
            showCount
            maxLength={100}
            autoSize={{ minRows: 2, maxRows: 2 }}
            row={2}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            留言
          </Button>
        </Form.Item>
      </Form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
          精选留言
        {list.map((v) => {
          return (
            <Comment
              style={{ width: "45rem",borderBottom: "1px solid #cccaca"}}
              author={<a>{v.user_name}</a>}
              avatar={<Avatar src={v.user_avatar} alt="Han Solo" />}
              content={
                <>
                  <p>{v.msg}</p>
                </>
              }
            >
              {props.children}
            </Comment>
          );
        })}
      </div>
    </>
  );
};
export default withRouter(LeavingMessage);
