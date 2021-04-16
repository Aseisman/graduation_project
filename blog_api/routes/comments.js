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
router.prefix("/comments");

//添加评论
router.post("/add", async (ctx) => {
  const {
    article_id,
    user_id,
    user_name,
    user_avatar,
    comment_content,
    parent_comment_id,
    parent_comment,
    parent_comment_user_name,
  } = ctx.request.body;
  let sql;
  const time = formatDate();
  if (!parent_comment_id) {
    sql = `insert into comment values(null,${user_id},'${user_name}','${user_avatar}',${article_id},0,'${time}','${comment_content}',null,null,null)`;
  } else {
    sql = `insert into comment values(null,${user_id},'${user_name}','${user_avatar}',${article_id},0,'${time}','${comment_content}','${parent_comment_id}','${parent_comment_user_name}','${parent_comment}')`;
  }
  try {
    await query(sql);
    let sql2= `update article set article_comment_count=article_comment_count+1 where article_id=${article_id}`
    await query(sql2);
    ctx.status = 200;
    ctx.body = { code: 200, msg: "新增成功" };
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }
});
//文章id找评论列表
router.get("/findById", async (ctx) => {
  const { article_id } = ctx.request.query;
  let sql = `select * from comment where article_id=${article_id} order by comment_date desc`;
  let res = await query(sql);
  ctx.status = 200;
  ctx.body = { code: 200, data: res };
});

//删除特定的某一条评论
// router.get("/findById",async ctx=>{
//     const { article_id }= ctx.request.query;
//     console.log(article_id);
// })

module.exports = router;
