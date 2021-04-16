import React, { useEffect } from "react";
import { message, Modal, Tag, Input, Button } from "antd";
import ReactMarkdown from "react-markdown";
import { withRouter } from "react-router";
import {
  findByUserId,
  findArticleById,
  findCommentById,
  addComment,
  isAgree,
  addAgree,
  report
} from "./service";
import { useState } from "react/cjs/react.development";
import * as style from "./index.module.css";
import notification from "../../components/NotificationBox/index";
import CommentBox from "../../components/CommentBox/index";
import agreeIcon from "../../assets/agree.png";
import reportIcon from "../../assets/report.png";
const { TextArea } = Input;
const Detail = (props) => {
  // let detail = props.location.params;
  let id = props.location.pathname.split("/detail/")[1];
  let publisher = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState({});
  const [detail, setDetail] = useState({});
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");
  const [like,setLike]=useState(false);
  //请求接口
  const findDetail = async () => {
    // if (!props.location.params) return;
    if (!id) return;
    let res = await Promise.all([
      findArticleById({ article_id: id }),
      findCommentById({ article_id: id }),
      isAgree({article_id:id,user_id:publisher.user_id}),
    ]);
    // let res = await findArticleById({ article_id: id });
    // await findCommentById({ article_id: id });
    setDetail(res[0].data[0]);
    setCommentList(res[1].data);
    setLike(res[2].data);
    res = await findByUserId({ user_id: res[0].data[0].user_id });
    setUser(res.user[0]);
  };
  //评论
  const onPublish = async () => {
    let condition = {
      article_id: detail.article_id,
      user_id: publisher.user_id,
      user_name: publisher.user_name,
      user_avatar: publisher.user_avatar,
      comment_content: comment,
    };
    let res = await addComment(condition);
    if (res.code === 200) {
      message.success("评论成功");
      // this.getArticleList();
      //重新请求评论列表
      let res2 = await findCommentById({ article_id: id });
      setCommentList(res2.data);
    } else {
      notification({ message: "错误", description: res.msg });
    }
  };
  //点赞
  const onPushLike =async()=>{
    if(!like){
      let res = await addAgree({article_id:id,user_id:publisher.user_id});
      if(res.code===200){
        message.success("点赞成功");
        let newDetail={...detail};
        newDetail.article_like_count+=1;
        setDetail(newDetail);
        setLike(true);
      }
    }
  }
  const onPushRepost = async()=>{
    let res = await report({article_id:id,user_id:publisher.user_id,user_name:publisher.user_name})
    if(res.code===200){
      message.success("举报成功，待管理员审核");
    }
  }
  useEffect(() => {
    findDetail();
  }, [id]);
  if (id) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ maxWidth: "55%" }}>{detail.article_title}</h1>
        {/* 用户信息 */}
        <div
          style={{
            width: "40vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5rem",
          }}
        >
          {/* 左边 */}
          <div style={{ display: "flex" }}>
            <img
              src={user.user_avatar}
              alt="头像"
              style={{ width: "5rem", height: "5rem", borderRadius: "50%" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                marginLeft: "0.6rem",
              }}
            >
              <div>{user.user_name}</div>
              <div style={{ fontSize: "12px", color: "#969696" }}>
                {detail.article_date}
              </div>
            </div>
          </div>
          {/* 右边 */}
          <div>
            {detail.label && detail.label.length > 0 ? (
              detail.label.map((item) => {
                return (
                  <Tag color="#108ee9" key={item.label_id}>
                    {item.label_name}
                  </Tag>
                );
              })
            ) : (
              <Tag color="#108ee9">无标签</Tag>
            )}
          </div>
        </div>
        {/* 文章 */}
        <div style={{ width: "50%" }}>
          <ReactMarkdown
            source={detail.article_content}
            escapeHtml={false}
            allowDangerousHtml={true}
          />
        </div>
        {/* 点赞 or 举报 */}
        <div
          style={{
            width: "50%",
            margin: "3rem",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div>
            <img
              className={style["icon"]}
              title="点赞"
              src={agreeIcon}
              alt="点赞"
              onClick={()=>onPushLike()}
            />
            <p>{like?"已点赞，":""}{detail.article_like_count}点赞</p>
          </div>
          <div>
            <img
              className={style["icon"]}
              title="举报"
              src={reportIcon}
              alt="举报"
              onClick={()=>onPushRepost()}
            />
            <p>举报</p>
          </div>
        </div>
        {/* 评论框 */}
        <div style={{ marginTop: "5rem", width: "50%", marginBottom: "5rem" }}>
          {/* <div style={{margin:"1rem",marginLeft:"0",fontSize:"1.7rem",fontWeight:"800"}}>评论<span style={{fontSize:"1.4rem",color:"#595959",fontWeight:"500"}}>(已有xxx条评论)</span></div> */}
          <div
            style={{
              margin: "1rem",
              marginLeft: "0",
              fontSize: "1.7rem",
              fontWeight: "800",
            }}
          >
            评论
          </div>
          <TextArea
            className={style["ant-textarea"]}
            showCount
            onChange={(e) => setComment(e.target.value)}
            maxLength={100}
            placeholder="发表评论"
            autoSize={{ minRows: 2, maxRows: 2 }}
            row={2}
          />
          <Button style={{ marginTop: "1rem" }} onClick={() => onPublish()}>
            发表
          </Button>
        </div>
        {/* 评论 */}
        <div style={{ marginTop: "5rem", width: "50%", marginBottom: "5rem" }}>
          {commentList.map((v) => {
            return (
              <CommentBox
                key={v.comment_id}
                callback={async () => {
                  let res2 = await findCommentById({
                    article_id: detail.article_id,
                  });
                  setCommentList(res2.data);
                }}
                comment={v}
                condition={{
                  article_id: detail.article_id,
                  user_id: publisher.user_id,
                  user_name: publisher.user_name,
                  user_avatar: publisher.user_avatar,
                }}
              ></CommentBox>
            );
          })}
        </div>
      </div>
    );
  } else {
    setTimeout(() => props.history.push("/"), 3000);
    return (
      <Modal title="错误提示" visible={true} closable={false} footer={null}>
        无选中的文章，即将返回首页
      </Modal>
    );
  }
};
export default withRouter(Detail);

// import Vditor from 'vditor';
// import 'vditor/src/assets/scss/index.scss';

// import Editor from 'for-editor-herb';
// // require `highlight.js` package
// const Hljs = require('highlight.js');
// class Detail extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             value: '',
//         };
//     }

//     componentDidMount() {
//         // register languages in componentDidMount lifecycle
//         Hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
//         Hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
//         Hljs.registerLanguage('less', require('highlight.js/lib/languages/less'));
//         Hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
//         Hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
//         Hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
//         Hljs.registerLanguage('go', require('highlight.js/lib/languages/go'));
//     }

//     handleChange(value) {
//         this.setState({
//             value,
//         });
//     }

//     render() {
//         const { value } = this.state;
//         // Support default language('en', 'zh-CN', 'zh-TW', 'jp') and localization
//         const toolbar = {
//             h1: true,
//             h2: true,
//             h3: true,
//             h4: true,
//             h5: true,
//             h6: true,
//             img: true,
//             list: true,
//             para: {
//                 paragraph: true, // control the whole part if you don't want to display
//                 italic: true,
//                 bold: true,
//                 bolditalic: true,
//                 delline: true,
//                 underline: true,
//                 keytext: true,
//                 superscript: true,
//                 subscript: true,
//                 marktag: true,
//             },
//             table: true,
//             quote: true,
//             link: true,
//             inlinecode: true,
//             code: true,
//             collapse: true,
//             katex: true,
//             preview: true,
//             expand: true,
//             undo: true,
//             redo: true,
//             save: true,
//             subfield: true,
//             toc: true, // generate TOC
//         };

//         // Transfer function `Hljs.highlightAuto` to the Editor
//         return (
//             <Editor
//                 value={value}
//                 toolbar={toolbar}
//                 onChange={() => this.handleChange()}
//                 highlight={Hljs.highlightAuto}
//             />
//         );
//     }
// }
// // import { Modal } from 'antd';
// // import { useLocation } from 'react-router-dom';
// // const Detail = props => {
// //     const location = useLocation();
// //     let detail=location.params;
// //     if (detail) {

// //     } else {
// //         return (
// //             <Modal
// //                 title="错误提示"
// //                 visible={true}
// //                 closable={false}
// //                 footer={null}
// //             >
// //                 无选中的文章，即将返回首页
// //             </Modal>
// //         );
// //     }
// // };
// // class Detail extends React.Component {
// //     render() {
// //         return (
// //             <div>
// //                 <textarea id="md_editor"></textarea>
// //             </div>
// //         );
// //     }

// //mditor

// //     componentDidMount() {
// //         // const s = document.createElement('script');
// //         // s.type = 'text/javascript';
// //         // s.src = 'https://unpkg.com/mditor@1.0.5/dist/js/mditor.min.js';
// //         // document.body.appendChild(s);
// //         // console.log('到这里');
// //         var mditor = new Mditor()
// //         mditor.fromTextarea(document.getElementById('md_editor'));

// //         //获取或设置编辑器的值
// //         mditor.on('ready', function () {
// //             console.log(mditor.value);
// //             mditor.value = '** hello **';
// //         });
// //         //   var ele_textarea = document.getElementById('md_editor');
// //         //   var mditor =  Mditor.fromTextarea(ele_textarea);
// //     }
// // }

// //vditor

// export default class Demo extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             editValue: '',
//         };
//     }
//     componentDidMount = () => {
//         //组件挂载完成之后调用 注意一定要在组件挂载完成之后调用 否则会找不到注入的DOM
//         this.createVidtor({ value: this.state.editValue });
//     };
//     //创建编辑器 下面会详解
//     createVidtor = params => {
//         let { value } = params;
//         value = value ? value : ' ';
//         let that = this;
//         const vditor = new Vditor('vditor', {
//             height: 800,
//             // mode: 'sv', //及时渲染模式
//             placeholder: 'React Vditor',
//             toolbar:['emoji' , 'headings' , 'bold' , 'italic' , 'strike' , '|' , 'line' , 'quote' , 'list' , 'ordered-list' , 'check' ,'outdent' ,'indent' , 'code' , 'inline-code' , 'insert-after' , 'insert-before' ,'undo' , 'redo' , 'upload' , 'link' , 'table' , 'record' , 'edit-mode' , 'both' , 'preview' , 'fullscreen' , 'outline' , 'code-theme' , 'content-theme' , 'export', 'devtools' , 'info' , 'help' , 'br']
//         });
//         this.vditor = vditor;
//         return vditor;
//     };
//     //首先需要在render里面注入DOM，可自定义注入DOM的ID，初始化编辑器的时候使用自定义的ID即可
//     render() {
//         return (
//             <div className="editorWrap">
//                 <div id="vditor" />
//             </div>
//         );
//     }
// }
