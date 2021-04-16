drop database if exists blog;
create database blog;
use blog;



#建立用户表
create table `user`(
    `user_id` bigInt not null AUTO_INCREMENT COMMENT '用户ID',
    `user_name` varchar(50) not null COMMENT '用户名',
    `user_password` varchar(255) not null COMMENT '用户密码',
    `user_email` varchar(50) not null COMMENT '用户邮箱',
    `user_phone` varchar(50) COMMENT '用户手机',
    `user_sex` int DEFAULT 0 COMMENT '用户性别:0男，1女',
    `user_avatar` varchar(255) COMMENT '用户头像',
    `is_allow` int DEFAULT 0 COMMENT '是否启用:0启用，1禁用',
    PRIMARY KEY(`user_id`)
)ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

insert into user values(null,'张三','$2a$10$tWpgdNSsiAS.gzuCiXjq.eKH4ZpXWxMSXvLyJlfkgKxkH/cTF4yaG','123456@qq.com','13512312323',0,'https://wx2.sinaimg.cn/mw690/006s6B2Gly1gn5sqhxbfkj30u0140wpf.jpg',0);
insert into user values(null,'李四','$2a$10$tWpgdNSsiAS.gzuCiXjq.eKH4ZpXWxMSXvLyJlfkgKxkH/cTF4yaG','12345678@qq.com','13512312323',0,'https://wx2.sinaimg.cn/mw690/006s6B2Gly1gn5sqhxbfkj30u0140wpf.jpg',0);

#建立文章表
create table `article`(
    `article_id` bigInt not null AUTO_INCREMENT COMMENT '文章ID',
    `user_id` bigInt not null COMMENT '用户ID',
    `article_title` text not null COMMENT '文章标题',
    `article_content` longtext COMMENT '文章内容',
    `article_comment_count` bigInt not null COMMENT '评论数',
    `article_date` datetime not null COMMENT '发表时间',
    `article_like_count` bigInt not null COMMENT '点赞数',
    `article_status` bigInt DEFAULT 0 not null COMMENT '发表状态0未发表，1发表，2删除，3未审核',
    `article_desc` text  COMMENT '文章描述',
    `article_views` bigInt DEFAULT 0 not null COMMENT '查看数',
    `article_img_url` varchar(255) not null COMMENT '封面图片',
    constraint pk PRIMARY KEY(`article_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

insert into article values(null,10001,'这是是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题是文章标题文章标题','这是文章内这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容这是文章内容容',0,'2020-01-01',0,1,"这是这是文章描述这是文章描述这是文章描述这是文章描述这是文章描述这是文章描述这是文章描述这是文章描述这是文章描述这是文章描述文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,1,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
insert into article values(null,10001,'这是文章标题','这是文章内容',0,'2020-01-01',0,0,"这是文章描述",0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");
#建立评论表
create table `comment`(
    `comment_id` bigInt not null AUTO_INCREMENT COMMENT '评论ID',
    `user_id` bigInt not null COMMENT '发表用户ID',
    `user_name` varchar(50) not null COMMENT '用户名',
    `user_avatar` varchar(255) COMMENT '用户头像',
    `article_id` bigInt not null COMMENT '文章ID',
    `comment_like_count` bigInt not null COMMENT '点赞数',
    `comment_date` datetime not null COMMENT '评论日期',
    `comment_content` text COMMENT '评论内容',
    `parent_comment_id` bigInt COMMENT '父评论ID',
    `parent_comment_user_name` varchar(50) COMMENT '父用户名',
    `parent_comment` text COMMENT '父评论内容',
    constraint pk PRIMARY KEY(`comment_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

insert into comment values(null,10001,'张三','https://wx2.sinaimg.cn/mw690/006s6B2Gly1gn5sqhxbfkj30u0140wpf.jpg',1,10, '2020-01-01','针不厝',null);




#标签表
create table label(
    label_id bigInt not null AUTO_INCREMENT COMMENT '标签ID',
    label_name varchar(20) not null COMMENT '标签名',
    label_description text not null COMMENT '标签描述',
		constraint pl PRIMARY KEY(`label_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

insert into label values(null,'VUE','前端标签');
insert into label values(null,'REACT','前端标签');
insert into label values(null,'TARO','前端标签');
insert into label values(null,'Angular','前端标签');

#文章，标签中间表
create table article_label(
    article_id bigInt not null COMMENT '文章ID',
    label_id bigInt not null COMMENT '标签ID',
		CONSTRAINT `pk` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`),
		CONSTRAINT `kp` FOREIGN KEY (`label_id`) REFERENCES `label` (`label_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='标签文章中间表';

insert into article_label values(1,1);
insert into article_label values(2,1);
insert into article_label values(1,2);

#管理员表
create table administrator(
    admin_id bigInt not null AUTO_INCREMENT COMMENT '管理员id',
    admin_name varchar(20) not null COMMENT '管理员名',
    admin_password varchar(255) not null COMMENT '管理员密码',
    PRIMARY KEY(`admin_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

insert into administrator values(null,"admin",'$2a$10$tWpgdNSsiAS.gzuCiXjq.eKH4ZpXWxMSXvLyJlfkgKxkH/cTF4yaG') 

#点赞表
create table agree(
    user_id bigInt not null COMMENT '用户ID',
    article_id bigInt not null COMMENT '文章ID'
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

#举报表
create table report(
    report_id bigInt not null AUTO_INCREMENT COMMENT '举报id',
    user_id bigInt not null COMMENT '用户ID',
    user_name varchar(50) not null COMMENT '用户名',
    article_id bigInt not null COMMENT '文章ID',
    PRIMARY KEY(`report_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='举报表';

#留言表
create table lmessage(
    lmessage_id bigInt not null AUTO_INCREMENT COMMENT '留言id',
    user_id bigInt not null COMMENT '用户ID',
    user_name varchar(50) not null COMMENT '用户名',
    user_avatar varchar(255) COMMENT '用户头像',
    lmessage_date datetime not null COMMENT '留言日期',
    msg text not null COMMENT '留言信息',
    PRIMARY KEY(`lmessage_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='留言表';