const express = require('express');//框架模块
const router = express.Router(); //设置路由模块
const GetStatus = require('../utils/GetStatus');// 返回状态模块




//导入数据库
// home 首页数据库
let User = require('../mongoDB/user');
let Home = require('../mongoDB/home')




// 获取作品id模块
router.post('/api/userId', async (req, res) => {
  let { _id, page } = req.body;

  // 获取查询出来的id
  let DataId = await User.findById(_id);





  if (DataId == null) {
    return GetStatus(res, 201, {}, "获取数据失败", false);
  } else {

    // 判断是否是wode 
    if (page == "wode") {


      // 判断数据是否为空
      if (DataId.wode.length != 0) {
        return GetStatus(res, 200, [...DataId.wode], "ID获取成功", true);
      }
      return GetStatus(res, 201, [], "暂无id", false);


    } else if (page == "dianzan") {


      // 判断数据是否为空
      if (DataId.dianzng.length != 0) {
        return GetStatus(res, 200, [...DataId.dianzng], "ID获取成功", true);
      }
      return GetStatus(res, 201, [], "暂无id", false);

    } else if (page == "shocang") {


      // 判断数据是否为空
      if (DataId.shocang.length != 0) {
        return GetStatus(res, 200, [...DataId.shocang], "ID获取成功", true);
      }
      return GetStatus(res, 201, [], "暂无id", false);
    };
  }
})



// 获取作品数据
router.post('/api/userList', async (req, res) => {

  let resulte = await Home.findOne({ id: req.body.id })
  if (resulte == null) {
    return GetStatus(res, 201, [], "数据获取失败", false)
  }
  return res.send(resulte)







})










module.exports = router