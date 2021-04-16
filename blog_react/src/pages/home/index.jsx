import React, { useEffect, useState, useRef } from "react";
import {
  getScrollTop,
  getWindowHeight,
  getDocumentHeight,
  debounce
} from "../../utils/utils";
import { Input } from 'antd';
import { useHistory, useLocation } from "react-router-dom";
// import { Spin, Input, Button } from 'antd';
import { connect } from "react-redux";
// import * as actionCreators from '../../store/actionCreators';
import "../../components/Loading/index.css";
import { articlesList, tagList } from "./service";
import ArticleBox from "../../components/ArticleBox/index";
import "./index.css";
import rigeng from "../../assets/2.png";
import youzai from "../../assets/3.png";
import chahua from "../../assets/4.png";
import add from "../../assets/add.png";
const Home = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [articleList, setArticleList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const requestParam = useRef({ pageNum: 0, pageSize: 10 });
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const totalNum = useRef(20);
  const params = new URLSearchParams(location.search);
  const getArticleList = async () => {
    setIsLoading(true);
    if (
      requestParam.current.pageNum * requestParam.current.pageSize >=
      totalNum.current
    ) {
      //到了
      console.log("结束");
      setIsEnd(true);
      return;
    }
    let res = await articlesList(requestParam.current);
    console.log(res);
    totalNum.current = res.data.count;
    setArticleList((preState) => {
      return [...preState, ...res.data.list];
    });
    setIsLoading(false);
  };
  const getLabelList = async () => {
    let res = await tagList();
    setLabelList(res.data);
  };
  useEffect(() => {
    let label = params.get("label") ? parseInt(params.get("label")) : null;
    if (label) {
      requestParam.current.label_id = label;
    }
    console.log(requestParam);
    getArticleList();
    getLabelList();
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (!isLoading && !isEnd) {
          requestParam.current.pageNum += 1;
          getArticleList();
        }
      }
    };
  }, []);
  //跳转界面
  const gotoDetail = (v) => {
    // history.push({
    //     pathname:'/detail',
    //     params:v
    // })
    let win = window.open(
      window.location.href + "detail/" + v.article_id,
      "_blank"
    );
    win.focus();
  };
  const updateArticleList = async () => {
    console.log(requestParam.current);
    let res = await articlesList(requestParam.current);
    totalNum.current = res.data.count;
    // setArticleList([]);
    setArticleList(res.data.list);
  };
  //分类选择
  const reflash = (v) => {
    console.log(v);
    let params = new URLSearchParams(location.search);
    if (params.get("label") == v) {
      //已经有的
      requestParam.current.label_id = "";
      requestParam.current.pageNum = 0;
      updateArticleList();
      history.replace(`/`);
      return;
    }
    params.set("label", v);
    requestParam.current.label_id = v;
    requestParam.current.pageNum = 0;
    updateArticleList();
    history.replace(`/?` + params.toString());
  };
  //模糊搜索
  const searchList= debounce(async(e)=>{
    console.log(e.target.value);
    requestParam.current.pageNum = 0;
    requestParam.current.keyword =e.target.value;
    updateArticleList();
  },800) 
  const list = articleList.map((item, index) => {
    return (
      <ArticleBox
        key={item.article_id}
        article={item}
        onClick={() => gotoDetail(item)}
      ></ArticleBox>
    );
  });
  const tags = labelList.map((item, index) => {
    return (
      <div key={item.label_id} onClick={() => reflash(item.label_id)}>
        {item.label_name}
      </div>
    );
  });
  return (
    <div className="index">
      <div className="articleList">
        {/* 左 */}
        {list}
      </div>
      <div className="right">
        {/* 右 */}
        <Input className="activity" style={{ marginTop: "2rem", borderRadius: "0.5rem" }} placeholder="搜索" onChange={(e)=>searchList(e)} />
        <img
          src={chahua}
          className="activity"
          alt="照片"
          style={{ marginTop: "2rem", borderRadius: "1rem" }}
        />
        <img src={rigeng} className="activity" alt="照片" />
        <img src={youzai} className="activity" alt="照片" />

        <div className="labels-box">
          <p className="labels-title">标签云</p>
          <div className="labels">
            {tags}
            {/* <div>数据结构与算法</div>
                            <div>vue.js</div>
                            <div>浏览器内核</div>
                            <div>Nodejs</div>
                            <div>react</div>
                            <div>express</div>
                            <div>mongodb</div>
                            <div>ES6</div>
                            <div>vue.js</div>
                            <div>vue.js</div>
                            <div>vue.js</div> */}
          </div>
        </div>
      </div>
      {props.user ? (
        <div
          className="add"
          onClick={() => {
            history.push("/write");
          }}
        >
          <img src={add} alt="照片" />
        </div>
      ) : null}
    </div>
  );
};

//把store中的数据映射到组件的props中
//简单：读数据
//state就是我们在store存的东西
// const mapStateToProps = state => ({
//     myData: state.myData,
// });
//接收dispatch()方法并返回期望注入到展示组件的props中的回调方法
//把store的dispatch映射到组件的props中
//简单：改数据
//传进来一个dispatch，我们调用这个dispatch去改store里面的数据
// const mapDispatchToProps = dispatch => ({
//     //返回一个方法，传入props,要更新store就调用这个方法
//     updateData(data) {
//         const action = actionCreators.getData(data);
//         dispatch(action);
//     },
// });
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(Home);
