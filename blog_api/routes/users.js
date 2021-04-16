const Router = require("koa-router");
//引入模块
const nodemailer = require("nodemailer");
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
router.prefix("/users");
var num = "";

router.get("/mail", async (ctx, next) => {
  const { mail } = ctx.request.query;
  num="";
  for (var i = 0; i < 4; i++) {
    num += Math.floor(Math.random() * 10);
  }
  //设置邮箱配置
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com", //邮箱服务的主机，如smtp.qq.com
    port: "587", //对应的端口号
    //开启安全连接
    secure: false,
    //secureConnection:false,
    //用户信息
    auth: {
      user: "",
      pass: "",
    },
  });
  //设置收件人信息
  let mailOptions = {
    from: "876956898@qq.com", //谁发的
    to: mail, //发给谁
    subject: "验证码", //主题是什么
    text: "验证信息:" + num, //文本内容
    html: "", //html模板
    //附件信息
    attachments: [
      {
        filename: "",
        path: "",
      },
    ],
  };
  //发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      ctx.status = 500;
      ctx.body = { code: 500, msg: error };
      return console.log(error);
    }
    console.log(`Message: ${info.messageId}`);
    console.log(`sent: ${info.response}`);
    ctx.body = { code: 200, data: info };
  });
});
//注册
router.post("/register", async (ctx, next) => {
  console.log(ctx.request.body);
  console.log(num);
  const { user_name, user_password, user_email,vNum } = ctx.request.body;
  //查询参数是否俱全
  if (!(user_email && user_password && user_name)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  if(num==""){
    ctx.status = 200;
    ctx.body = { code: 500, msg: "请先发送验证码" };
    return;
  }
  if(vNum!==num){
    ctx.status = 200;
    ctx.body = { code: 500, msg: "验证码错误" };
    return;
  }
  if(vNum==num){
    num="";
  }
  //找邮箱是否已经注册
  let res = await query(
    FIND_TABLE("user", {
      primaryKey: "user_email",
      primaryVal: ctx.request.body.user_email,
    })
  );
  //res:{RowDataPacket {xxx:xxx}}
  if (res.length >= 1) {
    //存在邮箱
    ctx.status = 200;
    ctx.body = { code: 500, msg: "邮箱已被占用" };
    return;
  }
  //不存在
  //tableName,{keys,vals}
  let sql = INSERT_TABLE("user");
  //加密
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user_password, salt);
  try {
    let res = await query(sql, {
      user_name: user_name,
      user_password: hash,
      user_email: user_email,
      user_avatar: "https://wx2.sinaimg.cn/mw690/006s6B2Gly1gn5sqhxbfkj30u0140wpf.jpg",
      is_allow: 0,
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
  const { user_email, user_password } = ctx.request.body;
  //查询参数是否俱全
  if (!(user_email && user_password)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  let res = await query(
    FIND_TABLE("user", {
      primaryKey: "user_email",
      primaryVal: user_email,
    })
  );
  if (res.length > 0) {
    let isPWD = bcrypt.compareSync(user_password, res[0].user_password);
    if (isPWD) {
      const token = jwt.sign({ user_id: res[0].user_id }, keys.secretKey, {
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
//id找人
router.get("/findById", async (ctx, next) => {
  const { user_id } = ctx.request.query;
  if (!user_id) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  let res = await query(
    FIND_TABLE("user", {
      primaryKey: "user_id",
      primaryVal: user_id,
    })
  );
  if (res) {
    ctx.status = 200;
    delete res[0].user_password;
    ctx.body = { code: 200, user: res };
  } else {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "查无此人" };
  }
});
//更新用户信息
router.post("/update", async (ctx, next) => {
  const { user_id,user_name,user_phone,user_sex } = ctx.request.body;
  // let sql = UPDATE_TABLE(
  //   "user",
  //   { primaryKey: "user_id", primaryVal: 10003 },
  //   { key: [`user_name`, `user_phone`], val: ["六六", "12312323455"] }
  // );
  let sql=`update user set user_name='${user_name}',user_sex=${user_sex},user_phone='${user_phone}' where user_id=${user_id}`;
  try {
    await query(sql);
    ctx.status = 200;
    ctx.body = { code: 200, msg: "更新成功" };
  } catch (err) {
    console.info(err);
    ctx.status = 200;
    ctx.body = { code: 500, msg: "数据库出错" + err };
  }
});
//用户列表
router.get("/find", async (ctx, next) => {
  const { pageNum, pageSize, status } = ctx.request.query;
  if (!(pageNum && pageSize)) {
    ctx.status = 200;
    ctx.body = { code: 500, msg: "参数不全" };
    return;
  }
  try {
    let sql = `select * from user ${
      status ? " where is_allow=" + status : ""
    } limit ${pageNum * 10},${pageSize}`;
    let res = await query(sql);
    let sql2 = `select count(*) as count from user ${
      status ? " where is_allow=" + status : ""
    }`;
    let count = await query(sql2);
    count = JSON.parse(JSON.stringify(count));
    ctx.status = 200;
    ctx.body = { code: 200, data: { list: res, count: count[0].count } };
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
});
//软删除
router.delete("/delete", async (ctx, next) => {
  const { user_id,status } = ctx.request.body;
  let sql = `update user set is_allow=${status} where user_id=${user_id}`;
  try {
    await query(sql);
    ctx.status = 200;
    ctx.body = { code: 200, msg: "修改成功" };
  } catch (error) {
    console.info(err);
    ctx.status = 200;
    ctx.body = { code: 500, msg: "数据库出错" + error };
  }
});

module.exports = router;
