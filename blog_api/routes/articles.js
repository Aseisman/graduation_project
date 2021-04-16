const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const router = new Router();
const bcrypt = require("bcryptjs"); //加密，哈希加密
const {
  query,
  connectHandle,
  executeTransaction,
  executeSQL,
} = require("../utils/query");
const keys = require("../config/keys");
const { formatDate } = require("../utils/date-format");
const {
  FIND_TABLE,
  QUERY_TABLE,
  INSERT_TABLE,
  UPDATE_TABLE,
  DELETE_TABLE,
} = require("../utils/sql");
//路径
router.prefix("/articles");
const cal=require("../utils/time-calculate")
//文章列表
router.get("/find", async (ctx) => {
  //需要的参数
  /**
   * pageNum
   * pageSize
   * tag
   * keyword
   */
  const { label_id, keyword, pageNum, pageSize } = ctx.request.query;
  if (!(pageNum && pageSize)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  try {
    //查询语句
    let sql = `select DISTINCT(a.article_id), a.* from article a left join article_label b on a.article_id=b.article_id where a.article_status=1${
      label_id ? " and b.label_id=" + label_id : ""
    }${
      keyword
        ? " and ( article_content like '%" +
          keyword +
          "%' or article_title like '%" +
          keyword +
          "%' )"
        : ""
    } order by article_date desc limit ${pageNum * 10},${pageSize}`;
    console.log(sql);
    let res = await query(sql);
    let findLabelSql, LabelResult;
    for (let r of res) {
      findLabelSql = `select DISTINCT(a.label_id), a.label_name, a.label_description from label a left join article_label b on a.label_id=b.label_id where b.article_id=${r.article_id}`;
      LabelResult = await query(findLabelSql);
      r.label = JSON.parse(JSON.stringify(LabelResult));
    }
    let sql2 = `select count(*) as count from article a left join article_label b on a.article_id=b.article_id where article_status=1${
      label_id ? " and b.label_id=" + label_id : ""
    }${
      keyword
        ? " and ( article_content like '%" +
          keyword +
          "%' or article_title like '%" +
          keyword +
          "%' )"
        : ""
    }`;
    let count = await query(sql2);
    count = JSON.parse(JSON.stringify(count));
    ctx.status = 200;
    ctx.body = { code: 200, data: { list: res, count: count[0].count } };
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }
});
//后台API
router.get("/all", async (ctx) => {
  //需要的参数
  /**
   * pageNum
   * pageSize
   * tag
   * keyword
   */
  const { label_id, pageNum, pageSize, status } = ctx.request.query;
  if (!(pageNum && pageSize)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  try {
    //查询语句
    let sql = `select DISTINCT(a.article_id), a.* from article a left join article_label b on a.article_id=b.article_id${
      label_id ? " where b.label_id=" + label_id : ""
    }${
      status ? " where a.article_status=" + status : ""
    } order by article_date desc limit ${pageNum * 10},${pageSize}`;
    console.log(sql);
    let res = await query(sql);
    let findLabelSql, LabelResult;
    for (let r of res) {
      findLabelSql = `select DISTINCT(a.label_id), a.label_name, a.label_description from label a left join article_label b on a.label_id=b.label_id where b.article_id=${r.article_id}`;
      LabelResult = await query(findLabelSql);
      r.label = JSON.parse(JSON.stringify(LabelResult));
      findUserSql = `select * from  user where user_id=${r.user_id}`;
      UserResult = await query(findUserSql);
      r.user = JSON.parse(JSON.stringify(UserResult))[0];
    }

    let sql2 = `select count(*) as count from article a left join article_label b on a.article_id=b.article_id${
      label_id ? " where b.label_id=" + label_id : ""
    }${status ? " where a.article_status=" + status : ""}`;
    console.log(sql2);
    let count = await query(sql2);
    count = JSON.parse(JSON.stringify(count));
    ctx.status = 200;
    ctx.body = { code: 200, data: { list: res, count: count[0].count } };
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }
});
//根据id找文章 浏览量
router.get("/findOne", async (ctx) => {
  const { article_id } = ctx.request.query || ctx.request.body;
  if (!article_id) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  try {
    //文章内容
    let sql = `select DISTINCT(a.article_id), a.* from article a left join article_label b on a.article_id=b.article_id where a.article_id= ${article_id}`;
    let res = await query(sql);
    //标签
    let findLabelSql = `select DISTINCT(a.label_id), a.label_name, a.label_description from label a left join article_label b on a.label_id=b.label_id where b.article_id=${res[0].article_id}`;
    let findLabelRes = await query(findLabelSql);
    let findUserSql = `select * from  user where user_id=${res[0].user_id}`;
    let UserResult = await query(findUserSql);
    res[0].user = JSON.parse(JSON.stringify(UserResult))[0];
    res[0].label = findLabelRes;
    //浏览量判断
    if(!cal(res[0].user_id,article_id,new Date())){
      //不存在,更新数据库,浏览量
      await query(`update article set article_views=article_views+1 where article_id=${article_id}`);
    }
    ctx.status = 200;
    ctx.body = { code: 200, data: res };
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }
});
//文章审核
router.post("/audit", async (ctx) => {
  let { article_id, article_status } = ctx.request.body;
  let sql = `update article set article_status='${article_status}' where article_id=${article_id}`;
  try {
    await query(sql);
    ctx.status = 200;
    ctx.body = { code: 200, msg: "审核成功" };
  } catch (error) {
    console.info(err);
    ctx.status = 200;
    ctx.body = { code: 500, msg: "数据库出错" + error };
  }
});
//新增文章
router.post("/add", async (ctx) => {
  //content可以为空
  //其他都得有默认值
  let {
    article_status,
    user_id,
    article_title,
    article_content,
    labels,
  } = ctx.request.body;
  if (!article_content) {
    article_content = "";
  }
  if (!labels) {
    labels = [];
  }
  const connection = await connectHandle();
  const time = formatDate();
  try {
    await executeTransaction(connection);
    try {
      let res = await executeSQL(
        connection,
        `insert into article values(null,${user_id},'${article_title}','${article_content}',0,'${time}',0,${article_status},'',0,"https://upload-images.jianshu.io/upload_images/20783111-5c3e9af4da584b49.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240");`
      );
      for (let label of labels) {
        let sql = `insert into article_label values(${res.insertId},${label});`;
        let newres = await executeSQL(connection, sql);
      }
      connection.commit((error) => {
        if (error) {
          console.log("事务提交失败");
        }
      });
      ctx.status = 200;
      ctx.body = { code: 200, msg: "新增成功" };
      return;
      // connection.release(); //释放连接
    } catch (err) {
      console.info(err);
      ctx.status = 200;
      ctx.body = { code: 500, msg: "插入数据库出错" };
      return connection.rollback(() => {
        console.log("插入失败数据回滚");
      });
    }
  } catch (err) {
    return "开启事务失败";
  }
});
//更新文章
router.post("/update", async (ctx) => {
  let {
    article_status,
    article_id,
    article_title,
    article_content,
  } = ctx.request.body;
  const time = formatDate();
  const connection = await connectHandle();
  try {
    await executeTransaction(connection);
    try {
      let res = await executeSQL(
        connection,
        `update article set article_title='${article_title}',article_content='${article_content}',article_status=${article_status},article_date='${time}' where article_id=${article_id};`
      );
      // //删除全部
      // let delsql = `delete from article_label where article_id=${article_id}`;
      // await executeSQL(connection, delsql);
      // //重新添加全部
      // for (let l of label) {
      //     let sql = `insert into article_label values(${article_id},${l});`;
      //     await executeSQL(connection, sql);
      // }
      connection.commit((error) => {
        if (error) {
          console.log("事务提交失败");
        }
      });
      ctx.status = 200;
      ctx.body = { code: 200, msg: "更新成功" };
      return;
      // connection.release(); //释放连接
    } catch (err) {
      console.info(err);
      ctx.status = 200;
      ctx.body = { code: 500, msg: "数据库出错" + err };
      return connection.rollback(() => {
        console.log("插入失败数据回滚");
      });
    }
  } catch (err) {
    return "开启事务失败";
  }
});
//更新文章的label、desc、img_url
router.post("/updateCondition", async (ctx) => {
  let { article_id, label, article_desc, article_img_url } = ctx.request.body;
  const time = formatDate();
  const connection = await connectHandle();
  try {
    await executeTransaction(connection);
    try {
      let res = await executeSQL(
        connection,
        `update article set article_date='${time}',article_desc='${article_desc}',article_img_url='${article_img_url}' where article_id=${article_id};`
      );
      //删除全部
      let delsql = `delete from article_label where article_id=${article_id}`;
      await executeSQL(connection, delsql);
      //重新添加全部
      for (let l of label) {
        let sql = `insert into article_label values(${article_id},${l});`;
        await executeSQL(connection, sql);
      }
      connection.commit((error) => {
        if (error) {
          console.log("事务提交失败");
        }
      });
      ctx.status = 200;
      ctx.body = { code: 200, msg: "更新成功" };
      return;
      // connection.release(); //释放连接
    } catch (err) {
      console.info(err);
      ctx.status = 200;
      ctx.body = { code: 500, msg: "数据库出错" + err };
      return connection.rollback(() => {
        console.log("插入失败数据回滚");
      });
    }
  } catch (err) {
    return "开启事务失败";
  }
});
//删除文章
router.delete("/delete", async (ctx) => {
  const { article_id } = ctx.request.body;
  const time = formatDate();
  let sql = `update article set article_status=2,article_date='${time}' where article_id=${article_id};`;
  console.log(ctx.request.body);
  console.log(ctx.request.query);
  try {
    await query(sql);
    ctx.status = 200;
    ctx.body = { code: 200, msg: "删除成功" };
  } catch (error) {
    console.info(err);
    ctx.status = 200;
    ctx.body = { code: 500, msg: "数据库出错" + error };
  }
});
//点赞
router.post("/like", async (ctx) => {
  const { user_id,article_id } = ctx.request.body;
  try {
    let sql = `update article set article_like_count=article_like_count+1 where article_id=${article_id};`;
    await query(sql);
    let sql2 = `insert into agree values(${user_id},${article_id})`;
    await query(sql2);

    ctx.status = 200;
    ctx.body = { code: 200, msg: "点赞成功" };
  } catch (error) {
    console.info(err);
    ctx.status = 200;
    ctx.body = { code: 500, msg: "数据库出错" + error };
    return connection.rollback(() => {
      console.log("插入失败数据回滚");
    });
  }
});
//判断是否点赞
router.get("/isLike",async (ctx)=>{
  const {user_id,article_id}=ctx.request.query || ctx.request.body;
  try {
    let sql=`select * from agree where user_id=${user_id} and article_id=${article_id}`;
    let res=await query(sql);
    if(res.length>0){
      ctx.status=200;
      ctx.body={code:200,data:true}   
    }else{
      ctx.status=200;
      ctx.body={code:200,data:false}
    }
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }

})
//根据用户id找文章
router.get("/findByUserId", async (ctx) => {
  const { user_id } = ctx.request.query || ctx.request.body;
  if (!user_id) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  try {
    //文章内容
    let sql = `select DISTINCT(a.article_id), a.* from article a left join article_label b on a.article_id=b.article_id where a.user_id= ${user_id} and a.article_status!=2 order by article_date desc`;
    let res = await query(sql);
    //标签
    for (let r of res) {
      let findLabelSql = `select DISTINCT(a.label_id), a.label_name, a.label_description from label a left join article_label b on a.label_id=b.label_id where b.article_id=${r.article_id}`;
      let LabelResult = await query(findLabelSql);
      r.label = JSON.parse(JSON.stringify(LabelResult));
    }
    ctx.status = 200;
    ctx.body = { code: 200, data: res };
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }
});

//举报
router.post("/report",async (ctx)=>{
  const { user_id,article_id,user_name } = ctx.request.body;
  try {
    let sql=`insert into report values(null,${user_id},'${user_name}',${article_id})`;
    await query(sql);
    ctx.status=200;
    ctx.body={code:200,msg:"举报成功，待管理员审核"};
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }
})

module.exports = router;
// connection.query(
//     `insert into article values(null,${user_id},${article_title},${article_content},0,${article_date},0,${article_status});`,
//     async (err, results, fields) => {
//         if (err) {
//             console.info(err);
//             ctx.status = 200;
//             ctx.body = { code: 500, msg: '插入文章数据库出错' };
//             return connection.rollback(() => {
//                 console.log('插入失败数据回滚');
//             });
//         } else {
//             for (let label of labels) {
//                 let sql = `insert into article_label values(${user_id},${label});`;
//                 try {
//                     let res = await executeSQL(connection, sql);
//                 } catch (err) {
//                     ctx.status = 200;
//                     ctx.body = { code: 500, msg: '插入数据库出错' };
//                     return connection.rollback(() => {
//                         console.log('插入失败数据回滚');
//                     });
//                 }
//             }
//             connection.commit(error => {
//                 if (error) {
//                     console.log('事务提交失败');
//                 } else {
//                     ctx.status = 200;
//                     ctx.body = { code: 200, msg: '新增成功' };
//                 }
//             });
//             connection.release(); //释放连接
//         }
//         return;
//     }
// );

// connection.query(
//     `insert into article_label values(${user_id},1);`,
//     (err, results, fields) => {
//         if (err) {
//             console.info(err);
//             ctx.status=200;
//             ctx.body={code:500,msg:"插入数据库出错"};
//             return connection.rollback(() => {
//                 console.log('插入失败数据回滚');
//             });
//         } else {
//             connection.commit(error => {
//                 if (error) {
//                     console.log('事务提交失败');
//                 }else{
//                     ctx.status = 200;
//                     ctx.body = { code: 200, msg: '新增成功' };
//                 }
//             });
//         }
//         connection.release(); //释放连接
//         return;
//     }
// );

// let sql = `select article.article_id from article left join article_label on article.article_id=article_label.article_id and article_status=1${
//     label_id || keyword ? ' and' : ''
// } ${label_id ? ' label_id=' + label_id : ''} ${label_id && keyword ? ' and' : ''} ${
//     keyword
//         ? " ( article_content like '%" +
//           keyword +
//           "%' or article_title like '%" +
//           keyword +
//           "%' )"
//         : ''
// }limit ${pageNum * 10},${pageSize}`;
