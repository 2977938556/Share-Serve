let express = require('express');



//导入发送状态函数
let GetStatus = require('../utils/GetStatus')

//导入数据库
let Home = require('../mongoDB/home')



let router = express.Router();



router.get('/api/home', async (req, res) => {

  // console.log("收到的数据", req.body)
  // console.log("收到的数据据", req.query)

  let { page, pageSize } = req.query;
  let store = req.query.store || 0;

  //获取总条数
  let num = await Home.count();

  // 分页查询数据
  // skip：跳过的数量
  // limit: 这个参数是查询的条数 

  let data = null;

  //这里通过前端传递的升序降序进行判断
  if (store == 0) {
    // 升序
    data = await Home.find({}).skip((page - 1) * pageSize).limit(pageSize);
  } else {
    //降序
    data = await Home.find({}).skip((page - 1) * pageSize).limit(pageSize).sort({
      _id: -1,
    });
  }


  // // 这里是未查询到数据的情况
  if (data == null) {
    return GetStatus(res, 201, {}, "分页数据查询失败", false)
  }
  //ok 那么就发送数据
  return GetStatus(res, 200, { homeData: { ...data }, num: num, }, "分页数据查询成功", true)


})






module.exports = router;