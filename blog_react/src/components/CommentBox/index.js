import React, { useState } from "react";
import "./index.css";
import {
    addComment,
  } from "./service";
import { Comment,Modal,message, Avatar,Input,Button } from "antd";
import notification from "../../components/NotificationBox/index";
const { TextArea } = Input;
const CommmentBox = (props) => {
  const [isModalVisible,setIsModalVisible]=useState(false);
  const [loading,setLoading]=useState(false);
  const [comment,setComment]=useState("");
  const handleOk=async ()=>{
      setLoading(true);
      let condition=props.condition;
      condition.comment_content=comment;
      condition.parent_comment=props.comment.comment_content;
      condition.parent_comment_id=props.comment.comment_id;
      condition.parent_comment_user_name=props.comment.user_name;
      console.log(condition);
      let res = await addComment(condition);
      if (res.code === 200) {
        message.success("评论成功");
        // this.getArticleList();
        setIsModalVisible(false);
        setLoading(false);
        //回调函数刷新列表
        props.callback();
      } else {
        notification({ message: "错误", description: res.msg });
      }

  }
  const handleCancel=()=>{
    setIsModalVisible(false);
  }
  return (
    <>
    <Comment
      actions={[
        <span key="comment-nested-reply-to" onClick={() =>setIsModalVisible(true)}>
          回复
        </span>
      ]}
      author={<a>{props.comment.user_name}</a>}
      avatar={<Avatar src={props.comment.user_avatar} alt="Han Solo" />}
      content={
        <>
          {props.comment.parent_comment_id?<p style={{padding:" 0.3rem 1rem",margin: "1rem 0",background: "rgb(244, 244, 244)",color: "rgb(121 118 118)", borderRadius: "5px"}}>{props.comment.parent_comment_user_name}: {props.comment.parent_comment}</p>:""}
          <p>{props.comment.comment_content}</p>
        </>
      }
    >
      {props.children}
    </Comment>
    <Modal title="评论" visible={isModalVisible} footer={[<Button key="submit" type="primary" loading={loading} onClick={()=>handleOk()}>评论</Button>]} onCancel={handleCancel} >
        <TextArea
            showCount
            onChange={(e) => setComment(e.target.value)}
            maxLength={100}
            placeholder={`回复${props.comment.user_name}:`}
            autoSize={{ minRows: 2, maxRows: 2 }}
            row={2}
          />
    </Modal>
    </>
  );
};
export default CommmentBox;
