const Router = require('koa-router');
const router = new Router();
const { query } = require('../utils/query');
//路径
router.prefix('/labels');

router.get('/find',async ctx=>{
    const { article_id } =ctx.request.query;
    if(!article_id){
        ctx.status = 200;
        ctx.body = { code: 500, msg: '参数不全' };
        return;
    }
    try{
        let sql=`select * from label`;
        let res=await query(sql);
        ctx.status=200;
        ctx.body={code:200,data:res}
    }catch(err){
        console.info('出错');
        console.info(err);
        ctx.status = 500;
        ctx.body = err;
    }
})
router.get('/all',async ctx=>{
    try{
        let sql=`select * from label`;
        let res=await query(sql);
        ctx.status=200;
        ctx.body={code:200,data:res}
    }catch(err){
        console.info('出错');
        console.info(err);
        ctx.status = 500;
        ctx.body = err;
    }
})
router.post('/add',async ctx=>{
    const { label_name,label_description } =ctx.request.body;
    if(!label_name||!label_description){
        ctx.status = 200;
        ctx.body = { code: 500, msg: '参数不全' };
        return;
    }
    try{
        let sql=`insert into label values(null,"${label_name}","${label_description}")`;
        let res=await query(sql);
        ctx.status=200;
        ctx.body={code:200,msg:"新增成功"};
    }catch(err){
        console.info('出错');
        console.info(err);
        ctx.status = 500;
        ctx.body = err;
    }
})
router.post('/update',async ctx=>{
    const { label_id,label_name,label_description } =ctx.request.body;
    if(!label_id||!label_name||!label_description){
        ctx.status = 200;
        ctx.body = { code: 500, msg: '参数不全' };
        return;
    }
    try{
        let sql=`update label set label_name='${label_name}',label_description='${label_description}' where label_id='${label_id}'`;
        let res=await query(sql);
        ctx.status=200;
        ctx.body={code:200,msg:"修改成功"};
    }catch(err){
        console.info('出错');
        console.info(err);
        ctx.status = 500;
        ctx.body = err;
    }
})
module.exports = router;