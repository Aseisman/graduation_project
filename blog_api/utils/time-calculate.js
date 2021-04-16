const cache = [];
//数组里面放对象
// {
//     user_id:string,
//     article_id:string,
//     time:Date
// }

//计算时间差 秒
function timeDifference(startTime,endTime){
    var time1=startTime.getTime();
    var time2=endTime.getTime();
    return ((time2-time1)/1000).toFixed(0);
}
//判断是否过期
module.exports = function cal(user_id, article_id, time) {
  //返回true代表存在，false代表不存在或者已经过期；大于5分钟
  if (cache.length <= 0) {
    cache.push({ user_id, article_id, time });
    return false;
  } else {
    const found = cache.findIndex((e) => {
      return e.user_id == user_id && e.article_id == article_id;
    });
    if (found !== -1) {
      //有值
      //判断
      console.log(cache[found]);
      if (timeDifference(cache[found].time,new Date())< 300) {
        //没超过5分钟
        return true;
      } else {
        //超过5分钟
        cache.splice(found, 1);
        cache.push(user_id, article_id, time);
        return false;
      }
    } else {
      //没有值
      cache.push({ user_id, article_id, time });
      return false;
    }
  }
};
