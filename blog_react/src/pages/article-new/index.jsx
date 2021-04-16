import React, { Component } from "react";
import Editor from "for-editor-herb";
import { message, Modal } from "antd";
import { connect } from "react-redux";
import { EditOutlined, SettingOutlined } from "@ant-design/icons";
// import * as styles from './index.scss';
import {
  findByUserId,
  createArticle,
  deleteArticle,
  updateArticle,
} from "./service";
import * as style from "./index.module.css";
import { withRouter } from "react-router";
import ArticleConditionModal from "../../components/ArticleConditionModal/index";
import { timestampToTime } from "../../utils/utils";
import notification from "../../components/NotificationBox/index";
const Hljs = require("highlight.js");

class CreateArticle extends Component {
  $vm = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      mobile: false, //手机端
      language: "en", //语言
      articleList: [], //文章列表
      currentArticle: "", //当前文章
      currentStatus: 0, //发表状态，0未发表 1已发表 2 已删除 3 未审核
      currentCondition: {}, //当前文章配置信息
      currentTitle: "", //当前文章标题
      isActive: 0, //当前文章的界面标识
      isEditModal: false, //编辑文章Modal
      deleteAlarm: false, //删除框
    };
  }
  componentDidMount() {
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
    });
    Hljs.registerLanguage("css", require("highlight.js/lib/languages/css"));
    Hljs.registerLanguage("json", require("highlight.js/lib/languages/json"));
    Hljs.registerLanguage("less", require("highlight.js/lib/languages/less"));
    Hljs.registerLanguage("scss", require("highlight.js/lib/languages/scss"));
    Hljs.registerLanguage(
      "javascript",
      require("highlight.js/lib/languages/javascript")
    );
    Hljs.registerLanguage(
      "typescript",
      require("highlight.js/lib/languages/typescript")
    );
    Hljs.registerLanguage("go", require("highlight.js/lib/languages/go"));

    //获取当前用户文章列表
    if (this.props.user) {
      this.getArticleList();
    } else {
      message.error("登录已过期，请重新登录");
      this.props.history.replace("/login");
    }
  }

  resize() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      this.setState({
        mobile: false,
      });
    } else {
      this.setState({
        mobile: true,
      });
    }
  }

  handleChange(value) {
    this.setState({
      currentArticle: value,
    });
  }
  async onPush() {
    // console.log(this.state.currentArticle);
    let condition = {
      ...this.state.currentCondition,
      article_title: this.state.currentTitle,
      article_content: this.state.currentArticle,
    };
    condition.article_status = 3;
    let res = await updateArticle(condition);
    if (res.code === 200) {
      message.success("更新成功,待审核");
      this.getArticleList();
    } else {
      notification({ message: "更新错误", description: res.msg });
    }
  }
  async handleSave(value) {
    // eslint-disable-next-line no-console
    console.log("触发保存事件", value);
    let condition = {
      ...this.state.currentCondition,
      article_title: this.state.currentTitle,
      article_content: value,
    };
    console.log(condition);
    let res = await updateArticle(condition);
    if (res.code === 200) {
      message.success("更新成功");
      this.getArticleList();
    } else {
      notification({ message: "更新错误", description: res.msg });
    }
    //         ## 啊点三公分
    // - asjbkf
    // 1. aljhbg
    // 2. 阿西吧
    // 3. 阿西吧
    // 4. 阿西吧
    // 5. 阿西吧
    // 6. 阿西吧
  }
  getArticleList() {
    findByUserId({ user_id: this.props.user.user_id })
      .then((res, err) => {
        // console.log(res);
        if (err) throw err;
        //初始化
        if (res.data.length <= 0) return;
        //展示界面有：title、article，随时更新
        let article = res.data[0].article_content,
          title = res.data[0].article_title,
          status = res.data[0].article_status;
        let condition = res.data[0];
        this.setState({
          articleList: res.data,
          currentArticle: article,
          currentCondition: condition,
          currentTitle: title,
          isActive: 0,
          currentStatus: status,
        });
      })
      .catch((err) => {
        message.error(err);
      });
  }
  async createArticle() {
    //新建文章
    const condition = {
      article_status: 0,
      user_id: this.props.user.user_id,
      article_title: timestampToTime(new Date().getTime(), true),
    };
    let res = await createArticle(condition);
    if (res.code === 200) {
      message.success("新增成功");
      this.getArticleList();
    } else {
      notification({ message: "新增错误", description: res.msg });
    }
  }
  addImg($file) {
    this.$vm.current.$img2Url($file.name, "file_url");
    // eslint-disable-next-line no-console
    console.log($file);
  }

  render() {
    const { currentArticle, mobile, currentStatus } = this.state;
    const customLang = {
      placeholder: "开始编辑...",
      undo: "上一步",
      redo: "下一步",
      h1: "一级标题",
      h2: "二级标题",
      h3: "三级标题",
      h4: "四级标题",
      h5: "五级标题",
      h6: "六级标题",
      para: "段落",
      italic: "斜体",
      bold: "粗体",
      bolditalic: "斜粗体",
      delline: "删除线",
      underline: "下划线",
      keytext: "键盘文本",
      superscript: "上标",
      subscript: "下标",
      marktag: "高亮标签",
      table: "表格",
      quote: "引用",
      img: "添加图片链接",
      link: "链接",
      list: "列表",
      orderlist: "有序列表",
      disorderlist: "无序列表",
      checklist: "勾选框列表",
      inlinecode: "行内代码",
      code: "代码块",
      collapse: "折叠块",
      katex: "KaTeX",
      save: "保存",
      preview: "预览",
      singleColumn: "单栏",
      doubleColumn: "双栏",
      fullscreenOn: "全屏编辑",
      fullscreenOff: "退出全屏",
      addImgLink: "添加图片链接",
      addImg: "上传图片",
      toc: "生成大纲",
    };
    const toolbar = {
      h1: true,
      h2: true,
      h3: true,
      h4: true,
      h5: true,
      h6: true,
      img: true,
      list: true,
      para: {
        paragraph: true, // control the whole part if you don't want to display
        italic: true,
        bold: true,
        bolditalic: true,
        delline: true,
        underline: true,
        keytext: true,
        superscript: true,
        subscript: true,
        marktag: true,
      },
      table: true,
      quote: true,
      link: true,
      inlinecode: true,
      code: true,
      collapse: true,
      katex: true,
      preview: true,

      undo: true,
      redo: true,
      save: true,
      subfield: true,
      toc: true, // generate TOC
    };
    const list = this.state.articleList.map((v, i) => {
      return (
        <div className={style["article-box"]} key={i}>
          <div
            className={
              this.state.isActive === i
                ? style["article-box-active"]
                : style["article-box-disactive"]
            }
            onClick={() =>
              this.setState({
                isActive: i,
                currentTitle: this.state.articleList[i].article_title,
                currentArticle: this.state.articleList[i].article_content,
                currentCondition: this.state.articleList[i],
                currentStatus: this.state.articleList[i].article_status,
              })
            }
          >
            <div className={style["article-title"]}>{v.article_title}</div>
            <div
              className={style["setting-icon"]}
              style={
                this.state.isActive === i
                  ? {
                      position: "relative",
                      right: "8%",
                      cursor: "pointer",
                      width: "10%",
                      textAlign: "center",
                    }
                  : { display: "none" }
              }
            >
              <SettingOutlined spin={true} />
              <div className={style["article-detail"]}>
                <div
                  onClick={(e) => {
                    //弹出选择框
                    this.setState({
                      isEditModal: true,
                    });
                    //阻止事件捕获
                    e.stopPropagation();
                  }}
                >
                  设置细节
                </div>
                <div onClick={() => this.setState({ deleteAlarm: true })}>
                  删除
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <>
        <div className={style["whole-article-box"]}>
          {/* 文章列表 */}
          <div className={style["article-list"]}>
            <div
              className={style["goBack-button"]}
              onClick={() => {
                this.props.history.push("/");
              }}
            >
              回首页
            </div>
            {/* 新建文章按钮 */}
            <div
              className={style["new-article"]}
              onClick={(e) => {
                this.createArticle();
                //阻止事件捕获
                e.stopPropagation();
              }}
            >
              <div style={{ marginLeft: "1rem" }}>
                <EditOutlined />
                {"   "}新建文章
              </div>
            </div>

            {/* 文章列表 */}
            {list}
            {/* <div className={style['article-box']}>
                        <div className={style['article-box-active']}>
                            <div className={style['article-title']}>文章一</div>
                            <div style={{ position: 'relative', right: '8%' }}>
                                <SettingOutlined />
                            </div>
                        </div>
                        <div className={style['article-box-disactive']}>
                            <div className={style['article-title']}>文章二</div>
                            <div
                                style={
                                    this.state.isActive == 1
                                        ? { position: 'relative', right: '8%' }
                                        : { display: 'none' }
                                }
                            >
                                <SettingOutlined />
                            </div>
                        </div>
                            background: rgb(242, 242, 242);
    z-index: 999;
                    </div> */}
          </div>
          {/* 文章详情 */}
          <div>
            <div className={style.title}>
              <input
                placeholder="请输入标题"
                value={this.state.currentTitle}
                onChange={(v) => {
                  this.setState({ currentTitle: v.target.value });
                }}
              />
              {/* <div className={style.submitButton}>发表</div> */}
            </div>
            {mobile && (
              <Editor
                ref={this.$vm}
                language={customLang}
                value={currentArticle}
                subfield={false}
                onChange={(value) => this.handleChange(value)}
                onSave={(value) => this.handleSave(value)}
                highlight={Hljs.highlightAuto}
                style={{ width: "84vw", height: "95vh" }}
              />
            )}
            {!mobile && (
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => this.onPush()}
                  className={style.submitButton}
                >
                  {currentStatus === 0
                    ? "发表"
                    : currentStatus === 1
                    ? "更新"
                    : currentStatus === 3
                    ? "待审核"
                    : "已删除"}
                </div>
                <Editor
                  ref={this.$vm}
                  toolbar={toolbar}
                  language={customLang}
                  style={{ width: "84vw", height: "95vh" }}
                  value={currentArticle}
                  addImg={($file) => this.addImg($file)}
                  onChange={(value) => this.handleChange(value)}
                  onSave={(value) => this.handleSave(value)}
                  highlight={Hljs.highlightAuto}
                  anchor={true}
                  outline={true}
                  preview={true}
                  subfield={true}
                />
              </div>
            )}
          </div>
        </div>
        <ArticleConditionModal
          visible={this.state.isEditModal}
          condition={this.state.currentCondition}
          onCancel={() =>
            this.setState({
              isEditModal: false,
            })
          }
        />
        <Modal
          title="删除提示"
          visible={this.state.deleteAlarm}
          onOk={async (e) => {
            //删除功能
            let res = await deleteArticle({
              article_id: this.state.currentCondition.article_id,
            });
            if (res.code !== 200) {
              notification({
                message: "删除错误",
                description: res.msg,
              });
            } else {
              message.success("删除成功");
              this.setState({ deleteAlarm: false });
              this.getArticleList();
            }
            //阻止事件捕获
            e.stopPropagation();
          }}
          onCancel={() => this.setState({ deleteAlarm: false })}
        >
          您正在删除当前文章，删除后不存在，请谨慎操作
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.user,
});
export default withRouter(connect(mapStateToProps)(CreateArticle));
