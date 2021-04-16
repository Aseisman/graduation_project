const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa-cors');

const keys = require('./config/keys');
const jwt = require('jsonwebtoken');
const articles = require('./routes/articles')
const users = require('./routes/users');
const comments = require('./routes/comments');
const labels = require('./routes/labels');
const img = require('./routes/img');
const admins=require('./routes/admin');
const lmessages=require("./routes/lmessages");
// error handler
onerror(app);

// middlewares
app.use(cors({
    origin: function(ctx) {
        // if (ctx.url === '/api/user/login') {
        //     return "*"; // 允许来自所有域名请求
        // }
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(
    bodyparser()
);
app.use(json());
app.use(logger());
// app.use(async (ctx, next) => {
//     let url = ctx.request.url;
//     let index = url.indexOf("?");
//     if(index!=-1){
//       url = url.slice(0, index);
//     }
//     //免检查路径
//     let freeurl = ['/users/login', '/users/register','/articles/find','/articles/findOne',"/articles/add","/articles/update","/articles/delete","/articles/like","/comments/findById"];
//     // let freeurl = [];
//     if (freeurl.indexOf(url) != -1) {
//         await next();
//     } else {
//         // 规定token写在header 的 'autohrization'
//         let token = ctx.request.headers['authorization'];
//         if (!token) {
//             ctx.status = 200;
//             ctx.body = {
//                 code: 500,
//                 message: '无权限',
//             };
//         } else {
//             // 解码
//             try {
//                 let payload = jwt.verify(token, keys.secretKey);
//                 if (payload) {
//                     ctx.request.body.payload = payload;
//                     await next();
//                 }
//             } catch (err) {
//                 console.log(err);
//                 ctx.status = 200;
//                 ctx.body = {
//                     code: 500,
//                     message: 'token异常',
//                 };
//             }
//         }
//     }
// });
//静态资源和界面
// app.use(require('koa-static')(__dirname + '/public'))
// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// api放这里
app.use(articles.routes(), articles.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(comments.routes(), comments.allowedMethods());
app.use(labels.routes(), labels.allowedMethods());
app.use(img.routes(), img.allowedMethods());
app.use(admins.routes(),admins.allowedMethods());
app.use(lmessages.routes(),lmessages.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

module.exports = app;
