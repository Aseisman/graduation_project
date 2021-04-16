//引入模块
const nodemailer = require("nodemailer");
const multer = require("@koa/multer");
const Router = require("koa-router");
const path = require("path");
const router = new Router();
var num = "";
//路径
router.prefix("/mail");
//注册
router.get("/send", async (ctx, next) => {
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
module.exports = router;
