let express = require('express');// 导入express 模块

let GetStatus = require('../utils/GetStatus');

const router = express.Router(); //设置路由模块
let Home = require('../mongoDB/home')// 导入首页的数据库
let Register = require('../mongoDB/register')// 导入用户数据库






//01  获取img信息的
router.get('/api/detailData', async (req, res) => {
  // console.log("收到的数据", req.query)
  let { id } = req.query || "";

  // 数据库查找数据
  let imgDetail = await Home.findOne({ _id: id })
  // console.log(imgDetail)



  // 判断是否为空
  if (imgDetail === null) {
    return GetStatus(res, 201, {}, "数据获取失败", false);
  }


  // //返回正确的数据
  return GetStatus(res, 200, { imgDetail }, "获取成功", true)
})



// 02 处理评论模块
router.post('/api/pinglun', async (req, res) => {

  // 查找用户的数据
  let user = await Register.findOne({ originator: req.body.originator })

  // 查找的作品数据
  let imgData = await Home.findOne({ _id: req.body.imgId });

  // 整理数据
  let pl = {
    author: user.author,
    conter: req.body.plValues,
    trim: new Date().getTime(),
    bgcUrl: user.bgcUrl,
  }
  // 压入评论数据到作品数据中
  imgData.pinglun.push(pl)


  // 更新数据 并返回数据
  imgData.save().then(data => {
    return GetStatus(res, 200, {}, "评论成功", true)
  }).catch(err => {
    return GetStatus(res, 201, {}, "评论失败", false)
  })


})





module.exports = router