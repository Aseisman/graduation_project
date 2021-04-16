const multer = require("@koa/multer");
const Router = require('koa-router');
const path = require("path");
const router = new Router();
//路径
router.prefix('/upload');

//上传文件存放路径、及文件命名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null, path.join(__dirname, "/photo"));
      //E:\rucksack\毕业设计\gp\graduation_project\blog_react\src\assets\photo
      cb(null, path.join("E:/rucksack/毕业设计/gp/graduation_project/blog_react/public/photo"));
    },
    filename: function (req, file, cb) {
      let type = file.originalname.split(".")[1];
      cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`);
    },
  });
//文件上传限制
const limits = {
    fields: 10, //非文件字段的数量
    fileSize: 5000 * 1024, //文件大小 单位 b
    files: 1, //文件数量
  };
  const upload = multer({ storage, limits });
router.post('/photo', upload.single("file"), async (ctx) => {
    // ctx.body = {
    //   code: 200,
    //   data: (ctx.request.file.destination+"/"+ctx.request.file.filename).replace(/\\/g,"/"), //返回文件名
    //   msg:"上传成功"
    // };
    ctx.body = {
      code: 200,
      data: "./photo/"+ctx.request.file.filename, //返回文件名
      msg:"上传成功"
    };
})
module.exports = router;