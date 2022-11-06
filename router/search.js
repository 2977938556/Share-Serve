let express = require('express');

let router = express.Router();

let GetStatus = require('../utils/GetStatus')



let Home = require('../mongoDB/home');





// 01: 搜索数据接口

router.post("/api/search", async (req, res) => {
  // 将传递过来的参数转换成正则表达式
  let reg = new RegExp(req.body.search);

  // 模糊搜索数据
  let data = await Home.find({
    $or: [
      { author: reg },
      { title: reg },
    ]
  })

  // 这里是没有查找到数据
  if (data.length == 0) {
    return GetStatus(res, 201, [], "没有搜索到数据", false)
  }

  // 这里查找到数据
  return GetStatus(res, 201, data, "没有搜索到数据", false)

})


module.exports = router;