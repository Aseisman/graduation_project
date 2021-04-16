const Router = require("koa-router");
const jwt = require("jsonwebtoken");
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
router.prefix("/admins");

//注册
router.post("/register", async (ctx, next) => {
  console.log(ctx.request.body);
  const { admin_name, admin_password } = ctx.request.body;
  //查询参数是否俱全
  if (!(admin_password && admin_name)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  //找邮箱是否已经注册
  let res = await query(
    FIND_TABLE("administrator", {
      primaryKey: "admin_name",
      primaryVal: ctx.request.body.admin_name,
    })
  );
  //res:{RowDataPacket {xxx:xxx}}
  if (res.length >= 1) {
    //存在邮箱
    ctx.status = 200;
    ctx.body = { code: 500, msg: "管理员已被占用" };
    return;
  }
  //不存在
  //tableName,{keys,vals}
  let sql = INSERT_TABLE("administrator");
  //加密
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(admin_password, salt);
  try {
    let res = await query(sql, {
      admin_name: admin_name,
      admin_password: hash,
    });
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

//登录
router.post("/login", async (ctx, next) => {
  console.log(ctx.request.body);
  const { admin_name, admin_password } = ctx.request.body;
  //查询参数是否俱全
  if (!(admin_name && admin_password)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  let res = await query(
    FIND_TABLE("administrator", {
      primaryKey: "admin_name",
      primaryVal: admin_name,
    })
  );
  if (res.length > 0) {
    let isPWD = bcrypt.compareSync(admin_password, res[0].admin_password);
    if (isPWD) {
      const token = jwt.sign({ admin_id: res[0].admin_id }, keys.secretKey, {
        expiresIn: 3600,
      });
      ctx.status = 200;
      ctx.body = { code: 200, data: { ...res[0], token } };
    } else {
      ctx.status = 200;
      ctx.body = { code: 500, msg: "密码错误" };
    }
  } else {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "无此账号" };
  }
});

//修改密码
router.post("/update", async (ctx, next) => {
  const { admin_id, admin_password } = ctx.request.body;
  if (!(admin_id && admin_password)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  try {
    let res = await query(
      `update administrator set admin_password=${admin_password} where admin_id=${admin_id}`
    );
    if (res) {
      ctx.status = 200;
      ctx.body = { code: 200, msg: "更新成功" };
      return;
    }
  } catch (err) {
    console.info("出错");
    console.info(err);
    ctx.status = 500;
    ctx.body = err;
  }
});

// //id找人
// router.get('/findById', async (ctx, next) => {
//     const { admin_id } = ctx.request.query;
//     if (!admin_id) {
//         ctx.status = 200;
//         ctx.body = { code: 500, msg: '参数不全' };
//         return;
//     }
//     let res = await query(
//         FIND_TABLE('user', {
//             primaryKey: 'user_id',
//             primaryVal: user_id,
//         })
//     );
//     if (res) {
//         ctx.status = 200;
//         delete res[0].user_password
//         ctx.body = { code: 200, user: res };
//     } else {
//         ctx.status = 200;
//         ctx.body = { code: 500, msg: '查无此人' };
//     }
// });
// //更新用户信息
// router.put('/update', async (ctx, next) => {
//     let sql = UPDATE_TABLE(
//         'user',
//         { primaryKey: 'user_id', primaryVal: 10003 },
//         { key: [`user_name`, `user_phone`], val: ['六六', '12312323455'] }
//     );
//     let { error, res } = await query(sql);
//     console.log(error);
//     console.log(res);
//     ctx.body = sql;
// });

module.exports = router;
