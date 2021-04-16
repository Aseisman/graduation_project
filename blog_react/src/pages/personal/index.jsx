import React, { useEffect, useState } from "react";
import { Form, Radio, Input, Button, message, Modal } from "antd";
import { withRouter } from "react-router";
import { detail, update } from "./service";
import notification from "../../components/NotificationBox/index";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const Personal = (props) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState({});
  let publisher = JSON.parse(localStorage.getItem("user"));

  let findUser = async () => {
    let res = await detail({ user_id: publisher.user_id });
    setUser(res.user[0]);
    form.setFieldsValue(res.user[0]);
  };
  useEffect(() => {
    if (publisher) findUser();
  }, []);
  const onFinish = async (values) => {
    let condition = {
      ...values,
      user_id: user.user_id,
    };
    let res = await update(condition);
    if (res.code == 200) {
      message.success("更新成功");
      publisher.user_name = condition.user_name;
      publisher.user_phone = condition.user_phone;
      publisher.user_sex = condition.user_sex;
      localStorage.setItem("user", JSON.stringify(publisher));
    } else {
      notification({ message: "错误", description: res.msg });
    }
  };
  if (!publisher) {
    setTimeout(() => props.history.push("/"), 3000);
    return (
      <Modal title="错误提示" visible={true} closable={false} footer={null}>
        未登录
      </Modal>
    );
  } else {
    return (
      <div style={{ width: "100%", textAlign: "center" }}>
        <img
          src={user ? user.user_avatar : ""}
          alt="头像"
          style={{
            width: "10rem",
            height: "10rem",
            borderRadius: "50%",
            margin: "3rem",
          }}
        />
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
          form={form}
        >
          <Form.Item
            name="user_name"
            label="用户名"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="user_email"
            label="邮箱"
            rules={[
              {
                type: "email",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="user_sex" label="性别">
            <Radio.Group>
              <Radio value={0}>男</Radio>
              <Radio value={1}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="user_phone" label="手机号">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
};
export default withRouter(Personal);
