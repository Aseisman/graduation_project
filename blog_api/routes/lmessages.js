const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const { formatDate } = require("../utils/date-format");
const router = new Router();
const bcrypt = require("bcryptjs"); //加密，哈希加密
const { query } = require("../utils/query");
const keys = require("../config/keys");
const {
  FIND_TABLE,
  QUERY_TABLE,
  INSERT_TABLE,
  UPDATE_TABLE,
  DELETE_TABLE,
} = require("../utils/sql");
//路径
router.prefix("/lmessages");
//留言
router.post("/add", async (ctx, next) => {
    const { user_id, user_name,user_avatar,msg } = ctx.request.body;
    const time = formatDate();
    let sql = `insert into lmessage values(null,${user_id},'${user_name}','${user_avatar}','${time}','${msg}')`;
    try {
      let res = await query(sql);
      if (res) {
        ctx.status = 200;
        ctx.body = { code: 200, msg: "创建成功" };
        return;
      }
    } catch (err) {
      console.info("出错");
      console.info(err);
      ctx.status = 500;
      ctx.body = err;
    }
  });

//列表
router.get('/find',async (ctx,next)=>{
    try {
        let sql=`select * from lmessage`;
        let res = await query(sql);
        if (res) {
          ctx.status = 200;
          ctx.body = { code: 200, data:res};
          return;
        }
    } catch (err) {
        console.info("出错");
        console.info(err);
        ctx.status = 500;
        ctx.body = err;
    }
})
module.exports = router;
