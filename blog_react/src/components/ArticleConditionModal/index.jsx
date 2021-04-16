import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Divider, Input, Select, Upload, Form, message } from "antd";
import { labelList, updateCondition, uploadPhoto } from "./service";

import * as style from "./index.module.css";
import skeletion from "../../assets/skeleton.png";
import img_skeleton from "../../assets/img_skeleton.png";
import imageUrl from "../../assets/upload.png";
/**
 * ts 组件化写法
 */
// interface Label{
//     label_id?:Number;
//     label_name:String;
//     label_description:String;
// }
// interface Condition{
//     article_desc?:String;
//     article_img_url?:String;
//     article_label?:Label[];
// }
// interface Props{
//     condition:Condition;
//     visible:Boolean;
//     onFinish:(value:Condition)=>void;
// }
const { TextArea } = Input;
const { Option } = Select;
const ArticleConditionModal = (props) => {
  // let { condition, visible = false, onFinish, onCancel, ...opts } = props;
  let { condition, visible = false, onCancel } = props;
  let oldLabel = condition.label
    ? condition.label.map((item) => item.label_id)
    : [];
  const [form] = Form.useForm();
  const [labels, setLabels] = useState([]);
  const [fileList, setFileList] = useState();
  //监听获取数据
  useEffect(() => {
    if (!condition) return;
    if (condition.label) {
      let labels = condition.label.map((v) => v.label_id);
      form.setFieldsValue({
        label: labels,
        article_desc: condition.article_desc,
      });
      setFileList([{ name: "封面", url: condition.article_img_url }]);
    }
    if (condition.article_id) {
      labelList({ article_id: condition.article_id }).then((res) => {
        if (res.code === 200) {
          setLabels(res.data);
        }
      });
    }
  }, [condition]);
  //更新
  const handleCondition = async () => {
    let { label, article_desc } = form.getFieldsValue();
    let article_img_url;
    if (fileList[0].url) {
      //有文件了，跳过；
      article_img_url = fileList[0].url;
    } else {
      let res1 = await uploadPhoto({ file: fileList[0] });
      if (res1.code === 200) {
        article_img_url = res1.data;
      } else {
        message.error("图片上传不成功");
      }
    }
    let res = await updateCondition({
      label,
      article_desc,
      article_img_url,
      article_id: condition.article_id,
    });
    if (res.code === 200) {
      message.success("更新成功");
      onCancel();
    } else {
      message.error("更新失败");
    }
  };
  return (
    <div
      className={style["article-condition"]}
      style={visible ? {} : { display: "none" }}
    >
      {/* 中间的东西 */}
      <div className={style["condition-box"]}>
        <div className={style["condition-box-left"]}>
          {/* 左 */}
          <Form onFinish={handleCondition} form={form}>
            <div
              style={{
                fontSize: "24px",
                margin: "0",
                lineHeight: "33px",
                color: "#262626",
              }}
            >
              设置封面图，优化文章的显示效果
            </div>
            <div
              style={{ fontSize: "14px", lineHeight: "20px", color: "#b3b3b3" }}
            >
              未设置则自动按默认样式显示
            </div>
            <div
              style={{
                borderLeft: "1px dashed #b3b3b3",
                paddingLeft: "3rem",
                paddingTop: "3rem",
                transform: "translate(2rem, 1rem)",
              }}
            >
              {/* 步骤设置 */}

              <div className={style["per-box"]}>
                <b>选择标签</b>
                <Form.Item style={{ marginBottom: "0px" }} name={"label"}>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    value={oldLabel}
                    // value={condition.label.map((item)=>{return item.label_id})}
                  >
                    {labels.map((item) => {
                      return (
                        <Option key={item.label_id} value={item.label_id}>
                          {item.label_name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <em className={style["time-lime"]}>1</em>
              </div>

              <Form.Item
                style={{ marginBottom: "0px" }}
                name={"article_img_url"}
              >
                <div className={style["per-box"]}>
                  <b>上传封面图</b>
                  <span
                    style={{
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#b3b3b3",
                    }}
                  >
                    尺寸大于 360×360，格式 png/jpg
                  </span>
                  <em className={style["time-lime"]}>2</em>
                  <div>
                    <Upload
                      name="file"
                      action="#"
                      fileList={fileList}
                      beforeUpload={() => {
                        return false;
                      }}
                      onRemove={() => {
                        setFileList(undefined);
                      }}
                      onChange={(file) => {
                        setFileList([file.file]);
                      }}
                    >
                      <div className={style["upload-box"]}>
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{ width: "4rem" }}
                        />
                        点击上传
                      </div>
                    </Upload>
                  </div>
                </div>
              </Form.Item>

              <div className={style["per-box"]}>
                <b>输入摘要</b>
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  name={"article_desc"}
                >
                  <TextArea
                    className={style["ant-textarea"]}
                    showCount
                    maxLength={30}
                    autoSize={{ minRows: 2, maxRows: 2 }}
                    row={2}
                  />
                </Form.Item>
                <em className={style["time-lime"]}>3</em>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className={style["preserve"]} onClick={() => form.submit()}>
                保存
              </div>
              <div className={style["cancel"]} onClick={()=>{onCancel()}}>
                取消
              </div>
            </div>
          </Form>
        </div>
        <Divider dashed type="vertical" style={{ height: "50rem" }} />
        <div className={style["condition-box-right"]}>
          <div className={style["phone-top"]}>{/* 手机顶部 */}</div>
          <div className={style["phone-border"]}>
            {/* 手机边框 */}
            <div className={style["phone-screen"]}>
              {/* 手机屏幕 */}
              <div>
                <img
                  src={skeletion}
                  alt="骨架屏"
                  style={{ width: "92%", marginLeft: "4%", marginTop: "1rem" }}
                />
              </div>
              <div
                style={{
                  width: "92%",
                  marginLeft: "4%",
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgb(243, 243, 243)",
                  paddingTop: "1rem",
                  borderBottom: "1px solid rgb(243, 243, 243)",
                  paddingBottom: "1rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", fontSize: "1.4rem" }}>
                    2021-02-07
                  </div>
                  <div className={style["phone-desc"]}>
                    {condition.article_desc}
                  </div>
                  <div className={style["label"]}>
                    <span>VUE</span>
                    <span>React</span>
                  </div>
                </div>

                <img src={fileList&&fileList[0].url?fileList[0].url:img_skeleton} alt="骨架屏" style={{ width: "26%" }} />
              </div>
              <div>
                <img
                  src={skeletion}
                  alt="骨架屏"
                  style={{ width: "92%", marginLeft: "4%", marginTop: "1rem" }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              fontWeight: "500",
              textAlign: "center",
              fontSize: "1.7rem",
              color: "#262626",
              marginTop: "3rem",
            }}
          >
            效果预览
          </div>
          <div
            style={{
              fontSize: "1.4rem",
              lineHeight: "2rem",
              color: "#b3b3b3",
              textAlign: "center",
            }}
          >
            仅供参考，具体效果会根据不同手机型号而变化
          </div>
          {/* 右 */}
        </div>
      </div>
      {/* 关闭按钮 */}
      <div className={style["close-button"]} onClick={()=>{onCancel()}}>
        <CloseOutlined
          style={{ fontSize: "2.5rem", color: "rgb(179, 179, 179)" }}
        />
      </div>
    </div>
  );
};
export default ArticleConditionModal;
