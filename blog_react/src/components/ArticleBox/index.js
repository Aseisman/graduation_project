import React from 'react'
import "./index.css"
import {timestampToTime} from "../../utils/utils"
export default class ArticleBox extends React.Component{
    constructor(props){
        super(props);
        // this.state = {
        //     photo:photo,
        //     title:"2020-2021年Web前端最新导航-前端学习资源分享",
        //     desc:"可以显著提升开发效率的前端导航连接",
        //     view:"416",
        //     comment:5,
        //     like:5,
        //     create_time:"2020-10-07 11:51:50"
        // };
        this.state=this.props.article;
        // this.state.img_url="https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240";
    }
    render(){
        return (
                <div className="box" onClick={this.props.onClick}>
                   <div className="content">
                        <div className="title">
                            {this.state.article_title}
                        </div>
                        <div className="desc">
                            {/* 文字描述 */}
                            {this.state.article_desc}
                        </div>
                        <div className="comment">
                            {/* 查看 评论 赞 日期 */}
                            查看 {this.state.article_views} 评论 {this.state.article_comment_count} 赞 {this.state.article_like_count} {timestampToTime(this.state.article_date,true)}
                        </div>
                   </div>
                   <img src={this.state.article_img_url} alt="图片" className="box-photo"></img> 
                </div>
        )
    }
}